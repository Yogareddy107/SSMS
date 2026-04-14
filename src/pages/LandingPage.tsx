import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowRight, 
  CheckCircle2, 
  Shield, 
  Zap, 
  Users, 
  Star,
  Globe,
  Clock,
  ChevronDown,
  Play,
  BarChart3,
  Layers,
  Smartphone,
  Lock,
  MessageSquare,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  Mail,
  MapPin,
  Phone,
  Search,
  Home,
  Wrench,
  Sparkles,
  Scissors,
  HeartPulse,
  Truck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export default function LandingPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);

  const categories = [
    { name: "Home Cleaning", icon: Home, color: "bg-blue-50 text-blue-600" },
    { name: "AC Repair", icon: Wrench, color: "bg-orange-50 text-orange-600" },
    { name: "Salon at Home", icon: Scissors, color: "bg-pink-50 text-pink-600" },
    { name: "Massage", icon: HeartPulse, color: "bg-green-50 text-green-600" },
    { name: "Deep Cleaning", icon: Sparkles, color: "bg-purple-50 text-purple-600" },
    { name: "Moving", icon: Truck, color: "bg-slate-50 text-slate-600" },
  ];

  const pricing = [
    {
      name: "Basic",
      price: "Free",
      desc: "Perfect for exploring our premium services.",
      features: ["Verified Professionals", "Standard Support", "Insurance Covered", "Secure Payments"],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Premium",
      price: "$29",
      desc: "Priority booking and exclusive benefits.",
      features: ["Priority Scheduling", "24/7 VIP Support", "10% Off All Services", "Dedicated Manager", "Extended Warranty"],
      cta: "Upgrade Now",
      popular: true
    },
    {
      name: "Business",
      price: "$99",
      desc: "For offices and commercial spaces.",
      features: ["Bulk Booking Discounts", "Monthly Maintenance", "Custom Invoicing", "Multiple Locations", "Quarterly Audits"],
      cta: "Contact Sales",
      popular: false
    }
  ];

  const testimonials = [
    {
      name: "Elena Rossi",
      role: "Homeowner",
      content: "The level of professionalism is unmatched. It's like having a personal concierge for my home maintenance.",
      avatar: "https://i.pravatar.cc/150?u=elena"
    },
    {
      name: "James Wilson",
      role: "Interior Designer",
      content: "I recommend SmartService to all my clients. Their attention to detail and quality of work is exceptional.",
      avatar: "https://i.pravatar.cc/150?u=james"
    },
    {
      name: "Sophia Chen",
      role: "Busy Professional",
      content: "Finally, a service that understands the value of time. Reliable, efficient, and absolutely worth it.",
      avatar: "https://i.pravatar.cc/150?u=sophia"
    }
  ];

  const faqs = [
    {
      q: "How do you verify your service providers?",
      a: "Every professional undergoes a multi-stage vetting process, including background checks, skill assessments, and reference verification to ensure the highest standards of quality and safety."
    },
    {
      q: "Is my booking insured?",
      a: "Yes, every service booked through SmartService is covered by our comprehensive insurance policy, giving you complete peace of mind."
    },
    {
      q: "What if I'm not satisfied with the service?",
      a: "We stand by our work. If you're not completely satisfied, we'll send another professional to make it right, or offer a full refund as part of our Service Guarantee."
    },
    {
      q: "Can I schedule recurring services?",
      a: "Absolutely. You can set up weekly, bi-weekly, or monthly schedules for cleaning, maintenance, and other services directly through your dashboard."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-black selection:bg-accent selection:text-white font-sans grid-lines">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white border-b-2 border-black h-20 flex items-center">
        <div className="max-w-[1400px] mx-auto px-6 w-full flex items-center justify-between">
          <div className="flex items-center space-x-4 group cursor-pointer">
            <div className="w-10 h-10 bg-black flex items-center justify-center border-2 border-black group-hover:bg-accent transition-colors">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black uppercase tracking-tighter">
              Smart<span className="text-accent">Service</span>
            </span>
          </div>
          
          <div className="hidden lg:flex items-center space-x-12 text-[11px] font-bold uppercase tracking-[0.2em]">
            <a href="#features" className="hover:text-accent transition-colors">01. Features</a>
            <a href="#pricing" className="hover:text-accent transition-colors">02. Pricing</a>
            <a href="#testimonials" className="hover:text-accent transition-colors">03. Reviews</a>
          </div>

          <div className="flex items-center space-x-6">
            <Link to="/login" className="hidden sm:block text-[11px] font-bold uppercase tracking-widest hover:text-accent transition-colors">
              Login
            </Link>
            <Link to="/register">
              <Button className="bg-black hover:bg-accent text-white px-8 h-12 rounded-none font-bold uppercase tracking-widest text-[11px] transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-40 pb-20 border-b-2 border-black">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            
            {/* Left Content */}
            <div className="lg:col-span-7 lg:border-r-2 lg:border-black pr-12 pb-20">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="inline-flex items-center space-x-3 text-accent font-mono text-[11px] font-bold uppercase tracking-[0.3em] mb-12"
              >
                <div className="w-12 h-[2px] bg-accent" />
                <span>System v4.0.2</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[clamp(3rem,8vw,6rem)] font-black leading-[0.85] uppercase tracking-tighter mb-12 font-heading"
              >
                Professional <br />
                <span className="text-accent">Care</span> for the <br />
                Modern <span className="outline-text">Home</span>.
              </motion.h1>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-col sm:flex-row gap-0 border-2 border-black max-w-2xl"
              >
                <div className="relative flex-1">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
                  <Input 
                    className="w-full h-20 pl-16 pr-6 border-none bg-white rounded-none text-lg font-bold placeholder:text-zinc-300 focus:ring-0"
                    placeholder="WHAT SERVICE DO YOU NEED?"
                  />
                </div>
                <Button className="h-20 px-12 bg-black hover:bg-accent text-white rounded-none font-black uppercase tracking-widest text-xs border-l-2 border-black transition-colors">
                  Search Now
                </Button>
              </motion.div>
            </div>

            {/* Right Content - Visuals */}
            <div className="lg:col-span-5 pl-12 flex flex-col justify-between">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square border-2 border-black overflow-hidden bg-zinc-100 mb-12"
              >
                <img 
                  src="https://picsum.photos/seed/modern/800/800" 
                  alt="Modern Home" 
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 right-6 bg-accent text-white p-4 font-mono text-xs font-bold uppercase tracking-widest">
                  Est. 2026
                </div>
              </motion.div>

              <div className="grid grid-cols-2 border-t-2 border-black pt-12">
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Active Pros</p>
                  <p className="text-4xl font-black font-heading">15,402</p>
                </div>
                <div>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Success Rate</p>
                  <p className="text-4xl font-black font-heading">99.2%</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-0 border-b-2 border-black">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.name}
                whileHover={{ backgroundColor: "#000", color: "#fff" }}
                className="p-12 border-r-2 border-black last:border-r-0 flex flex-col justify-between h-[400px] transition-colors cursor-pointer group"
              >
                <div className="space-y-8">
                  <div className="w-16 h-16 border-2 border-black flex items-center justify-center group-hover:border-white transition-colors">
                    <cat.icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter font-heading">{cat.name}</h3>
                  <p className="font-medium text-sm leading-relaxed opacity-60">Professional grade {cat.name.toLowerCase()} solutions for your residential space.</p>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Features */}
      <section className="py-24 border-b-2 border-black bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Verified Identity", desc: "Every professional undergoes a rigorous 5-step background check and skill assessment.", icon: Shield },
              { title: "Fixed Pricing", desc: "No surprises. Know the exact cost before you book. Transparent and fair.", icon: Zap },
              { title: "Service Guarantee", desc: "Not satisfied? We'll make it right. Your happiness is our top priority.", icon: CheckCircle2 },
            ].map((item, i) => (
              <div key={i} className="flex flex-col space-y-6">
                <div className="text-accent font-mono text-4xl font-black">0{i+1}.</div>
                <h3 className="text-2xl font-black uppercase tracking-tighter font-heading">{item.title}</h3>
                <p className="text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 border-b-2 border-black">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
            <div className="max-w-2xl">
              <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] font-heading mb-8">
                Pricing <br />
                <span className="text-accent">Structure</span>.
              </h2>
              <p className="text-zinc-500 font-medium text-lg">Transparent investment for your home's longevity.</p>
            </div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">
              Updated: April 2026
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-2 border-black">
            {pricing.map((plan, i) => (
              <div
                key={plan.name}
                className={cn(
                  "p-12 border-r-2 border-black last:border-r-0 flex flex-col justify-between transition-all duration-500",
                  plan.popular ? "bg-black text-white" : "bg-white text-black"
                )}
              >
                <div>
                  <div className="flex justify-between items-start mb-12">
                    <h3 className="text-3xl font-black uppercase tracking-tighter font-heading">{plan.name}</h3>
                    {plan.popular && <span className="bg-accent text-white px-3 py-1 text-[9px] font-bold uppercase tracking-widest">Popular</span>}
                  </div>
                  <div className="mb-12">
                    <span className="text-6xl font-black font-heading">{plan.price}</span>
                    {plan.price !== "Free" && <span className="font-mono text-xs ml-2 opacity-50">/MO</span>}
                  </div>
                  <ul className="space-y-6 mb-12">
                    {plan.features.map(feature => (
                      <li key={feature} className="flex items-center text-sm font-bold uppercase tracking-tight">
                        <CheckCircle2 className={cn("w-4 h-4 mr-4 shrink-0", plan.popular ? "text-accent" : "text-black")} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className={cn(
                  "w-full h-16 rounded-none font-black uppercase tracking-widest text-xs border-2 transition-all",
                  plan.popular 
                    ? "bg-accent hover:bg-white hover:text-black border-accent" 
                    : "bg-black hover:bg-accent text-white border-black"
                )}>
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 border-b-2 border-black bg-zinc-900 text-white">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.9] font-heading mb-8">
                Client <br />
                <span className="text-accent">Feedback</span>.
              </h2>
              <div className="flex items-center space-x-2 font-mono text-xs font-bold uppercase tracking-widest text-zinc-500">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span>4.9/5 Average Rating</span>
              </div>
            </div>
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-0 border-2 border-zinc-800">
              {testimonials.map((t, i) => (
                <div
                  key={t.name}
                  className="p-12 border-r-2 border-zinc-800 last:border-r-0 last:border-b-0 border-b-2 md:border-b-0"
                >
                  <p className="text-xl font-medium italic mb-12 leading-relaxed opacity-80">
                    "{t.content}"
                  </p>
                  <div className="flex items-center space-x-4">
                    <img src={t.avatar} alt={t.name} className="w-12 h-12 border-2 border-accent object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-widest">{t.name}</h4>
                      <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 border-b-2 border-black">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <h2 className="text-5xl font-black uppercase tracking-tighter leading-[0.9] font-heading">
                Common <br />
                <span className="text-accent">Inquiries</span>.
              </h2>
            </div>
            <div className="lg:col-span-8 space-y-0 border-t-2 border-black">
              {faqs.map((faq, i) => (
                <div 
                  key={i} 
                  className="border-b-2 border-black group cursor-pointer"
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <div className="py-8 flex items-center justify-between">
                    <span className="text-xl font-black uppercase tracking-tight font-heading group-hover:text-accent transition-colors">
                      {faq.q}
                    </span>
                    <div className={cn("w-8 h-8 border-2 border-black flex items-center justify-center transition-transform duration-300", activeFaq === i && "rotate-180 bg-black text-white")}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pb-8 text-lg font-medium opacity-60 max-w-2xl">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 bg-accent text-white overflow-hidden relative">
        <div className="absolute inset-0 grid-lines opacity-20" />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-[clamp(3rem,10vw,8rem)] font-black uppercase tracking-tighter leading-[0.8] mb-12 font-heading">
              Ready to <br />
              <span className="text-black">Upgrade?</span>
            </h2>
            <p className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-16 max-w-2xl">
              Join the network of professional services reimagined for the modern era.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link to="/register">
                <Button size="lg" className="bg-black hover:bg-white hover:text-black text-white h-20 px-16 text-xl rounded-none font-black uppercase tracking-widest border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all">
                  Join Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-2 border-black bg-transparent text-black hover:bg-black hover:text-white h-20 px-16 text-xl rounded-none font-black uppercase tracking-widest transition-all">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-black py-24 border-t-2 border-black">
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16 mb-24">
            <div className="md:col-span-5">
              <div className="flex items-center space-x-4 mb-12">
                <div className="w-10 h-10 bg-black flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-black uppercase tracking-tighter">
                  Smart<span className="text-accent">Service</span>
                </span>
              </div>
              <p className="font-medium text-lg leading-relaxed max-w-md opacity-60">
                A systematic approach to home maintenance. Professional grade solutions delivered with precision and transparency.
              </p>
            </div>
            
            <div className="md:col-span-2">
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8">Navigation</h4>
              <ul className="space-y-4 font-black uppercase tracking-widest text-[11px]">
                <li><a href="#" className="hover:text-accent transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Reviews</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Contact</a></li>
              </ul>
            </div>

            <div className="md:col-span-5">
              <h4 className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-8">Newsletter</h4>
              <div className="flex border-2 border-black">
                <Input className="bg-white border-none text-black h-16 rounded-none font-bold placeholder:text-zinc-300 focus:ring-0" placeholder="EMAIL ADDRESS" />
                <Button className="bg-black hover:bg-accent text-white h-16 px-8 rounded-none font-black uppercase tracking-widest text-xs border-l-2 border-black transition-colors">
                  Join
                </Button>
              </div>
            </div>
          </div>
          
          <div className="pt-12 border-t-2 border-black flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-[10px] font-bold uppercase tracking-[0.2em]">
            <p>© 2026 SmartService System. All rights reserved.</p>
            <div className="flex space-x-12">
              <a href="#" className="hover:text-accent transition-colors">Privacy</a>
              <a href="#" className="hover:text-accent transition-colors">Terms</a>
              <a href="#" className="hover:text-accent transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

