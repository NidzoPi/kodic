"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function ClientRegisterPage() {

    const router = useRouter();


    const [companyName, setCompanyName] = useState("");
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
                }),
            }
        );


        const data = await res.json();


        if (!res.ok) {

            setError(data.error);

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
                    className="
                        bg-purple-600
                        text-white
                        w-full
                        p-2
                        rounded
                    "
                >
                    Kreiraj partnerski nalog
                </button>


            </form>

        </main>

    );
}