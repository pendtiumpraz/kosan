import { Sidebar } from "@/components/layout/Sidebar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // TODO: Get user from session
    const user = {
        name: "Demo User",
        role: "OWNER" as const,
        avatar: undefined,
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
