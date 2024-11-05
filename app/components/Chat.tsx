"use client";

import { useState } from "react";

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState<{ user: string; bot: any }[]>([]);

  const sendMessage = async () => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log("AI reply:", data.reply);
      setChat([...chat, { user: message, bot: data.reply }]);
      setMessage("");
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData.error);
    }
  };

  return (
    <div>
      <div>
        {chat.map((msg, index) => (
          <div key={index}>
            <p>
              <strong>You:</strong> {msg.user}
            </p>
            <p>
              <strong>Bot:</strong> {msg.bot}
            </p>
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
