"use client";

import { useEffect, useRef, useState } from "react";

export default function ScratchPage() {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scratching, setScratching] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [started, setStarted] = useState(false);


  useEffect(() => {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;


    canvas.width = 320;
    canvas.height = 180;


    // površina za grebanje
    ctx.fillStyle = "#999";
    ctx.fillRect(0,0,320,180);


    ctx.fillStyle = "white";
    ctx.font = "bold 28px Arial";
    ctx.textAlign = "center";

    ctx.fillText(
      "OGREBI",
      160,
      95
    );


  }, []);


  function scratch(e: React.MouseEvent<HTMLCanvasElement>) {

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;


    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;


    ctx.globalCompositeOperation = "destination-out";

    ctx.beginPath();
    ctx.arc(x,y,20,0,Math.PI*2);
    ctx.fill();


    checkScratch();

  }



  function checkScratch(){

    const canvas = canvasRef.current;

    if(!canvas) return;


    const ctx = canvas.getContext("2d");

    if(!ctx) return;


    const pixels = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );


    let transparent = 0;


    for(
      let i=3;
      i<pixels.data.length;
      i+=4
    ){

      if(pixels.data[i] === 0)
        transparent++;

    }


    const percent =
      transparent /
      (canvas.width * canvas.height)
      *100;


    if(percent > 45 && !started){

      setStarted(true);

      getPrize();

    }

  }



  async function getPrize(){

    const res = await fetch(
      "/api/scratch",
      {
        method:"POST"
      }
    );


    const data = await res.json();

    setResult(data);

  }



  return (

    <main className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <div className="
        bg-white
        rounded-3xl
        shadow-xl
        p-10
        text-center
      ">


      <h1 className="
        text-3xl
        font-bold
        mb-6
      ">
        🎁 Ogrebi i osvoji popust
      </h1>



      {!result ? (

        <canvas
          ref={canvasRef}
          onMouseMove={(e)=>{

            if(e.buttons===1)
              scratch(e);

          }}
          className="
            rounded-xl
            cursor-pointer
          "
        />


      ):(

        <div>

          <div className="text-5xl">
            🎉
          </div>

          <h2 className="
            text-3xl
            font-bold
          ">
            Čestitamo!
          </h2>


          <div className="
            text-6xl
            font-bold
            text-purple-600
            my-5
          ">
            {result.discount}%
          </div>


          <p>
            Vaš kod:
          </p>


          <div className="
            bg-gray-200
            p-3
            rounded-lg
            font-mono
          ">
            {result.coupon}
          </div>


        </div>

      )}


      </div>

    </main>

  );
}