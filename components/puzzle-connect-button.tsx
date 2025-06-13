'use client';

import { useState, useEffect } from 'react';
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

// Constants
const DAPP_INFO = {
  name: 'AleoMail',
  description: 'AleoMail',
  iconUrl: '/aleomail_logo.png'
} as const;

const EXPLORER_BASE_URL = 'https://explorer.aleo.org/address';

// Types
interface ToastConfig {
  title: string;
  description: string;
  variant: 'default' | 'destructive';
}

export function PuzzleConnectButton() {
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [addressCopied, setAddressCopied] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const showToast = ({ title, description, variant }: ToastConfig) => {
    toast({
      title,
      description,
      variant
    });
  };

  const handleLogout = () => {
    try {
      logout();
      router.push('/auth');
    } catch (error) {
      console.error('Error during logout:', error);
      showToast({
        title: 'Error',
        description: 'Failed to logout. Please try again.',
        variant: 'destructive'
      });
    }
  };

  const {
    connect,
    data,
    error: connectError,
    loading: connectLoading
  } = useConnect({
    dAppInfo: DAPP_INFO,
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

  // Handle account changes
  useEffect(() => {
    if (account === undefined) {
      handleLogout();
    }
  }, [account]);

  // Update connection status
  useEffect(() => {
    setIsConnected(!!account);
  }, [account]);

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      showToast({
        title: 'Connection Error',
        description: `Failed to connect: ${connectError}`,
        variant: 'destructive'
      });
    }
  }, [connectError]);

  // Handle disconnection errors
  useEffect(() => {
    if (disconnectError) {
      showToast({
        title: 'Disconnection Error',
        description: `Failed to disconnect: ${disconnectError}`,
        variant: 'destructive'
      });
    }
  }, [disconnectError]);

  const handleConnect = async () => {
    setLoading(true);
    try {
      await connect();
      showToast({
        title: 'Success',
        description: 'Wallet connected successfully!',
        variant: 'default'
      });
    } catch (e) {
      showToast({
        title: 'Connection Error',
        description: `Failed to connect: ${(e as Error).message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await disconnect();
      showToast({
        title: 'Success',
        description: 'Wallet disconnected successfully!',
        variant: 'default'
      });
      handleLogout();
    } catch (e) {
      showToast({
        title: 'Disconnection Error',
        description: `Failed to disconnect: ${(e as Error).message}`,
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setAddressCopied(true);
      showToast({
        title: 'Success',
        description: 'Address copied to clipboard!',
        variant: 'default'
      });
      setTimeout(() => setAddressCopied(false), 2000);
    } catch (error) {
      showToast({
        title: 'Error',
        description: 'Failed to copy address to clipboard',
        variant: 'destructive'
      });
    }
  };

  const truncateAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  const viewOnExplorer = (address: string) => {
    window.open(
      `${EXPLORER_BASE_URL}/${address}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        disabled={loading || connectLoading}
        className="!bg-slate-100 relative !text-slate-700 hover:!bg-slate-700 w-full hover:!text-slate-100 !border-slate-200"
        aria-label="Connect Wallet"
      >
        {loading || connectLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            <span>Connecting...</span>
          </>
        ) : (
          <span>Connect Wallet</span>
        )}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 !bg-slate-100 !text-slate-700 hover:!bg-blue-500 hover:!text-slate-100 !border-slate-200"
          aria-label="Wallet options"
        >
          <span className="text-slate-700">
            {truncateAddress(account?.address || '')}
          </span>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5 text-sm font-medium text-slate-700">
          Connected Account
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => copyToClipboard(account?.address || '')}
          className="cursor-pointer"
        >
          <Copy className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>{addressCopied ? 'Copied!' : 'Copy Address'}</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => viewOnExplorer(account?.address || '')}
          className="cursor-pointer"
        >
          <ExternalLink className="mr-2 h-4 w-4" aria-hidden="true" />
          <span>View on Explorer</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDisconnect}
          disabled={loading || disconnectLoading}
          className="text-destructive focus:text-destructive cursor-pointer"
        >
          {loading || disconnectLoading ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              <span>Disconnecting...</span>
            </>
          ) : (
            <>
              <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
              <span>Disconnect</span>
            </>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
