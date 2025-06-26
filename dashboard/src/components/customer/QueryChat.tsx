'use client';
import { useState } from 'react';
import Markdown from 'react-markdown';
import { Button } from '../ui/button';

interface Message {
    role: 'user' | 'bot';
    content: string;
    mediaUrl?: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [userMessage, setUserMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [chatStarted, setChatStarted] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !userMessage) {
            setError('Please provide both a message and an image/video.');
            return;
        }

        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            const uploadData = await uploadResponse.json();

            if (!uploadResponse.ok) {
                throw new Error(uploadData.error || 'Upload failed');
            }

            const chatResponse = await fetch('/api/customer/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    mediaUrl: uploadData.url,
                }),
            });

            const chatData = await chatResponse.json();

            if (!chatResponse.ok) {
                throw new Error(chatData.error || 'Chat initiation failed');
            }

            setMessages([
                {
                    role: 'user',
                    content: userMessage,
                    mediaUrl: uploadData.url,
                },
                {
                    role: 'bot',
                    content: `Analysis: ${chatData.analysis}\n\nResponse: ${chatData.reply}`,
                },
            ]);

            setChatStarted(true);
            setFile(null);
            setUserMessage('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setUploading(false);
        }
    };

    const handleContinueChat = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userMessage) return;

        try {
            const chatResponse = await fetch('/api/customer/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    mediaUrl: messages.find(m => m.mediaUrl)?.mediaUrl,
                }),
            });

            const chatData = await chatResponse.json();

            if (!chatResponse.ok) {
                throw new Error(chatData.error || 'Chat continuation failed');
            }

            setMessages(prev => [
                ...prev,
                { role: 'user', content: userMessage },
                { role: 'bot', content: chatData.reply },
            ]);

            setUserMessage('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <div className="space-y-4 min-h-full">
            <div className="h-96 overflow-y-auto border p-4 rounded bg-gray-50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
                    >
                        {msg.mediaUrl && (
                            <div className="mb-2">
                                {msg.mediaUrl.includes('video') ? (
                                    <video src={msg.mediaUrl} controls className="max-w-xs mx-auto" />
                                ) : (
                                    <img src={msg.mediaUrl} alt="Uploaded media" className="max-w-xs mx-auto" />
                                )}
                            </div>
                        )}
                        <div
                            className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}
                        >
                            <Markdown>{msg.content}</Markdown>
                        </div>
                    </div>
                ))}
            </div>

            {!chatStarted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="file"
                            accept="image/*,video/*"
                            onChange={handleFileChange}
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>
                    <div>
                    <textarea
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Describe the issue with your delivery..."
                        className="w-full p-2 border rounded"
                        rows={3}
                    />
                    <Button
                        type="submit"
                        disabled={uploading}
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Processing...' : 'Start Chat'}
                    </Button>
                    </div>
                </form>
            ) : (
                <form onSubmit={handleContinueChat} className="space-y-4">
                    <textarea
                        value={userMessage}
                        onChange={(e) => setUserMessage(e.target.value)}
                        placeholder="Continue the conversation..."
                        className="w-full p-2 border rounded"
                        rows={2}
                        disabled={uploading}
                    />
                    <Button
                        type="submit"
                        className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={uploading || userMessage.trim() === ""}
                    >
                        {uploading ? 'Sending...' : 'Send'}
                    </Button>
                </form>
            )}

            {error && (
                <p className="text-red-600 text-center">{error}</p>
            )}
        </div>
    );
}