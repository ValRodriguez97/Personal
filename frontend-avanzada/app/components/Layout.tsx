import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/app/components/Sidebar';
import { Navbar } from '@/app/components/Navbar';

export function Layout() {
  return (
    <div className="flex h-screen bg-[#F5F5F5] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
