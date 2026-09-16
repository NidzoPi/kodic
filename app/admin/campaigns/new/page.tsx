"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewCampaignPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [discount, setDiscount] = useState("");
    const [totalCoupons, setTotalCoupons] = useState("");
    const [discountType, setDiscountType] = useState("PERCENT");
    const [expiresAt, setExpiresAt] = useState("");

    const [oldPrice, setOldPrice] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [error, setError] = useState("");

    async function submit(e: React.FormEvent) {
        e.preventDefault();

        setError("");

        const hasOldPrice = oldPrice.trim() !== "";
        const hasNewPrice = newPrice.trim() !== "";

        // Ako je unesena samo jedna cijena
        if (hasOldPrice !== hasNewPrice) {
            setError(
                "Ako unosite cijenu, potrebno je unijeti i staru i novu cijenu."
            );
            return;
        }

        // Provjera cijena ako su obje unesene
        if (hasOldPrice && hasNewPrice) {
            const oldPriceNumber = Number(oldPrice);
            const newPriceNumber = Number(newPrice);

            if (
                !Number.isFinite(oldPriceNumber) ||
                !Number.isFinite(newPriceNumber) ||
                oldPriceNumber < 0 ||
                newPriceNumber < 0
            ) {
                setError("Cijene moraju biti validni iznosi.");
                return;
            }

            if (newPriceNumber >= oldPriceNumber) {
                setError("Nova cijena mora biti manja od stare cijene.");
                return;
            }
        }

        const response = await fetch("/api/admin/campaigns", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name,
                description,
                discount,
                discountType,
                totalCoupons,
                expiresAt,
                oldPrice: hasOldPrice ? oldPrice : null,
                newPrice: hasNewPrice ? newPrice : null,
            }),
        });

        if (!response.ok) {
            setError("Došlo je do greške prilikom kreiranja kampanje.");
            return;
        }

        router.push("/admin/campaigns");
    }

    return (
        <form
            onSubmit={submit}
            className="bg-white p-6 rounded shadow max-w-xl"
        >
            <h2 className="text-3xl font-bold text-gray-800 mb-5">
                Nova kampanja
            </h2>

            <input
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                placeholder="Naziv"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <textarea
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                placeholder="Kako da korisnik iskoristi kupon kod?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <select
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 rounded"
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
            >
                <option value="PERCENT">Popust u %</option>
                <option value="FIXED">Popust u KM</option>
            </select>

            <input
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                placeholder={
                    discountType === "PERCENT"
                        ? "Popust %"
                        : "Popust KM"
                }
                type="number"
                step="0.01"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
            />

            <input
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                placeholder="Broj kodova"
                type="number"
                value={totalCoupons}
                onChange={(e) => setTotalCoupons(e.target.value)}
            />

            <div className="border border-gray-200 rounded p-4 mb-3">
                <h3 className="font-semibold text-gray-800 mb-1">
                    Cijena proizvoda
                </h3>

                <p className="text-sm text-gray-500 mb-3">
                    Opciono. Ako unesete jednu cijenu, potrebno je unijeti i drugu.
                </p>

                <input
                    className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                    placeholder="Stara cijena (KM)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                />

                <input
                    className="border border-gray-300 p-2 w-full text-gray-800 placeholder:text-gray-600 rounded"
                    placeholder="Nova cijena (KM)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                />
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded mb-3 text-sm">
                    {error}
                </div>
            )}

            <label className="block mb-1 text-gray-700 font-semibold">
                Datum isteka kampanje
            </label>

            <input
                className="border border-gray-300 p-2 w-full mb-3 text-gray-800 placeholder:text-gray-600 rounded"
                type="date"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
            />

            <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2 rounded font-semibold"
            >
                Kreiraj kampanju
            </button>
        </form>
    );
}