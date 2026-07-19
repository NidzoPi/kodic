"use client";

import { useRouter } from "next/navigation";


export default function DashboardPage() {

  const router = useRouter();


  async function logout() {

    await fetch(
      "/api/auth/logout",
      {
        method: "POST",
      }
    );


    router.push("/login");

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
        p-8
        rounded-xl
        shadow
        text-center
      ">

        <h1 className="
          text-3xl
          font-bold
          mb-4
        ">
          Dashboard
        </h1>


        <p className="mb-6">
          Uspješno ste prijavljeni 🎉
        </p>


        <button
          onClick={logout}
          className="
            bg-red-600
            text-white
            px-6
            py-2
            rounded-lg
          "
        >
          Odjava
        </button>


      </div>


    </main>

  );

}