'use client';

import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';

interface HeaderProps {
  connected: boolean;
  setConnected: (connected: boolean) => void;
  userType: 'freelancer' | 'employee';
}

export function Header({ connected, setConnected, userType }: HeaderProps) {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Shield
          className={`h-8 w-8 ${
            userType === 'freelancer' ? 'text-emerald-600' : 'text-blue-600'
          }`}
        />
        <h1 className="text-2xl font-bold">Leofolio</h1>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700 ml-2">
          {userType === 'freelancer' ? 'Freelancer' : 'Employee'}
        </span>
      </div>

      <Button
        onClick={() => setConnected(false)}
        variant="outline"
        className={
          userType === 'freelancer'
            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
            : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200'
        }
      >
        <LogOut className="mr-2 h-4 w-4" />
        Disconnect
      </Button>
    </header>
  );
}
