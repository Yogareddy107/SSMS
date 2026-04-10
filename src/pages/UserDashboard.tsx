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
  const [bookings, setBookings] = useState<Booking[]>(recentBookings.map(b => ({
    ...b,
    subTasks: [
      { id: '1', title: 'Confirm appointment', completed: true },
      { id: '2', title: 'Prepare workspace', completed: false },
    ]
  })));
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

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

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooking(true);
    
    const service = services.find(s => s.id.toString() === selectedServiceId);
    
    setTimeout(() => {
      setIsBooking(false);
      const newBooking = {
        id: `BK-${Math.floor(Math.random() * 1000)}`,
        service: service?.name || 'Service',
        provider: 'Assigned Soon',
        date: (e.target as any).date.value,
        status: 'Pending',
        price: `$${service?.price}`,
        subTasks: [
          { id: '1', title: 'Confirm appointment', completed: false },
          { id: '2', title: 'Prepare workspace', completed: false },
        ]
      };
      setLastBooking(newBooking);
      setBookings([newBooking, ...bookings]);
      setShowConfirmation(true);
      toast.success('Service booked successfully!');
    }, 1500);
  };

  const toggleTask = (bookingId: string, taskId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          subTasks: b.subTasks?.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t)
        };
      }
      return b;
    }));
  };

  const addTask = (bookingId: string, title: string) => {
    if (!title.trim()) return;
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          subTasks: [...(b.subTasks || []), { id: Date.now().toString(), title, completed: false }]
        };
      }
      return b;
    }));
  };

  const submitReview = (bookingId: string, rating: number, comment: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, rating };
      }
      return b;
    }));
    toast.success('Review submitted! Thank you for your feedback.');
  };

  return (
    <div className="space-y-8 bg-slate-50/30 p-4 md:p-8 rounded-3xl">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, John!</h2>
          <p className="text-slate-500">Here's what's happening with your services today.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 h-11 px-6 rounded-xl">
              <Plus className="w-5 h-5 mr-2" />
              Book New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Book a Service</DialogTitle>
              <DialogDescription className="text-slate-500">
                Choose a service and schedule your appointment.
              </DialogDescription>
            </DialogHeader>

            {/* Search & Filters in Modal */}
            <div className="space-y-4 py-4">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input 
                    placeholder="Search services..." 
                    className="pl-9 bg-slate-50 border-slate-200"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  className="bg-slate-50 border-slate-200 rounded-md h-10 px-3 text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <Label>Price Range</Label>
                  <span>${priceRange[0]} - ${priceRange[1]}</span>
                </div>
                <Input 
                  type="range" 
                  min="0" 
                  max="500" 
                  step="10"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="h-2 bg-slate-100 accent-indigo-600"
                />
              </div>

              <Separator className="bg-slate-100" />

              <ScrollArea className="h-[200px] pr-4">
                <div className="space-y-2">
                  {filteredServices.map(s => (
                    <div 
                      key={s.id}
                      onClick={() => setSelectedServiceId(s.id.toString())}
                      className={cn(
                        "p-3 rounded-lg border transition-all cursor-pointer flex justify-between items-center group",
                        selectedServiceId === s.id.toString() 
                          ? "bg-indigo-50 border-indigo-200" 
                          : "bg-white border-slate-100 hover:border-slate-200"
                      )}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm text-slate-900">{s.name}</p>
                          <Badge variant="secondary" className="text-[10px] bg-slate-100 text-slate-600">{s.category}</Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs text-slate-500">{s.averageRating?.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <span className="font-bold text-indigo-600">${s.price}</span>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-slate-400 hover:text-slate-600"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Info className="w-4 h-4" />
                            </Button>
                          </SheetTrigger>
                          <SheetContent className="bg-white border-slate-200 text-slate-900">
                            <SheetHeader>
                              <SheetTitle>{s.name}</SheetTitle>
                              <SheetDescription className="text-slate-500">
                                Service Details & Description
                              </SheetDescription>
                            </SheetHeader>
                            <div className="mt-6 space-y-6">
                              <img 
                                src={`https://picsum.photos/seed/${s.name}/400/200`} 
                                alt={s.name} 
                                className="rounded-xl w-full object-cover h-40 shadow-sm"
                                referrerPolicy="no-referrer"
                              />
                              <div className="space-y-2">
                                <h4 className="font-bold text-indigo-600">About this service</h4>
                                <p className="text-sm text-slate-600 leading-relaxed">{s.description}</p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                  <p className="text-xs text-slate-500 uppercase">Price</p>
                                  <p className="font-bold text-lg text-slate-900">${s.price}</p>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                                  <p className="text-xs text-slate-500 uppercase">Rating</p>
                                  <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                                    <p className="font-bold text-lg text-slate-900">{s.averageRating?.toFixed(1)}</p>
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

              <form onSubmit={handleBookService} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Preferred Date</Label>
                  <Input id="date" type="date" className="bg-slate-50 border-slate-200" required />
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white" disabled={isBooking || !selectedServiceId}>
                    {isBooking && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Confirm Booking
                  </Button>
                </DialogFooter>
              </form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Booking Confirmation Dialog */}
      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-[425px] text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
          </div>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-slate-500">
              Your service has been scheduled successfully.
            </DialogDescription>
          </DialogHeader>
          {lastBooking && (
            <div className="bg-slate-50 rounded-xl p-4 my-4 border border-slate-100 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase">Service</span>
                <span className="font-bold text-slate-900">{lastBooking.service}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase">Date</span>
                <span className="font-bold text-slate-900">{lastBooking.date}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase">Price</span>
                <span className="font-bold text-indigo-600">{lastBooking.price}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-500 uppercase">Provider</span>
                <span className="text-sm italic text-slate-500">{lastBooking.provider}</span>
              </div>
            </div>
          )}
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1 border-slate-200 text-slate-700" onClick={() => toast.info('Added to your calendar!')}>
              <CalendarPlus className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
            <Button className="flex-1 bg-indigo-600 text-white" onClick={() => setShowConfirmation(false)}>
              View Booking Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white border-slate-100 hover:border-indigo-100 transition-colors shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${stat.bg.replace('/10', '')} bg-opacity-10`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300" />
                </div>
                <p className="text-sm text-slate-500 font-medium">{stat.title}</p>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Bookings Table */}
        <Card className="lg:col-span-2 bg-white border-slate-100 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl text-slate-900">My Bookings</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search bookings..." 
                  className="pl-9 bg-slate-50 border-slate-200 h-9 w-40 sm:w-64 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="text-slate-500">Service</TableHead>
                  <TableHead className="text-slate-500">Provider</TableHead>
                  <TableHead className="text-slate-500">Date</TableHead>
                  <TableHead className="text-slate-500">Status</TableHead>
                  <TableHead className="text-slate-500 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.filter(b => b.service.toLowerCase().includes(searchQuery.toLowerCase())).map((booking) => (
                  <TableRow key={booking.id} className="border-slate-100 hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium text-slate-700">{booking.service}</TableCell>
                    <TableCell className="text-slate-600">{booking.provider}</TableCell>
                    <TableCell className="text-slate-600">{booking.date}</TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary" 
                        className={cn(
                          "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider",
                          booking.status === 'Completed' ? "bg-green-50 text-green-600 border border-green-100" :
                          booking.status === 'In Progress' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          "bg-slate-50 text-slate-600 border border-slate-100"
                        )}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white border-slate-200 text-slate-900 sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {booking.service}
                              <Badge variant="outline" className="text-[10px] border-slate-200 text-slate-500">{booking.id}</Badge>
                            </DialogTitle>
                            <DialogDescription className="text-slate-500">
                              Manage your booking details and tasks.
                            </DialogDescription>
                          </DialogHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                            {/* Details */}
                            <div className="space-y-4">
                              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-500 uppercase">Status</span>
                                  <Badge className="bg-indigo-50 text-indigo-600 border border-indigo-100">{booking.status}</Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-500 uppercase">Provider</span>
                                  <span className="text-sm font-medium text-slate-700">{booking.provider}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-500 uppercase">Date</span>
                                  <span className="text-sm font-medium text-slate-700">{booking.date}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-xs text-slate-500 uppercase">Price</span>
                                  <span className="text-sm font-bold text-indigo-600">{booking.price}</span>
                                </div>
                              </div>

                              {/* Review Section (Only if Completed) */}
                              {booking.status === 'Completed' && (
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                  <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                    <MessageSquare className="w-4 h-4 text-indigo-600" />
                                    {booking.rating ? 'Your Review' : 'Leave a Review'}
                                  </h4>
                                  {booking.rating ? (
                                    <div className="flex items-center gap-1">
                                      {[1, 2, 3, 4, 5].map(star => (
                                        <Star 
                                          key={star} 
                                          className={cn("w-4 h-4", star <= booking.rating! ? "text-amber-500 fill-amber-500" : "text-slate-300")} 
                                        />
                                      ))}
                                      <span className="text-xs text-slate-500 ml-2">Verified Review</span>
                                    </div>
                                  ) : (
                                    <div className="space-y-3">
                                      <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                          <Button 
                                            key={star} 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 hover:bg-amber-50 hover:text-amber-500"
                                            onClick={() => submitReview(booking.id, star, '')}
                                          >
                                            <Star className="w-4 h-4" />
                                          </Button>
                                        ))}
                                      </div>
                                      <p className="text-[10px] text-slate-500 italic">Click a star to rate your experience.</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Tasks Section */}
                            <div className="space-y-4">
                              <h4 className="text-sm font-bold flex items-center gap-2 text-slate-900">
                                <ListTodo className="w-4 h-4 text-indigo-600" />
                                Service Tasks
                              </h4>
                              <div className="bg-slate-50 rounded-xl border border-slate-100 p-4 min-h-[200px] flex flex-col">
                                <ScrollArea className="flex-1 max-h-[150px]">
                                  <div className="space-y-2">
                                    {booking.subTasks?.map(task => (
                                      <div 
                                        key={task.id} 
                                        className="flex items-center gap-3 group"
                                      >
                                        <button 
                                          onClick={() => toggleTask(booking.id, task.id)}
                                          className={cn(
                                            "w-5 h-5 rounded border transition-all flex items-center justify-center",
                                            task.completed ? "bg-indigo-600 border-indigo-600" : "border-slate-300 hover:border-indigo-500"
                                          )}
                                        >
                                          {task.completed && <CheckCircle2 className="w-3 h-3 text-white" />}
                                        </button>
                                        <span className={cn(
                                          "text-sm transition-all",
                                          task.completed ? "text-slate-400 line-through" : "text-slate-600"
                                        )}>
                                          {task.title}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                                <div className="mt-4 flex gap-2">
                                  <Input 
                                    placeholder="Add task..." 
                                    className="h-8 text-xs bg-white border-slate-200"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        addTask(booking.id, e.currentTarget.value);
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                  />
                                  <Button size="icon" className="h-8 w-8 bg-indigo-600 text-white">
                                    <Plus className="w-4 h-4" />
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
          </CardContent>
        </Card>

        {/* Quick Actions / Payment */}
        <div className="space-y-6">
          <Card className="bg-indigo-600 border-none shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Quick Pay
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-indigo-100 text-sm">You have 1 pending payment for "Electrical Service".</p>
              <Button className="w-full bg-white text-indigo-600 hover:bg-indigo-50 font-bold">
                Pay $95.00 Now
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white border-slate-100 shadow-sm">
            <CardHeader>
              <CardTitle className="text-slate-900 text-lg">Service Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                {[
                  { time: '10:30 AM', event: 'Provider arrived', status: 'done' },
                  { time: '11:00 AM', event: 'Work started', status: 'active' },
                  { time: 'Expected 1:00 PM', event: 'Completion', status: 'pending' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start space-x-4 relative">
                    <div className={cn(
                      "w-6 h-6 rounded-full border-4 border-white z-10 shadow-sm",
                      item.status === 'done' ? "bg-green-500" : 
                      item.status === 'active' ? "bg-indigo-600 animate-pulse" : 
                      "bg-slate-200"
                    )} />
                    <div>
                      <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">{item.time}</p>
                      <p className="text-sm text-slate-700 font-semibold">{item.event}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
