"use client";

import { useEffect, useState } from "react";
import { trpc } from "@/lib/trpcClient";

export default function TestPage() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await trpc.health.query(); // This calls the "health" endpoint
        console.log("Server response:", response);
        setMessage(response);
      } catch (error) {
        console.error("Error connecting to server:", error);
      }
    };

    fetchHealth();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">WebSocket Test</h1>
      <p>Server Response: {message || "Connecting..."}</p>
    </div>
  );
}
