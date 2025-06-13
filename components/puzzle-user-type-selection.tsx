'use client';

import { useEffect, useState } from 'react';
import {
  useConnect,
  useAccount,
  useDisconnect,
  useRequestSignature,
  Network
} from '@puzzlehq/sdk';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

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
          'escrow_contract11.aleo',
          'escrow_contract_beta.aleo'
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
      toast({
        title: 'Error ',
        description: `Connection error: ${connectError}`,
        variant: 'destructive'
      });

      // toast.error(`Connection error: ${connectError}`);
      setIsProcessing(false);
      setCurrentStep('idle');
    }

    if (requestSignatureError) {
      toast({
        title: 'Error ',
        description: `Signature error: ${requestSignatureError}`,
        variant: 'destructive'
      });

      // toast.error(`Signature error: ${requestSignatureError}`);
      setIsProcessing(false);
      setCurrentStep('idle');
    }
  }, [connectError, requestSignatureError]);
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
          toast({
            title: 'success',
            description: response.message || 'Login successful',
            variant: 'default'
          });

          // toast.success(response.message || 'Login successful');

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
        toast({
          title: 'Error ',
          description: `${errorMessage}`,
          variant: 'destructive'
        });

        // toast.error(errorMessage);
      } finally {
        setIsProcessing(false);
        setCurrentStep('idle');
      }
    } else {
      await requestSignature();
    }
  };
  // Handle signature response
  useEffect(() => {
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
        await new Promise((resolve) => setTimeout(resolve, 100));

        // After connection, request signature
        if (account?.address) {
          setCurrentStep('signing');
          await requestSignature();
        }
      }
    } catch (error) {
      console.error('Authentication flow error:', error);
      toast({
        title: 'Error ',
        description: `Authentication process failed`,
        variant: 'destructive'
      });

      // toast.error('Authentication process failed');
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
  // useEffect(() => {
  //   // Check if wallet is already connected but user is not logged in
  //   const attemptAutoLogin = async () => {
  //     // Only attempt auto-login if wallet is connected and we're not already processing
  //     if (account?.address && !isProcessing && currentStep === 'idle') {
  //       console.log('Wallet already connected, attempting auto-login');
  //       // Don't set isProcessing here to avoid UI changes until user clicks the button
  //       // This just prepares for a faster login when they do click
  //       handleAuthentication();
  //     }
  //   };

  //   attemptAutoLogin();
  // }, [account, isProcessing, currentStep]);

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
    <Card className="w-full max-w-md mx-auto shadow-lg border-0  bg-white">
      <CardHeader className="text-center space-y-4 pb-8">
        <div className="relative">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Leofolio
          </CardTitle>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-blue-600 rounded-full"></div>
        </div>
        <CardDescription className="text-base text-slate-600">
          Privacy-preserving credential management and hiring platform
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs
          defaultValue="freelancer"
          onValueChange={(value) =>
            setSelectedType(value as 'freelancer' | 'employer')
          }
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 p-1 bg-blue-50/50 rounded-xl">
            <TabsTrigger
              value="freelancer"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg transition-all duration-200"
            >
              Freelancer
            </TabsTrigger>
            <TabsTrigger
              value="employer"
              className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-700 rounded-lg transition-all duration-200"
            >
              Employer
            </TabsTrigger>
          </TabsList>

          <TabsContent value="freelancer" className="mt-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-200">
              <div className="p-3 bg-blue-100 rounded-full">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-700">
                  Freelancer Account
                </h3>
                <p className="text-sm text-slate-600">
                  Manage credentials and get hired privately
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 p-2 rounded-lg bg-blue-50/50 group  transition-colors duration-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700 transition-colors duration-200">
                  Store credentials with privacy
                </span>
              </li>
              <li className="flex items-center gap-3 p-2 rounded-lg bg-blue-50/50 group  transition-colors duration-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700 transition-colors duration-200">
                  Generate zero-knowledge proofs
                </span>
              </li>
              <li className="flex items-center gap-3 p-2 rounded-lg bg-blue-50/50 group  transition-colors duration-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700 transition-colors duration-200">
                  Receive private payments
                </span>
              </li>
            </ul>
          </TabsContent>

          <TabsContent value="employer" className="mt-6 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-blue-100 hover:shadow-md transition-all duration-200">
              <div className="p-3 bg-blue-100 rounded-full">
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-blue-700">
                  Employer Account
                </h3>
                <p className="text-sm text-slate-600">
                  Discover and hire verified freelancers
                </p>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3 p-2 rounded-lg bg-blue-50/50 group  transition-colors duration-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700 transition-colors duration-200">
                  Verify freelancer credentials privately
                </span>
              </li>
              <li className="flex items-center gap-3 p-2 rounded-lg bg-blue-50/50 group  transition-colors duration-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700 transition-colors duration-200">
                  Make secure payments
                </span>
              </li>
              <li className="flex items-center gap-3 p-2 rounded-lg bg-blue-50/50 group  transition-colors duration-200">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="text-slate-700 transition-colors duration-200">
                  Manage projects and contractors
                </span>
              </li>
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="pt-6">
        <Button
          onClick={handleAuthentication}
          disabled={isProcessing}
          className={`w-full py-6 text-base font-medium rounded-xl transition-all duration-200 ${
            selectedType === 'freelancer'
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'
          } shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isProcessing && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
          {getButtonText()}
        </Button>
      </CardFooter>
    </Card>
  );
}
