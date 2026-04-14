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
  MapPin,
  Loader2
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
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  updateDoc, 
  doc, 
  orderBy 
} from 'firebase/firestore';
import { toast } from 'sonner';

const data = [
  { name: 'Mon', earnings: 400 },
  { name: 'Tue', earnings: 300 },
  { name: 'Wed', earnings: 600 },
  { name: 'Thu', earnings: 800 },
  { name: 'Fri', earnings: 500 },
  { name: 'Sat', earnings: 900 },
  { name: 'Sun', earnings: 700 },
];

interface BookingRequest {
  id: string;
  user: string;
  service: string;
  location: string;
  time: string;
  price: string;
  status: string;
}

export default function ProviderDashboard() {
  const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Listen for PENDING bookings
    const q = query(
      collection(db, 'bookings'),
      where('status', '==', 'PENDING'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requestsData: BookingRequest[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        requestsData.push({
          id: doc.id,
          user: data.userName || 'Customer',
          service: data.serviceName || data.service,
          location: data.location || 'Remote/TBD',
          time: data.date,
          price: typeof data.price === 'number' ? `$${data.price}` : data.price,
          status: data.status
        });
      });
      setRequests(requestsData);
      setIsLoading(false);
    }, (error) => {
      console.error("Error listening to requests:", error);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleAccept = async (id: string) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'ACCEPTED',
        providerId: auth.currentUser.uid,
        providerName: auth.currentUser.displayName || 'Service Provider'
      });
      toast.success('Booking accepted!');
    } catch (error) {
      console.error('Error accepting booking:', error);
      toast.error('Failed to accept booking.');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), {
        status: 'CANCELLED'
      });
      toast.info('Booking declined.');
    } catch (error) {
      console.error('Error declining booking:', error);
      toast.error('Failed to decline booking.');
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b-2 border-black">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">Provider <span className="text-accent">Portal</span>.</h2>
          <p className="text-zinc-500 font-medium mt-2">Manage your service requests and track your technical performance metrics.</p>
        </div>
        <div className="flex items-center">
          <Badge className="bg-black text-white border-2 border-black px-4 py-2 font-black uppercase tracking-widest text-[10px] rounded-none shadow-[4px_4px_0px_0px_rgba(255,62,0,1)]">
            <div className="w-2 h-2 bg-accent rounded-full mr-3 animate-pulse" />
            System: Online & Active
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black">
        {[
          { title: 'Total Earnings', value: '$4,285', icon: DollarSign, color: 'text-black', bgColor: 'bg-white' },
          { title: 'Jobs Completed', value: '124', icon: Check, color: 'text-white', bgColor: 'bg-black' },
          { title: 'Active Clients', value: '12', icon: Users, color: 'text-black', bgColor: 'bg-accent' },
          { title: 'Rating', value: '4.9', icon: Star, color: 'text-black', bgColor: 'bg-white' },
        ].map((stat, i) => (
          <div key={i} className={cn("p-8 border-r-2 border-black last:border-r-0 flex flex-col justify-between group transition-colors", stat.bgColor)}>
            <div className="flex items-center justify-between mb-8">
              <div className="w-12 h-12 border-2 border-black flex items-center justify-center bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <stat.icon className={cn("w-6 h-6", stat.color === 'text-white' ? 'text-black' : stat.color)} />
              </div>
              <TrendingUp className={cn("w-5 h-5", stat.color === 'text-white' ? 'text-white' : 'text-zinc-300')} />
            </div>
            <div>
              <p className={cn("font-mono text-[10px] font-bold uppercase tracking-widest mb-2", stat.color === 'text-white' ? 'text-zinc-400' : 'text-zinc-400')}>{stat.title}</p>
              <h3 className={cn("text-4xl font-black font-heading", stat.color === 'text-white' ? 'text-white' : 'text-black')}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Earnings Chart */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-black">
              Weekly <span className="text-accent">Yield</span>.
            </h3>
            <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              <Clock className="w-3 h-3" />
              Real-time Update
            </div>
          </div>
          
          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff3e00" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#ff3e00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="stepAfter" 
                  dataKey="earnings" 
                  stroke="#ff3e00" 
                  fillOpacity={1} 
                  fill="url(#colorEarnings)" 
                  strokeWidth={4} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Incoming Requests */}
        <div className="lg:col-span-4 space-y-8">
          <h3 className="text-3xl font-black uppercase tracking-tighter font-heading text-black">Incoming <span className="text-accent">Requests</span>.</h3>
          <div className="space-y-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-10 h-10 text-black animate-spin" />
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-16 bg-zinc-50 border-2 border-black border-dashed">
                <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">No pending requests detected.</p>
              </div>
            ) : (
              requests.map((req, i) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <div className="bg-white border-2 border-black p-6 space-y-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all group">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black uppercase tracking-tight text-lg group-hover:text-accent transition-colors">{req.user}</h4>
                        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">{req.service}</p>
                      </div>
                      <span className="text-2xl font-black font-heading text-black">{req.price}</span>
                    </div>
                    <div className="space-y-3 pt-4 border-t-2 border-zinc-50">
                      <div className="flex items-center font-bold text-[11px] uppercase tracking-widest text-zinc-500">
                        <MapPin className="w-4 h-4 mr-3 text-black" />
                        {req.location}
                      </div>
                      <div className="flex items-center font-bold text-[11px] uppercase tracking-widest text-zinc-500">
                        <Clock className="w-4 h-4 mr-3 text-black" />
                        {req.time}
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={() => handleAccept(req.id)}
                        className="flex-1 bg-black hover:bg-accent text-white rounded-none font-black uppercase tracking-widest text-[10px] h-12 border-2 border-black transition-all"
                      >
                        Accept
                      </Button>
                      <Button 
                        onClick={() => handleDecline(req.id)}
                        variant="outline" 
                        className="flex-1 border-2 border-black text-black hover:bg-black hover:text-white rounded-none font-black uppercase tracking-widest text-[10px] h-12 transition-all"
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
