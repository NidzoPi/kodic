"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";


type DashboardData = {
    activeCampaigns: number;
    totalCoupons: number;
    redeemedCoupons: number;
    usageRate: number;
};


export default function ClientDashboardPage() {

    const router = useRouter();

    const [data, setData] =
        useState<DashboardData | null>(null);



    async function loadDashboard() {

        const res = await fetch(
            "/api/client/dashboard",
            {
                cache: "no-store"
            }
        );


        if (!res.ok) {

            router.push("/login");
            return;

        }


        const dashboard =
            await res.json();


        setData(dashboard);

    }



    useEffect(() => {

        loadDashboard();

    }, []);



    if (!data) {

        return (
            <div>
                Učitavanje...
            </div>
        );

    }



    return (

        <div>


            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Dashboard
            </h2>



            <div className="
                grid
                md:grid-cols-2
                xl:grid-cols-4
                gap-6
            ">


                <div className="bg-white rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Aktivne kampanje
                    </h3>

                    <p className="text-4xl font-bold mt-3 text-purple-600">
                        {data.activeCampaigns}
                    </p>

                </div>



                <div className="bg-white rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Podijeljeni kuponi
                    </h3>

                    <p className="text-4xl font-bold mt-3 text-purple-600">
                        {data.totalCoupons}
                    </p>

                </div>



                <div className="bg-white rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Iskorišteni kuponi
                    </h3>

                    <p className="text-4xl font-bold mt-3 text-purple-600">
                        {data.redeemedCoupons}
                    </p>

                </div>



                <div className="bg-white rounded-xl shadow p-6">

                    <h3 className="text-gray-500">
                        Stopa iskorištenosti
                    </h3>

                    <p className="text-4xl font-bold mt-3 text-purple-600">
                        {data.usageRate}%
                    </p>

                </div>


            </div>


        </div>

    );

}