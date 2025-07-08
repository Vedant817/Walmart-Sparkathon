"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'contact';
  text: string;
  timestamp: string;
}

export default function ChatPage() {
  const params = useParams();
  const contactId = typeof params === 'object' && params !== null && 'contactId' in params
    ? (params.contactId as string)
    : '';
  const [contactName, setContactName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaContentRef = useRef<HTMLDivElement>(null);

  const getSampleMessages = (id: string): Message[] => {
    switch (id) {
      case 'accounts@walmart.com':
        return [
          { id: 'm1', sender: 'contact', text: 'Hello, how can I assist you with the payment inquiry?', timestamp: '2025-07-08T10:35:00Z' },
          { id: 'm2', sender: 'user', text: 'I received an alert about payment for order #3208. Can you confirm the status?', timestamp: '2025-07-08T10:36:00Z' },
          { id: 'm3', sender: 'contact', text: 'Yes, the payment for order #3208 was successfully processed on July 5th. You should see it reflected in your account soon.', timestamp: '2025-07-08T10:37:00Z' },
          { id: 'm4', sender: 'user', text: 'Great, thank you for the quick confirmation. Is there a transaction ID I can reference?', timestamp: '2025-07-08T10:38:00Z' },
          { id: 'm5', sender: 'contact', text: 'Certainly. The transaction ID is PAY3208-XYZ789. You can find it in your payment portal under recent transactions.', timestamp: '2025-07-08T10:39:00Z' },
          { id: 'm6', sender: 'user', text: "Perfect, I'll check that. Thanks again for your help", timestamp: '2025-07-08T10:40:00Z' },
          { id: 'm7', sender: 'contact', text: 'You\'re welcome! Let us know if you have any further questions.', timestamp: '2025-07-08T10:41:00Z' },
        ];
      case 'logistics@walmart.com':
        return [
          { id: 'm1', sender: 'contact', text: 'Hi, how can I help with your dispatch query?', timestamp: '2025-07-08T11:00:00Z' },
          { id: 'm2', sender: 'user', text: 'Order #3210 was dispatched. Can I get a more precise ETA for Store #1234?', timestamp: '2025-07-08T11:01:00Z' },
          { id: 'm3', sender: 'contact', text: 'The truck is currently en route and is expected to arrive at Store #1234 by 3 PM today, barring any unforeseen traffic.', timestamp: '2025-07-08T11:02:00Z' },
          { id: 'm4', sender: 'user', text: 'Understood. Is there a tracking link I can share with the store manager?', timestamp: '2025-07-08T11:03:00Z' },
          { id: 'm5', sender: 'contact', text: 'Yes, you can use this link: [tracking.walmart.com/3210]. It provides real-time updates on the truck\'s location.', timestamp: '2025-07-08T11:04:00Z' },
          { id: 'm6', sender: 'user', text: 'Excellent! That\'s very helpful. Thank you!', timestamp: '2025-07-08T11:05:00Z' },
          { id: 'm7', sender: 'contact', text: 'Anytime. We\'ll notify you if there are any significant changes to the delivery schedule.', timestamp: '2025-07-08T11:06:00Z' },
        ];
      case 'inventory@walmart.com':
        return [
          { id: 'm1', sender: 'contact', text: 'Hello, regarding the stock alert, what product are you inquiring about?', timestamp: '2025-07-08T11:10:00Z' },
          { id: 'm2', sender: 'user', text: "I received a low stock alert for Great Value Milk. What's the current replenishment status?", timestamp: '2025-07-08T11:11:00Z' },
          { id: 'm3', sender: 'contact', text: 'A new order for Great Value Milk has been placed and is scheduled for delivery within 24 hours. We are monitoring the stock levels closely.', timestamp: '2025-07-08T11:12:00Z' },
          { id: 'm4', sender: 'user', text: 'That\'s good to hear. Can we expedite the delivery given the high demand?', timestamp: '2025-07-08T11:13:00Z' },
          { id: 'm5', sender: 'contact', text: 'I\'ve flagged it as urgent. The earliest we can get it there is tomorrow morning. I\'ll send a confirmation once it\'s loaded.', timestamp: '2025-07-08T11:14:00Z' },
          { id: 'm6', sender: 'user', text: 'Appreciate it. Please keep me updated.', timestamp: '2025-07-08T11:15:00Z' },
          { id: 'm7', sender: 'contact', text: 'Will do. We\'re working to minimize any disruption.', timestamp: '2025-07-08T11:16:00Z' },
        ];
      case 'prod.sup@walmart.com':
        return [
          { id: 'm1', sender: 'contact', text: 'Hi, I understand you have a question about a production issue.', timestamp: '2025-07-08T11:20:00Z' },
          { id: 'm2', sender: 'user', text: 'Yes, the alert mentioned an issue on Production Line A. Can you provide an update on the resolution?', timestamp: '2025-07-08T11:21:00Z' },
          { id: 'm3', sender: 'contact', text: 'We have identified the issue as a conveyor belt motor failure. Our technicians are on-site, and we expect the line to be operational within the next 2 hours.', timestamp: '2025-07-08T11:22:00Z' },
          { id: 'm4', sender: 'user', text: 'Is there any impact on the current production schedule for other products?', timestamp: '2025-07-08T11:23:00Z' },
          { id: 'm5', sender: 'contact', text: 'Only product X is affected. Other lines are running normally. We\'ve shifted some resources to mitigate delays.', timestamp: '2025-07-08T11:24:00Z' },
          { id: 'm6', sender: 'user', text: 'Good to know. Thanks for the update.', timestamp: '2025-07-08T11:25:00Z' },
          { id: 'm7', sender: 'contact', text: 'You\'re welcome. We\'ll send another update once the line is fully operational.', timestamp: '2025-07-08T11:26:00Z' },
        ];
      case 'dispatch@walmart.com':
        return [
          { id: 'm1', sender: 'contact', text: 'Hello, how can I assist with your route inquiry?', timestamp: '2025-07-08T11:30:00Z' },
          { id: 'm2', sender: 'user', text: 'The route for order #3211 was changed. Can you confirm the new estimated arrival time?', timestamp: '2025-07-08T11:31:00Z' },
          { id: 'm3', sender: 'contact', text: 'Yes, the route was adjusted due to roadworks. The new ETA for order #3211 is 4:30 PM.', timestamp: '2025-07-08T11:32:00Z' },
          { id: 'm4', sender: 'user', text: 'Are there any other potential delays we should be aware of on this new route?', timestamp: '2025-07-08T11:33:00Z' },
          { id: 'm5', sender: 'contact', text: 'We\'ve checked the traffic and road conditions, and the new route appears clear. We don\'t anticipate further delays.', timestamp: '2025-07-08T11:34:00Z' },
          { id: 'm6', sender: 'user', text: 'Alright, thank you for the detailed information.', timestamp: '2025-07-08T11:35:00Z' },
          { id: 'm7', sender: 'contact', text: 'My pleasure. We\'ll keep monitoring the delivery.', timestamp: '2025-07-08T11:36:00Z' },
        ];
      default:
        return [
          { id: 'm1', sender: 'contact', text: 'Hello, how can I help you today?', timestamp: '2025-07-08T10:00:00Z' },
          { id: 'm2', sender: 'user', text: 'I\'m inquiring about a recent alert.', timestamp: '2025-07-08T10:01:00Z' },
          { id: 'm3', sender: 'contact', text: 'Please provide the alert ID or a brief description so I can assist you better.', timestamp: '2025-07-08T10:02:00Z' },
        ];
    }
  };

  useEffect(() => {
    if (contactId) {
      const name = contactId.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase());
      setContactName(name);
      setMessages(getSampleMessages(contactId));
    }
  }, [contactId]);

  useEffect(() => {
    if (scrollAreaContentRef.current) {
      scrollAreaContentRef.current.scrollTop = scrollAreaContentRef.current.scrollHeight;
    }
  }, [messages]);

  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    }).format(date);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const newMsg: Message = {
      id: `m${Date.now()}`,
      sender: 'user',
      text: newMessage.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMsg]);
    setNewMessage('');
  };

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <Card className="flex flex-col h-[calc(100vh-35px)]">
        <CardHeader>
          <CardTitle>Chat with {contactName}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 p-4 border rounded-md mb-4">
            <div className="space-y-4" ref={scrollAreaContentRef}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${msg.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <p className="text-xs mt-1 opacity-75">{formatTimestamp(msg.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              className="flex-1"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage}>Send</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}