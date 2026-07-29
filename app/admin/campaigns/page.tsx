import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";


export default async function CampaignsPage() {

  const campaigns =
    await prisma.campaign.findMany({
      include: {
        _count: {
          select: {
            coupons: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });


  return (
    <div>

      <div className="flex justify-between mb-6">

        <h2 className="text-3xl font-bold text-gray-800 mb-8">
          Kampanje
        </h2>


        <Link
          href="/admin/campaigns/new"
          className="bg-black text-white px-4 py-2 rounded"
        >
          Nova kampanja
        </Link>

      </div>



      <div className="space-y-4">

        {campaigns.map(campaign => (

          <div
            key={campaign.id}
            className="bg-white p-5 rounded shadow"
          >

            <h3 className="text-1xl font-bold text-gray-400">
              {campaign.name}
            </h3>

            <p className="text-gray-400">
              Vrijednost:{" "}
              {campaign.discountType === "PERCENT"
                ? `${campaign.discount}%`
                : `${campaign.discount} KM`
              }
            </p>

            <p className="text-gray-400">
              Izdati kodovi:
              {" "}
              {campaign._count.coupons}
              /
              {campaign.totalCoupons}
            </p>

            <DeleteButton id={campaign.id} />

          </div>


        ))}


      </div>

    </div>
  );
}