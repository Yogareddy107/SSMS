import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ArrowLeft, Loader2, Mail, Lock, User } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        displayName: name,
        role: 'USER', // Default role
        createdAt: serverTimestamp()
      });

      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
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
              <h2 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">Register <span className="text-accent">Node</span>.</h2>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-2">
                Initialize new entity registration
              </p>
            </div>
          </div>

          <form onSubmit={handleRegister} className="space-y-8">
            <div className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="name" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <Input
                    id="name"
                    placeholder="JOHN DOE"
                    className="pl-12 h-14 border-2 border-black rounded-none font-bold placeholder:text-zinc-200 focus:ring-0 focus:border-accent transition-colors"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
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
                <Label htmlFor="password" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Access Key</Label>
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
                Register Entity
              </Button>

              <p className="text-center font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                Already registered?{' '}
                <Link to="/login" className="text-accent font-black hover:text-black transition-colors">
                  Access Node
                </Link>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
