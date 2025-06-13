'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { useConnect, useAccount, useDisconnect, Network } from '@puzzlehq/sdk';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, WalletCards, PlusCircle, Copy } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const ESCROW_PROGRAM_ID = 'escrow_contract.aleo';

export function EscrowWallet() {
  const { account } = useAccount();
  const [balance, setBalance] = useState<number>(0);
  const [fundingAmount, setFundingAmount] = useState<string>('');
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [lastBalanceFetchTime, setLastBalanceFetchTime] = useState<Date | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<'freelancer' | 'employer'>(
    'freelancer'
  );
  const [sendAmount, setSendAmount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // --- Fetch Balance Logic (Simulated - Returns 0) ---
  // Effect: Simulates fetching the escrow balance, always returning 0 for now.
  // Input: account, account adapter instance
  // Output: Sets the balance state to 0 or displays an error toast.
  const fetchBalance = useCallback(async () => {
    if (!account || !account) {
      setBalance(0); // Reset to 0 if disconnected
      return;
    }

    setIsLoadingBalance(true);
    setBalance(0); // Clear previous balance while loading

    try {
      // Simulate network delay - replace with actual logic when available
      console.log(
        `Simulating balance fetch for address: ${account} - Returning 0`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Shorter delay for simulation

      // Set balance to 0 as requested, indicating fetch completed
      setBalance(0);
      setLastBalanceFetchTime(new Date());
    } catch (error) {
      console.error('Error during simulated balance fetch:', error);
      toast({
        title: 'Balance Fetch Failed',
        description: 'Could not simulate balance retrieval.',
        variant: 'destructive'
      });
      setBalance(0); // Ensure balance is 0 on error
    } finally {
      setIsLoadingBalance(false);
    }
  }, [account, account]);

  // Fetch balance on initial load and when account changes
  useEffect(() => {
    // Only fetch if account is present
    if (account) {
      fetchBalance();
    } else {
      // If user disconnects, immediately set balance to 0 without "loading"
      setBalance(0);
      setIsLoadingBalance(false);
      setLastBalanceFetchTime(null);
    }
  }, [account, fetchBalance]); // Rerun when account or fetchBalance changes

  // --- Fund Account Logic ---
  // Effect: Initiates a transaction to fund the user's escrow account.
  // Input: fundingAmount (string)
  // Output: Calls requestTransaction or displays an error toast.
  const handleFundAccount = async () => {
    if (!account || !account) {
      toast({
        title: 'account Not Connected',
        description: 'Please connect your account to fund your account.',
        variant: 'destructive'
      });
      return;
    }
    // if (!requestTransaction) {
    //   toast({
    //     title: 'account Error',
    //     description: 'Request Transaction function not available.',
    //     variant: 'destructive'
    //   });
    //   return;
    // }

    const amountMicrocredits = parseInt(fundingAmount, 10);
    if (isNaN(amountMicrocredits) || amountMicrocredits <= 0) {
      toast({
        title: 'Invalid Amount',
        description:
          'Please enter a valid positive amount to fund (microcredits).',
        variant: 'destructive'
      });
      return;
    }

    setIsFunding(true);
    try {
      // IMPORTANT: Adjust fee as needed. This is a placeholder.
      // You might need a fee record or a dynamic fee estimation strategy.
      const feeInMicrocredits = 1000000;

      // const aleoTransaction = Transaction.createTransaction(
      //    accountAdapterNetwork.TestnetBeta, // Ensure this matches your contract deployment network
      //   ESCROW_PROGRAM_ID,
      //   'fund_account', // Transition function from escrow_contract.aleo
      //   [`${amountMicrocredits}u64`], // Input argument(s) as strings
      //   feeInMicrocredits
      //   // undefined, // feeRecord - Pass undefined if not providing a specific record
      // );

      // console.log('Requesting funding transaction:', aleoTransaction);
      // const txId = await requestTransaction(aleoTransaction);
      // console.log('Transaction ID:', txId);

      // if (txId) {
      //   toast({
      //     title: 'Funding Transaction Sent',
      //     description: `Transaction ID: ${txId.substring(
      //       0,
      //       20
      //     )}... Monitor your account or explorer for confirmation.`,
      //     action: (
      //       <a
      //         href={`https://explorer.aleo.org/transaction/${txId}`} // Adjust explorer URL if needed (e.g., testnet3.aleo.network)
      //         target="_blank"
      //         rel="noopener noreferrer"
      //         className="ml-2 underline"
      //       >
      //         View on Explorer
      //       </a>
      //     )
      //   });
      //   setFundingAmount(''); // Clear input on success
      //   // Optionally, trigger a simulated balance refresh after a delay
      //   // Note: This won't show the *actual* new balance yet.
      //   setTimeout(fetchBalance, 7000); // Refresh balance simulation after 7s
      // } else {
      //   toast({
      //     title: 'Transaction Not Broadcast',
      //     description: 'The transaction was likely cancelled in the account.',
      //     variant: 'destructive'
      //   });
      // }
    } catch (e) {
      console.error('Funding error:', e);
      let description = 'An unknown error occurred during funding.';
      // if (e instanceof accountNotConnectedError) {
      //   description = 'account disconnected. Please reconnect.';
      // } else if (e instanceof Error) {
      //   // Attempt to provide a more specific error if possible
      //   description = e.message.includes('rejected')
      //     ? 'Transaction rejected by user in account.'
      //     : e.message;
      // }
      toast({
        title: 'Funding Failed',
        description: description,
        variant: 'destructive'
      });
    } finally {
      setIsFunding(false);
    }
  };

  const copyAddress = () => {
    if (account) {
      navigator.clipboard.writeText(account.address);
      toast({
        title: 'Address Copied',
        description: 'account address copied to clipboard.'
      });
    }
  };

  const handleSend = async () => {
    if (!account) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to send funds.',
        variant: 'destructive'
      });
      return;
    }

    const amount = parseFloat(sendAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to send.',
        variant: 'destructive'
      });
      return;
    }

    if (!recipientAddress) {
      toast({
        title: 'Invalid Address',
        description: 'Please enter a valid recipient address.',
        variant: 'destructive'
      });
      return;
    }

    setIsSending(true);
    try {
      // Implement send logic here
      toast({
        title: 'Transaction Sent',
        description: 'Your transaction has been submitted.'
      });
      setSendAmount('');
      setRecipientAddress('');
      setTimeout(fetchBalance, 2000);
    } catch (error) {
      toast({
        title: 'Transaction Failed',
        description: 'Failed to send transaction. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Card className="w-full shadow-lg bg-white backdrop-blur-sm border border-blue-100 rounded-2xl overflow-hidden">
      <CardHeader className="pb-4 border-b border-blue-100/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <WalletCards className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl font-semibold text-gray-800">
                Leofolio Wallet
              </CardTitle>
              <CardDescription className="text-gray-500 text-sm mt-0.5">
                {ESCROW_PROGRAM_ID}
              </CardDescription>
            </div>
          </div>
          {account && (
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-200 px-3 py-1"
            >
              Connected
            </Badge>
          )}
          {!account && (
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 border-red-200 px-3 py-1"
            >
              Disconnected
            </Badge>
          )}
        </div>
      </CardHeader>

      <div className="flex border-b border-blue-100/50">
        <button
          onClick={() => setActiveTab('freelancer')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'freelancer'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Freelancer Wallet
        </button>
        <button
          onClick={() => setActiveTab('employer')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'employer'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Employer Escrow
        </button>
      </div>

      <CardContent className="space-y-6 p-6">
        {/* Address Display */}
        {account && (
          <div className="space-y-2">
            <Label
              htmlFor="accountAddress"
              className="text-gray-700 text-sm font-medium"
            >
              Wallet Address
            </Label>
            <div className="flex items-center gap-2 p-3 border rounded-xl bg-gray-50/80 text-sm font-mono break-all group hover:bg-gray-100/80 transition-colors">
              <span id="accountAddress" className="flex-1 text-gray-600">
                {account.address}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAddress}
                aria-label="Copy address"
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-200/50"
              >
                <Copy className="h-4 w-4 text-gray-500" />
              </Button>
            </div>
          </div>
        )}

        {/* Balance Display */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-gray-700 text-sm font-medium">Balance</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchBalance}
              disabled={isLoadingBalance || !account}
              className="text-xs gap-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100/50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  isLoadingBalance ? 'animate-spin' : ''
                }`}
              />
              Refresh
            </Button>
          </div>
          {isLoadingBalance && account && (
            <Skeleton className="h-16 w-full rounded-xl bg-gray-100" />
          )}
          {!isLoadingBalance && account && (
            <div className="p-4 border rounded-xl bg-gradient-to-br from-white to-blue-50/80 shadow-sm">
              <div className="text-4xl font-bold text-gray-800">
                {balance.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 mt-1">microALE</div>
            </div>
          )}
          {!account && (
            <div className="text-center text-gray-500 p-4 border rounded-xl border-dashed h-16 flex items-center justify-center bg-gray-50/50">
              Connect wallet to view balance
            </div>
          )}
        </div>

        {activeTab === 'freelancer' && account && (
          <div className="space-y-4 pt-4 border-t border-blue-100/50">
            <div className="space-y-3">
              <Label
                htmlFor="sendAmount"
                className="text-gray-700 text-sm font-medium"
              >
                Send Funds
              </Label>
              <div className="space-y-2">
                <Input
                  id="sendAmount"
                  type="number"
                  placeholder="Amount to send"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  disabled={isSending}
                  className="bg-white border-gray-200 focus:border-blue-500 rounded-xl h-11"
                />
                <Input
                  type="text"
                  placeholder="Recipient Address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  disabled={isSending}
                  className="bg-white border-gray-200 focus:border-blue-500 rounded-xl h-11"
                />
                <Button
                  onClick={handleSend}
                  disabled={isSending || !sendAmount || !recipientAddress}
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11"
                >
                  {isSending ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <PlusCircle className="h-4 w-4" />
                  )}
                  Send
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'employer' && account && (
          <div className="space-y-3 pt-4 border-t border-blue-100/50">
            <Label
              htmlFor="fundingAmount"
              className="text-gray-700 text-sm font-medium"
            >
              Fund Escrow Account
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="fundingAmount"
                type="number"
                placeholder="Enter amount in microcredits"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                disabled={isFunding || !account}
                min="1"
                className="bg-white border-gray-200 focus:border-blue-500 rounded-xl h-11"
              />
              <Button
                onClick={handleFundAccount}
                disabled={
                  isFunding ||
                  !fundingAmount ||
                  !account ||
                  parseInt(fundingAmount, 10) <= 0
                }
                className="gap-2 shrink-0 bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-11 px-4"
              >
                {isFunding ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                Fund
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              Add funds to your escrow balance. Transaction fees apply.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
