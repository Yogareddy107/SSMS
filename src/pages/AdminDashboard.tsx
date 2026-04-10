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
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Admin Overview</h2>
          <p className="text-slate-500">System-wide analytics and management console.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50">
            Export Report
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200">
            System Settings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Revenue', value: '$45,285', icon: CreditCard, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
          { title: 'Total Users', value: '1,284', icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
          { title: 'Active Services', value: '42', icon: Briefcase, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { title: 'System Alerts', value: '2', icon: ShieldAlert, color: 'text-rose-600', bgColor: 'bg-rose-50' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", stat.bgColor)}>
                  <stat.icon className={cn("w-5 h-5", stat.color)} />
                </div>
                <Badge variant="outline" className="text-[10px] border-slate-100 text-slate-500 bg-slate-50">+12%</Badge>
              </div>
              <p className="text-sm font-medium text-slate-500">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center text-lg font-bold">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Revenue Growth
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Service Distribution */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center text-lg font-bold">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Service Mix
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px] flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4 mt-4 w-full">
              {pieData.map((item, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs font-medium text-slate-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management */}
      <Card className="bg-white border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
          <CardTitle className="text-xl font-bold text-slate-900">User Management</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input 
              placeholder="Search users..." 
              className="pl-9 bg-slate-50 border-slate-200 h-10 w-64 text-sm rounded-xl focus:ring-indigo-500"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow className="border-slate-100 hover:bg-transparent">
                <TableHead className="text-slate-500 font-bold px-6 py-4 text-xs uppercase tracking-wider">User</TableHead>
                <TableHead className="text-slate-500 font-bold px-6 py-4 text-xs uppercase tracking-wider">Role</TableHead>
                <TableHead className="text-slate-500 font-bold px-6 py-4 text-xs uppercase tracking-wider">Status</TableHead>
                <TableHead className="text-slate-500 font-bold px-6 py-4 text-xs uppercase tracking-wider text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="px-6 py-4">
                    <div>
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className="border-slate-200 text-slate-600 bg-white font-medium">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge className={cn(
                      "font-bold",
                      user.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-amber-50 text-amber-700 border-amber-100'
                    )}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
