"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpcClient";
import { useRouter } from "next/navigation";

export default function ChatroomsPage() {
  const [chatrooms, setChatrooms] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchChatrooms = async () => {
      console.log(await trpc.getChatrooms.query(), "rooommmmm");
      try {
        const rooms = await trpc.getChatrooms.query();

        setChatrooms(rooms);
      } catch (err) {
        console.error("Failed to fetch chatrooms:", err);
      }
    };

    fetchChatrooms();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Available Chatrooms</h1>
      <div className="space-y-4">
        {chatrooms.map((room: any) => (
          <div
            key={room._id}
            className="p-4 border rounded shadow flex justify-between items-center cursor-pointer"
            onClick={() => router.push(`/chatrooms/${room._id}`)}
          >
            <h2 className="text-lg font-bold">{room.name}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
