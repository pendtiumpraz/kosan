import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Get session from NextAuth
    const session = await auth();

    // Redirect to login if not authenticated
    if (!session?.user) {
        redirect("/login");
    }

    const user = {
        name: session.user.name || "User",
        role: session.user.role,
        avatar: session.user.avatar,
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Sidebar */}
            <Sidebar
                userRole={user.role}
                userName={user.name}
                userAvatar={user.avatar}
            />

            {/* Main Content - offset by sidebar width */}
            <main className="ml-64 min-h-screen transition-all duration-300">
                {children}
            </main>
        </div>
    );
}
