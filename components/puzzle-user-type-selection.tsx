'use client';

import { useEffect, useState } from 'react';
import {
  useConnect,
  useAccount,
  useDisconnect,
  useRequestSignature,
  Network
} from '@puzzlehq/sdk';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
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
import { Shield, Briefcase, User, Loader2 } from 'lucide-react';
import { walletAuth } from '@/service/auth';
import { useStore } from '@/Store/user';

export function UserTypeSelection() {
  const [selectedType, setSelectedType] = useState<'freelancer' | 'employer'>(
    'freelancer'
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<
    'idle' | 'connecting' | 'signing' | 'authenticating'
  >('idle');

  const router = useRouter();

  // Zustand store hooks
  const { saveUserToken, saveUserData, saveUserType, loadUserData } =
    useStore();

  // Puzzle wallet hooks
  const { account } = useAccount();

  const {
    connect,
    error: connectError,
    loading: connectLoading
  } = useConnect({
    dAppInfo: {
      name: 'Leofolio',
      description:
        'Privacy-preserving credential management and hiring platform',
      iconUrl: '/leofolio_logo.png'
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
          'escrow_contract11.aleo','escrow_contract_beta.aleo'
        ]
      }
    }
  });

  const { disconnect } = useDisconnect();

  const {
    requestSignature,
    response: requestSignatureResponse,
    loading: requestSignatureLoading,
    error: requestSignatureError
  } = useRequestSignature({
    message: account?.address ?? 'Leofolio Authentication'
  });

  // Handle errors from wallet interactions
  useEffect(() => {
    if (connectError) {
      toast.error(`Connection error: ${connectError}`);
      setIsProcessing(false);
      setCurrentStep('idle');
    }

    if (requestSignatureError) {
      toast.error(`Signature error: ${requestSignatureError}`);
      setIsProcessing(false);
      setCurrentStep('idle');
    }
  }, [connectError, requestSignatureError]);

  // Handle signature response
  useEffect(() => {
    const handleSignatureResponse = async () => {
      // Process signature if available, regardless of currentStep to handle auto-login cases
      if (requestSignatureResponse?.signature && account?.address) {
        try {
          setCurrentStep('authenticating');

          const body = {
            walletAddress: account.address,
            signature: requestSignatureResponse.signature,
            role: selectedType,
            nonce: 'nonce' // Consider generating a proper nonce
          };

          const response = await walletAuth(body);

          if (response?.data) {
            // Save user data and token
            saveUserData(response);
            saveUserToken(response.data.token);
            saveUserType(response.data.user.role);

            // Navigate based on user role and new user status
            const isNewUser = response.data.isNewUser;
            const userRole = response.data.user.role;

            toast.success(response.message || 'Login successful');

            if (userRole === 'freelancer') {
              router.replace(
                isNewUser ? '/onboarding/freelancer' : '/freelancer'
              );
            } else if (userRole === 'employer') {
              router.replace(isNewUser ? '/onboarding/employer' : '/employer');
            }
          }
        } catch (error) {
          console.error('Authentication error:', error);
          const errorMessage =
            (error as any)?.response?.data?.message || 'Authentication failed';
          toast.error(errorMessage);
        } finally {
          setIsProcessing(false);
          setCurrentStep('idle');
        }
      }
    };

    handleSignatureResponse();
  }, [
    requestSignatureResponse,
    account,
    selectedType,
    router,
    saveUserData,
    saveUserToken,
    saveUserType
  ]);

  // Main authentication flow
  const handleAuthentication = async () => {
    if (isProcessing) return;

    setIsProcessing(true);

    try {
      // If account is already connected, skip to signature request
      if (account?.address) {
        setCurrentStep('signing');
        await requestSignature();
        // The signature response will be handled in the useEffect above
      } else {
        // Connect wallet first
        setCurrentStep('connecting');
        await connect();
        // Wait a moment for the connection to be established
        await new Promise((resolve) => setTimeout(resolve, 500));

        // After connection, request signature
        if (account?.address) {
          setCurrentStep('signing');
          await requestSignature();
        }
      }
    } catch (error) {
      console.error('Authentication flow error:', error);
      toast.error('Authentication process failed');
      setIsProcessing(false);
      setCurrentStep('idle');
    }
  };

  // Check if wallet is already connected on component mount and load user data
  useEffect(() => {
    loadUserData();

    // If wallet is already connected, update the button state
    if (account?.address) {
      console.log('Wallet already connected:', account.address);
    }
  }, [loadUserData, account]);

  // Auto-login if wallet is already connected
  useEffect(() => {
    // Check if wallet is already connected but user is not logged in
    const attemptAutoLogin = async () => {
      // Only attempt auto-login if wallet is connected and we're not already processing
      if (account?.address && !isProcessing && currentStep === 'idle') {
        console.log('Wallet already connected, attempting auto-login');
        // Don't set isProcessing here to avoid UI changes until user clicks the button
        // This just prepares for a faster login when they do click
      }
    };

    attemptAutoLogin();
  }, [account, isProcessing, currentStep]);

  // Button text based on current step
  const getButtonText = () => {
    switch (currentStep) {
      case 'connecting':
        return 'Connecting Wallet...';
      case 'signing':
        return 'Waiting for Signature...';
      case 'authenticating':
        return 'Authenticating...';
      default:
        return account
          ? 'Continue with Puzzle Wallet'
          : 'Connect Puzzle Wallet';
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle
          className={`text-2xl font-bold animate-pulse ${
            selectedType === 'employer' ? 'text-blue-700' : 'text-blue-700'
          }`}
        >
          Leofolio
        </CardTitle>
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
            <TabsTrigger value="employer">Employer</TabsTrigger>
          </TabsList>

          <TabsContent value="freelancer" className="mt-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <User className="h-10 w-10 text-blue-600 p-2 bg-blue-100 rounded-full" />
              <div>
                <h3 className="font-medium text-blue-700">
                  Freelancer Account
                </h3>
                <p className="text-sm text-slate-600">
                  Manage credentials and get hired privately
                </p>
              </div>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Store credentials with privacy
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Generate zero-knowledge proofs
              </li>
              <li className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                Receive private payments
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="employer" className="mt-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Briefcase className="h-10 w-10 text-blue-600 p-2 bg-blue-100 rounded-full" />
              <div>
                <h3 className="font-medium text-blue-700">Employer Account</h3>
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
        <Button
          onClick={handleAuthentication}
          disabled={isProcessing}
          className={`w-full ${
            selectedType === 'freelancer'
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isProcessing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
}
