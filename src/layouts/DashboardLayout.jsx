
import Sidebar from "../components/ Sidebar";
export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar stays fixed */}
      <Sidebar />

      {/* Main content with proper spacing for sidebar */}
      <div className="flex-1 lg:mr-92 xl:mr-80 overflow-hidden">
        <main className="p-6 overflow-y-auto h-full">
          {children}
        </main>
      </div>
    </div>
  );
}
