import { requireAdmin } from "@/lib/auth/requireAdmin";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const result = await requireAdmin();


    if (result.status === "UNAUTHENTICATED") {
        redirect("/login");
    }


    if (result.status === "FORBIDDEN") {
        redirect("/dashboard");
    }


    const user = result.user;


    if (user.role !== "CLIENT") {
        redirect("/admin");
    }


    return (
        <div className="min-h-screen bg-gray-100 flex">

            <aside className="w-64 bg-black text-white p-5 flex flex-col min-h-screen">

                <h1 className="text-xl font-bold mb-8">
                    Kodić Klijent
                </h1>


                <nav className="space-y-3">

                    <a
                        href="/client"
                        className="block hover:text-gray-300"
                    >
                        Dashboard
                    </a>


                    <a
                        href="/admin/campaigns"
                        className="block hover:text-gray-300"
                    >
                        Kampanje
                    </a>


                    <a
                        href="/admin/coupons"
                        className="block hover:text-gray-300"
                    >
                        Kuponi
                    </a>

                </nav>


                <div className="mt-auto pt-6">
                    <LogoutButton />
                </div>

            </aside>


            <main className="flex-1 p-6">

                <div className="mb-5 text-sm text-gray-600">
                    Prijavljen:
                    {" "}
                    {user.email}
                </div>


                {children}

            </main>

        </div>
    );
}