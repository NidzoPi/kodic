"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function NewCampaignPage() {

    const router = useRouter();


    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [totalCoupons, setTotalCoupons] = useState("");


    async function submit(e: React.FormEvent) {

        e.preventDefault();


        await fetch("/api/admin/campaigns", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name,
                description,
                discount,
                totalCoupons

            })

        });


        router.push("/admin/campaigns");

    }



    return (

        <form
            onSubmit={submit}
            className="bg-white p-6 rounded shadow max-w-xl"
        >


            <h2 className="text-3xl font-bold text-gray-800 mb-5">
                Nova kampanja
            </h2>


            <input
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                placeholder="Naziv"
                value={name}
                onChange={e => setName(e.target.value)}
            />


            <textarea
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                placeholder="Opis"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />


            <input
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                placeholder="Popust %"
                type="number"
                value={discount}
                onChange={e => setDiscount(e.target.value)}
            />


            <input
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                placeholder="Broj kodova"
                type="number"
                value={totalCoupons}
                onChange={e => setTotalCoupons(e.target.value)}
            />


            <button
                className="
bg-gray-800
hover:bg-gray-900
text-white
px-5
py-2
rounded
font-semibold
"
            >
                Kreiraj kampanju
            </button>


        </form>

    );

}