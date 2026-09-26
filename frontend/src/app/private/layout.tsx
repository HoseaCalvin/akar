import Sidebar from "@/components/Sidebar";
import { EnvironmentProvider } from "@/lib/environment-context";

export default function PrivateRootLayout({ children }: LayoutProps<"/">) {
  return (
    <EnvironmentProvider>
      <main className="flex bg-linear-to-t from-[#CAD6F4] to-white w-full h-screen overflow-hidden">
        <Sidebar />
        <div className="flex-1 min-w-0 h-full overflow-y-auto">
          {children}
        </div>
      </main>
    </EnvironmentProvider>
  );
}
