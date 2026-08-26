import { requireAdmin } from "@/lib/auth/requireAdmin";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";


export default async function AdminLayout({
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


    return (
        <div className="min-h-screen bg-gray-100 flex">

            <aside className="w-48 md:w-64 bg-black text-white p-4 md:p-5 flex flex-col min-h-screen">
                <h1 className="text-xl font-bold mb-8">
                    {user.role === "CLIENT"
                        ? "Kodić Klijent"
                        : "Kodić Admin"}
                </h1>


                <nav className="flex-1 flex flex-col space-y-3">

                    <a
                        href={user.role === "CLIENT" ? "/client" : "/admin"}
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


                    {
                        user.role === "ADMIN" && (

                            <a
                                href="/admin/users"
                                className="block hover:text-gray-300"
                            >
                                Korisnici
                            </a>

                        )
                    }


                    <a
                        href="/admin/coupons"
                        className="block hover:text-gray-300"
                    >
                        Kuponi
                    </a>

                    <div className="mt-auto pt-6">
                        <LogoutButton />
                    </div>

                </nav>

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