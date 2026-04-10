import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Settings, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Briefcase, 
  ShieldCheck,
  Bell,
  Sun,
  Moon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { auth } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'sonner';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Provider Portal', path: '/provider', icon: Briefcase },
  { name: 'Admin Panel', path: '/admin', icon: ShieldCheck },
  { name: 'Profile', path: '/profile', icon: User },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex overflow-hidden font-sans">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-slate-100">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-bold text-slate-900">
                SmartService
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-3 py-2 rounded-xl transition-all duration-200 group",
                    isActive 
                      ? "bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-sm" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isSidebarOpen && "mr-3")} />
                  {isSidebarOpen && <span className="font-medium">{item.name}</span>}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Mini */}
          <div className="p-4 border-t border-slate-100">
            <div className={cn("flex items-center", !isSidebarOpen && "justify-center")}>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {userInitial}
              </div>
              {isSidebarOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-bold text-slate-900 truncate">{userName}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
              )}
              {isSidebarOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-4 text-slate-500"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-lg font-bold text-slate-900">
              {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-slate-500"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-slate-500 relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white" />
            </Button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center space-x-2">
              <span className="text-sm font-bold text-slate-700 hidden sm:inline-block">{userName}</span>
              <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {userInitial}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
