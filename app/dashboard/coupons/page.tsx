"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Coupon = {
    id: string;
    code: string;
    discount: number;
    createdAt: string;
    campaign: {
        name: string;
        description: string | null;
        discountType: string;
        totalCoupons: number;
        oldPrice: number | string | null;
        newPrice: number | string | null;
        client: {
            name: string;
        } | null;
        _count: {
            coupons: number;
        };
    };
    expiresAt: string | null;
    redeemedAt: string | null;
};

export default function CouponsPage() {
    const router = useRouter();

    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [loading, setLoading] = useState(true);

    async function loadCoupons() {
        const res = await fetch("/api/coupons");

        if (!res.ok) {
            router.push("/login");
            return;
        }

        const data = await res.json();

        setCoupons(data);
        setLoading(false);
    }

    function getCouponStatus(coupon: Coupon) {
        if (coupon.redeemedAt) {
            return {
                text: "ISKORIŠTEN",
                color: "bg-green-100 text-green-700",
            };
        }

        if (
            coupon.expiresAt &&
            new Date(coupon.expiresAt) < new Date()
        ) {
            return {
                text: "ISTEKAO",
                color: "bg-red-100 text-red-700",
            };
        }

        return {
            text: "AKTIVAN",
            color: "bg-purple-100 text-purple-700",
        };
    }

    useEffect(() => {
        loadCoupons();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-100 p-8">
                Učitavanje...
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">

                <button
                    onClick={() => router.back()}
                    className="
                        mb-6
                        bg-purple-600
                        hover:bg-purple-700
                        text-white
                        px-4
                        py-2
                        rounded-lg
                        font-semibold
                        transition
                    "
                >
                    ← Nazad
                </button>

                <h1 className="text-4xl font-bold text-gray-900 mb-8">
                    🎁 Moji kuponi
                </h1>

                {coupons.length === 0 ? (
                    <div
                        className="
                            bg-white
                            rounded-xl
                            shadow
                            p-6
                            text-center
                        "
                    >
                        <h2 className="text-xl font-bold">
                            Nemate osvojenih kupona
                        </h2>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">

                        {coupons.map((coupon) => (
                            <div
                                key={coupon.id}
                                className="
                                    bg-white
                                    rounded-xl
                                    shadow
                                    p-6
                                "
                            >
                                {(() => {
                                    const status =
                                        getCouponStatus(coupon);

                                    return (
                                        <span
                                            className={`
                                                inline-block
                                                px-3
                                                py-1
                                                rounded-full
                                                text-sm
                                                font-bold
                                                ${status.color}
                                            `}
                                        >
                                            {status.text}
                                        </span>
                                    );
                                })()}

                                <h2 className="text-xl font-bold text-gray-900 mt-3">
                                    {coupon.campaign.name}
                                </h2>

                                {/* Stara i nova cijena */}
                                {coupon.campaign.oldPrice != null &&
                                    coupon.campaign.newPrice != null && (
                                        <div className="mt-4 mb-2">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl font-semibold text-red-600 line-through">
                                                    {Number(
                                                        coupon.campaign.oldPrice
                                                    ).toFixed(2)}{" "}
                                                    KM
                                                </span>

                                                <span className="text-3xl font-bold text-green-600">
                                                    {Number(
                                                        coupon.campaign.newPrice
                                                    ).toFixed(2)}{" "}
                                                    KM
                                                </span>
                                            </div>

                                            <p className="text-sm text-gray-500 mt-1">
                                                Cijena sa popustom
                                            </p>
                                        </div>
                                    )}

                                <div
                                    className="
                                        text-5xl
                                        font-bold
                                        text-purple-600
                                        my-4
                                    "
                                >
                                    {coupon.campaign.discountType ===
                                        "PERCENT"
                                        ? `${Number(
                                            coupon.discount
                                        ).toFixed(0)}%`
                                        : `${Number(
                                            coupon.discount
                                        ).toFixed(2)} KM`}
                                </div>

                                <p className="text-gray-500">
                                    {coupon.campaign.discountType ===
                                        "PERCENT"
                                        ? "POPUST"
                                        : "UŠTEDA"}
                                </p>

                                <div
                                    className="
                                        mt-4
                                        bg-gray-200
                                        p-3
                                        rounded-lg
                                        font-mono
                                        font-bold
                                        text-gray-800
                                        text-lg
                                    "
                                >
                                    {coupon.code}
                                </div>

                                <p
                                    className="
                                        text-sm
                                        text-gray-400
                                        mt-3
                                    "
                                >
                                    Osvojen:{" "}
                                    {new Date(
                                        coupon.createdAt
                                    ).toLocaleDateString("sr-RS")}
                                </p>

                                <p
                                    className="
                                        text-sm
                                        text-gray-400
                                    "
                                >
                                    <strong>Ističe:</strong>{" "}
                                    {coupon.expiresAt
                                        ? new Date(
                                            coupon.expiresAt
                                        ).toLocaleDateString(
                                            "sr-RS"
                                        )
                                        : "-"}
                                </p>

                                <div
                                    className="
                                        mt-4
                                        bg-purple-50
                                        rounded-lg
                                        p-3
                                        text-purple-700
                                        font-semibold
                                    "
                                >
                                    🎫 Preostalo kupona:{" "}
                                    {coupon.campaign.totalCoupons -
                                        coupon.campaign._count.coupons}{" "}
                                    /{" "}
                                    {coupon.campaign.totalCoupons}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    <strong>Partner:</strong>{" "}
                                    {coupon.campaign.client?.name}
                                </p>

                                {coupon.campaign.description && (
                                    <div className="mt-4 bg-blue-50 rounded-lg p-4">
                                        <p className="text-sm font-bold text-gray-800 mb-1">
                                            Kako iskoristiti kupon?
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {coupon.campaign.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </main>
    );
}