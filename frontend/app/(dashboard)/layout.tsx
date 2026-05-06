import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-white text-black font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden border-l border-neutral-100">
        <Header />
        <main className="flex-1 overflow-y-auto bg-[#fafafa]">
          <div className="p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
