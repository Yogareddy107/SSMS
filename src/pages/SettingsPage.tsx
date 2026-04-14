import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  Moon, 
  Sun, 
  Lock, 
  Eye, 
  Globe, 
  Shield, 
  Smartphone,
  Mail,
  MessageSquare,
  CreditCard,
  Trash2
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('USER');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    marketing: false
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          setUserRole(userDoc.data().role || 'USER');
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleRoleChange = async (newRole: string) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        role: newRole
      });
      setUserRole(newRole);
      toast.success(`Role updated to ${newRole}. Sidebar will update.`);
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role.");
    }
  };

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success('Preference updated');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <div className="pb-12 border-b-2 border-black">
        <h2 className="text-4xl font-black uppercase tracking-tighter font-heading text-black">System <span className="text-accent">Settings</span>.</h2>
        <p className="text-zinc-500 font-medium mt-2">Configure your account preferences and technical application parameters.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Appearance */}
        <div className="bg-white border-2 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,62,0,1)]">
              <Sun className="w-6 h-6 text-white" />
            </div>
            <Badge className="rounded-none border-2 border-black bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">Visuals</Badge>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">Appearance</h3>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Customize the visual output of the interface.</p>
          </div>
          <div className="space-y-6 pt-6 border-t-2 border-zinc-50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-black uppercase tracking-widest text-[10px] text-black">Dark Mode</Label>
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">Invert system color palette.</p>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-black uppercase tracking-widest text-[10px] text-black">High Contrast</Label>
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">Maximize visual differentiation.</p>
              </div>
              <Switch className="data-[state=checked]:bg-accent" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border-2 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,62,0,1)]">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <Badge className="rounded-none border-2 border-black bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">Alerts</Badge>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">Notifications</h3>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Control the flow of system updates.</p>
          </div>
          <div className="space-y-6 pt-6 border-t-2 border-zinc-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Mail className="w-4 h-4 text-black" />
                <Label className="font-black uppercase tracking-widest text-[10px] text-black">Email Protocol</Label>
              </div>
              <Switch 
                checked={notifications.email} 
                onCheckedChange={() => handleToggle('email')} 
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Smartphone className="w-4 h-4 text-black" />
                <Label className="font-black uppercase tracking-widest text-[10px] text-black">Push Interface</Label>
              </div>
              <Switch 
                checked={notifications.push} 
                onCheckedChange={() => handleToggle('push')} 
                className="data-[state=checked]:bg-accent"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <MessageSquare className="w-4 h-4 text-black" />
                <Label className="font-black uppercase tracking-widest text-[10px] text-black">SMS Gateway</Label>
              </div>
              <Switch 
                checked={notifications.sms} 
                onCheckedChange={() => handleToggle('sms')} 
                className="data-[state=checked]:bg-accent"
              />
            </div>
          </div>
        </div>

        {/* Privacy & Security */}
        <div className="bg-white border-2 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,62,0,1)]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <Badge className="rounded-none border-2 border-black bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">Security</Badge>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">Privacy & Security</h3>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Manage data encryption and access protocols.</p>
          </div>
          <div className="space-y-6 pt-6 border-t-2 border-zinc-50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-black uppercase tracking-widest text-[10px] text-black">Two-Factor Auth</Label>
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">Secondary verification layer.</p>
              </div>
              <Button variant="outline" size="sm" className="h-10 border-2 border-black rounded-none font-black uppercase tracking-widest text-[9px] px-4 hover:bg-black hover:text-white transition-all">Enable</Button>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="font-black uppercase tracking-widest text-[10px] text-black">Public Profile</Label>
                <p className="font-mono text-[9px] font-bold uppercase tracking-widest text-zinc-400">Visibility to external nodes.</p>
              </div>
              <Switch defaultChecked className="data-[state=checked]:bg-accent" />
            </div>
          </div>
        </div>

        {/* Billing */}
        <div className="bg-white border-2 border-black p-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] space-y-8">
          <div className="flex items-center justify-between mb-4">
            <div className="w-14 h-14 bg-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,62,0,1)]">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <Badge className="rounded-none border-2 border-black bg-white text-black text-[9px] font-black uppercase tracking-widest px-2 py-0.5">Demo</Badge>
          </div>
          <div>
            <h3 className="text-2xl font-black uppercase tracking-tight text-black">Role Switcher</h3>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Simulate different user permissions for testing.</p>
          </div>
          <div className="space-y-4 pt-6 border-t-2 border-zinc-50">
            <div className="grid grid-cols-3 gap-2">
              {['USER', 'PROVIDER', 'ADMIN'].map((role) => (
                <Button
                  key={role}
                  variant={userRole === role ? 'default' : 'outline'}
                  onClick={() => handleRoleChange(role)}
                  className={cn(
                    "h-12 border-2 border-black rounded-none font-black uppercase tracking-widest text-[9px] transition-all",
                    userRole === role ? "bg-black text-white" : "hover:bg-zinc-100"
                  )}
                >
                  {role}
                </Button>
              ))}
            </div>
            <p className="font-mono text-[8px] text-zinc-400 uppercase tracking-widest text-center">Changes will reflect in the sidebar navigation.</p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-accent/5 border-2 border-accent p-10 shadow-[10px_10px_0px_0px_rgba(255,62,0,1)] space-y-8">
        <div>
          <h3 className="text-2xl font-black uppercase tracking-tight text-accent">Danger Zone</h3>
          <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent/60 mt-1">Irreversible destructive actions for your account node.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 pt-8 border-t-2 border-accent/20">
          <div className="space-y-1">
            <p className="font-black uppercase tracking-tight text-sm text-black">Delete Account</p>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1">Permanently remove all data and system access.</p>
          </div>
          <Button variant="destructive" className="bg-accent hover:bg-black text-white rounded-none font-black uppercase tracking-widest text-[10px] h-14 px-10 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
            <Trash2 className="w-4 h-4 mr-3" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
}
