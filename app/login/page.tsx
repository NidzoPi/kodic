"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";


function LoginForm() {

  const router = useRouter();


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const [loading, setLoading] = useState(false);


  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");
    setLoading(true);

    const res = await fetch(
      "/api/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),

      }
    );


    const data = await res.json();


    if (!res.ok) {

      setError(data.error);
      setLoading(false);
      return;

    }


    router.push("/dashboard");

  }



  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">
      <div className="w-96">
        <div className="flex justify-center mb-6">
          <img
            src="/Logo_Login_Registracija.png"
            alt="Kodić"
            className="w-40 h-auto"
          />
        </div>

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
            Prijava
          </h1>

          {
            registered && (
              <p className="
      text-green-600
      text-sm
      mb-4
    ">
                Registracija je uspješna. Sada se prijavite.
              </p>
            )
          }



          <input
            className="
             border
    border-gray-300
    text-gray-900
    placeholder:text-gray-300
    p-2
    w-full
    mb-3
    rounded
          "
            placeholder="Email"
            type="email"
            value={email}
            onChange={
              e => setEmail(e.target.value)
            }
          />



          <input
            className="
             border
    border-gray-300
    text-gray-900
    placeholder:text-gray-300
    p-2
    w-full
    mb-3
    rounded
          "
            placeholder="Lozinka"
            type="password"
            value={password}
            onChange={
              e => setPassword(e.target.value)
            }
          />



          {
            error && (
              <p className="
              text-red-500
              mb-3
            ">
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
                Prijavljivanje...
              </span>
            ) : (
              "Prijavi se"
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
            <span className="text-lg">G</span>
            Nastavi sa Google
          </a>

          <Link
            href="/register"
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
            Nemate nalog? Registrujte se →
          </Link>


        </form>
      </div>

    </main>

  );

}
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Učitavanje...</div>}>
      <LoginForm />
    </Suspense>
  );
}