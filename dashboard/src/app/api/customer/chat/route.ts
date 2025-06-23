import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, AIMessage } from '@langchain/core/messages';
import { InMemoryChatMessageHistory } from '@langchain/core/chat_history';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { v4 as uuidv4 } from 'uuid';

const sessionStore = new Map<string, InMemoryChatMessageHistory>();

interface ChatRequest {
    message: string;
    mediaUrl?: string;
}

interface ChatResponse {
    success: boolean;
    analysis: string | null;
    reply: string;
    sessionId: string;
}

async function getOrCreateSession(sessionId: string | undefined): Promise<string> {
    const cookieStore = await cookies();
    let newSessionId = sessionId || cookieStore.get('sessionId')?.value;

    if (!newSessionId) {
        newSessionId = uuidv4();
        cookieStore.set('sessionId', newSessionId, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            path: '/',
        });
    }

    if (!sessionStore.has(newSessionId)) {
        sessionStore.set(newSessionId, new InMemoryChatMessageHistory());
    }

    return newSessionId;
}

export async function POST(request: Request) {
    try {
        const { message, mediaUrl }: ChatRequest = await request.json();
        const sessionId = await getOrCreateSession(undefined);

        const sessionHistory = await sessionStore.get(sessionId)!.getMessages();
        if (!message || (!mediaUrl && sessionHistory.length === 0)) {
            return NextResponse.json(
                { error: 'Message and media URL are required for the first message' },
                { status: 400 }
            );
        }

        const visionModel = new ChatOpenAI({
            model: 'qwen/qwen2.5-vl-72b-instruct:free',
            apiKey: process.env.OPENROUTER_API_KEY,
            configuration: { baseURL: process.env.MODEL_URL,},
        });

        const chatModel = new ChatOpenAI({
            model: 'deepseek/deepseek-chat-v3-0324:free',
            apiKey: process.env.OPENROUTER_API_KEY,
            configuration: { baseURL: process.env.MODEL_URL },
        });

        let analysis = '';
        if (mediaUrl) {
            const visionPrompt = ChatPromptTemplate.fromMessages([
                ['user', 'Analyse the media and see if the package received has the issue like broken object, bad quality and related stuff. If yes describe it in the short and precise way. Also focus on the part that it is the issue from the delivery service and not the user\'s fault. If the issue is there from the users side then return not our fault. Try to keep the response short and precise. It will be displayed to both the user and the support agent. Image: {mediaUrl}'],
            ]);

            const visionChain = visionPrompt.pipe(visionModel);
            const visionResponse = await visionChain.invoke({ mediaUrl });
            analysis = visionResponse.content as string || 'No analysis available';
        }

        const chatPrompt = ChatPromptTemplate.fromMessages([
            ['system', 'You are a customer care chatbot for a delivery service. Respond empathetically and offer solutions based on the user\'s issue and any provided media analysis. Use the conversation history to maintain context.'],
            ...sessionHistory,
            ['user', `Analysis of the image: ${analysis}\n\nUser message: ${message}`],
        ]);

        const chatChain = chatPrompt.pipe(chatModel);
        const chatResponse = await chatChain.invoke({});
        const reply = chatResponse.content as string || 'Sorry, I could not process your request. Please try again later.';

        const history = sessionStore.get(sessionId)!;
        await history.addMessage(new HumanMessage({ content: message, additional_kwargs: { mediaUrl } }));
        await history.addMessage(new AIMessage({ content: analysis ? `Analysis: ${analysis}\n\nResponse: ${reply}` : reply }));

        return NextResponse.json({
            success: true,
            analysis: analysis || null,
            reply,
            sessionId,
        } satisfies ChatResponse);
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json(
            { error: 'Chat processing failed' },
            { status: 500 }
        );
    }
}