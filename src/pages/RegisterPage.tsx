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
import { auth } from '@/lib/firebase';

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
      await updateProfile(userCredential.user, { displayName: name });
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center text-sm text-slate-500 hover:text-slate-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="bg-white border-slate-200 shadow-xl rounded-3xl overflow-hidden">
          <CardHeader className="space-y-1 text-center pb-8 pt-10">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">Create Account</CardTitle>
            <CardDescription className="text-slate-500">
              Join SmartService to manage your bookings
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="px-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="pl-10 bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-10 bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-indigo-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-slate-50 border-slate-200 h-12 rounded-xl focus:ring-indigo-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-8 pb-10 flex flex-col space-y-4">
              <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl text-white font-bold shadow-lg shadow-indigo-200"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Create Account
              </Button>
              <p className="text-sm text-slate-500 text-center mt-4">
                Already have an account?{' '}
                <Link to="/login" className="text-indigo-600 font-bold hover:underline">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
