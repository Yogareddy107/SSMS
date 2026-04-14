import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Filter,
  ArrowUpRight,
  CreditCard,
  Loader2,
  Star,
  ChevronRight,
  Info,
  ListTodo,
  MessageSquare,
  CalendarPlus,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'motion/react';
import { getServices } from '@/services/api';
import { toast } from 'sonner';
import { db, auth } from '@/lib/firebase';
import { cn } from '@/lib/utils';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  setDoc
} from 'firebase/firestore';

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

interface Booking {
  id: string;
  service: string;
  provider: string;
  date: string;
  status: string;
  price: string;
  subTasks?: SubTask[];
  rating?: number;
  userId: string;
  serviceId: string;
  createdAt: any;
}

interface Service {
  id: number;
  name: string;
  category: string;
  price: number;
  description?: string;
  averageRating?: number;
}

const stats = [
  { title: 'Total Bookings', value: '12', icon: Calendar, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { title: 'In Progress', value: '3', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' },
  { title: 'Completed', value: '8', icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' },
  { title: 'Pending Payment', value: '1', icon: AlertCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
];

const recentBookings = [
  { id: 'BK-001', service: 'Home Cleaning', provider: 'Alice Smith', date: '2024-03-20', status: 'In Progress', price: '$80' },
  { id: 'BK-002', service: 'AC Repair', provider: 'Bob Johnson', date: '2024-03-18', status: 'Completed', price: '$120' },
  { id: 'BK-003', service: 'Plumbing', provider: 'Charlie Brown', date: '2024-03-15', status: 'Completed', price: '$65' },
  { id: 'BK-004', service: 'Electrical', provider: 'David Wilson', date: '2024-03-10', status: 'Pending', price: '$95' },
];

export default function UserDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [lastBooking, setLastBooking] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const stats = [
    { 
      title: 'Total Bookings', 
      value: bookings.length.toString(), 
      icon: Calendar, 
      color: 'text-indigo-400', 
      bg: 'bg-indigo-400/10' 
    },
    { 
      title: 'In Progress', 
      value: bookings.filter(b => b.status === 'IN_PROGRESS' || b.status === 'ACCEPTED').length.toString(), 
      icon: Clock, 
      color: 'text-amber-400', 
      bg: 'bg-amber-400/10' 
    },
    { 
      title: 'Completed', 
      value: bookings.filter(b => b.status === 'COMPLETED').length.toString(), 
      icon: CheckCircle2, 
      color: 'text-green-400', 
      bg: 'bg-green-400/10' 
    },
    { 
      title: 'Pending', 
      value: bookings.filter(b => b.status === 'PENDING').length.toString(), 
      icon: AlertCircle, 
      color: 'text-rose-400', 
      bg: 'bg-rose-400/10' 
    },
  ];

  // Real-time listener for bookings
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'bookings'),
      where('userId', '==', auth.currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData: Booking[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        bookingsData.push({
          id: doc.id,
          service: data.serviceName || data.service, // Handle both for compatibility
          provider: data.providerName || data.provider || 'Assigned Soon',
          date: data.date,
          status: data.status,
          price: typeof data.price === 'number' ? `$${data.price}` : data.price,
          subTasks: data.subTasks || [],
          rating: data.rating,
          userId: data.userId,
          serviceId: data.serviceId,
          createdAt: data.createdAt
        });
      });
      setBookings(bookingsData);
    }, (error) => {
      console.error("Error listening to bookings:", error);
      toast.error("Failed to sync bookings in real-time.");
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoadingServices(true);
      try {
        const data = await getServices();
        // Add some mock descriptions and ratings for demo
        const enhancedData = data.map((s: any) => ({
          ...s,
          description: `Professional ${s.name} service with guaranteed satisfaction. Our experts use premium tools and techniques.`,
          averageRating: 4.5 + Math.random() * 0.5
        }));
        setServices(enhancedData);
      } catch (error) {
        console.error('Failed to fetch services:', error);
      } finally {
        setIsLoadingServices(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || s.category === categoryFilter;
    const matchesPrice = s.price >= priceRange[0] && s.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = ['All', ...Array.from(new Set(services.map(s => s.category)))];

  const handleBookService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) {
      toast.error('You must be logged in to book a service.');
      return;
    }

    setIsBooking(true);
    
    const service = services.find(s => s.id.toString() === selectedServiceId);
    const date = (e.target as any).date.value;

    try {
      const bookingData = {
        userId: auth.currentUser.uid,
        serviceId: selectedServiceId,
        serviceName: service?.name || 'Service',
        providerId: null,
        providerName: 'Assigned Soon',
        date: date,
        status: 'PENDING',
        price: service?.price || 0,
        createdAt: serverTimestamp(),
        subTasks: [
          { id: '1', title: 'Confirm appointment', completed: false },
          { id: '2', title: 'Prepare workspace', completed: false },
        ]
      };

      const docRef = await addDoc(collection(db, 'bookings'), bookingData);
      
      setLastBooking({
        ...bookingData,
        id: docRef.id,
        price: `$${bookingData.price}`,
        service: bookingData.serviceName,
        provider: bookingData.providerName
      });
      
      setShowConfirmation(true);
      toast.success('Service booked successfully!');
    } catch (error) {
      console.error('Error booking service:', error);
      toast.error('Failed to book service. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const toggleTask = async (bookingId: string, taskId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const updatedSubTasks = booking.subTasks?.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );

    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        subTasks: updatedSubTasks
      });
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task.');
    }
  };

  const addTask = async (bookingId: string, title: string) => {
    if (!title.trim()) return;
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const newTask = { id: Date.now().toString(), title, completed: false };
    const updatedSubTasks = [...(booking.subTasks || []), newTask];

    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        subTasks: updatedSubTasks
      });
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task.');
    }
  };

  const submitReview = async (bookingId: string, rating: number, comment: string) => {
    if (!auth.currentUser) return;

    try {
      // Update booking with rating
      await updateDoc(doc(db, 'bookings', bookingId), { rating });

      // Add to reviews collection
      const booking = bookings.find(b => b.id === bookingId);
      await addDoc(collection(db, 'reviews'), {
        userId: auth.currentUser.uid,
        bookingId: bookingId,
        serviceId: booking?.serviceId,
        rating,
        comment,
        createdAt: serverTimestamp()
      });

      toast.success('Review submitted! Thank you for your feedback.');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review.');
    }
  };

  return (
    <div className="space-y-12 bg-white p-0 md:p-0 rounded-none">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-12 border-b-2 border-black">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">
            Welcome back, <span className="text-accent">{auth.currentUser?.displayName?.split(' ')[0] || 'User'}</span>.
          </h2>
          <p className="text-zinc-500 font-medium mt-2">System Status: <span className="text-black font-bold">Operational</span>. Your home services are synchronized.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-black hover:bg-accent text-white h-14 px-8 rounded-none font-black uppercase tracking-widest text-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
              <Plus className="w-5 h-5 mr-3" />
              Book New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-2 border-black text-black sm:max-w-[600px] rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden">
            <DialogHeader className="p-8 bg-zinc-50 border-b-2 border-black">
              <DialogTitle className="text-2xl font-black uppercase tracking-tighter font-heading">Service Request</DialogTitle>
              <DialogDescription className="text-zinc-500 font-medium">
                Initialize a new service deployment for your residence.
              </DialogDescription>
            </DialogHeader>

            {/* Search & Filters in Modal */}
            <div className="p-8 space-y-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <Input 
                    placeholder="SEARCH SERVICES..." 
                    className="pl-10 h-12 bg-white border-2 border-black rounded-none font-bold placeholder:text-zinc-300 focus:ring-0"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-white border-2 border-black rounded-none h-12 px-4 text-xs font-black uppercase tracking-widest focus:ring-0"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <Label>Investment Range</Label>
                  <span className="text-black">${priceRange[0]} — ${priceRange[1]}</span>
                </div>
                <Input 
                  type="range" 
                  min="0" 
                  max="500" 
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="h-2 bg-zinc-100 accent-black cursor-pointer"
                />
              </div>

              <ScrollArea className="h-[250px] border-2 border-black">
                <div className="divide-y-2 divide-black">
                  {filteredServices.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => setSelectedServiceId(s.id.toString())}
                      className={cn(
                        "p-6 transition-all cursor-pointer flex justify-between items-center group",
                        selectedServiceId === s.id.toString() 
                          ? "bg-black text-white" 
                          : "bg-white text-black hover:bg-zinc-50"
                      )}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <p className="font-black uppercase tracking-tight text-lg">{s.name}</p>
                          <Badge className={cn(
                            "rounded-none border-2 text-[9px] font-black uppercase tracking-widest px-2 py-0.5",
                            selectedServiceId === s.id.toString() ? "border-white text-white" : "border-black text-black"
                          )}>
                            {s.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star className={cn("w-3 h-3", selectedServiceId === s.id.toString() ? "text-accent fill-accent" : "text-black fill-black")} />
                          <span className="font-mono text-[10px] font-bold">{s.averageRating?.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-4">
                        <span className={cn("text-xl font-black font-heading", selectedServiceId === s.id.toString() ? "text-accent" : "text-black")}>
                          ${s.price}
                        </span>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={cn(
                                "h-10 w-10 border-2 transition-colors rounded-none",
                                selectedServiceId === s.id.toString() ? "border-white text-white hover:bg-white hover:text-black" : "border-black text-black hover:bg-black hover:text-white"
                              )}
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Info className="w-5 h-5" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="bg-white border-l-2 border-black text-black rounded-none p-0">
                            <SheetHeader className="p-8 bg-zinc-50 border-b-2 border-black">
                              <SheetTitle className="text-3xl font-black uppercase tracking-tighter font-heading">{s.name}</SheetTitle>
                              <SheetDescription className="text-zinc-500 font-medium">
                                Technical Specifications & Service Scope
                              </SheetDescription>
                            </SheetHeader>
                            <div className="p-8 space-y-8">
                              <div className="border-2 border-black overflow-hidden bg-zinc-100">
                                <img 
                                  src={`https://picsum.photos/seed/${s.name}/600/300`} 
                                  alt={s.name} 
                                  className="w-full object-cover h-48 grayscale hover:grayscale-0 transition-all duration-700"
                                  referrerPolicy="no-referrer"
                                />
                              </div>
                              <div className="space-y-4">
                                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-accent">Service Overview</h4>
                                <p className="text-lg font-medium leading-relaxed text-zinc-600">{s.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-0 border-2 border-black">
                                <div className="p-6 border-r-2 border-black bg-zinc-50">
                                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Investment</p>
                                  <p className="text-3xl font-black font-heading text-black">${s.price}</p>
                                </div>
                                <div className="p-6 bg-white">
                                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Rating</p>
                                  <div className="flex items-center gap-2">
                                    <Star className="w-6 h-6 text-accent fill-accent" />
                                    <p className="text-3xl font-black font-heading text-black">{s.averageRating?.toFixed(1)}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              <form onSubmit={handleBookService} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Deployment Date</Label>
                  <Input id="date" type="date" className="h-14 bg-white border-2 border-black rounded-none font-bold focus:ring-0" required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full h-16 bg-black hover:bg-accent text-white rounded-none font-black uppercase tracking-widest text-sm border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all" disabled={isBooking || !selectedServiceId}>
                    {isBooking && <Loader2 className="w-5 h-5 mr-3 animate-spin" />}
                    Initialize Booking
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-white border-2 border-black text-black sm:max-w-[450px] rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden">
          <div className="p-12 text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-accent border-2 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <DialogHeader className="space-y-4">
              <DialogTitle className="text-4xl font-black uppercase tracking-tighter font-heading">Confirmed.</DialogTitle>
              <DialogDescription className="text-zinc-500 font-medium">
                Service deployment has been successfully scheduled.
              </DialogDescription>
            </DialogHeader>
            {lastBooking && (
              <div className="bg-zinc-50 border-2 border-black p-8 my-8 text-left space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">Service</span>
                  <span className="font-black uppercase tracking-tight text-black">{lastBooking.service}</span>
                </div>
                <div className="flex justify-between items-center border-b border-zinc-200 pb-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">Date</span>
                  <span className="font-black uppercase tracking-tight text-black">{lastBooking.date}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">Investment</span>
                  <span className="font-black text-2xl font-heading text-accent">{lastBooking.price}</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="h-14 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] hover:bg-black hover:text-white transition-all" onClick={() => toast.info('Added to your calendar!')}>
                <CalendarPlus className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
              <Button className="h-14 bg-black text-white rounded-none font-black uppercase tracking-widest text-[10px] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all" onClick={() => setShowConfirmation(false)}>
                View Details
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 border-2 border-black">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 border-r-2 border-black last:border-r-0 bg-white hover:bg-zinc-50 transition-colors group"
          >
            <div className="flex items-center justify-between mb-8">
              <div className={cn("w-12 h-12 border-2 border-black flex items-center justify-center transition-colors", stat.bg)}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              <ArrowUpRight className="w-5 h-5 text-zinc-300 group-hover:text-black transition-colors" />
            </div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">{stat.title}</p>
            <h3 className="text-4xl font-black font-heading text-black">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Recent Bookings Table */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col sm:flex-row items-end justify-between gap-6">
            <h3 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">
              Service <span className="text-accent">Log</span>.
            </h3>
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
              <Input 
                placeholder="SEARCH LOGS..." 
                className="pl-10 h-12 bg-white border-2 border-black rounded-none font-bold placeholder:text-zinc-300 focus:ring-0"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="border-2 border-black overflow-hidden bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <Table>
              <TableHeader className="bg-zinc-50 border-b-2 border-black">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-6">Service</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-6">Provider</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-6">Date</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-6">Status</TableHead>
                  <TableHead className="font-black uppercase tracking-widest text-[10px] text-black h-14 px-6 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.filter(b => b.service.toLowerCase().includes(searchQuery.toLowerCase())).map((booking) => (
                  <TableRow key={booking.id} className="border-b-2 border-black last:border-b-0 hover:bg-zinc-50 transition-colors">
                    <TableCell className="font-black uppercase tracking-tight text-sm px-6 py-6">{booking.service}</TableCell>
                    <TableCell className="font-medium text-zinc-500 px-6 py-6">{booking.provider}</TableCell>
                    <TableCell className="font-mono text-xs font-bold px-6 py-6">{booking.date}</TableCell>
                    <TableCell className="px-6 py-6">
                      <Badge 
                        className={cn(
                          "rounded-none border-2 px-3 py-1 text-[9px] font-black uppercase tracking-widest",
                          booking.status === 'COMPLETED' ? "bg-green-50 text-green-600 border-green-600" :
                          booking.status === 'IN_PROGRESS' ? "bg-amber-50 text-amber-600 border-amber-600" :
                          booking.status === 'ACCEPTED' ? "bg-black text-white border-black" :
                          "bg-white text-zinc-400 border-zinc-200"
                        )}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6 py-6">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 border-2 border-black rounded-none hover:bg-black hover:text-white transition-all"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <ChevronRight className="w-6 h-6" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-2 border-black text-black sm:max-w-[700px] rounded-none shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden">
                          <DialogHeader className="p-8 bg-zinc-50 border-b-2 border-black">
                            <DialogTitle className="flex items-center gap-4 text-3xl font-black uppercase tracking-tighter font-heading">
                              {booking.service}
                              <Badge className="rounded-none border-2 border-black bg-white text-black text-[10px] font-mono px-2">{booking.id}</Badge>
                            </DialogTitle>
                            <DialogDescription className="text-zinc-500 font-medium">
                              Technical deployment management and task synchronization.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                            {/* Details */}
                            <div className="p-8 border-r-2 border-black space-y-8">
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent">Deployment Data</h4>
                                <div className="space-y-4">
                                  <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">Status</span>
                                    <Badge className="rounded-none border-2 border-black bg-black text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5">{booking.status}</Badge>
                                  </div>
                                  <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">Provider</span>
                                    <span className="font-black uppercase tracking-tight text-sm">{booking.provider}</span>
                                  </div>
                                  <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">Date</span>
                                    <span className="font-black uppercase tracking-tight text-sm">{booking.date}</span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">Investment</span>
                                    <span className="font-black text-xl font-heading text-accent">{booking.price}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Review Section (Only if Completed) */}
                              {booking.status === 'COMPLETED' && (
                                <div className="space-y-4 pt-8 border-t-2 border-black">
                                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    Performance Review
                                  </h4>
                                  {booking.rating ? (
                                    <div className="flex items-center gap-2">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <Star 
                                          key={star} 
                                          className={cn("w-5 h-5", star <= booking.rating! ? "text-accent fill-accent" : "text-zinc-200")} 
                                        />
                                      ))}
                                      <span className="font-mono text-[10px] font-bold text-zinc-400 ml-2 uppercase">Verified</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-4">
                                      <div className="flex gap-2">
                                        {[1, 2, 3, 4, 5].map(star => (
                                          <Button 
                                            key={star} 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-10 w-10 border-2 border-black rounded-none hover:bg-accent hover:text-white transition-all"
                                            onClick={() => submitReview(booking.id, star, '')}
                                          >
                                            <Star className="w-5 h-5" />
                                          </Button>
                                        ))}
                                      </div>
                                      <p className="font-mono text-[9px] text-zinc-400 uppercase tracking-widest">Select rating to finalize deployment record.</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Tasks Section */}
                            <div className="p-8 space-y-8">
                              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-accent flex items-center gap-2">
                                <ListTodo className="w-4 h-4" />
                                Operational Tasks
                              </h4>
                              <div className="space-y-0 border-2 border-black divide-y-2 divide-black">
                                <ScrollArea className="h-[200px]">
                                  <div className="divide-y-2 divide-black">
                                    {booking.subTasks?.map(task => (
                                      <div 
                                        key={task.id} 
                                        className="flex items-center gap-4 p-4 group bg-white hover:bg-zinc-50 transition-colors"
                                      >
                                        <button 
                                          onClick={() => toggleTask(booking.id, task.id)}
                                          className={cn(
                                            "w-6 h-6 border-2 transition-all flex items-center justify-center rounded-none",
                                            task.completed ? "bg-black border-black" : "border-black hover:bg-zinc-100"
                                          )}
                                        >
                                          {task.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        </button>
                                        <span className={cn(
                                          "font-bold uppercase tracking-tight text-xs transition-all",
                                          task.completed ? "text-zinc-300 line-through" : "text-black"
                                        )}>
                                          {task.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                                <div className="p-4 bg-zinc-50 flex gap-3">
                                  <Input 
                                    placeholder="NEW TASK..." 
                                    className="h-10 bg-white border-2 border-black rounded-none font-bold text-[10px] focus:ring-0"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        addTask(booking.id, e.currentTarget.value);
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                  <Button size="icon" className="h-10 w-10 bg-black text-white border-2 border-black rounded-none hover:bg-accent transition-all">
                                    <Plus className="w-5 h-5" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Quick Actions / Payment */}
        <div className="lg:col-span-4 space-y-12">
          <div className="bg-accent border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden group">
            <div className="absolute inset-0 grid-lines opacity-20" />
            <div className="relative z-10 space-y-8">
              <div className="flex items-center text-white">
                <CreditCard className="w-6 h-6 mr-3" />
                <h3 className="text-2xl font-black uppercase tracking-tighter font-heading">Quick Pay.</h3>
              </div>
              <p className="text-white font-bold text-lg leading-tight">You have <span className="text-black">1 pending payment</span> for "Electrical Service".</p>
              <Button className="w-full h-16 bg-black hover:bg-white hover:text-black text-white rounded-none font-black uppercase tracking-widest text-sm border-2 border-black transition-all">
                Pay $95.00 Now
              </Button>
            </div>
          </div>

          <div className="bg-white border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-2xl font-black uppercase tracking-tighter font-heading text-black mb-12">Timeline.</h3>
            <div className="space-y-12 relative before:absolute before:left-[15px] before:top-2 before:bottom-2 before:w-[2px] before:bg-black">
              {[
                { time: '10:30 AM', event: 'Provider arrived', status: 'done' },
                { time: '11:00 AM', event: 'Work started', status: 'active' },
                { time: 'Expected 1:00 PM', event: 'Completion', status: 'pending' },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-6 relative">
                  <div className={cn(
                    "w-8 h-8 border-2 border-black z-10 bg-white transition-all",
                    item.status === 'done' ? "bg-black" : 
                    item.status === 'active' ? "bg-accent animate-pulse" : 
                    "bg-white"
                  )} />
                  <div className="space-y-1">
                    <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">{item.time}</p>
                    <p className="font-black uppercase tracking-tight text-sm text-black">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Removed local cn definition
