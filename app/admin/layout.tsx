
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/components/LogoutButton";
import Link from "next/link";

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
        <div className="flex min-h-screen bg-gray-100">
            <aside className="flex min-h-screen w-48 flex-col bg-black p-4 text-white md:w-64 md:p-5">
                <h1 className="mb-8 text-xl font-bold">
                    {user.role === "CLIENT" ? "Kodić Klijent" : "Kodić Admin"}
                </h1>

                <nav className="flex flex-1 flex-col space-y-3">
                    <Link
                        href={user.role === "CLIENT" ? "/client" : "/admin"}
                        className="block hover:text-gray-300"
                    >
                        Dashboard
                    </Link>

                    <Link
                        href="/admin/campaigns"
                        className="block hover:text-gray-300"
                    >
                        Kampanje
                    </Link>

                    {user.role === "ADMIN" && (
                        <>
                            <Link
                                href="/admin/users"
                                className="block hover:text-gray-300"
                            >
                                Korisnici
                            </Link>

                            <Link
                                href="/admin/giveaways/imports"
                                className="block hover:text-gray-300"
                            >
                                Facebook objave
                            </Link>
                            <Link
                                href="/admin/giveaways/test-import"
                                className="block text-sm text-gray-400 hover:text-white"
                            >
                                Unesi ručno nagradnu igru
                            </Link>
                        </>
                    )}

                    <Link
                        href="/admin/coupons"
                        className="block hover:text-gray-300"
                    >
                        Kuponi
                    </Link>

                    <div className="mt-auto pt-6">
                        <LogoutButton />
                    </div>
                </nav>
            </aside>

            <main className="min-w-0 flex-1 p-6">
                <div className="mb-5 text-sm text-gray-600">
                    Prijavljen: {user.email}
                </div>

                {children}
            </main>
        </div>
    );
}
