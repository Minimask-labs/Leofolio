'use client';
import { PuzzleConnectButton } from './puzzle-connect-button';
import { useAccount } from '@puzzlehq/sdk';

export function Header() {
  const {account} = useAccount();
 
  return (
    <header className="flex justify-between items-center sticky border-b border-blue-200 py-4 px-4 bg-white/80 backdrop-blur-sm top-0 z-30">
      <div className="flex items-center justify-between gap-2  container w-full mx-auto">
        <div className="flex items-center gap-2">
          <h1
            className={`text-2xl font-bold text-blue-600 `}
          >
            Leofolio
          </h1>
          <span className="lg:text-xs text-[10px] lg:flex hidden px-2 py-1 rounded-full bg-slate-100 text-slate-700 ml-2">
            {account?.network} 
           </span>
        </div> 
        <div>
          <PuzzleConnectButton />
        </div>
      </div>
    </header>
  );
}
