"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [googleToken, setGoogleToken] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, googleToken }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Logged in! Redirecting...");
        setTimeout(() => router.push("/notes"), 1200);
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch {
      setMessage("Something went wrong.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3ff] via-[#faf9ff] to-[#ffffff]">
      <form
        onSubmit={handleLogin}
        className="bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ✨ Welcome Back
        </h1>

        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-200 rounded-xl pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Google Login */}
        <div className="flex justify-center mb-4">
          <GoogleLogin
            onSuccess={(cred) => {
              setGoogleToken(cred.credential || "");
              setMessage("Google verification complete ✔");
            }}
            onError={() => setMessage("Google verification failed")}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !googleToken}
          className="w-full bg-indigo-600 text-white py-3 rounded-xl disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        {message && (
          <p className="mt-4 text-center text-gray-600 font-medium">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
