"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpcClient";

export default function SignInPage() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSignIn = async () => {
    if (!username.trim()) return;

    try {
      const user = await trpc.signIn.mutate({ username });
      localStorage.setItem("user", JSON.stringify(user)); // Save user info locally
      router.push("/chatrooms"); // Navigate to chatrooms page
    } catch (err) {
      console.error("Sign-In Error:", err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sign In</h1>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Enter your username"
        className="p-2 border rounded w-full mb-4"
      />
      <button
        onClick={handleSignIn}
        className="p-2 bg-blue-600 text-white rounded w-full"
      >
        Sign In
      </button>
    </div>
  );
}
