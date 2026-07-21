"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";


function RegisterForm() {

  const router = useRouter();

  const searchParams = useSearchParams();

  const referralCode = searchParams.get("ref");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");


  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault();

    setError("");


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
          Registracija
        </h1>


        <input
          className="border p-2 w-full mb-3"
          placeholder="Ime"
          value={name}
          onChange={
            e => setName(e.target.value)
          }
        />


        <input
          className="border p-2 w-full mb-3"
          placeholder="Email"
          type="email"
          value={email}
          onChange={
            e => setEmail(e.target.value)
          }
        />


        <input
          className="border p-2 w-full mb-3"
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
          className="
            bg-purple-600
            text-white
            w-full
            p-2
            rounded
          "
        >
          Registruj se
        </button>


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