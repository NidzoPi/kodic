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


  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");


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
          text-2xl
          font-bold
          mb-6
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
            p-2
            w-full
            mb-3
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
            p-2
            w-full
            mb-3
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
          className="
            bg-purple-600
            text-white
            w-full
            p-2
            rounded
          "
        >
          Prijavi se
        </button>

        <Link
          href="/register"
          className="
    block
    text-center
    mt-4
    text-sm
    text-purple-600
    hover:underline
  "
        >
          Nemate nalog? Registrujte se →
        </Link>


      </form>


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