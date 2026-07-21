"use client";

import { useRouter } from "next/navigation";


export default function DeleteButton({
    id
}:{
    id:string
}) {

    const router = useRouter();


    async function remove(){

        const ok = confirm(
            "Obrisati kampanju?"
        );


        if(!ok) return;


        await fetch(
            "/api/admin/campaigns",
            {
                method:"DELETE",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    id
                })
            }
        );


        router.refresh();

    }


    return (
        <button
            onClick={remove}
            className="mt-3 bg-red-600 text-white px-3 py-1 rounded"
        >
            Obriši
        </button>
    );
}