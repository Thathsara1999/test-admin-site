import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { chatAPI } from "../../services/api";

type ChatMessage = {
  from: "bot" | "user";
  text: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      from: "bot",
      text: "Hello! I'm HealthyKids Assistant. How can I help you today?",
    },
    { from: "user", text: "When is my child's next vaccination due?" },
    {
      from: "bot",
      text: "Based on Liam's records, the MMR vaccine is due on March 25, 2026.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    const cleanInput = input.trim();
    if (!cleanInput || isLoading) return;

    const userMessage: ChatMessage = { from: "user", text: cleanInput };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");

    setIsLoading(true);
    try {
      const history = nextMessages.map((msg) => ({
        role:
          msg.from === "user"
            ? ("user" as const)
            : ("assistant" as const),
        content: msg.text,
      }));

      const botReply = await chatAPI.getReply({
        message: cleanInput,
        messages: history,
      });

      setMessages((prev) => [...prev, { from: "bot", text: botReply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry, I couldn't reach the AI service right now. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-md h-[calc(100vh-200px)] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800">
            HealthyKids Assistant
          </h2>
        </div>

        {/* Chat messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start ${msg.from === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.from === "bot" && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
              )}
              <div
                className={`rounded-lg p-4 max-w-md ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-blue-50 text-gray-800"
                }`}
              >
                <p>{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start justify-start">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                <MessageCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div className="rounded-lg p-4 max-w-md bg-blue-50 text-gray-800">
                <p>Thinking...</p>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleSend();
                }
              }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={() => {
                void handleSend();
              }}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
