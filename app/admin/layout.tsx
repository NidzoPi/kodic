import { requireAdmin } from "@/lib/auth/requireAdmin";
import { redirect } from "next/navigation";


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

            <aside className="w-64 bg-black text-white p-5">

                <h1 className="text-xl font-bold mb-8">
                    Kodić Admin
                </h1>


                <nav className="space-y-3">

                    <a
                        href="/admin"
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