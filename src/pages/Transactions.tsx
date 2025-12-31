import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useFinance, Transaction, TransactionType } from '@/contexts/FinanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrencyINR } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Moon,
  Sun,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Settings,
  LogOut,
  Search,
  Filter,
  Trash2,
  Plus,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Transactions() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAuth();
  const { transactions, categories, deleteTransaction, addTransaction } = useFinance();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTransaction, setNewTransaction] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    category: '',
    notes: '',
  });

  const location = useLocation();
  const pathname = location.pathname;
  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Statistics', path: '/statistics' },
    { icon: <Receipt className="w-5 h-5" />, label: 'Transactions', path: '/transactions' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  const filteredTransactions = transactions.filter((t) => {
    const matchesSearch = t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success('Transaction deleted');
  };

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

  const filteredCategories = categories.filter(c => c.type === newTransaction.type);

  const groupedTransactions = filteredTransactions.reduce((acc, t) => {
    const date = new Date(t.date).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(t);
    return acc;
  }, {} as Record<string, Transaction[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-card border-r border-border p-4 hidden md:flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold">SimpliFy</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={pathname === item.path ? 'secondary' : 'ghost'}
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
      <header className="md:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border px-4 flex items-center justify-between z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-display font-bold">SimpliFy</span>
        </div>
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-50">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors duration-200 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              {item.icon}
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main Content */}
      <main className="lg:ml-64 pt-20 lg:pt-8 pb-24 lg:pb-8 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Transactions</h1>
              <p className="text-muted-foreground">Manage all your transactions</p>
            </div>
            <Button variant="hero" onClick={() => setShowAddModal(true)} className="hidden sm:flex">
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as TransactionType | 'all')}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="investment">Investment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([date, dayTransactions]) => (
              <div key={date}>
                <h3 className="text-sm font-medium text-muted-foreground mb-3">{date}</h3>
                <Card>
                  <CardContent className="p-0 divide-y divide-border">
                    {dayTransactions.map((transaction) => {
                      const category = categories.find(c => c.name === transaction.category);
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                              {category?.icon || '💰'}
                            </div>
                            <div>
                              <p className="font-medium">{transaction.category}</p>
                              <p className="text-sm text-muted-foreground">{transaction.notes || 'No notes'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`font-semibold text-lg ${
                              transaction.type === 'income' 
                                ? 'text-success' 
                                : transaction.type === 'expense' 
                                  ? 'text-destructive' 
                                  : 'text-chart-3'
                            }`}>
                              {transaction.type === 'income' ? '+' : '-'}
                              {formatCurrencyINR(transaction.amount)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(transaction.id)}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              </div>
            ))}
            
            {filteredTransactions.length === 0 && (
              <Card className="p-12 text-center">
                <Receipt className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No transactions found</p>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Floating Add Button (Mobile) */}
      <Button
        variant="hero"
        size="icon"
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg sm:hidden"
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
