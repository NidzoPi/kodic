"use client";

import { useState, useRef, useEffect } from "react";
import confetti from "canvas-confetti";


type Props = {
    onScratchComplete?: () => void | Promise<void>;
    onNewScratch?: () => void;
};


export default function ScratchCard({
    onScratchComplete,
    onNewScratch
}: Props) {


    const [scratched, setScratched] = useState(false);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [hasScratched, setHasScratched] = useState(false);

    const [apiCalled, setApiCalled] = useState(false);



    useEffect(() => {

        const canvas = canvasRef.current;

        if (!canvas) return;


        canvas.width = 320;
        canvas.height = 192;


        const ctx = canvas.getContext("2d");

        if (!ctx) return;


        ctx.fillStyle = "#9ca3af";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "OGREBI OVDJE 🎁",
            canvas.width / 2,
            canvas.height / 2
        );


    }, []);

    useEffect(() => {

        if (!scratched && canvasRef.current) {

            resetCanvas();

        }

    }, [scratched]);




    async function startDrawing() {

        setIsDrawing(true);


        if (!apiCalled) {

            await finishScratch();

        }

    }



    function stopDrawing() {

        setIsDrawing(false);

    }



    function draw(
        e: React.PointerEvent<HTMLCanvasElement>
    ) {


        if (!isDrawing) return;


        const canvas = canvasRef.current;

        if (!canvas) return;

        canvas.style.touchAction = "none";


        const ctx = canvas.getContext("2d");

        if (!ctx) return;


        const rect = canvas.getBoundingClientRect();


        const x =
            e.clientX - rect.left;


        const y =
            e.clientY - rect.top;



        ctx.globalCompositeOperation =
            "destination-out";



        ctx.beginPath();


        ctx.arc(
            x,
            y,
            20,
            0,
            Math.PI * 2
        );


        ctx.fill();
        checkScratchPercent();


    }



    async function scratch() {

        if (scratched) return;


        setLoading(true);


        const res = await fetch(
            "/api/scratch",
            {
                method: "POST"
            }
        );


        // const data = await res.json();
        let data;

        try {

            data = await res.json();

        } catch (error) {

            console.error("API nije vratio JSON");

            alert("Greška servera");

            setLoading(false);

            return;

        }


        if (!res.ok) {

            alert(data.error);

            setLoading(false);

            return;

        }



        setResult(data);

        setScratched(true);

        setLoading(false);

        console.log("Pozivam refresh dashboarda");

        if (onScratchComplete) {

            await onScratchComplete();

        }

    }

    function celebrateWin() {

        confetti({
            particleCount: 150,
            spread: 90,
            startVelocity: 35,
            origin: {
                y: 0.6,
            },
        });


        setTimeout(() => {

            confetti({
                particleCount: 80,
                spread: 120,
                origin: {
                    y: 0.7,
                },
            });

        }, 300);

    }

    function checkScratchPercent() {

        const canvas = canvasRef.current;

        if (!canvas) return;


        const ctx = canvas.getContext("2d");

        if (!ctx) return;


        const pixels = ctx.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
        );


        let transparent = 0;


        for (
            let i = 3;
            i < pixels.data.length;
            i += 4
        ) {

            if (pixels.data[i] === 0) {
                transparent++;
            }

        }


        const total =
            canvas.width *
            canvas.height;


        const percent =
            (transparent / total) * 100;


        /*console.log(
            "Oguljeno:",
            percent.toFixed(2),
            "%"
        );*/


        if (
            percent > 60 &&
            !hasScratched
        ) {

            setHasScratched(true);
            celebrateWin();
            setScratched(true);


            if (onScratchComplete) {

                onScratchComplete();

            }

        }
        // console.log("Dovoljno ogrebano:", percent > 60);

    }

    async function finishScratch() {

        if (apiCalled) return;


        setApiCalled(true);


        setLoading(true);


        const res = await fetch(
            "/api/scratch",
            {
                method: "POST"
            }
        );


        const data = await res.json();


        if (!res.ok) {

            alert(data.error);

            setLoading(false);

            setApiCalled(false);

            return;

        }


        // odmah prikaži nagradu ispod canvasa
        setResult(data);


        setLoading(false);

    }

    function resetCanvas() {

        const canvas = canvasRef.current;

        if (!canvas) return;

        const ctx = canvas.getContext("2d");

        if (!ctx) return;


        ctx.globalCompositeOperation = "source-over";

        ctx.fillStyle = "#9ca3af";

        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );


        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "OGREBI OVDJE 🎁",
            canvas.width / 2,
            canvas.height / 2
        );

    }





    return (

        <div
            className="
            relative
            w-80
            h-48
            rounded-2xl
            overflow-hidden
            shadow-xl
            "
        >



            {/* REZULTAT ISPOD */}

            <div
                className="
    absolute
    inset-0
    bg-purple-700
    flex
    items-center
    justify-center
    text-white
    z-0
    "
            >




                {result && (

                    <div className="text-center">

                        <div className="text-4xl font-bold">
                            {
                                result.discountType === "PERCENT"
                                    ? `${Number(result.discount).toFixed(0)}%`
                                    : `${Number(result.discount).toFixed(2)} KM`
                            }
                        </div>

                        <div>
                            {result && (
                                result.discountType === "PERCENT"
                                    ? "POPUST"
                                    : "UŠTEDA"
                            )}
                        </div>
                        <div className="mt-2 text-lg font-semibold">
                            {result.campaign}
                        </div>


                        <button
                            onClick={() => {

                                setResult(null);

                                setScratched(false);

                                setApiCalled(false);

                                setHasScratched(false);

                                if (onNewScratch) {
                                    onNewScratch();
                                }

                            }}
                            className="
            mt-4
            bg-white
            text-purple-700
            font-bold
            px-5
            py-2
            rounded-lg
            "
                        >
                            ZAGREBI OPET
                        </button>

                    </div>

                )}



            </div>





            {/* CANVAS PREMAZ */}


            {!scratched && (

                <canvas

                    ref={canvasRef}

                    onPointerDown={startDrawing}

                    onPointerMove={draw}

                    onPointerUp={stopDrawing}

                    onPointerLeave={stopDrawing}

                    onPointerCancel={stopDrawing}

                    className="
    absolute
    inset-0
    cursor-pointer
    z-10
    touch-none
    "

                />

            )}



        </div>

    );

}