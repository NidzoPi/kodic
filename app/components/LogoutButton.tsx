"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {

    const router = useRouter();


    async function logout() {

        await fetch("/api/auth/logout", {
            method: "POST",
        });


        router.push("/login");
        router.refresh();

    }


    return (
        <button
            onClick={logout}
            className="block hover:text-gray-300"
        >
            Odjava
        </button>
    );

}