"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (nextEmail: string, nextPassword: string) => {
    setLoading(true);
    setError(null);

    const { data, error: authError } = await authClient.signIn.email({
      email: nextEmail,
      password: nextPassword,
    });

    setLoading(false);

    if (authError) {
      setError(authError.message ?? "Login failed");
      return;
    }

    if (data?.user) {
      router.push("/private/dashboard");
    }
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    await login(email, password);
  };

  const handleDemoLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await login("demo@gmail.com", "DemoPassword");
  };

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#06163F]">
      <div className="flex my-5">
        <h1 className="text-white">Akar</h1>
      </div>
      <form
        onSubmit={handleLogin}
        className="bg-black w-full max-w-lg flex flex-col justify-center items-center gap-4 py-7 px-20 rounded-3xl"
      >
        <h1 className="text-white text-2xl font-semibold">Welcome Back</h1>
        <section className="space-y-1.5 w-full">
          <h2 className="text-white text-xs">Email</h2>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="login-field"
            autoComplete="email"
          />
        </section>
        <section className="space-y-1.5 w-full">
          <h2 className="text-white text-xs">Password</h2>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="login-field"
            autoComplete="current-password"
          />
        </section>
        {error && <p className="w-full text-sm text-red-400">{error}</p>}
        <section className="flex justify-between w-full">
          <div className="flex justify-between items-center gap-x-0.5">
            <input type="checkbox" className="bg-black mr-2" />
            <p className="text-xs text-white">Remember me</p>
          </div>
          <p className="text-xs text-[#FFEABE] cursor-pointer hover:underline">
            Forgot Password
          </p>
        </section>
        <button
          type="submit"
          aria-label="Login"
          disabled={loading}
          className="bg-[#112250] w-full text-white py-2.5 rounded-lg cursor-pointer animate hover:bg-[#1c2c5d] disabled:opacity-60"
        >
          {loading ? "Logging in…" : "Login"}
        </button>
      </form>
      <button
        type="button"
        aria-label="Demo Login"
        disabled={loading}
        className="bg-indigo-500 w-fit text-white rounded-lg py-0.5 px-3 cursor-pointer animate mt-3 hover:bg-indigo-400 lg:py-1 lg:px-3 disabled:opacity-60"
        onClick={handleDemoLogin}
      >
        Demo
      </button>
    </div>
  );
}
