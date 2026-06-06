import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { Search, Bell, Menu, X, User, LogOut, Settings, BookMarked, Home, Library, LayoutDashboard, Check } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import logoImg from "../../imports/mq1jioql-ANP.png";
import { NotificationDropdown } from "./components/NotificationDropdown";

export function Layout() {
  const { user, logout, hasPermission } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.username || 'User');
  const hasAdminDashboardAccess = hasPermission('APPROVE_USER') || hasPermission('UPLOAD_BOOK') || hasPermission('MODERATE_COMMENT') || hasPermission('MANAGE_ROLE');

  const hasAdminDashboardAccess = hasPermission('APPROVE_USER') || hasPermission('UPLOAD_BOOK') || hasPermission('MODERATE_COMMENT') || hasPermission('MANAGE_ROLE');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      <header className="bg-[#00502D] text-white shadow-md z-20 relative">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} alt="MDN Logo" className="h-10 object-contain bg-white rounded p-1" />
              <span className="font-bold text-xl hidden sm:block tracking-wide">
                Digital Library
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-xl mx-8 hidden md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search for books, authors, or topics..."
                className="w-full bg-white/10 border border-white/20 rounded-full py-2 pl-10 pr-4 text-white placeholder-white/70 focus:outline-none focus:bg-white focus:text-gray-900 focus:placeholder-gray-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <NotificationDropdown />
            
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-2 p-1 pr-3 hover:bg-white/10 rounded-full transition-colors">
                <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center font-bold text-sm uppercase">
                  {userName.substring(0, 2)}
                </div>
                <span className="hidden sm:block text-sm font-medium capitalize">{userName}</span>
              </div>
              <div className="absolute right-0 top-full pt-2 w-48 hidden group-hover:block z-50">
                <div className="bg-white rounded-lg shadow-xl py-2 text-gray-800 border border-gray-100">
                  <Link to="/collection" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><BookMarked size={16} /> My Collection</Link>
                  {hasAdminDashboardAccess && (
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><Settings size={16} /> Dashboard</Link>
                  )}
                  <hr className="my-2 border-gray-200" />
                  <button onClick={() => {
                    logout();
                    navigate('/login');
                  }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600"><LogOut size={16} /> Logout</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">

        <aside
          className={`${isSidebarOpen ? "w-64" : "w-0"} transition-all duration-300 ease-in-out bg-white shadow-[4px_0_24px_rgba(0,0,0,0.05)] overflow-hidden z-10 flex flex-col shrink-0`}
        >
          <nav className="p-4 flex flex-col gap-2 w-64 flex-1">
            <SidebarLink to="/" icon={<Home size={20} />} label="Home" active={location.pathname === '/'} />
            <SidebarLink to="/browse" icon={<Library size={20} />} label="Browse Catalog" active={location.pathname.startsWith('/browse')} />
            <SidebarLink to="/collection" icon={<BookMarked size={20} />} label="My Collection" active={location.pathname === '/collection'} />
            
            {hasAdminDashboardAccess && (
              <>
                <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</div>
                <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname.startsWith('/admin')} />
              </>
            )}
          </nav>
        </aside>


        <main className="flex-1 overflow-auto bg-slate-50 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarLink({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active?: boolean }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-green-50 text-[#00502D] font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
