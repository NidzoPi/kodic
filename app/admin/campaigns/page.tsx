import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";
import { getCurrentUser } from "@/lib/auth/currentUser";


export default async function CampaignsPage() {

  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const campaigns =
    await prisma.campaign.findMany({

      where:
        user.role === "ADMIN"
          ? {}
          : {
            clientId: user.clientId
          },

      include: {
        client: true,
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

      <div className="flex items-center justify-between mb-6">

        <h2 className="text-3xl font-bold text-gray-800">
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

            <h3 className="text-xl font-bold text-gray-400">
              {campaign.name}
            </h3>

            <p className="text-gray-400">
              Vrijednost:{" "}
              {
                campaign.discountType === "PERCENT"
                  ? `${Number(campaign.discount).toFixed(0)}%`
                  : `${Number(campaign.discount).toFixed(2)} KM`
              }
            </p>

            <p className="text-gray-400">
              Izdati kodovi:
              {" "}
              {campaign._count.coupons}
              /
              {campaign.totalCoupons}
            </p>

  
              {
                user.role === "ADMIN" && (

                  <p className="text-gray-400">
                    Klijent:{" "}
                    {
                      campaign.client
                        ? campaign.client.name
                        : "Interna kampanja"
                    }
                  </p>

                )
              }
            

            <DeleteButton id={campaign.id} />

          </div>


        ))}


      </div>

    </div>
  );
}