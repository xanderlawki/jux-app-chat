"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useUserStore from "@/store/userStore";

export default function SignIn() {
  const [username, setUsernameInput] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUsername } = useUserStore(); // Zustand state for user

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim()) {
      setError("Username cannot be empty.");
      return;
    }

    try {
      const response = await axios.post("/api/auth/signin", { username });
      if (response.status === 200) {
        setUsername(username); // Save username globally
        router.push("/chatrooms"); // Redirect to the home page
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSignIn}
        className="w-full max-w-sm p-4 bg-white rounded shadow-md"
      >
        <h1 className="text-2xl font-bold mb-4">Sign In</h1>
        <input
          type="text"
          placeholder="Enter a unique username"
          value={username}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded mb-2"
        />
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
