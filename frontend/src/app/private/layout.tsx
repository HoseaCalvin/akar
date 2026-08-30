import Sidebar from "@/components/Sidebar";

export default function PrivateRootLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex bg-linear-to-t from-[#CAD6F4] to-white w-full h-screen overflow-y-auto">
      <Sidebar/>
      <div className="flex-1 min-w-0 h-full overflow-y-auto">
          { children }
      </div>
    </main>
  );
}
