'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, LogOut } from 'lucide-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import '@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { logout } from '@/service/auth';
import { useRouter } from 'next/navigation';
import { useStore } from '@/Store/user';

interface HeaderProps {
  // connected: boolean;
  // setConnected: (connected: boolean) => void;
  // userType: 'freelancer' | 'employee';
}

export function Header({  }: HeaderProps) {
    const router = useRouter();
  const { userType, loadUserType, userData } = useStore();

    const { publicKey, wallet, connected, disconnecting } = useWallet();

    const handleLogout =  () => {
      try {
        logout();
        router.push('/auth');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    };
    useEffect(() => {
      if (disconnecting) {
        // console.log('disconnecting status:', disconnecting);
        handleLogout();
      }
      console.log('userType:', userType);
     }, [disconnecting]);
       useEffect(() => {
         if (publicKey || connected) {
         loadUserType();
          }
       }, [publicKey, connected]);
     
  return (
    <header className="flex justify-between items-center sticky py-4  bg-black top-0 z-30">
      <div className="flex items-center justify-between gap-2 bg-black container w-full mx-auto">
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
        </div>{' '}
        <div>
          {/* {connected ? ( */}
            <WalletMultiButton
              className={
                userType === 'freelancer'
                  ? '!bg-emerald-50 !text-emerald-700 hover:!bg-emerald-700 w-full hover:!text-white !border-emerald-200'
                  : '!bg-blue-50 !text-blue-700 hover:!bg-blue-700 w-full hover:!text-blue-50 !border-blue-200'
              }
            />
         </div>
      </div>
     </header>
  );
}
