import { Outlet, Link, useNavigate, useLocation, ScrollRestoration } from "react-router";
import { Search, Bell, Menu, X, User, LogOut, Settings, BookMarked, Home, Library, LayoutDashboard, Check, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { NotificationDropdown } from "./components/NotificationDropdown";
import logoImg from "../imports/image.svg";
export function Layout() {
  const { t } = useTranslation();
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useEffect(() => {
    const routeTitles: Record<string, string> = {
      '/': 'Home - Digital Library',
      '/browse': 'Browse - Digital Library',
      '/collection': 'My Collection - Digital Library',
      '/admin': 'Dashboard - Digital Library',
      '/settings': 'Settings - Digital Library',
    };
    let newTitle = 'Digital Library';
    if (location.pathname.startsWith('/browse')) newTitle = 'Browse - Digital Library';
    else if (location.pathname.startsWith('/admin')) newTitle = 'Dashboard - Digital Library';
    else if (location.pathname.startsWith('/book/')) newTitle = 'Book Details - Digital Library';
    else if (routeTitles[location.pathname]) newTitle = routeTitles[location.pathname];
    document.title = newTitle;
  }, [location]);
  const userName = user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.username || 'User');
  const hasAdminDashboardAccess = hasPermission('APPROVE_USER') || hasPermission('UPLOAD_BOOK') || hasPermission('MODERATE_COMMENT') || hasPermission('MANAGE_ROLE');
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-[#00502D] text-white shadow-md z-20 relative">
        <div className="w-full px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors ml-0"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/" className="flex items-center gap-3">
              <img src={logoImg} alt="Digital Library Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
              <span className="font-bold text-xl hidden sm:block tracking-wide">
                Digital Library
              </span>
            </Link>
          </div>
          <div className="hidden md:block flex-1 max-w-xl mx-8">
            {/* Search bar removed as per user request to avoid confusion with Browse page search */}
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSwitcher />
            <NotificationDropdown />
            <div className="relative cursor-pointer">
              <div 
                className="flex items-center gap-2 p-1 pr-3 hover:bg-white/10 rounded-full transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center font-bold text-sm uppercase">
                  {userName.substring(0, 2)}
                </div>
                <span className="hidden sm:block text-sm font-medium capitalize">{userName}</span>
              </div>
              {isProfileOpen && (
                <div className="absolute right-0 top-full pt-2 w-48 z-50">
                  <div className="bg-white rounded-lg shadow-xl py-2 text-gray-800 border border-gray-100">
                    <Link to="/collection" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><BookMarked size={16} /> {t('nav.bookmarks', 'My Collection')}</Link>
                    <Link to="/settings" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><Settings size={16} /> {t('nav.settings', 'Settings')}</Link>
                    {hasAdminDashboardAccess && (
                      <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100"><LayoutDashboard size={16} /> {t('nav.dashboard', 'Dashboard')}</Link>
                    )}
                    <hr className="my-2 border-gray-200" />
                    <button onClick={() => {
                      setIsProfileOpen(false);
                      logout();
                      navigate('/login');
                    }} className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 text-red-600"><LogOut size={16} /> {t('nav.logout', 'Logout')}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile backdrop */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}
        <aside
          className={`fixed inset-y-0 left-0 z-40 transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out bg-white shadow-[4px_0_24px_rgba(0,0,0,0.05)] w-64 flex flex-col shrink-0 ${!isSidebarOpen ? 'md:w-0' : 'md:w-64'} md:transition-all overflow-hidden`}
        >
          {/* Mobile Sidebar Header with Logo */}
          <div className="md:hidden flex items-center justify-between p-4 bg-[#00502D] text-white">
            <Link to="/" className="flex items-center gap-3" onClick={() => setIsSidebarOpen(false)}>
              <img src={logoImg} alt="Digital Library Logo" className="w-9 h-9 object-contain drop-shadow-sm" />
              <span className="font-bold text-lg tracking-wide">
                Digital Library
              </span>
            </Link>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>

          <nav className="p-4 flex flex-col gap-2 w-64 flex-1">
            <SidebarLink to="/" icon={<Home size={20} />} label={t('nav.home', 'Home')} active={location.pathname === '/'} onClick={() => { if(window.innerWidth < 768) setIsSidebarOpen(false) }} />
            <SidebarLink to="/browse" icon={<Library size={20} />} label={t('nav.library', 'Browse Catalog')} active={location.pathname.startsWith('/browse')} onClick={() => { if(window.innerWidth < 768) setIsSidebarOpen(false) }} />
            <SidebarLink to="/collection" icon={<BookMarked size={20} />} label={t('nav.bookmarks', 'My Collection')} active={location.pathname === '/collection'} onClick={() => { if(window.innerWidth < 768) setIsSidebarOpen(false) }} />
            {hasAdminDashboardAccess && (
              <>
                <div className="mt-6 mb-2 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Management</div>
                <SidebarLink to="/admin" icon={<LayoutDashboard size={20} />} label={t('nav.dashboard', 'Dashboard')} active={location.pathname.startsWith('/admin')} onClick={() => { if(window.innerWidth < 768) setIsSidebarOpen(false) }} />
              </>
            )}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto bg-slate-50 relative w-full">
          <ScrollRestoration />
          <Outlet />
        </main>
      </div>
    </div>
  );
}
function SidebarLink({ to, icon, label, active, onClick }: { to: string; icon: React.ReactNode; label: string; active?: boolean, onClick?: () => void }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-green-50 text-[#00502D] font-medium' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
