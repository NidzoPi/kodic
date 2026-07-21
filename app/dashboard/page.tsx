"use client";

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
};

export default function DashboardPage() {
  const router = useRouter();

  const [data, setData] = useState<DashboardData | null>(null);

  async function loadDashboard() {

    const res = await fetch("/api/dashboard");

    if (!res.ok) {
      router.push("/login");
      return;
    }

    const dashboard = await res.json();

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

        <h1 className="text-4xl font-bold mb-8">
          Dobrodošao {data.name ?? "korisniče"} 👋
        </h1>

        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-2">
              🎫 Dostupna grebanja
            </h2>

            <p className="text-3xl font-bold">
              {(data.canScratch ? 1 : 0) + data.extraScratches}
            </p>

            <p className="text-gray-500 mt-2">
              1 dnevno + bonus grebanja
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
              🎁 Grebanje
            </h2>

            {data.canScratch || data.extraScratches > 0 ? (
              <ScratchCard onScratchComplete={loadDashboard} />
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
            <h2 className="text-xl font-semibold mb-2">
              👥 Pozvani prijatelji
            </h2>

            <p className="text-3xl font-bold">
              {data.referrals}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-4">
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

          <div className="bg-white rounded-xl shadow p-6">

            <h2 className="text-xl font-semibold mb-2">
              🎁 Kuponi
            </h2>

            <p className="text-3xl font-bold">
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

    </main>
  );
}