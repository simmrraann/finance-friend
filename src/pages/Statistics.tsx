import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFinance } from '@/contexts/FinanceContext';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrencyINR } from '@/lib/utils';
import { useAuth, Character } from '@/contexts/AuthContext';
import { analyzeFinancialData, generateCompanionMessage } from '@/lib/aiCompanion';
import {
  TrendingUp,
  Moon,
  Sun,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Settings,
  LogOut,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

type StatsPeriod = 'weekly' | 'monthly' | 'yearly';
type ChartPeriod = 'weekly' | 'monthly' | 'yearly';

const characterEmoji: Record<NonNullable<Character>, string> = {
  spark: '⚡',
  zen: '🧘',
  sage: '🦉',
};

export default function Statistics() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { logout, user } = useAuth();
  const { transactions, categories, getTotalIncome, getTotalExpenses, getTotalInvestments } = useFinance();

  const [statsPeriod, setStatsPeriod] = useState<StatsPeriod>('weekly');
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>('weekly');

  const character = user?.character || 'zen';
  const firstName = (user?.username || user?.email?.split('@')[0] || 'friend').split(' ')[0];

  // Generate dynamic AI companion insights based on real financial data
  const companionInsight = useMemo(() => {
    const analysis = analyzeFinancialData(transactions);
    const message = generateCompanionMessage(analysis, character, firstName);
    return {
      analysis: message.weeklyInsight,
      tags: message.tags,
    };
  }, [transactions, character, firstName]);

  const location = useLocation();
  const pathname = location.pathname;
  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Statistics', path: '/statistics' },
    { icon: <Receipt className="w-5 h-5" />, label: 'Transactions', path: '/transactions' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  // Calculate category spending
  const categorySpending = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const pieData = Object.entries(categorySpending).map(([name, value]) => ({
    name,
    value,
  }));

  // Weekly data
  const weeklyData = [
    { day: 'Mon', income: 400, expenses: 120 },
    { day: 'Tue', income: 0, expenses: 80 },
    { day: 'Wed', income: 200, expenses: 150 },
    { day: 'Thu', income: 0, expenses: 45 },
    { day: 'Fri', income: 800, expenses: 200 },
    { day: 'Sat', income: 0, expenses: 300 },
    { day: 'Sun', income: 0, expenses: 50 },
  ];

  // Monthly data
  const monthlyData = [
    { day: 'Week 1', income: 1400, expenses: 450 },
    { day: 'Week 2', income: 1200, expenses: 380 },
    { day: 'Week 3', income: 800, expenses: 520 },
    { day: 'Week 4', income: 1500, expenses: 410 },
  ];

  // Yearly data
  const yearlyData = [
    { day: 'Jan', income: 5000, expenses: 2100 },
    { day: 'Feb', income: 4800, expenses: 1900 },
    { day: 'Mar', income: 5200, expenses: 2300 },
    { day: 'Apr', income: 4600, expenses: 2000 },
    { day: 'May', income: 5100, expenses: 2200 },
    { day: 'Jun', income: 5500, expenses: 2400 },
  ];

  const getChartData = () => {
    switch (chartPeriod) {
      case 'monthly': return monthlyData;
      case 'yearly': return yearlyData;
      default: return weeklyData;
    }
  };

  // Monthly trend
  const monthlyTrend = [
    { month: 'Jul', balance: 2500 },
    { month: 'Aug', balance: 3200 },
    { month: 'Sep', balance: 2800 },
    { month: 'Oct', balance: 4100 },
    { month: 'Nov', balance: 3600 },
    { month: 'Dec', balance: 4500 },
    { month: 'Jan', balance: 5000 },
  ];

  const COLORS = ['hsl(217, 91%, 50%)', 'hsl(199, 89%, 48%)', 'hsl(186, 80%, 45%)', 'hsl(250, 60%, 55%)', 'hsl(38, 92%, 50%)'];

  const getPeriodLabel = () => {
    switch (statsPeriod) {
      case 'monthly': return 'This Month';
      case 'yearly': return 'This Year';
      default: return 'This Week';
    }
  };

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
      <main className="md:ml-64 pt-20 md:pt-8 pb-16 md:pb-8 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-display font-bold mb-2">Statistics</h1>
            <p className="text-muted-foreground">Visualize your financial journey</p>
          </div>

          {/* Top-Level Period Toggle */}
          <div className="mb-6">
            <div className="inline-flex bg-secondary rounded-xl p-1">
              {(['weekly', 'monthly', 'yearly'] as StatsPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setStatsPeriod(period)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                    statsPeriod === period
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {period} Statistics
                </button>
              ))}
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Income</p>
                  <p className="text-2xl font-display font-bold text-success">
                    {formatCurrencyINR(getTotalIncome())}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{getPeriodLabel()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                  <ArrowUpRight className="w-5 h-5 text-success" />
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
                  <p className="text-2xl font-display font-bold text-destructive">
                    {formatCurrencyINR(getTotalExpenses())}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{getPeriodLabel()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <ArrowDownRight className="w-5 h-5 text-destructive" />
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Investments</p>
                  <p className="text-2xl font-display font-bold text-primary">
                    {formatCurrencyINR(getTotalInvestments())}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{getPeriodLabel()}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-primary" />
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Income vs Expenses Overview */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Income vs Expenses</CardTitle>
                {/* Chart-level toggle */}
                <div className="inline-flex bg-secondary rounded-lg p-0.5">
                  {(['weekly', 'monthly', 'yearly'] as ChartPeriod[]).map((period) => (
                    <button
                      key={period}
                      onClick={() => setChartPeriod(period)}
                      className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize ${
                        chartPeriod === period
                          ? 'bg-primary text-primary-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getChartData()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="income" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expenses" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [formatCurrencyINR(value), 'Amount']}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* AI Financial Insights */}
            <Card className="lg:col-span-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="text-3xl animate-float">{characterEmoji[character]}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">Financial Insights</CardTitle>
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">AI-powered analysis from your companion</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-foreground leading-relaxed">{companionInsight.analysis}</p>
                {companionInsight.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {companionInsight.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tag === 'Overspending' || tag === 'Needs attention'
                            ? 'bg-destructive/10 text-destructive'
                            : tag === 'Strong savings' || tag === 'Trending up'
                            ? 'bg-success/10 text-success'
                            : tag === 'Lifestyle inflation'
                            ? 'bg-warning/10 text-warning'
                            : 'bg-primary/10 text-primary'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Balance Trend */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Balance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [formatCurrencyINR(value), 'Balance']}
                      />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
