// app/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  useEffect(() => {
    // load Google Identity Services script if client id is present
    if (!googleClientId) return;

    const id = "gsi-script";
    if (document.getElementById(id)) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.id = id;
    document.head.appendChild(script);

    script.onload = () => {
      // @ts-ignore
      if (window.google) {
        // render invisible button to use prompt() later
        // we will render our own button, but set up the callback:
        // @ts-ignore
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
        });
      }
    };

    return () => {
      // keep script: no removal needed
    };
  }, [googleClientId]);

  async function handleGoogleCallback(response: any) {
    // response.credential is the JWT we will send to backend
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: response?.clientId ? "" : undefined, googleToken: response.credential, email: email || undefined }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Logged in! Redirecting...");
        setTimeout(() => router.push("/"), 900);
      } else {
        setMessage(data.message || data.error || "Invalid credentials");
      }
    } catch (err) {
      setMessage("Something went wrong with Google login.");
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleClick = () => {
    if (!googleClientId) {
      setMessage("Google client not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env.");
      return;
    }
    // prompt the One-Tap / popup
    // @ts-ignore
    window.google?.accounts.id.prompt();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        setMessage("✅ Logged in! Redirecting...");
        setTimeout(() => router.push("/"), 900);
      } else {
        setMessage(data.message || data.error || "Invalid credentials");
      }
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3ff] via-[#faf9ff] to-[#ffffff]">
      <form
        onSubmit={handleLogin}
        className="bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">✨ Welcome Back</h1>
        <p className="text-center text-gray-500 mb-6">
          Log in to continue to <span className="font-semibold text-indigo-600">Simple Notes</span>
        </p>

        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700">
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50">
          {loading ? "Logging in..." : "Log In"}
        </button>

        <div className="mt-4 flex items-center gap-3 justify-center">
          {googleClientId ? (
            <button
              type="button"
              onClick={handleGoogleClick}
              className="mt-4 inline-flex items-center gap-2 border rounded px-3 py-2 hover:shadow"
            >
              <img alt="Google" src="/google-icon.svg" className="w-5 h-5" />
              Sign in with Google
            </button>
          ) : (
            <div className="text-sm text-gray-400">Google signin disabled — set NEXT_PUBLIC_GOOGLE_CLIENT_ID</div>
          )}
        </div>

        {message && <p className="mt-4 text-center text-gray-600 font-medium">{message}</p>}

        <p className="mt-6 text-center text-gray-500">
          Don’t have an account?{" "}
          <a href="/signup" className="text-indigo-600 font-semibold hover:underline">Sign Up</a>
        </p>
      </form>
    </div>
  );
}
