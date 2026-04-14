import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { 
  Users, 
  Briefcase, 
  CreditCard, 
  TrendingUp,
  Activity,
  ShieldAlert,
  Search,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const lineData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 5000 },
  { name: 'Apr', revenue: 4500 },
  { name: 'May', revenue: 6000 },
  { name: 'Jun', revenue: 5500 },
];

const pieData = [
  { name: 'Cleaning', value: 400 },
  { name: 'Repair', value: 300 },
  { name: 'Plumbing', value: 200 },
  { name: 'Electrical', value: 100 },
];

const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#f43f5e'];

const users = [
  { id: 'U-001', name: 'John Doe', email: 'john@example.com', role: 'User', status: 'Active' },
  { id: 'U-002', name: 'Alice Smith', email: 'alice@service.com', role: 'Provider', status: 'Active' },
  { id: 'U-003', name: 'Bob Johnson', email: 'bob@service.com', role: 'Provider', status: 'Pending' },
  { id: 'U-004', name: 'Admin User', email: 'admin@system.com', role: 'Admin', status: 'Active' },
];

export default function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [activeServices, setActiveServices] = useState(0);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);

  useEffect(() => {
    // Listen for users
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUserCount(snapshot.size);
      const usersData: any[] = [];
      snapshot.forEach(doc => usersData.push({ id: doc.id, ...doc.data() }));
      setRecentUsers(usersData.slice(0, 5));
    });

    // Listen for bookings
    const unsubscribeBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      setBookingCount(snapshot.size);
    });

    // Mock active services count
    setActiveServices(42);

    return () => {
      unsubscribeUsers();
      unsubscribeBookings();
    };
  }, []);

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b-2 border-black">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">Admin <span className="text-accent">Overview</span>.</h2>
          <p className="text-zinc-500 font-medium mt-2">System-wide analytics and management console for technical operations.</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="h-14 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all">
            Export Report
          </Button>
          <Button className="h-14 bg-black hover:bg-accent text-white rounded-none font-black uppercase tracking-widest text-[10px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            System Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black">
        {[
          { title: 'Total Revenue', value: `$${(bookingCount * 85).toLocaleString()}`, icon: CreditCard, color: 'text-black', bgColor: 'bg-white' },
          { title: 'Total Users', value: userCount.toString(), icon: Users, color: 'text-white', bgColor: 'bg-black' },
          { title: 'Active Services', value: activeServices.toString(), icon: Briefcase, color: 'text-black', bgColor: 'bg-accent' },
          { title: 'Total Bookings', value: bookingCount.toString(), icon: Activity, color: 'text-white', bgColor: 'bg-black' },
        ].map((stat, i) => (
          <div key={i} className={cn("p-8 border-r-2 border-black last:border-r-0 flex flex-col justify-between group transition-colors", stat.bgColor)}>
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <stat.icon className={cn("w-6 h-6", stat.color === 'text-white' ? 'text-black' : stat.color)} />
              </div>
              <Badge className="rounded-none border-2 border-black bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">+12%</Badge>
            </div>
            <div>
              <p className={cn("font-mono text-[10px] font-bold uppercase tracking-widest mb-2", stat.color === 'text-white' ? 'text-zinc-400' : 'text-zinc-400')}>{stat.title}</p>
              <h3 className={cn("text-4xl font-black font-heading", stat.color === 'text-white' ? 'text-white' : 'text-black')}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Revenue Chart */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-black">
              Revenue <span className="text-accent">Growth</span>.
            </h3>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <TrendingUp className="w-3 h-3" />
              Fiscal Year 2024
            </div>
          </div>
          
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="0" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#000" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ dy: 10 }}
                />
                <YAxis 
                  stroke="#000" 
                  fontSize={10} 
                  fontWeight="bold"
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`} 
                  tick={{ dx: -10 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: 'none', 
                    borderRadius: '0', 
                    boxShadow: '8px 8px 0px 0px rgba(255,62,0,1)' 
                  }}
                  itemStyle={{ color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em' }}
                  labelStyle={{ color: '#ff3e00', fontWeight: '900', marginBottom: '4px', fontSize: '12px' }}
                />
                <Line 
                  type="stepAfter" 
                  dataKey="revenue" 
                  stroke="#ff3e00" 
                  strokeWidth={4} 
                  dot={{ fill: '#000', stroke: '#000', strokeWidth: 2, r: 4 }} 
                  activeDot={{ r: 8, fill: '#ff3e00', stroke: '#000', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Distribution */}
        <div className="lg:col-span-4 space-y-8">
          <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-black">Service <span className="text-accent">Mix</span>.</h3>
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[400px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="#000"
                  strokeWidth={2}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#ff3e00' : index === 1 ? '#000' : index === 2 ? '#71717a' : '#e4e4e7'} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#000', 
                    border: 'none', 
                    borderRadius: '0', 
                    boxShadow: '4px 4px 0px 0px rgba(255,62,0,1)' 
                  }}
                  itemStyle={{ color: '#fff', fontWeight: '900', textTransform: 'uppercase', fontSize: '10px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-8 w-full border-t-2 border-black pt-8">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center space-x-3">
                  <div className="w-4 h-4 border-2 border-black" style={{ backgroundColor: i === 0 ? '#ff3e00' : i === 1 ? '#000' : i === 2 ? '#71717a' : '#e4e4e7' }} />
                  <span className="font-mono text-[9px] font-black uppercase tracking-widest text-black">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
          <h3 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">
            User <span className="text-accent">Management</span>.
          </h3>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
            <Input 
              placeholder="SEARCH USERS..." 
              className="pl-10 h-12 bg-white border-2 border-black rounded-none font-bold placeholder:text-zinc-300 focus:ring-0"
            />
          </div>
        </div>

        <div className="border-2 border-black overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <Table>
            <TableHeader className="bg-zinc-50 border-b-2 border-black">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-8">User Profile</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-8">Role</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-8">Status</TableHead>
                <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-8 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.length > 0 ? recentUsers.map((user) => (
                <TableRow key={user.id} className="border-b-2 border-black last:border-b-0 hover:bg-zinc-50 transition-colors">
                  <TableCell className="px-8 py-6">
                    <div>
                      <p className="font-black uppercase tracking-tight text-sm">{user.displayName || 'Anonymous'}</p>
                      <p className="font-mono text-[10px] font-bold text-zinc-400 mt-1">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <Badge className="rounded-none border-2 border-black bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-6">
                    <Badge className="rounded-none border-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest bg-black text-white border-black">
                      Active
                    </Badge>
                  </TableCell>
                  <TableCell className="px-8 py-6 text-right">
                    <Button variant="ghost" size="icon" className="h-10 w-10 border-2 border-black rounded-none hover:bg-black hover:text-white transition-all">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                    No users detected in system.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
