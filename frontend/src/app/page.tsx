"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authClient, markFrontendSession } from "@/lib/auth-client";
import logo from "../../public/logo-akar.webp";

export default function Home() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const login = async (nextEmail: string, nextPassword: string) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await authClient.signIn.email({
        email: nextEmail,
        password: nextPassword,
      });

      if (authError) {
        setError(
          authError.message ??
            "Login failed. Pastikan backend berjalan dan user demo sudah dibuat.",
        );
        return;
      }

      if (!data) {
        setError("Login failed");
        return;
      }

      markFrontendSession();
      router.push("/private/dashboard");
    } catch {
      setError(
        "Tidak bisa terhubung ke server auth. Cek backend di NEXT_PUBLIC_BACKEND_URL.",
      );
    } finally {
      setLoading(false);
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

  const handleDemoLogin = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    markFrontendSession();
    window.location.assign("/private/dashboard");
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#09074b]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#3127b8_0%,#20159a_38%,#09074b_100%)]" />

      <div className="absolute -left-32 top-[-100px] h-[500px] w-[500px] rounded-full bg-[#4338ca]/30 blur-[100px]" />
      <div className="absolute right-[-100px] bottom-[-100px] h-[500px] w-[500px] rounded-full bg-[#3127b8]/30 blur-[120px]" />

      <div
        className="
          absolute
          -top-24
          left-[51%]
          h-32
          w-32
          -translate-x-1/2
          rounded-full
          bg-[radial-gradient(circle_at_35%_30%,#a9a0ff_0%,#6256db_35%,#211796_75%,#130e68_100%)]
          opacity-80
          shadow-[inset_-15px_-20px_35px_rgba(0,0,0,.25),0_10px_40px_rgba(0,0,0,.25)]
        "
      />

      <div
        className="
          absolute
          left-[2%]
          top-[8%]
          h-[185px]
          w-[185px]
          rounded-full
          bg-[radial-gradient(circle_at_68%_30%,#aaa3ff_0%,#756be4_28%,#3527b6_62%,#171074_100%)]
          shadow-[inset_-25px_-25px_50px_rgba(0,0,0,.28),0_20px_50px_rgba(0,0,0,.2)]
        "
      />

      <div
        className="
          absolute
          left-[23%]
          top-[8%]
          h-6
          w-6
          rounded-full
          bg-[radial-gradient(circle_at_35%_30%,#a9a0ff,#4b40c7_60%,#211782)]
          shadow-lg
        "
      />

      <div
        className="
          absolute
          right-[4%]
          top-[9%]
          h-[415px]
          w-[415px]
          rounded-full
          bg-[radial-gradient(circle_at_67%_34%,#b6afff_0%,#8177ed_25%,#4938d0_48%,#21168f_72%,#120b61_100%)]
          shadow-[inset_-45px_-50px_80px_rgba(0,0,0,.32),0_25px_80px_rgba(0,0,0,.25)]
        "
      />

      <div
        className="
          absolute
          left-[20%]
          top-[39%]
          h-14
          w-14
          rounded-full
          bg-[radial-gradient(circle_at_62%_40%,#b7b1ff,#6257db_45%,#21168b_80%)]
          shadow-[0_8px_30px_rgba(0,0,0,.35)]
        "
      />

      <div
        className="
          absolute
          bottom-[9%]
          left-[11%]
          h-[240px]
          w-[240px]
          rounded-full
          bg-[radial-gradient(circle_at_68%_30%,#a49cff_0%,#685ce2_28%,#3424b4_58%,#140c69_100%)]
          shadow-[inset_-30px_-35px_60px_rgba(0,0,0,.3),0_20px_50px_rgba(0,0,0,.2)]
        "
      />

      <div
        className="
          absolute
          -bottom-10
          -left-10
          h-24
          w-24
          rounded-full
          bg-[radial-gradient(circle_at_55%_35%,#aaa3ff,#5449d0_50%,#17106e)]
        "
      />

      <div
        className="
          absolute
          bottom-[6%]
          right-[21%]
          h-7
          w-7
          rounded-full
          bg-[radial-gradient(circle_at_35%_30%,#9b94f4,#4137b8)]
          shadow-lg
        "
      />

      <div
        className="
          absolute
          right-[2%]
          top-[72%]
          h-7
          w-7
          rounded-full
          bg-[radial-gradient(circle_at_35%_30%,#9b94f4,#4137b8)]
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[675px]
          w-[675px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border
          border-white/25
          bg-white/[0.075]
          shadow-[inset_0_0_80px_rgba(255,255,255,.035),0_20px_80px_rgba(0,0,0,.12)]
          backdrop-blur-[2px]
        "
      />

      <div
        className="
          relative
          z-10
          flex
          min-h-screen
          w-full
          items-center
          justify-center
          px-5
        "
      >
        <div className="w-full max-w-[465px]">
          <div className="mb-14 flex items-center justify-center">
            <div className="flex items-center gap-2.5">
              <Image
                src={logo}
                alt="AKAR Logo"
                width={205}
                height={70}
                priority
                className="h-auto w-[205px] object-contain"
              />
            </div>
          </div>

          <h1 className="mb-7 text-[42px] font-semibold leading-none tracking-[-1.5px] text-white">
            Login
          </h1>

          <form onSubmit={handleLogin} className="w-full">
            <div
              className="
                mb-3
                flex
                h-[57px]
                w-full
                items-center
                rounded-[9px]
                border
                border-white/20
                bg-white/[0.13]
                px-5
                backdrop-blur-md
                transition
                focus-within:border-white/40
                focus-within:bg-white/[0.16]
              "
            >
              <svg
                width="33"
                height="27"
                viewBox="0 0 33 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-5 shrink-0"
              >
                <rect
                  x="1.5"
                  y="2"
                  width="30"
                  height="23"
                  rx="3"
                  stroke="white"
                  strokeWidth="2.5"
                />
                <path
                  d="M3 4L16.5 15L30 4"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Input your username"
                autoComplete="email"
                className="
                  h-full
                  w-full
                  bg-transparent
                  text-[19px]
                  text-white
                  outline-none
                  placeholder:text-white/90
                "
              />
            </div>

            <div
              className="
                flex
                h-[57px]
                w-full
                items-center
                rounded-[9px]
                border
                border-white/20
                bg-white/[0.13]
                px-5
                backdrop-blur-md
                transition
                focus-within:border-white/40
                focus-within:bg-white/[0.16]
              "
            >
              <svg
                width="27"
                height="29"
                viewBox="0 0 27 29"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-6 shrink-0"
              >
                <rect
                  x="3"
                  y="12"
                  width="21"
                  height="15"
                  rx="3"
                  fill="white"
                />
                <path
                  d="M7 12V8C7 3.9 9.7 1.5 13.5 1.5C17.3 1.5 20 3.9 20 8V12"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <circle cx="13.5" cy="19" r="2" fill="#5A50B5" />
              </svg>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Input your password"
                autoComplete="current-password"
                className="
                  h-full
                  w-full
                  bg-transparent
                  text-[19px]
                  text-white
                  outline-none
                  placeholder:text-white/90
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword ? "Hide password" : "Show password"
                }
                className="ml-3 shrink-0 cursor-pointer text-white/90 transition hover:text-white"
              >
                {showPassword ? (
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2 12C2 12 5.5 5 12 5C18.5 5 22 12 22 12C22 12 18.5 19 12 19C5.5 19 2 12 2 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 3L21 21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10.6 5.2C11.05 5.07 11.52 5 12 5C18.5 5 22 12 22 12C22 12 20.9 14.2 19 16.1"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M6.2 6.3C3.6 6.3 3.6 12 3.6 12C3.6 12 5.5 19 12 19C13.9 19 15.6 18.5 17.1 17.7"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-3 rounded-lg border border-red-300/20 bg-red-500/10 px-4 py-2.5">
                <p className="text-sm text-red-200">{error}</p>
              </div>
            )}

            <div className="mt-4 flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  className="
                    h-[20px]
                    w-[20px]
                    cursor-pointer
                    appearance-none
                    rounded-[4px]
                    border
                    border-white/20
                    bg-white/60
                    checked:bg-white
                  "
                />

                <span className="text-[16px] text-white">
                  Remember for 30 days
                </span>
              </label>

              <button
                type="button"
                className="
                  cursor-pointer
                  text-[16px]
                  text-white
                  transition
                  hover:underline
                "
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="
                mt-8
                h-[70px]
                w-full
                cursor-pointer
                rounded-[35px]
                bg-gradient-to-r
                from-[#6b63ad]
                to-[#7469a9]
                text-[20px]
                font-medium
                text-white
                shadow-[0_10px_30px_rgba(0,0,0,.12)]
                transition
                duration-200
                hover:brightness-110
                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>

          <div className="mt-5 text-center">
            <span className="text-[15px] text-white">
              Don’t have an account?{" "}
            </span>

            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={loading}
              className="
                cursor-pointer
                text-[15px]
                font-semibold
                text-[#FFE000]
                transition
                hover:underline
                disabled:opacity-60
              "
            >
              Demo
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}