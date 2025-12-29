import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Receipt, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Statistics', path: '/statistics', icon: BarChart3 },
  { name: 'Transactions', path: '/transactions', icon: Receipt },
  { name: 'Settings', path: '/settings', icon: Settings },
];

export function BottomNavigation() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex flex-col items-center justify-center flex-1 h-full',
                'text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400',
                'transition-colors duration-200',
                isActive ? 'text-blue-600 dark:text-blue-400' : ''
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
