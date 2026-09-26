import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export const TripForgeChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      text: 'Hi! I’m TripForge AI. Ask me about destinations, routes, activities, budgets or your trip.',
    },
  ]);

  const sendMessage = async () => {
    const message = input.trim();

    if (!message || loading) return;

    setInput('');

    setMessages((prev) => [
      ...prev,
      { role: 'user', text: message },
    ]);

    setLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
        }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'Sorry, I could not generate a response.',
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#c85f72] text-white shadow-xl flex items-center justify-center hover:scale-105 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-32px)] bg-white rounded-3xl shadow-2xl border border-[#EF9CA7]/30 overflow-hidden">
          
          <div className="bg-[#3a1a22] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#FFDDE1]" />
              <div>
                <div className="font-semibold">TripForge AI</div>
                <div className="text-xs opacity-70">Travel assistant</div>
              </div>
            </div>

            <button onClick={() => setOpen(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="h-[380px] overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.role === 'user'
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                    message.role === 'user'
                      ? 'bg-[#c85f72] text-white'
                      : 'bg-[#FCF8F9] text-[#3a1a22]'
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-sm text-gray-500">
                TripForge AI is thinking...
              </div>
            )}
          </div>

          <div className="border-t p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') sendMessage();
              }}
              placeholder="Ask TripForge..."
              className="flex-1 px-3 py-2 rounded-xl border border-gray-200 outline-none text-sm"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="w-10 h-10 rounded-xl bg-[#c85f72] text-white flex items-center justify-center disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};