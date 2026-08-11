"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";


export default function ClientRegisterPage() {

    const router = useRouter();


    const [companyName, setCompanyName] = useState("");
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


        const res = await fetch(
            "/api/auth/register-client",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    companyName,
                    name,
                    email,
                    password,
                    turnstileToken
                }),
            }
        );


        const data = await res.json();


        if (!res.ok) {

            setError(data.error);
            setLoading(false);
            return;

        }


        //router.push("/login");
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
                    Postani naš partner
                </h1>


                <input
                    className="border
    border-gray-300
    text-gray-700
    placeholder:text-gray-400
    p-2
    w-full
    mb-3
    rounded"
                    placeholder="Naziv firme / radnje"
                    value={companyName}
                    onChange={
                        e => setCompanyName(e.target.value)
                    }
                />


                <input
                    className="border
    border-gray-300
    text-gray-700
    placeholder:text-gray-400
    p-2
    w-full
    mb-3
    rounded"
                    placeholder="Ime odgovorne osobe"
                    value={name}
                    onChange={
                        e => setName(e.target.value)
                    }
                />


                <input
                    className="border
    border-gray-300
    text-gray-700
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
                    className="border
    border-gray-300
    text-gray-500
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
                            Kreiranje partnerskog naloga...
                        </span>
                    ) : (
                        "Kreiraj partnerski nalog"
                    )}
                </button>
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