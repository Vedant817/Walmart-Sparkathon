interface Message {
    role: 'user' | 'bot';
    content: string;
    mediaUrl?: string;
}

const sessions = new Map<string, Message[]>();

export function getSession(sessionId: string): Message[] {
    return sessions.get(sessionId) || [];
}

export function addMessageToSession(sessionId: string, message: Message): void {
    const session = sessions.get(sessionId) || [];
    session.push(message);
    sessions.set(sessionId, session);
}

export function clearSession(sessionId: string): void {
    sessions.delete(sessionId);
}