import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Star,
  Check,
  X,
  Clock,
  MapPin
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', earnings: 400 },
  { name: 'Tue', earnings: 300 },
  { name: 'Wed', earnings: 600 },
  { name: 'Thu', earnings: 800 },
  { name: 'Fri', earnings: 500 },
  { name: 'Sat', earnings: 900 },
  { name: 'Sun', earnings: 700 },
];

const requests = [
  { id: 'RQ-101', user: 'Sarah Jenkins', service: 'Deep Cleaning', location: 'Downtown, NY', time: 'Today, 2:00 PM', price: '$150' },
  { id: 'RQ-102', user: 'Mike Ross', service: 'Carpet Wash', location: 'Brooklyn, NY', time: 'Tomorrow, 10:00 AM', price: '$85' },
];

export default function ProviderDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Provider Portal</h2>
          <p className="text-slate-500">Manage your service requests and track your earnings.</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1.5 font-bold rounded-full">
            <div className="w-2 h-2 bg-emerald-500 rounded-full mr-2 animate-pulse" />
            Online & Accepting Requests
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Total Earnings', value: '$4,285', icon: DollarSign, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
          { title: 'Jobs Completed', value: '124', icon: Check, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
          { title: 'Active Clients', value: '12', icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
          { title: 'Rating', value: '4.9', icon: Star, color: 'text-amber-600', bgColor: 'bg-amber-50' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={cn("p-3 rounded-xl", stat.bgColor)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Earnings Chart */}
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-slate-900 flex items-center text-lg font-bold">
              <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
              Weekly Earnings
            </CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0f172a', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="earnings" stroke="#6366f1" fillOpacity={1} fill="url(#colorEarnings)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Incoming Requests */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900">Incoming Requests</h3>
          {requests.map((req, i) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-white border-slate-200 shadow-sm hover:border-indigo-300 transition-colors rounded-2xl overflow-hidden">
                <CardContent className="p-5 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-slate-900">{req.user}</h4>
                      <p className="text-sm text-indigo-600 font-bold">{req.service}</p>
                    </div>
                    <span className="text-lg font-bold text-slate-900">{req.price}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs font-medium text-slate-500">
                      <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      {req.location}
                    </div>
                    <div className="flex items-center text-xs font-medium text-slate-500">
                      <Clock className="w-3.5 h-3.5 mr-2 text-slate-400" />
                      {req.time}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-10 font-bold rounded-xl shadow-lg shadow-indigo-100">
                      Accept
                    </Button>
                    <Button variant="outline" className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 text-xs h-10 font-bold rounded-xl">
                      Decline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
