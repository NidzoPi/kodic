"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import { Turnstile } from "@marsidev/react-turnstile";


function RegisterForm() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const referralCode = searchParams.get("ref");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");


  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");
    setLoading(true);

    console.log("KREĆEM REGISTRACIJU");
    const res = await fetch(
      "/api/auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          password,
          referralCode,
          turnstileToken
        }),
      }
    );
    console.log("REGISTER RESPONSE", res.status);

    const data = await res.json();


    if (!res.ok) {

      setError(data.error);
      setLoading(false);
      return;

    }


    //router.push("/dashboard");
    router.push("/login?registered=true");

  }


  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          p-8
          rounded-xl
          shadow
          w-96
        "
      >


        <h1 className="
          text-2xl font-bold mb-6 text-gray-700
        ">
          Registracija
        </h1>


        <input
          className=" border
    border-gray-300
    text-gray-900
    placeholder:text-gray-400
    p-2
    w-full
    mb-3
    rounded"
          placeholder="Ime"
          value={name}
          onChange={
            e => setName(e.target.value)
          }
        />


        <input
          className=" border
    border-gray-300
    text-gray-900
    placeholder:text-gray-400
    p-2
    w-full
    mb-3
    rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={
            e => setEmail(e.target.value)
          }
        />


        <input
          className=" border
    border-gray-300
    text-gray-900
    placeholder:text-gray-400
    p-2
    w-full
    mb-3
    rounded"
          placeholder="Lozinka"
          type="password"
          value={password}
          onChange={
            e => setPassword(e.target.value)
          }
        />


        {
          error && (
            <p className="text-red-500 mb-3">
              {error}
            </p>
          )
        }


        <button
          type="submit"
          disabled={loading}
          className="
    bg-purple-600
    text-white
    w-full
    p-2
    rounded
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Registrovanje u toku...
            </span>
          ) : (
            "Registruj se"
          )}
        </button>

        <div className="flex items-center gap-3 my-5">
          <div className="h-px bg-gray-300 flex-1" />
          <span className="text-sm text-gray-500">ili</span>
          <div className="h-px bg-gray-300 flex-1" />
        </div>

        <a
          href="/api/auth/google"
          className="
    flex
    items-center
    justify-center
    gap-3
    w-full
    border
    border-gray-300
    bg-white
    text-gray-700
    p-2
    rounded
    hover:bg-gray-50
    transition
  "
        >
          <span className="text-lg font-semibold">G</span>
          Nastavi sa Google
        </a>

        <Link
          href="/register/client"
          className="
    block
    text-center
    mt-4
    text-sm
    text-purple-700
    hover:text-purple-900
    hover:underline
  "
        >
          Postani naš partner →
        </Link>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 mb-2">
            🔒 Sigurnosna provjera
          </p>

          <p className="text-xs text-gray-400 mb-3">
            Provjera služi za zaštitu registracije od botova i lažnih naloga.
          </p>

          <div className="flex justify-center">
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
              onSuccess={(token) => {
                setTurnstileToken(token);
              }}
            />
          </div>
        </div>


      </form>

    </main>

  );

}
export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <RegisterForm />
    </Suspense>
  );
}