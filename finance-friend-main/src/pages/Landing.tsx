import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  TrendingUp, 
  PieChart, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  Moon, 
  Sun,
  Wallet,
  Target,
  Bell
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Wallet className="w-6 h-6" />,
      title: 'Smart Tracking',
      description: 'Effortlessly track income, expenses, and investments in one place.'
    },
    {
      icon: <PieChart className="w-6 h-6" />,
      title: 'Visual Insights',
      description: 'Beautiful charts and graphs to understand your spending patterns.'
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI Companion',
      description: 'Get personalized insights from your friendly finance companion.'
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: 'Goal Setting',
      description: 'Set spending limits and track your progress towards financial goals.'
    },
    {
      icon: <Bell className="w-6 h-6" />,
      title: 'Smart Alerts',
      description: 'Gentle notifications to keep you on track without being pushy.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Privacy First',
      description: 'Your data stays yours. No sharing, complete control.'
    },
  ];

  return (
    <div className="min-h-screen gradient-hero">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-display font-bold">SimpliFy</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button variant="ghost" onClick={() => navigate('/auth')}>
              Log in
            </Button>
            <Button variant="hero" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 animate-fade-up">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Your personal finance companion</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Money management
            <br />
            <span className="text-gradient">made simple</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Track expenses, set goals, and get AI-powered insights — all with a friendly companion by your side. 
            Built for Gen-Z, loved by everyone.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" onClick={() => navigate('/auth')} className="group">
              Start for free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="outline" size="xl" onClick={() => navigate('/auth')}>
              See how it works
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '$2M+', label: 'Tracked Monthly' },
              { value: '4.9★', label: 'User Rating' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, i) => (
              <div key={i} className="text-center animate-fade-up" style={{ animationDelay: `${0.1 * i}s` }}>
                <div className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Everything you need
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features wrapped in a beautiful, easy-to-use interface
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-lg transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${0.1 * i}s` }}
              >
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-4 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Character Preview Section */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Meet your companions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose a character that matches your vibe. They'll guide you through your financial journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { name: 'Spark', emoji: '⚡', trait: 'Motivational', desc: 'High energy, celebrates your wins!' },
              { name: 'Zen', emoji: '🧘', trait: 'Calm & Friendly', desc: 'Peaceful guidance, no judgment.' },
              { name: 'Sage', emoji: '🦉', trait: 'Analytical', desc: 'Data-driven insights, straight facts.' },
            ].map((char, i) => (
              <div
                key={i}
                className="text-center p-8 rounded-2xl bg-card border-2 border-border hover:border-primary/50 transition-all duration-300 animate-fade-up"
                style={{ animationDelay: `${0.15 * i}s` }}
              >
                <div className="text-6xl mb-4 animate-float" style={{ animationDelay: `${0.5 * i}s` }}>
                  {char.emoji}
                </div>
                <h3 className="text-2xl font-display font-bold mb-1">{char.name}</h3>
                <div className="inline-flex px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
                  {char.trait}
                </div>
                <p className="text-muted-foreground">{char.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 md:p-16 text-center">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-primary-foreground mb-4">
                Ready to take control?
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto mb-8">
                Join thousands of users who are already managing their finances the smart way.
              </p>
              <Button 
                variant="glass" 
                size="xl" 
                onClick={() => navigate('/auth')}
                className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-display font-bold">FinFlow</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2024 FinFlow. Your finances, simplified.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
