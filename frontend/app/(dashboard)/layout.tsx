import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-black text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden border-l border-neutral-800">
        <Header />
        <main className="flex-1 overflow-y-auto bg-black">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
