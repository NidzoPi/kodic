"use client";

import { useState } from "react";


export default function AdminCouponsPage() {
    const [coupon, setCoupon] = useState<any>(null);
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    return (

        <div className="max-w-3xl">

            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Kuponi
            </h2>

            <div className="bg-white rounded-xl shadow p-6">

                <label className="block font-semibold mb-2">
                    Kod kupona
                </label>

                <div className="flex gap-3">

                    <input
                        className="
                            flex-1
                            border
                            rounded-lg
                            px-4
                            py-2
                        "
                        placeholder="Unesite kod..."
                        value={code}
                        onChange={(e) =>
                            setCode(e.target.value.toUpperCase())
                        }
                    />
                    {
                        error && (

                            <p className="text-red-600 mt-4">

                                {error}

                            </p>

                        )
                    }
                    {
                        coupon && (

                            <div className="mt-6 bg-white rounded-xl shadow p-6">
                                <div
                                    className={`
        inline-block
        px-3
        py-1
        rounded-full
        text-sm
        font-semibold
        mb-4
        ${getCouponStatus(coupon).color}
    `}
                                >
                                    {getCouponStatus(coupon).text}
                                </div>
                                <h3 className="text-2xl font-bold mb-4">
                                    {coupon.campaign.name}
                                </h3>


                                <p>
                                    <strong>Kod:</strong> {coupon.code}
                                </p>


                                <p>
                                    <strong>Korisnik:</strong>{" "}
                                    {coupon.user?.email}
                                </p>


                                <p>
                                    <strong>Popust:</strong>{" "}
                                    {coupon.discount}
                                    {
                                        coupon.campaign.discountType === "FIXED"
                                            ? " KM"
                                            : "%"
                                    }
                                </p>


                                <p>
                                    <strong>Ističe:</strong>{" "}
                                    {
                                        coupon.expiresAt
                                            ? new Date(coupon.expiresAt)
                                                .toLocaleDateString("sr-RS")
                                            : "-"
                                    }
                                </p>
                                {
                                    !coupon.redeemedAt && coupon.campaign.active && !(
                                        coupon.expiresAt &&
                                        new Date(coupon.expiresAt) < new Date()
                                    ) && (

                                        <button
                                            onClick={redeemCoupon}
                                            className="
                mt-6
                bg-green-600
                hover:bg-green-700
                text-white
                px-5
                py-2
                rounded-lg
                font-semibold
            "
                                        >
                                            ✓ Iskoristi kupon
                                        </button>

                                    )
                                }

                            </div>

                        )
                    }

                    <button
                        onClick={searchCoupon}
                        className="
        bg-black
        text-white
        px-6
        rounded-lg
    "
                    >
                        Pretraži
                    </button>

                </div>

            </div>

        </div>

    );
    async function searchCoupon() {

        setError("");
        setCoupon(null);

        const res =
            await fetch(
                "/api/admin/coupons?code=" + code
            );

        const data = await res.json();

        if (!res.ok) {

            setError(data.error);

            return;

        }

        setCoupon(data);

    }

    async function redeemCoupon() {

        if (!coupon) return;

        const couponId = coupon.id;
        const confirmed = confirm(
            "Da li ste sigurni da želite označiti ovaj kupon kao iskorišten?"
        );

        if (!confirmed) return;


        const res = await fetch(
            "/api/admin/coupons/redeem",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    id: couponId
                })
            }
        );


        const data = await res.json();


        if (!res.ok) {

            alert(data.error);

            return;

        }


        setCoupon(data);

    }
    function getCouponStatus(coupon: any) {

        if (coupon.redeemedAt) {

            return {
                text: "ISKORIŠTEN",
                color: "bg-green-100 text-green-700"
            };

        }


        if (
            coupon.expiresAt &&
            new Date(coupon.expiresAt) < new Date()
        ) {

            return {
                text: "ISTEKAO",
                color: "bg-red-100 text-red-700"
            };

        }


        return {
            text: "AKTIVAN",
            color: "bg-purple-100 text-purple-700"
        };

    }

}
