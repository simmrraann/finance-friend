import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth, Character } from '@/contexts/AuthContext';
import { useFinance, TransactionType } from '@/contexts/FinanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Moon,
  Sun,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Settings,
  LogOut,
  X,
  Sparkles,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const characterMessages: Record<NonNullable<Character>, { greeting: string; tip: string; weeklyInsight: string }> = {
  spark: {
    greeting: "You're on FIRE! 🔥",
    tip: "Keep up the momentum! Every dollar saved is a step closer to your dreams!",
    weeklyInsight: "Your spending is 15% lower than last week — incredible progress! You're crushing your food budget and your investments are growing. Keep this energy going!",
  },
  zen: {
    greeting: "Welcome back, friend 🌿",
    tip: "Remember, financial wellness is a journey, not a destination. Take it one day at a time.",
    weeklyInsight: "This week has been balanced. Your expenses are steady, and you've maintained a healthy savings rate. Consider reviewing your subscriptions for potential savings.",
  },
  sage: {
    greeting: "Good to see you 📊",
    tip: "Based on your patterns, consider reviewing your entertainment spending this week.",
    weeklyInsight: "Analysis shows income up 8% vs last week. Top spending: Food & Dining (32%), Shopping (24%). Recommendation: Set a $50 weekly cap on entertainment.",
  },
};

const characterEmoji: Record<NonNullable<Character>, string> = {
  spark: '⚡',
  zen: '🧘',
  sage: '🦉',
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { 
    transactions, 
    categories, 
    addTransaction, 
    getTotalIncome, 
    getTotalExpenses, 
    getTotalInvestments, 
    getBalance 
  } = useFinance();
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: '',
    notes: '',
  });

  const character = user?.character || 'zen';
  const message = characterMessages[character];

  const handleAddTransaction = () => {
    if (!newTransaction.amount || !newTransaction.category) {
      toast.error('Please fill in amount and category');
      return;
    }
    
    addTransaction({
      type: newTransaction.type,
      amount: parseFloat(newTransaction.amount),
      category: newTransaction.category,
      date: new Date().toISOString().split('T')[0],
      notes: newTransaction.notes,
    });
    
    toast.success('Transaction added!');
    setShowAddModal(false);
    setNewTransaction({ type: 'expense', amount: '', category: '', notes: '' });
  };

  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard', active: true },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Statistics', path: '/statistics' },
    { icon: <Receipt className="w-5 h-5" />, label: 'Transactions', path: '/transactions' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  const filteredCategories = categories.filter(c => c.type === newTransaction.type);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-4 hidden lg:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold">FinFlow</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={item.active ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-3"
              onClick={() => navigate(item.path)}
            >
              {item.icon}
              {item.label}
            </Button>
          ))}
        </nav>
        
        <div className="space-y-2">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 text-destructive" onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="w-5 h-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">FinFlow</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-50">
        {navItems.map((item) => (
          <Button
            key={item.path}
            variant="ghost"
            size="icon"
            className={item.active ? 'text-primary' : 'text-muted-foreground'}
            onClick={() => navigate(item.path)}
          >
            {item.icon}
          </Button>
        ))}
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-8 pb-24 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold mb-2">
              Hi, {user?.name?.split(' ')[0] || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground">Here's your financial overview</p>
          </div>

          {/* Character Companion Card */}
          <Card className="mb-6 overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="flex items-start gap-4 p-6">
              <div className="text-4xl animate-float">{characterEmoji[character]}</div>
              <div className="flex-1">
                <p className="font-semibold mb-1">{message.greeting}</p>
                <p className="text-muted-foreground text-sm">{message.tip}</p>
              </div>
            </div>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Balance</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold">${getBalance().toLocaleString()}</p>
              <p className="text-xs text-success flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +12% from last month
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Income</span>
                <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-success" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold">${getTotalIncome().toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Expenses</span>
                <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-4 h-4 text-destructive" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold">${getTotalExpenses().toLocaleString()}</p>
              <p className="text-xs text-destructive flex items-center gap-1 mt-1">
                <ArrowDownRight className="w-3 h-3" /> +5% from last month
              </p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Investments</span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PiggyBank className="w-4 h-4 text-primary" />
                </div>
              </div>
              <p className="text-2xl font-display font-bold">${getTotalInvestments().toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-1">Total invested</p>
            </Card>
          </div>

          {/* AI Weekly Summary */}
          <Card className="mb-6 border-primary/20">
            <CardHeader className="flex flex-row items-center gap-3 pb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">Weekly AI Summary</CardTitle>
                <p className="text-xs text-muted-foreground">Powered by your companion</p>
              </div>
              <div className="ml-auto text-2xl">{characterEmoji[character]}</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground leading-relaxed">{message.weeklyInsight}</p>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Transactions</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((transaction) => {
                  const category = categories.find(c => c.name === transaction.category);
                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{category?.icon || '💰'}</div>
                        <div>
                          <p className="font-medium">{transaction.category}</p>
                          <p className="text-sm text-muted-foreground">{transaction.notes || transaction.date}</p>
                        </div>
                      </div>
                      <span className={`font-semibold ${
                        transaction.type === 'income' 
                          ? 'text-success' 
                          : transaction.type === 'expense' 
                            ? 'text-destructive' 
                            : 'text-primary'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Floating Add Button */}
      <Button
        variant="hero"
        size="icon"
        className="fixed bottom-20 lg:bottom-8 right-4 lg:right-8 w-14 h-14 rounded-full shadow-lg"
        onClick={() => setShowAddModal(true)}
      >
        <Plus className="w-6 h-6" />
      </Button>

      {/* Add Transaction Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md animate-scale-in">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add Transaction</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowAddModal(false)}>
                <X className="w-5 h-5" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Type Selection */}
              <div className="flex gap-2">
                {(['income', 'expense', 'investment'] as TransactionType[]).map((type) => (
                  <Button
                    key={type}
                    variant={newTransaction.type === type ? 'default' : 'outline'}
                    className="flex-1 capitalize"
                    onClick={() => setNewTransaction({ ...newTransaction, type, category: '' })}
                  >
                    {type}
                  </Button>
                ))}
              </div>
              
              {/* Amount */}
              <div>
                <label className="text-sm font-medium mb-2 block">Amount</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={newTransaction.amount}
                  onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                />
              </div>
              
              {/* Category */}
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={newTransaction.category}
                  onValueChange={(value) => setNewTransaction({ ...newTransaction, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        <span className="flex items-center gap-2">
                          <span>{cat.icon}</span>
                          <span>{cat.name}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              {/* Notes */}
              <div>
                <label className="text-sm font-medium mb-2 block">Notes (optional)</label>
                <Input
                  placeholder="Add a note..."
                  value={newTransaction.notes}
                  onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                />
              </div>
              
              <Button variant="hero" className="w-full" onClick={handleAddTransaction}>
                Add Transaction
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
