"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpcClient";

export default function ChatroomPage() {
  const { id: chatroomId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const fetchActiveUsers = async () => {
      try {
        const users = await trpc.getActiveUsers.query({ chatroomId });
        setActiveUsers(users);
      } catch (err) {
        console.error("Failed to fetch active users:", err);
      }
    };

    fetchActiveUsers();
  }, [chatroomId]);

  // Fetch initial messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const chatMessages = await trpc.getMessages.query({ chatroomId });
        setMessages(chatMessages);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [chatroomId]);

  // Subscribe to new messages
  useEffect(() => {
    const subscription = trpc.messages.subscribe(
      { chatroomId },
      {
        onData: (message) => {
          setMessages((prev) => [...prev, message]); // Add new messages to the state
        },
        onError: (err) => {
          console.error("Subscription error:", err);
        },
      }
    );

    return () => subscription.unsubscribe(); // Cleanup subscription on unmount
  }, [chatroomId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await trpc.sendMessage.mutate({
        chatroomId,
        username: "User", // Replace with actual username
        content: newMessage,
      });
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:3000");

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          chatroomId,
          username: JSON.parse(localStorage.getItem("user")).username,
        })
      );
    };

    ws.onmessage = (event) => {
      const { type, username } = JSON.parse(event.data);

      if (type === "join") {
        console.log(`${username} has joined the chatroom.`);
      } else if (type === "leave") {
        console.log(`${username} has left the chatroom.`);
      }
    };

    return () => {
      ws.send(
        JSON.stringify({
          type: "leave",
          chatroomId,
          username: JSON.parse(localStorage.getItem("user")).username,
        })
      );
      ws.close();
    };
  }, [chatroomId]);
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chatroom</h1>
      <div>
        <h2>Active Users</h2>
        <ul>
          {activeUsers.map((user, idx) => (
            <li key={idx}>{user}</li>
          ))}
        </ul>
      </div>
      <div className="border p-4 rounded mb-4 h-[400px] overflow-y-auto bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <span className="text-sm text-gray-500">{msg.username}:</span>
            <p className="text-gray-800">{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-grow p-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={sendMessage}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
