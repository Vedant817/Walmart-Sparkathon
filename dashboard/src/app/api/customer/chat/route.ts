import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { v4 as uuidv4 } from "uuid";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getCollection } from "@/lib/mongodb";
import { BUSINESS_LOCATIONS } from "@/lib/locations";
import { ObjectId } from "mongodb";

const storeIds = BUSINESS_LOCATIONS.filter(
    (loc) => loc.type === "store"
).map((loc) => loc.id);

const sessionStore = new Map<string, InMemoryChatMessageHistory>();

interface ChatRequest {
    message: string;
    mediaUrl?: string;
    sessionId?: string;
}

interface ChatResponse {
    success: boolean;
    analysis: string | null;
    reply: string;
    sessionId: string;
}

interface DbOrder {
    _id: ObjectId;
    orderId: ObjectId;
    products: {
        productId: string;
        name: string;
        price: number;
        quantity: number;
    }[];
    orderDate: Date;
    status: string;
    totalAmount: number;
    shippingAddress: {
        email: string;
        fullName: string;
    };
}

async function getCustomerPendingOrders(
    userEmail: string
): Promise<DbOrder[]> {
    const allOrders: DbOrder[] = [];
    for (const storeId of storeIds) {
        const orderCollectionName = `${storeId}_order`;
        const orderCollection = await getCollection(orderCollectionName);
        const orders = await orderCollection
            .find({ "shippingAddress.email": userEmail, status: "Pending" })
            .toArray();
        // Fix: Cast each order to DbOrder to satisfy type requirements
        allOrders.push(...(orders as DbOrder[]));
    }
    return allOrders;
}

export async function POST(request: NextRequest) {
    try {
        const { message, mediaUrl, sessionId: clientSessionId }: ChatRequest =
            await request.json();

        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const cookieStore = await cookies();
        let sessionId = clientSessionId || cookieStore.get("sessionId")?.value;
        let newSessionIdCreated = false;
        if (!sessionId) {
            sessionId = uuidv4();
            newSessionIdCreated = true;
        }

        if (!sessionStore.has(sessionId)) {
            sessionStore.set(sessionId, new InMemoryChatMessageHistory());
        }
        const sessionHistory = await sessionStore.get(sessionId)!.getMessages();

        if (!message && !mediaUrl && sessionHistory.length === 0) {
            return NextResponse.json(
                { error: "Message or media URL is required for the first message" },
                { status: 400 }
            );
        }

        const pendingOrders = await getCustomerPendingOrders(session.user.email);

        let analysis = "";
        if (mediaUrl) {
            const visionModel = new ChatOpenAI({
                model: "qwen/qwen2.5-vl-72b-instruct:free",
                apiKey: process.env.OPENROUTER_API_KEY,
                configuration: { baseURL: process.env.MODEL_URL },
            });
            const visionPrompt = ChatPromptTemplate.fromMessages([
                [
                    "user",
                    `Analyze the media for any product or package issues (e.g., broken, poor quality). Describe the issue concisely. Focus on it being a delivery service fault, not the user's. If it seems to be the user's fault, state "Not our fault." Keep the response brief for both user and support agent. Image: {mediaUrl}`,
                ],
            ]);
            const visionChain = visionPrompt.pipe(visionModel);
            const visionResponse = await visionChain.invoke({ mediaUrl });
            analysis = (visionResponse.content as string) || "No analysis available";
        }

        const chatModel = new ChatOpenAI({
            model: "deepseek/deepseek-chat-v3-0324:free",
            apiKey: process.env.OPENROUTER_API_KEY,
            configuration: { baseURL: process.env.MODEL_URL },
        });

        const orderContext = pendingOrders.length
            ? `Here are the user's pending orders:\n${pendingOrders
                .map(
                    (o) =>
                        `- Order ID: ${o.orderId.toHexString()}. Status: ${o.status
                        }. Total: $${o.totalAmount.toFixed(2)}. Products: ${o.products
                            .map((p) => `${p.quantity}x ${p.name}`)
                            .join(", ")}.`
                )
                .join("\n")}`
            : "The user has no pending orders.";

        const chatPrompt = ChatPromptTemplate.fromMessages([
            [
                "system",
                `You are a customer care chatbot for a delivery service. Your name is Sparky. Respond empathetically and offer solutions based on the user's issue, conversation history, and any provided media analysis. Use the following order information to answer questions accurately.\n\n${orderContext}`,
            ],
            ...sessionHistory,
            [
                "user",
                `Analysis of the image: ${analysis}\n\nUser message: ${message}`,
            ],
        ]);

        const chatChain = chatPrompt.pipe(chatModel);
        const chatResponse = await chatChain.invoke({});
        const reply =
            (chatResponse.content as string) ||
            "Sorry, I could not process your request. Please try again later.";

        const history = sessionStore.get(sessionId)!;
        await history.addMessage(
            new HumanMessage({ content: message, additional_kwargs: { mediaUrl } })
        );
        await history.addMessage(
            new AIMessage({
                content: analysis ? `Analysis: ${analysis}\n\nResponse: ${reply}` : reply,
            })
        );

        const response = NextResponse.json({
            success: true,
            analysis: analysis || null,
            reply,
            sessionId,
        } satisfies ChatResponse);

        if (newSessionIdCreated) {
            response.cookies.set("sessionId", sessionId, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                path: "/",
            });
        }

        return response;
    } catch (error) {
        console.error("Chat error:", error);
        return NextResponse.json(
            { error: "Chat processing failed" },
            { status: 500 }
        );
    }
}