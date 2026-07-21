import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "./DeleteButton";


export default async function CampaignsPage() {

  const campaigns =
    await prisma.campaign.findMany({
      orderBy:{
        createdAt:"desc"
      }
    });


  return (
    <div>

      <div className="flex justify-between mb-6">

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



      <div className="space-y-4">

        {campaigns.map(campaign => (

          <div
            key={campaign.id}
            className="bg-white p-5 rounded shadow"
          >

            <h3 className="font-bold">
              {campaign.name}
            </h3>

            <p>
              Popust: {campaign.discount}%
            </p>

            <p>
              Kodovi:
              {" "}
              {campaign.issuedCoupons}
              /
              {campaign.totalCoupons}
            </p>

            <DeleteButton id={campaign.id}/>

          </div>
          

        ))}


      </div>

    </div>
  );
}