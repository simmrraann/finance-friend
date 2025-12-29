import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';

export function AppLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
