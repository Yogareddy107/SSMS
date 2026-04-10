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
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              SmartService
            </span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50/50">
        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 border border-indigo-100 mb-6">
                <Zap className="w-3 h-3 mr-2" />
                Enterprise Service Management
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-slate-900 leading-tight">
                Manage Services with <br />
                <span className="text-indigo-600">Intelligent Precision</span>
              </h1>
              <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                The all-in-one platform for booking, tracking, and managing professional services. 
                Scalable, secure, and designed for modern enterprises.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/register">
                  <Button size="lg" className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 h-14 px-8 text-lg rounded-2xl shadow-xl shadow-indigo-500/25 text-white">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto h-14 px-8 text-lg rounded-2xl border-slate-200 hover:bg-slate-50 text-slate-700">
                  Watch Demo
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-20 relative"
          >
            <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 pointer-events-none" />
              <img 
                src="https://picsum.photos/seed/dashboard/1600/900" 
                alt="Dashboard Preview" 
                className="rounded-2xl w-full object-cover shadow-sm"
                referrerPolicy="no-referrer"
              />
            </div>
            
            {/* Floating Stats */}
            <div className="absolute -bottom-10 -left-10 hidden lg:block">
              <Card className="bg-white/90 backdrop-blur-xl border-slate-200 shadow-2xl w-64">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Completed</p>
                      <p className="text-2xl font-bold text-slate-900">1,284</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-slate-900">Everything you need to scale</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Powerful tools designed to help you manage bookings, providers, and payments with ease.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Real-time Tracking', desc: 'Monitor service progress with live updates and status timelines.', icon: Clock },
              { title: 'Secure Payments', desc: 'Integrated payment processing with automated invoicing and tracking.', icon: Shield },
              { title: 'Smart Analytics', desc: 'Gain deep insights into your business performance with visual charts.', icon: Zap },
            ].map((feature, i) => (
              <Card key={i} className="bg-white border-slate-200 hover:border-indigo-500/50 transition-all group shadow-sm hover:shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-600 transition-colors">
                    <feature.icon className="w-6 h-6 text-indigo-600 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
