import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { useFinance } from '@/contexts/FinanceContext';
import { useAuth, Character } from '@/contexts/AuthContext';
import {
  TrendingUp,
  Moon,
  Sun,
  LayoutDashboard,
  BarChart3,
  Receipt,
  Settings,
  LogOut,
  User,
  Bell,
  Shield,
  Download,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';
import jsPDF from 'jspdf';
import { formatCurrencyINR } from '@/lib/utils';

const characters = [
  { id: 'spark' as Character, name: 'Spark', emoji: '⚡', trait: 'Motivational' },
  { id: 'zen' as Character, name: 'Zen', emoji: '🧘', trait: 'Calm & Friendly' },
  { id: 'sage' as Character, name: 'Sage', emoji: '🦉', trait: 'Analytical' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, selectCharacter } = useAuth();
  const { transactions, getTotalIncome, getTotalExpenses, getTotalInvestments, getBalance } = useFinance();
  
  const [notifications, setNotifications] = useState({
    weekly: true,
    monthly: true,
    limits: true,
  });

  const location = useLocation();
  const pathname = location.pathname;
  const navItems = [
    { icon: <LayoutDashboard className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <BarChart3 className="w-5 h-5" />, label: 'Statistics', path: '/statistics' },
    { icon: <Receipt className="w-5 h-5" />, label: 'Transactions', path: '/transactions' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', path: '/settings' },
  ];

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const exportCsv = () => {
    if (!transactions.length) {
      toast.error('No transactions to export yet.');
      return;
    }

    const headers = ['ID', 'Type', 'Category', 'Amount', 'Date', 'Notes'];
    const rows = transactions.map((t) => [
      t.id,
      t.type,
      t.category,
      t.amount.toString(),
      t.date,
      t.notes ?? '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const username = user?.username || 'finflow-user';
    downloadFile(blob, `${username}-transactions.csv`);
    toast.success('CSV exported successfully.');
  };

  const exportPdf = () => {
    if (!transactions.length) {
      toast.error('No transactions to export yet.');
      return;
    }

    const doc = new jsPDF();
    const username = user?.username || 'SimpliFy user';

    doc.setFontSize(16);
    doc.text(`SimpliFy Report for ${username}`, 14, 20);

    doc.setFontSize(11);
    const summaryStartY = 30;
    doc.text(`Balance: ${formatCurrencyINR(getBalance())}`, 14, summaryStartY);
    doc.text(`Total Income: ${formatCurrencyINR(getTotalIncome())}`, 14, summaryStartY + 6);
    doc.text(`Total Expenses: ${formatCurrencyINR(getTotalExpenses())}`, 14, summaryStartY + 12);
    doc.text(`Total Investments: ${formatCurrencyINR(getTotalInvestments())}`, 14, summaryStartY + 18);

    let y = summaryStartY + 32;
    doc.setFontSize(12);
    doc.text('Recent Transactions', 14, y);
    y += 6;
    doc.setFontSize(9);

    const maxRows = 30;
    const toRender = transactions.slice(0, maxRows);

    toRender.forEach((t) => {
      const line = `${t.date} | ${t.type.toUpperCase()} | ${t.category} | ${formatCurrencyINR(t.amount)}${t.notes ? ` | ${t.notes}` : ''}`;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, 14, y);
      y += 5;
    });

    const blob = doc.output('blob');
    const filenameBase = (user?.username || 'simplify-user').toLowerCase().replace(/\s+/g, '-');
    downloadFile(blob, `${filenameBase}-report.pdf`);
    toast.success('PDF exported successfully.');
  };

  const handleExport = (format: 'pdf' | 'csv') => {
    try {
      if (format === 'csv') {
        exportCsv();
      } else {
        exportPdf();
      }
    } catch (e) {
      toast.error('Something went wrong while exporting. Please try again.');
      console.error(e);
    }
  };

  const handleCharacterChange = (character: Character) => {
    selectCharacter(character);
    toast.success(`${characters.find(c => c.id === character)?.name} is now your companion!`);
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
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">Manage your account and preferences</p>
          </div>

          <div className="space-y-6">
            {/* Profile Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Username</label>
                    <p className="font-medium">{user?.username || 'Demo User'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Email</label>
                    <p className="font-medium">{user?.email || 'demo@example.com'}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Phone number (private)</label>
                    <p className="font-medium">{user?.phoneNumber || '+1 234 567 8900'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Character Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Your Companion</CardTitle>
                <CardDescription>Choose who guides your financial journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  {characters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => handleCharacterChange(char.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all duration-200 ${
                        user?.character === char.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {user?.character === char.id && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                      <div className="text-4xl mb-2">{char.emoji}</div>
                      <p className="font-semibold">{char.name}</p>
                      <p className="text-xs text-muted-foreground">{char.trait}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Appearance */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                  </div>
                  <div>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize how FinFlow looks</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Dark Mode</p>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes</p>
                  </div>
                  <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
                </div>
              </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Notifications</CardTitle>
                    <CardDescription>Manage your notification preferences</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Weekly Summary</p>
                    <p className="text-sm text-muted-foreground">Get a weekly overview via SMS</p>
                  </div>
                  <Switch 
                    checked={notifications.weekly} 
                    onCheckedChange={(checked) => setNotifications({ ...notifications, weekly: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Monthly Recap</p>
                    <p className="text-sm text-muted-foreground">Detailed monthly report</p>
                  </div>
                  <Switch 
                    checked={notifications.monthly} 
                    onCheckedChange={(checked) => setNotifications({ ...notifications, monthly: checked })} 
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Spending Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified when approaching limits</p>
                  </div>
                  <Switch 
                    checked={notifications.limits} 
                    onCheckedChange={(checked) => setNotifications({ ...notifications, limits: checked })} 
                  />
                </div>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Download className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Export Data</CardTitle>
                    <CardDescription>Download your financial records</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline" className="flex-1" onClick={() => handleExport('pdf')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => handleExport('csv')}>
                    <Download className="w-4 h-4 mr-2" />
                    Export as CSV
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Privacy */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Privacy</CardTitle>
                    <CardDescription>Your data is safe with us</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm text-muted-foreground">
                    🔒 <span className="font-medium text-foreground">Privacy First:</span> Your financial data is encrypted and never shared with third parties. 
                    You have complete control over your information.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-destructive">Danger Zone</CardTitle>
                <CardDescription>Irreversible actions</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10" onClick={() => { logout(); navigate('/'); }}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
