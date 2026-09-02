"use client";

import React, { useState } from "react";


import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    const { data, error } = await authClient.signIn.email({ email, password });

    if(error) {
      return;
    }

    if(data.user) {
      router.push('/private/dashboard');
    }
  }

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if(!email || !password) {
      console.log("no password or email");
      return;
    }

    await login(email, password);
  }

  const handleDemoLogin = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    await login("demo@gmail.com", "DemoPassword");
  }

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen bg-[#06163F]">
      <div className="flex my-5">
        
        <h1 className="text-white">Akar</h1>
      </div>
      <form onSubmit={handleLogin} className="bg-black w-full max-w-lg flex flex-col justify-center items-center gap-4 py-7 px-20 rounded-3xl">
        <h1 className="text-white text-2xl font-semibold">Welcome Back</h1>
        <section className="space-y-1.5 w-full">
          <h2 className="text-white text-xs">Email</h2>
          <input 
            type="text" 
            value={email ?? ''}
            onChange={(e) => setEmail(e.target.value)}
            className="login-field"
          />
        </section>
        <section className="space-y-1.5 w-full">
          <h2 className="text-white text-xs">Password</h2>
          <input 
            type="password"
            value={password ?? ''} 
            onChange={(e) => setPassword(e.target.value)}
            className="login-field"
          />
        </section>
        <section className="flex justify-between w-full">
          <div className="flex justify-between items-center gap-x-0.5">
            <input 
              type="checkbox" 
              className="bg-black mr-2" 
            />
            <p className="text-xs text-white">Remember me</p>
          </div>
          <p className="text-xs text-[#FFEABE] cursor-pointer hover:underline">Forgot Password</p>
        </section>
        <button
          type="submit"
          aria-label="Login"
          className="bg-[#112250] w-full text-white py-2.5 rounded-lg cursor-pointer animate hover:bg-[#1c2c5d]"
        >
          Login
        </button>
      </form>
      <button 
        type="button"
        aria-label="Demo Login"
        className="bg-indigo-500 w-fit text-white rounded-lg py-0.5 px-3 cursor-pointer animate mt-3 hover:bg-indigo-400 lg:py-1 lg:px-3"
        onClick={handleDemoLogin}
      >
        Demo
      </button>
    </div>
  );
}
