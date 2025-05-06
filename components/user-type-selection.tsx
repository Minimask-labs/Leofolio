'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, Briefcase, User } from 'lucide-react';
import { WalletMultiButton } from '@demox-labs/aleo-wallet-adapter-reactui';
import '@demox-labs/aleo-wallet-adapter-reactui/dist/styles.css';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import { WalletNotConnectedError } from '@demox-labs/aleo-wallet-adapter-base';
import { LeoWalletAdapter } from '@demox-labs/aleo-wallet-adapter-leo';
import { walletAuth } from '@/service/auth';
import { useStore } from '@/Store/user';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, redirect } from 'next/navigation';

export function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<'freelancer' | 'employer'>(
    'freelancer'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { publicKey, wallet, connected, connecting } = useWallet();
  const {
    saveUserToken,
    saveUserData,
    saveUserType,
    token,
    loadUserData,
    userData
  } = useStore();

  const handleConnect = async () => {
    setLoading(true);
    if (publicKey) {
      // console.log('Public Key:', publicKey.toString());
      // console.log('Wallet:', wallet);
      // console.log('Wallet Adapter:', wallet?.adapter);
      if (!publicKey) throw new WalletNotConnectedError();
      const bytes = new TextEncoder().encode(publicKey);
      if (!wallet?.adapter) throw new Error('Wallet adapter is undefined');
      const signatureBytes = await (
        wallet?.adapter as LeoWalletAdapter
      ).signMessage(bytes);
      const signature = new TextDecoder().decode(signatureBytes);
      if (signature) {
        try {
          const body = {
            walletAddress: publicKey.toString(),
            signature: signature,
            role: selectedType,
            nonce: 'nonce'
          };
          const response = await walletAuth(body);
          console.log('Response:', response);
          if (response) {
            // Save the token and user data in cookies or local storage
            saveUserData(response);
            saveUserToken(response?.data?.token);
            saveUserType(response?.data?.user?.role);
            if (response?.data?.user?.role === 'freelancer') {
              // Use router.replace for faster navigation (no history entry)
              if (response?.data?.isNewUser) {
                router.replace('/onboarding/freelancer');
              } else {
                router.replace('/freelancer');
              }
              // Show toast after navigation
              toast({
                title: response?.message || 'Login successful',
                variant: 'default'
              });
            } else if (response?.data?.user?.role === 'employer') {
              if (response?.data?.isNewUser) {
                router.replace('/onboarding/freelancer');
              } else {
                router.replace('/employer');
              }

              toast({
                title: response?.message || 'Login successful',
                variant: 'default'
              });
            }
          }
        } catch (error) {
          console.error('Error during authentication:', error);
          // Handle error (e.g., show an error message)
          const errorMessage =
            (error as any)?.response?.data?.message ||
            'An unexpected error occurred.';
          toast({
            title: errorMessage,
            description: `There was a problem with your request. ${errorMessage}`,
            variant: 'destructive'
          });

          // Handle error appropriately (e.g., show an error message)
        } finally {
          setLoading(false);
        }
      }
    }
  };
  useEffect(() => {
    if (publicKey || connected) {
      handleConnect();
    }
    loadUserData();
    // console.log('loadUserData:',  userData);
    // if (token) {
    //   router.replace('/freelancer');
    // }
  }, [publicKey, connected]);
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Shield className="h-12 w-12 text-emerald-600" />
        </div>
        <CardTitle className="text-2xl">Leofolio</CardTitle>
        <CardDescription>
          Privacy-preserving credential management and hiring platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="freelancer"
          onValueChange={(value) =>
            setSelectedType(value as 'freelancer' | 'employer')
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="freelancer">Freelancer</TabsTrigger>
            <TabsTrigger value="employer">employer</TabsTrigger>
          </TabsList>
          <TabsContent value="freelancer" className="mt-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
              <User className="h-10 w-10 text-emerald-600 p-2 bg-emerald-100 rounded-full" />
              <div>
                <h3 className="font-medium text-emerald-700">
                  Freelancer Account
                </h3>
                <p className="text-sm text-slate-600">
                  Manage credentials and get hired privately
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                Store credentials with privacy
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                Generate zero-knowledge proofs
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                Receive private payments
              </li>
            </ul>
          </TabsContent>
          <TabsContent value="employer" className="mt-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Briefcase className="h-10 w-10 text-blue-600 p-2 bg-blue-100 rounded-full" />
              <div>
                <h3 className="font-medium text-blue-700">employer Account</h3>
                <p className="text-sm text-slate-600">
                  Discover and hire verified freelancers
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Verify freelancer credentials privately
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Make secure payments
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Manage projects and contractors
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        {connected ? (
          <Button
            disabled
            className={`w-full ${
              selectedType === 'freelancer'
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Connected
          </Button>
        ) : (
          <>
            {loading || connecting ? (
              <>
                <Button
                  disabled
                  className={`w-full ${
                    selectedType === 'freelancer'
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  loading...
                </Button>
              </>
            ) : (
              <WalletMultiButton
                className={`w-full !text-center !flex !items-center !justify-center ${
                  selectedType === 'freelancer'
                    ? '!bg-emerald-600 hover:!bg-emerald-700'
                    : '!bg-blue-600 hover:!bg-blue-700'
                }`}
              >
                <span> Connect Wallet</span>{' '}
              </WalletMultiButton>
            )}
          </>
        )}{' '}
      </CardFooter>
    </Card>
  );
}
