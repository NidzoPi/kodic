"use client";

import { useEffect, useRef, useState } from "react";


export default function ScratchPage() {

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [revealed, setRevealed] = useState(false);


  useEffect(() => {

    const canvas = canvasRef.current;

    if (!canvas) return;


    const ctx = canvas.getContext("2d");

    if (!ctx) return;


    canvas.width = 400;
    canvas.height = 200;


    ctx.fillStyle = "#9ca3af";
    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );


    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(
      "OGREBI 🎁",
      110,
      115
    );


  }, []);



  function scratch(
    e: React.MouseEvent<HTMLCanvasElement>
  ) {

    const canvas = canvasRef.current;

    if (!canvas) return;


    const ctx = canvas.getContext("2d");

    if (!ctx) return;


    const rect =
      canvas.getBoundingClientRect();


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
      25,
      0,
      Math.PI * 2
    );

    ctx.fill();


    setRevealed(true);

  }



  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-purple-100
    ">


      <div className="
        bg-white
        p-8
        rounded-xl
        shadow
        text-center
      ">


        <h1 className="
          text-3xl
          font-bold
          mb-6
        ">
          Kodić 🎉
        </h1>


        <div className="
          relative
          w-[400px]
          h-[200px]
        ">


          <div className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            text-4xl
            font-bold
          ">
            20% POPUST 🎁
          </div>


          <canvas
            ref={canvasRef}
            onMouseMove={scratch}
            className="
              relative
              cursor-pointer
            "
          />


        </div>


        {
          revealed && (

            <p className="
              mt-6
              text-xl
              font-bold
              text-green-600
            ">
              Čestitamo! Osvojili ste nagradu 🎉
            </p>

          )
        }


      </div>


    </main>

  );

}