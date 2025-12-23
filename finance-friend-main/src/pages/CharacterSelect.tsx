import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth, Character } from '@/contexts/AuthContext';
import { ArrowRight, Sparkles, Check } from 'lucide-react';
import { toast } from 'sonner';

const characters = [
  {
    id: 'spark' as Character,
    name: 'Spark',
    emoji: '⚡',
    trait: 'Motivational',
    color: 'from-amber-400 to-orange-500',
    bgColor: 'bg-amber-50 dark:bg-amber-950/20',
    borderColor: 'border-amber-300 dark:border-amber-700',
    description: 'High energy companion who celebrates every win and pushes you to do better!',
    greeting: "Let's GO! Ready to crush those financial goals? 🔥",
    personality: [
      'Celebrates your wins, big or small',
      'Gives you energy when you need it',
      'Keeps you motivated through tough times',
    ],
  },
  {
    id: 'zen' as Character,
    name: 'Zen',
    emoji: '🧘',
    trait: 'Calm & Friendly',
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    borderColor: 'border-emerald-300 dark:border-emerald-700',
    description: 'Peaceful guide who approaches finances with calm wisdom and no judgment.',
    greeting: "Welcome, friend. Let's take this journey one step at a time. 🌿",
    personality: [
      'Never judges your spending',
      'Offers gentle guidance',
      'Helps you stay stress-free',
    ],
  },
  {
    id: 'sage' as Character,
    name: 'Sage',
    emoji: '🦉',
    trait: 'Analytical',
    color: 'from-violet-400 to-purple-500',
    bgColor: 'bg-violet-50 dark:bg-violet-950/20',
    borderColor: 'border-violet-300 dark:border-violet-700',
    description: 'Data-driven advisor who gives you straight facts and actionable insights.',
    greeting: "I've analyzed your data. Here's what you need to know. 📊",
    personality: [
      'Straight to the point',
      'Deep data analysis',
      'Actionable recommendations',
    ],
  },
];

export default function CharacterSelect() {
  const navigate = useNavigate();
  const { selectCharacter, user } = useAuth();
  const [selected, setSelected] = useState<Character>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleContinue = () => {
    if (!selected) {
      toast.error('Please select a companion to continue');
      return;
    }
    
    setIsAnimating(true);
    selectCharacter(selected);
    
    setTimeout(() => {
      toast.success(`${characters.find(c => c.id === selected)?.name} is now your companion!`);
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">One last step</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
          Choose your companion
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Your companion will guide you through your financial journey with their unique personality.
        </p>
      </header>

      {/* Character Selection */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {characters.map((char, index) => (
            <button
              key={char.id}
              onClick={() => setSelected(char.id)}
              className={`
                relative text-left p-6 rounded-2xl border-2 transition-all duration-300
                ${char.bgColor}
                ${selected === char.id 
                  ? `${char.borderColor} shadow-lg scale-105` 
                  : 'border-transparent hover:border-border hover:shadow-md'
                }
                animate-fade-up
              `}
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              {/* Selection Indicator */}
              {selected === char.id && (
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${char.color} flex items-center justify-center text-white shadow-lg animate-scale-in`}>
                  <Check className="w-5 h-5" />
                </div>
              )}
              
              {/* Character Emoji */}
              <div className="text-6xl mb-4 animate-float" style={{ animationDelay: `${0.3 * index}s` }}>
                {char.emoji}
              </div>
              
              {/* Character Info */}
              <h3 className="text-2xl font-display font-bold mb-1">{char.name}</h3>
              <div className={`inline-flex px-3 py-1 rounded-full bg-gradient-to-r ${char.color} text-white text-sm font-medium mb-3`}>
                {char.trait}
              </div>
              <p className="text-muted-foreground mb-4">{char.description}</p>
              
              {/* Greeting Preview */}
              <div className="p-3 rounded-lg bg-background/50 border border-border mb-4">
                <p className="text-sm italic">"{char.greeting}"</p>
              </div>
              
              {/* Personality Traits */}
              <ul className="space-y-2">
                {char.personality.map((trait, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${char.color}`} />
                    {trait}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>
        
        {/* Continue Button */}
        <div className="text-center mt-10">
          <Button
            variant="hero"
            size="xl"
            onClick={handleContinue}
            disabled={!selected || isAnimating}
            className={`group ${isAnimating ? 'animate-pulse' : ''}`}
          >
            {isAnimating ? 'Setting up...' : 'Continue with your companion'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <p className="text-sm text-muted-foreground mt-4">
            Don't worry, you can always change this later in settings
          </p>
        </div>
      </main>
    </div>
  );
}
