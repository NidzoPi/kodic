"use client";

import { useState } from "react";


export default function ScratchButton() {

    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);


    async function scratch() {

        setLoading(true);

        const res = await fetch("/api/scratch", {
            method:"POST"
        });


        const data = await res.json();

        setResult(data);

        setLoading(false);

    }


    return (

        <div>

            <button
                onClick={scratch}
                disabled={loading}
                className="
                    bg-purple-600
                    text-white
                    px-8
                    py-4
                    rounded-xl
                    text-xl
                    font-bold
                "
            >
                {loading ? "Grebanje..." : "🎁 GREBI"}
            </button>


            {result && (

                <div className="mt-6 bg-green-100 p-5 rounded-xl">

                    {result.discount ? (

                        <>
                            <h3 className="text-2xl font-bold">
                                🎉 Čestitamo!
                            </h3>

                            <p>
                                Dobili ste {result.discount}% popusta
                            </p>

                            <p className="mt-2">
                                ID kartice: {result.scratchCardId}
                            </p>
                        </>

                    ) : (

                        <p>
                            {result.error}
                        </p>

                    )}

                </div>

            )}

        </div>

    );

}