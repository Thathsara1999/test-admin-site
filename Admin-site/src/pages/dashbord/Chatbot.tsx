import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
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

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { from: "user", text: input }]);
    // Simulate bot response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Got it! We'll remind you before the appointment.",
        },
      ]);
    }, 1000);
    setInput("");
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
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSend}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
