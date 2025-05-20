'use client';

import { useState, useEffect, use } from 'react';
import { useConnect, useAccount, useDisconnect, Network } from '@puzzlehq/sdk';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Loader2, ChevronDown, LogOut, Copy, ExternalLink } from 'lucide-react';
import { useStore } from '@/Store/user';
import { logout } from '@/service/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function PuzzleConnectButton() {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

 
  const handleLogout = () => {
    try {
      logout();
      router.push('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const {
    connect,
    data,
    error: connectError,
    loading: connectLoading
  } = useConnect({
    dAppInfo: {
      name: 'AleoMail',
      description: 'AleoMail',
      iconUrl: '/aleomail_logo.png'
    },
    permissions: {
      programIds: {
        [Network.AleoMainnet]: [
          'dapp_1.aleo',
          'dapp_2.aleo',
          'dapp_2_imports.aleo'
        ],
        [Network.AleoTestnet]: [
          'dapp_3.aleo',
          'dapp_3_imports_1.aleo',
          'dapp_3_imports_2.aleo',
          'aleo_voice001.aleo',
          'aleo_voice101.aleo',
          'aleo_voice321.aleo',
          'escrow_contract.aleo',
          'escrow_contract_v1.aleo',
          'escrow_contract_v2.aleo',
          'escrow_contract_v3.aleo',
          'zk_privacy_escrow.aleo',
          'escrow_contract11.aleo',
          'escrow_contract_beta.aleo'
        ]
      }
    }
  });

  const { account } = useAccount();

  const {
    disconnect,
    error: disconnectError,
    loading: disconnectLoading
  } = useDisconnect();
useEffect(() => {
  if (account === undefined) {
    handleLogout();
  }
}, [account]);
  useEffect(() => {
    setIsConnected(!!account);
  }, [account]);

  useEffect(() => {
    if (connectError) {
      toast({
        title: 'Error ',
        description: `Error connecting: ${connectError}`,
        variant: 'destructive'
      });

      // toast.error(`Error connecting: ${connectError}`);
    }
    if (disconnectError) {
      toast({
        title: 'Error ',
        description: `Error disconnecting: ${disconnectError}`,
        variant: 'destructive'
      });

      // toast.error(`Error disconnecting: ${disconnectError}`);
    }
  }, [connectError, disconnectError]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connect();
      toast({
        title: 'success',
        description: `Wallet connected successfully!`;
        variant: 'default',
       });

      // toast.success('Wallet connected successfully!');
    } catch (e) {
      toast({
        title: 'Error ',
        description: `Error connecting: ${(e as Error).message}`,
        variant: 'destructive'
      });

      // toast.error(`Error connecting: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await disconnect();
      toast({
        title: 'success',
        description: `Wallet disconnected successfully!`;
        variant: 'default',
       });

      // toast.success('Wallet disconnected successfully!');
      handleLogout();
    } catch (e) {
      toast({
        title: 'Error ',
        description: `Error disconnecting: ${(e as Error).message}`,
        variant: 'destructive'
      });

      // toast.error(`Error disconnecting: ${(e as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setAddressCopied(true);
    // toast.success('Address copied to clipboard!');
    toast({
      title: ' ',
      description: `Address copied to clipboard!`;
      variant: 'default',
     });

    setTimeout(() => setAddressCopied(false), 2000);
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const viewOnExplorer = (address: string) => {
    // Replace with the actual Aleo explorer URL
    window.open(`https://explorer.aleo.org/address/${address}`, '_blank');
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={loading || connectLoading}
        className="!bg-slate-100 relative !text-slate-700 hover:!bg-slate-700 w-full hover:!text-slate-100 !border-slate-200"
      >
        {loading || connectLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Connecting...
          </>
        ) : (
          <>Connect Wallet</>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {truncateAddress(account?.address || '')}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground">
          Connected Account
        </div>
        {/* <DropdownMenuSeparator /> */}
        {/* <div className="px-2 py-1.5 text-xs break-all">{account?.address}</div> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => copyToClipboard(account?.address || '')}
        >
          <Copy className="mr-2 h-4 w-4" />
          {addressCopied ? 'Copied!' : 'Copy Address'}
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => viewOnExplorer(account?.address || '')}
        >
          <ExternalLink className="mr-2 h-4 w-4" />
          View on Explorer
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDisconnect}
          disabled={loading || disconnectLoading}
          className="text-destructive focus:text-destructive"
        >
          {loading || disconnectLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Disconnecting...
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" />
              Disconnect
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
