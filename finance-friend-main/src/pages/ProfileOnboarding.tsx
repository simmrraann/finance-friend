import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Moon, Sun, User, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { normalizePhone } from '@/lib/phone';

function getTimeGreeting() {
  const hour = new Date().getHours();
  if (hour < 5) return 'Good night';
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function ProfileOnboarding() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState(user?.username || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (user.username && user.phoneNumber) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !phoneNumber.trim()) {
      toast.error('Please fill in both username and phone number');
      return;
    }

    const normalized = normalizePhone(phoneNumber);
    if (!normalized) {
      toast.error('Please enter a valid phone number with country code (e.g. +91 98765 43210)');
      return;
    }

    try {
      setIsLoading(true);
      await updateProfile({ username: username.trim(), phoneNumber: normalized });
      toast.success(`You’re all set, ${username.trim()} ✨`);
      navigate('/character-select');
    } catch {
      toast.error('Could not save your profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const greetingName = user?.email?.split('@')[0] || 'friend';

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-4">
        <div className="container mx-auto flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl">
              {getTimeGreeting()}, {greetingName} 🌙
            </CardTitle>
            <CardDescription>
              Let&apos;s personalize your space so we can greet you by name and send gentle SMS nudges later.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">What should we call you?</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Simran"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Phone number for SMS</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll only use this for helpful reminders and summaries. No spam, ever.
                </p>
              </div>

              <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? 'Saving...' : 'Save my profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


