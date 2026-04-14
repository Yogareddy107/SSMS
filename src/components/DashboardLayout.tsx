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
import { auth, db } from '@/lib/firebase';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';

import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [userRole, setUserRole] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role);
          } else {
            // Check if it's the default admin
            if (currentUser.email === "yogareddy107@gmail.com") {
              setUserRole('ADMIN');
            } else {
              setUserRole('USER');
            }
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole('USER');
        }
      } else {
        setUserRole(null);
      }

      setAuthLoading(false);
      if (!currentUser && location.pathname !== '/' && location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const filteredNavItems = navItems.filter(item => {
    if (item.path === '/provider') return userRole === 'PROVIDER' || userRole === 'ADMIN';
    if (item.path === '/admin') return userRole === 'ADMIN';
    return true;
  });

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-black border-t-accent animate-spin" />
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.2em] text-black">Initializing System...</p>
        </div>
      </div>
    );
  }

  const userInitial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || 'U';
  const userName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-white text-black flex overflow-hidden font-sans grid-lines">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r-2 border-black transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
          !isSidebarOpen && "-translate-x-full lg:w-20"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b-2 border-black">
            <div className="w-10 h-10 bg-black flex items-center justify-center mr-3 border-2 border-black group-hover:bg-accent transition-colors">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="text-xl font-black uppercase tracking-tighter">
                Smart<span className="text-accent">Service</span>
              </span>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={cn(
                    "flex items-center px-4 py-3 transition-all duration-200 group border-2",
                    isActive 
                      ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(255,62,0,1)]" 
                      : "text-zinc-500 border-transparent hover:border-black hover:text-black"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isSidebarOpen && "mr-3")} />
                  {isSidebarOpen && <span className="font-bold uppercase tracking-widest text-[11px]">{item.name}</span>}
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-none opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,62,0,1)]">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Mini */}
          <div className="p-6 border-t-2 border-black bg-zinc-50">
            <div className={cn("flex items-center", !isSidebarOpen && "justify-center")}>
              <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center text-white text-xs font-black">
                {userInitial}
              </div>
              {isSidebarOpen && (
                <div className="ml-4 overflow-hidden">
                  <p className="text-[11px] font-black uppercase tracking-widest text-black truncate">{userName}</p>
                  <p className="text-[10px] font-mono text-zinc-400 truncate">{user?.email}</p>
                </div>
              )}
              {isSidebarOpen && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="ml-auto text-zinc-400 hover:text-accent hover:bg-transparent"
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
        <header className="h-20 flex items-center justify-between px-8 bg-white border-b-2 border-black sticky top-0 z-40">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="mr-6 text-black border-2 border-black hover:bg-accent hover:text-white transition-all rounded-none"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <h1 className="text-2xl font-black uppercase tracking-tighter font-heading">
              {filteredNavItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center space-x-6">
            {mounted && (
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-black border-2 border-black hover:bg-black hover:text-white rounded-none transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="text-black border-2 border-black hover:bg-black hover:text-white rounded-none transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-accent border-2 border-black" />
            </Button>
            <div className="h-10 w-[2px] bg-black mx-2" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-4 p-0 hover:bg-transparent transition-colors group">
                  <div className="text-right hidden sm:block">
                    <p className="text-[11px] font-black uppercase tracking-widest text-black">{userName}</p>
                    <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest">Online</p>
                  </div>
                  <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center text-white text-xs font-black group-hover:bg-accent transition-colors">
                    {userInitial}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 rounded-none p-0 border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <DropdownMenuLabel className="px-6 py-6 bg-zinc-50 border-b-2 border-black">
                  <p className="text-xs font-black uppercase tracking-widest text-black">{userName}</p>
                  <p className="text-[10px] font-mono text-zinc-400 truncate mt-1">{user?.email}</p>
                </DropdownMenuLabel>
                <div className="p-2">
                  <DropdownMenuItem asChild className="rounded-none focus:bg-black focus:text-white cursor-pointer p-0">
                    <Link to="/profile" className="flex items-center px-4 py-3 w-full font-bold uppercase tracking-widest text-[10px]">
                      <User className="w-4 h-4 mr-3" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-none focus:bg-black focus:text-white cursor-pointer p-0">
                    <Link to="/settings" className="flex items-center px-4 py-3 w-full font-bold uppercase tracking-widest text-[10px]">
                      <Settings className="w-4 h-4 mr-3" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-black h-[2px] my-2" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="rounded-none focus:bg-accent focus:text-white text-accent cursor-pointer px-4 py-3 font-bold uppercase tracking-widest text-[10px]"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "circOut" }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
