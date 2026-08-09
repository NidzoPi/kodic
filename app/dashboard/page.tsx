"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ScratchCard from "@/app/components/ScratchCard";
import ScratchButton from "@/app/components/ScratchButton";

type DashboardData = {
  name: string | null;
  email: string;
  referralCode: string;
  extraScratches: number;
  referrals: number;
  coupons: number;
  scratchCards: number;
  canScratch: boolean;
  availableCards: number;
  availableScratches: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const [showScratchResult, setShowScratchResult] = useState(false);
  const [data, setData] = useState<DashboardData | null>(null);

  /*async function loadDashboard() {

    const res = await fetch("/api/dashboard");

    if (!res.ok) {
      router.push("/login");
      return;
    }

    const dashboard = await res.json();
    console.log("RADIM DASHBOARD REFRESH");

    setData(dashboard);
  }*/
  async function loadDashboard() {

    console.log("RADIM DASHBOARD REFRESH");

    const res = await fetch("/api/dashboard", {
      cache: "no-store"
    });

    if (!res.ok) {
      router.push("/login");
      return;
    }

    const dashboard = await res.json();

    console.log("NOVI DASHBOARD PODACI:", dashboard);

    setData(dashboard);
  }


  useEffect(() => {

    loadDashboard();

  }, [router]);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
  }

  async function copyReferral() {
    if (!data) return;

    await navigator.clipboard.writeText(
      `${window.location.origin}/register?ref=${data.referralCode}`
    );

    alert("Referral link kopiran!");
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Učitavanje...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto">

        <h1 className="text-4xl font-bold text-gray-400 mb-8">
          Vrijeme je za nagrade i popuste 🎁👋
        </h1>
        <h1 className="text-1xl font-bold text-gray-300 mb-8">
          Grebi i osvajaj! ~ Vaš Kodić ~
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🎫 Dostupna grebanja
            </h2>

            <p className="text-3xl font-bold text-gray-500 text-gray-500 text-gray-500">
              {data.availableScratches}
            </p>

            <p className="text-gray-500 mt-2">
              1 dnevno + bonus grebanja
            </p>
            <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4"> <h3 className="font-bold text-purple-800"> 👥 Pozovi prijatelja </h3> <p className="text-sm text-purple-700 mt-1"> Svaki prijatelj koji se registruje preko Vašeg referral linka otključava Vam <strong> +1 bonus grebanje!</strong> </p> </div>
            <p className="text-gray-500 mt-2">
              🎯 Dostupno nagrada:{" "}
              <strong className="text-purple-700">
                {data.availableCards}
              </strong>
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🎁 Grebanje
            </h2>

            {data.availableCards === 0 && data.extraScratches <= 0 && !showScratchResult ? (

              <div className="bg-gray-100 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold">
                  🎫 NEMA DOSTUPNIH KARTICA
                </h3>

                <p className="text-gray-500 mt-2">
                  Trenutno nema dostupnih kampanja za grebanja.
                </p>
              </div>


            ) : showScratchResult ||
              data.canScratch ||
              data.extraScratches > 0 ? (

              <ScratchCard
                onScratchComplete={() => {

                  setShowScratchResult(true);

                }}
                onNewScratch={async () => {

                  await loadDashboard();

                  setShowScratchResult(false);

                }}
              />


            ) : (

              <div className="bg-gray-100 p-6 rounded-xl text-center">
                <h3 className="text-xl font-bold">
                  ⏳ Već ste iskoristili današnje grebanje
                </h3>

                <p className="text-gray-500 mt-2">
                  Novo grebanje dostupno sutra
                </p>
              </div>

            )}



          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              👥 Pozvani prijatelji
            </h2>

            <p className="text-3xl font-bold text-gray-500 text-gray-500 text-gray-500">
              {data.referrals}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🔗 Referral link
            </h2>

            <input
              readOnly
              className="border rounded p-2 w-full mb-4"
              value={`${window.location.origin}/register?ref=${data.referralCode}`}
            />

            <button
              onClick={copyReferral}
              className="bg-purple-600 text-white px-4 py-2 rounded"
            >
              Kopiraj link
            </button>

          </div>

          <div onClick={() => router.push("/dashboard/coupons")}
            className="bg-white rounded-xl shadow p-6 cursor-pointer hover:shadow-lg transition">

            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              🎁 Kuponi
            </h2>

            <p className="text-3xl font-bold text-gray-500 text-gray-500 text-gray-500">
              {data.coupons}
            </p>

          </div>

        </div>

        <div className="mt-8">

          <button
            onClick={logout}
            className="bg-red-600 text-white px-6 py-3 rounded-lg"
          >
            Odjava
          </button>

        </div>

      </div>

    </main >
  );
}