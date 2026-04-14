import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Camera, Loader2, Save, Lock } from 'lucide-react';
import { motion } from 'motion/react';

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    address: '',
    bio: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch additional data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        const userData = userDoc.data();
        
        setFormData({
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          phoneNumber: userData?.phoneNumber || '',
          address: userData?.address || '',
          bio: userData?.bio || ''
        });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      // Update Auth Profile
      await updateProfile(user, {
        displayName: formData.displayName
      });

      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        displayName: formData.displayName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        bio: formData.bio,
        updatedAt: new Date().toISOString()
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-12 border-b-2 border-black">
        <div>
          <h2 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">Your <span className="text-accent">Profile</span>.</h2>
          <p className="text-zinc-500 font-medium mt-2">Manage your personal information and technical identity within the system.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-black hover:bg-accent text-white px-10 h-14 rounded-none font-black uppercase tracking-widest text-[10px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(255,62,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
        >
          {saving ? <Loader2 className="w-4 h-4 mr-3 animate-spin" /> : <Save className="w-4 h-4 mr-3" />}
          Update Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Avatar & Basic Info */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-white border-2 border-black p-10 text-center shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
            <div className="relative inline-block mb-8">
              <div className="w-40 h-40 border-4 border-black bg-accent flex items-center justify-center text-black text-6xl font-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                {formData.displayName?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </div>
              <button className="absolute -bottom-2 -right-2 w-12 h-12 bg-black border-2 border-black flex items-center justify-center text-white hover:bg-accent transition-colors shadow-[4px_4px_0px_0px_rgba(255,255,255,1)]">
                <Camera className="w-6 h-6" />
              </button>
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">{formData.displayName || 'User'}</h3>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-2 mb-8">{user?.email}</p>
            
            <div className="space-y-4 text-left pt-8 border-t-2 border-zinc-50">
              <div className="flex items-center font-bold text-[11px] uppercase tracking-widest text-zinc-500">
                <Mail className="w-4 h-4 mr-4 text-black" />
                {user?.email}
              </div>
              {formData.phoneNumber && (
                <div className="flex items-center font-bold text-[11px] uppercase tracking-widest text-zinc-500">
                  <Phone className="w-4 h-4 mr-4 text-black" />
                  {formData.phoneNumber}
                </div>
              )}
              {formData.address && (
                <div className="flex items-center font-bold text-[11px] uppercase tracking-widest text-zinc-500">
                  <MapPin className="w-4 h-4 mr-4 text-black" />
                  {formData.address}
                </div>
              )}
            </div>
          </div>

          <div className="bg-black border-2 border-black p-8 shadow-[8px_8px_0px_0px_rgba(255,62,0,1)]">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-4">System Status</h4>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <p className="text-white font-mono text-[10px] font-bold uppercase tracking-widest">Profile Verified & Active</p>
            </div>
          </div>
        </div>

        {/* Right Column: Edit Form */}
        <div className="lg:col-span-8 space-y-10">
          <div className="bg-white border-2 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-10">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Personal <span className="text-accent">Data</span>.</h3>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Update your core identity parameters.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="displayName" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <Input 
                    id="displayName"
                    value={formData.displayName}
                    onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                    className="pl-12 h-14 border-2 border-black rounded-none font-bold focus:ring-0 focus:border-accent transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="email" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-300" />
                  <Input 
                    id="email"
                    value={formData.email}
                    disabled
                    className="pl-12 h-14 border-2 border-zinc-100 bg-zinc-50 text-zinc-400 rounded-none font-bold cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="phone" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <Input 
                    id="phone"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                    className="pl-12 h-14 border-2 border-black rounded-none font-bold focus:ring-0 focus:border-accent transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="address" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <Input 
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="pl-12 h-14 border-2 border-black rounded-none font-bold focus:ring-0 focus:border-accent transition-colors"
                    placeholder="New York, USA"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <Label htmlFor="bio" className="font-black uppercase tracking-widest text-[10px] text-zinc-500">Bio</Label>
              <Textarea 
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="min-h-[160px] border-2 border-black rounded-none font-bold focus:ring-0 focus:border-accent p-6 transition-colors"
                placeholder="Tell us a bit about yourself..."
              />
            </div>
          </div>

          <div className="bg-white border-2 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8">
            <div>
              <h3 className="text-2xl font-black uppercase tracking-tighter text-black">Account <span className="text-accent">Security</span>.</h3>
              <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Manage your password and security protocols.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-8 bg-zinc-50 border-2 border-black gap-6">
              <div className="flex items-center space-x-6">
                <div className="w-14 h-14 bg-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,62,0,1)]">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-black uppercase tracking-tight text-sm">Authentication Password</p>
                  <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Last changed 3 months ago</p>
                </div>
              </div>
              <Button variant="outline" className="h-12 border-2 border-black rounded-none font-black uppercase tracking-widest text-[10px] px-8 hover:bg-black hover:text-white transition-all">
                Change Password
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
