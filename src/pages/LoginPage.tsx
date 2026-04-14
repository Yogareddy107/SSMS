import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Loader2, Mail, Lock } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, signInWithGoogle } from '@/lib/firebase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      toast.success('Logged in with Google');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden grid-lines">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center font-black uppercase tracking-widest text-[10px] text-zinc-400 hover:text-black mb-12 transition-colors group">
          <ArrowLeft className="w-4 h-4 mr-3 group-hover:-translate-x-1 transition-transform" />
          Back to Terminal
        </Link>

        <div className="bg-white border-2 border-black p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] space-y-10">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-black flex items-center justify-center shadow-[6px_6px_0px_0px_rgba(255,62,0,1)]">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">Access <span className="text-accent">Node</span>.</h2>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-2">
                Initialize authentication sequence
              </p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="email" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="NAME@SYSTEM.COM"
                    className="pl-12 h-14 border-2 border-black rounded-none font-bold placeholder:text-zinc-200 focus:ring-0 focus:border-accent transition-colors"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Access Key</Label>
                  <a href="#" className="font-mono text-[9px] font-bold uppercase tracking-widest text-accent hover:text-black">Recovery?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-12 h-14 border-2 border-black rounded-none font-bold placeholder:text-zinc-200 focus:ring-0 focus:border-accent transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Button 
                type="submit" 
                className="w-full bg-black hover:bg-accent text-white h-14 rounded-none font-black uppercase tracking-widest text-[11px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,62,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-3" /> : null}
                Initialize Session
              </Button>

              <div className="relative w-full py-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t-2 border-zinc-100" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-4 font-mono text-[9px] font-black uppercase tracking-widest text-zinc-300">Secondary Protocol</span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline" 
                className="w-full h-14 border-2 border-black rounded-none font-black uppercase tracking-widest text-[11px] hover:bg-black hover:text-white transition-all"
                onClick={handleGoogleLogin}
              >
                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 mr-3" alt="Google" />
                Google Identity
              </Button>

              <p className="text-center font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                No access node?{' '}
                <Link to="/register" className="text-accent font-black hover:text-black transition-colors">
                  Register Node
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
