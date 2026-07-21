"use client";

import { useState } from "react";


type Props = {
    onScratchComplete?: () => void | Promise<void>;
    onNewScratch?: () => void;
};


export default function ScratchCard({
    onScratchComplete,
    onNewScratch
}: Props) {
    {

        const [scratched, setScratched] = useState(false);
        const [loading, setLoading] = useState(false);
        const [result, setResult] = useState<any>(null);


        async function scratch() {

            if (scratched) return;

            setLoading(true);

            const res = await fetch("/api/scratch", {
                method: "POST"
            });

            const data = await res.json();
            console.log("Scratch API response:", data);

            setResult(data);

            /*if (res.ok && onScratchComplete) {
                setTimeout(() => {
                    onScratchComplete();
                }, 1000);
            }*/

            setScratched(true);

            setLoading(false);
        }


        return (

            <div className="flex justify-center">

                <div
                    onClick={scratch}
                    className="
                    relative
                    w-80
                    h-48
                    rounded-2xl
                    shadow-xl
                    cursor-pointer
                    overflow-hidden
                    bg-purple-700
                    flex
                    items-center
                    justify-center
                "
                >

                    {!scratched && (

                        <div
                            className="
                            absolute
                            inset-0
                            bg-gray-400
                            flex
                            items-center
                            justify-center
                            text-xl
                            font-bold
                            text-white
                        "
                        >
                            {loading
                                ? "Grebanje..."
                                : "OGREBI OVDE 🎁"
                            }

                        </div>

                    )}


                    {scratched && result && (

                        <div
                            className="
        text-white
        text-center
        "
                        >

                            <div className="text-4xl font-bold">
                                {result.discount}%
                            </div>

                            <div>
                                POPUST
                            </div>


                            <button
                                onClick={() => {
                                    setResult(null);
                                    setScratched(false);
                                    onScratchComplete?.();
                                }}
                                className="
        mt-6
        bg-purple-600
        text-white
        px-6
        py-3
        rounded-lg
        font-bold
    "
                            >
                                NOVO GREBANJE
                            </button>


                        </div>

                    )}

                </div>

            </div>

        );
    }
}