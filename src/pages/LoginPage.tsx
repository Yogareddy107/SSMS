import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Shield, ArrowLeft, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { auth, signInWithGoogle, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const user = await signInWithGoogle();
      
      // Check if user document exists, if not create it
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: 'USER',
          createdAt: serverTimestamp()
        });
      }

      toast.success('Logged in with Google');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error('Google login failed');
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
              <h2 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">Access <span className="text-accent">Node</span>.</h2>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-2">
                Initialize authentication sequence
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <Button 
                type="button"
                className="w-full bg-black hover:bg-accent text-white h-16 rounded-none font-black uppercase tracking-widest text-sm border-2 border-black shadow-[8px_8px_0px_0px_rgba(255,62,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-4"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                    <span>Continue with Google</span>
                  </>
                )}
              </Button>
            </div>

            <p className="text-center font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              By accessing this node, you agree to our <br />
              <span className="text-black">Security Protocols</span> & <span className="text-black">Terms of Service</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
