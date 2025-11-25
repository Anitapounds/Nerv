"use client";
import { X } from "lucide-react";
import { useState } from "react";

export default function ChatSidebar({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<string[]>([
    "Welcome to the chat!",
    "Say hi 👋",
  ]);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    setMessages((m) => [...m, input.trim()]);
    setInput("");
  };

  return (
    <aside className="fixed right-0 top-0 z-50 h-full w-80 bg-neutral-900 border-l border-neutral-700 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold">Live Chat</h3>
        <button onClick={onClose} className="text-gray-300 hover:text-white">
          Close
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 pb-4">
        {messages.map((m, i) => (
          <div key={i} className="bg-neutral-800 p-2 rounded">
            <div className="text-sm">{m}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-neutral-800 rounded p-2 text-sm outline-none"
          placeholder="Type a message..."
          onKeyDown={(e) => e.key === "Enter" && send()}
        />
        <button onClick={send} className="bg-indigo-600 px-3 rounded text-sm">
          Send
        </button>
      </div>
    </aside>
  );
}
