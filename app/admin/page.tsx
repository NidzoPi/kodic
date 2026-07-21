import { prisma } from "@/lib/prisma";
import Link from "next/link";


export default async function AdminPage() {


    const campaigns =
        await prisma.campaign.findMany({
            orderBy: {
                createdAt: "desc"
            }
        });



    return (

        <div>

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-2xl font-bold">
                    Kampanje
                </h2>


                <Link
                    href="/admin/campaigns/new"
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Nova kampanja
                </Link>

            </div>



            <div className="grid gap-4">


                {campaigns.map((campaign) => (

                    <div
                        key={campaign.id}
                        className="bg-white p-5 rounded shadow"
                    >

                        <h3 className="text-lg font-bold">
                            {campaign.name}
                        </h3>


                        <p>
                            {campaign.description}
                        </p>


                        <div className="mt-3">

                            <span>
                                Popust: {campaign.discount}%
                            </span>

                            <br />

                            <span>
                                Kodovi:
                                {" "}
                                {campaign.issuedCoupons}
                                /
                                {campaign.totalCoupons}
                            </span>

                        </div>


                    </div>

                ))}


                {campaigns.length === 0 && (

                    <p>
                        Nema kampanja.
                    </p>

                )}


            </div>


        </div>

    );
}