import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/currentUser";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    const user = await getCurrentUser();


    if (!user) {
        redirect("/login");
    }


    if (user.role === "CLIENT") {
        redirect("/admin/campaigns");
    }


    return (
        <>
            {children}
        </>
    );
}