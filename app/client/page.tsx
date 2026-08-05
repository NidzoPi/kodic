import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function ClientDashboardPage() {

    const user = await getCurrentUser();


    if (!user) {
        return null;
    }


    return (
        <div>

            <h2 className="text-3xl font-bold text-gray-800 mb-8">
                Dashboard klijenta
            </h2>


            <div className="bg-white rounded-xl shadow p-6">

                <h3 className="text-xl font-semibold">
                    Dobrodošli
                </h3>


                <p className="text-gray-500 mt-2">
                    Ovdje ćete upravljati svojim kampanjama.
                </p>

            </div>

        </div>
    );
}