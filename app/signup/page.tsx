"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

interface GoogleResponse {
  credential: string;
  select_by?: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

  // ---------------------------------------------------
  // Google Callback (fixed: safe types, no warnings)
  // ---------------------------------------------------
  const handleGoogleCallback = useCallback(
    async (response: GoogleResponse) => {
      setLoading(true);
      setMessage("");

      try {
        const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email || undefined,
            password: password || undefined,
            googleToken: response.credential,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          setMessage("✅ Account created! Redirecting...");
          setTimeout(() => router.push("/login"), 1000);
        } else {
          setMessage(data.message || data.error || "Signup failed");
        }
      } catch (error) {
        console.error(error);
        setMessage("Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [email, password, router]
  );

  // ---------------------------------------------------
  // Load Google Script (fixed missing dependency)
  // ---------------------------------------------------
  useEffect(() => {
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
      // @ts-expect-error Google not typed
      if (window.google) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleCallback,
        });
      }
    };
  }, [googleClientId, handleGoogleCallback]);

  // ---------------------------------------------------
  // Google Signup Button Click
  // ---------------------------------------------------
  const handleGoogleClick = () => {
    if (!googleClientId) {
      setMessage(
        "Google client not configured. Add NEXT_PUBLIC_GOOGLE_CLIENT_ID to .env."
      );
      return;
    }

    // @ts-expect-error Google prompt exists after script load
    window.google?.accounts.id.prompt();
  };

  // ---------------------------------------------------
  // Normal Email Signup
  // ---------------------------------------------------
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Account created! Redirecting...");
        setTimeout(() => router.push("/login"), 1000);
      } else {
        setMessage(data.message || data.error || "Signup failed");
      }
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------
  // UI Rendering
  // ---------------------------------------------------
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f3ff] via-[#faf9ff] to-[#ffffff]">
      <form
        onSubmit={handleSignup}
        className="bg-white/70 backdrop-blur-xl shadow-lg rounded-2xl p-8 w-full max-w-md border border-gray-100"
      >
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          ✨ Create an Account
        </h1>

        <p className="text-center text-gray-500 mb-6">
          Start your journey with{" "}
          <span className="font-semibold text-indigo-600">Simple Notes</span>
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          className="w-full mb-4 p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {/* Password */}
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-400 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Sign Up"}
        </button>

        {/* Google Signup */}
        <div className="mt-4 flex items-center justify-center">
          {googleClientId ? (
            <button
              type="button"
              onClick={handleGoogleClick}
              className="mt-4 inline-flex items-center gap-2 border rounded px-3 py-2 hover:shadow"
            >
              <Image
                alt="Google"
                src="/google-icon.svg"
                width={20}
                height={20}
              />
              Sign up with Google
            </button>
          ) : (
            <p className="text-sm text-gray-400">
              Google signup disabled — set NEXT_PUBLIC_GOOGLE_CLIENT_ID
            </p>
          )}
        </div>

        {message && (
          <p className="mt-4 text-center text-gray-600 font-medium">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-indigo-600 font-semibold hover:underline"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
}
