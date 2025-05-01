"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError,
} from "@demox-labs/aleo-wallet-adapter-base";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, WalletCards, PlusCircle, Copy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const ESCROW_PROGRAM_ID = "escrow_contract.aleo";

export function EscrowWallet() {
  const { publicKey, wallet, requestTransaction } = useWallet();
  // Initialize balance to 0 as requested
  const [balance, setBalance] = useState<number>(0);
  const [fundingAmount, setFundingAmount] = useState<string>("");
  const [isLoadingBalance, setIsLoadingBalance] = useState<boolean>(false);
  const [isFunding, setIsFunding] = useState<boolean>(false);
  const [lastBalanceFetchTime, setLastBalanceFetchTime] = useState<Date | null>(
    null
  );

  // --- Fetch Balance Logic (Simulated - Returns 0) ---
  // Effect: Simulates fetching the escrow balance, always returning 0 for now.
  // Input: publicKey, wallet adapter instance
  // Output: Sets the balance state to 0 or displays an error toast.
  const fetchBalance = useCallback(async () => {
    if (!publicKey || !wallet) {
      setBalance(0); // Reset to 0 if disconnected
      return;
    }

    setIsLoadingBalance(true);
    setBalance(0); // Clear previous balance while loading

    try {
      // Simulate network delay - replace with actual logic when available
      console.log(
        `Simulating balance fetch for address: ${publicKey} - Returning 0`
      );
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Shorter delay for simulation

      // Set balance to 0 as requested, indicating fetch completed
      setBalance(0);
      setLastBalanceFetchTime(new Date());
    } catch (error) {
      console.error("Error during simulated balance fetch:", error);
      toast({
        title: "Balance Fetch Failed",
        description: "Could not simulate balance retrieval.",
        variant: "destructive",
      });
      setBalance(0); // Ensure balance is 0 on error
    } finally {
      setIsLoadingBalance(false);
    }
  }, [publicKey, wallet]);

  // Fetch balance on initial load and when publicKey changes
  useEffect(() => {
    // Only fetch if publicKey is present
    if (publicKey) {
      fetchBalance();
    } else {
      // If user disconnects, immediately set balance to 0 without "loading"
      setBalance(0);
      setIsLoadingBalance(false);
      setLastBalanceFetchTime(null);
    }
  }, [publicKey, fetchBalance]); // Rerun when publicKey or fetchBalance changes

  // --- Fund Account Logic ---
  // Effect: Initiates a transaction to fund the user's escrow account.
  // Input: fundingAmount (string)
  // Output: Calls requestTransaction or displays an error toast.
  const handleFundAccount = async () => {
    if (!publicKey || !wallet) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to fund your account.",
        variant: "destructive",
      });
      return;
    }
    if (!requestTransaction) {
      toast({
        title: "Wallet Error",
        description: "Request Transaction function not available.",
        variant: "destructive",
      });
      return;
    }

    const amountMicrocredits = parseInt(fundingAmount, 10);
    if (isNaN(amountMicrocredits) || amountMicrocredits <= 0) {
      toast({
        title: "Invalid Amount",
        description:
          "Please enter a valid positive amount to fund (microcredits).",
        variant: "destructive",
      });
      return;
    }

    setIsFunding(true);
    try {
      // IMPORTANT: Adjust fee as needed. This is a placeholder.
      // You might need a fee record or a dynamic fee estimation strategy.
      const feeInMicrocredits = 1000000;

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta, // Ensure this matches your contract deployment network
        ESCROW_PROGRAM_ID,
        "fund_account", // Transition function from escrow_contract.aleo
        [`${amountMicrocredits}u64`], // Input argument(s) as strings
        feeInMicrocredits
        // undefined, // feeRecord - Pass undefined if not providing a specific record
      );

      console.log("Requesting funding transaction:", aleoTransaction);
      const txId = await requestTransaction(aleoTransaction);
      console.log("Transaction ID:", txId);

      if (txId) {
        toast({
          title: "Funding Transaction Sent",
          description: `Transaction ID: ${txId.substring(
            0,
            20
          )}... Monitor your wallet or explorer for confirmation.`,
          action: (
            <a
              href={`https://explorer.aleo.org/transaction/${txId}`} // Adjust explorer URL if needed (e.g., testnet3.aleo.network)
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 underline"
            >
              View on Explorer
            </a>
          ),
        });
        setFundingAmount(""); // Clear input on success
        // Optionally, trigger a simulated balance refresh after a delay
        // Note: This won't show the *actual* new balance yet.
        setTimeout(fetchBalance, 7000); // Refresh balance simulation after 7s
      } else {
        toast({
          title: "Transaction Not Broadcast",
          description: "The transaction was likely cancelled in the wallet.",
          variant: "destructive",
        });
      }
    } catch (e) {
      console.error("Funding error:", e);
      let description = "An unknown error occurred during funding.";
      if (e instanceof WalletNotConnectedError) {
        description = "Wallet disconnected. Please reconnect.";
      } else if (e instanceof Error) {
        // Attempt to provide a more specific error if possible
        description = e.message.includes("rejected")
          ? "Transaction rejected by user in wallet."
          : e.message;
      }
      toast({
        title: "Funding Failed",
        description: description,
        variant: "destructive",
      });
    } finally {
      setIsFunding(false);
    }
  };

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg bg-card/80 backdrop-blur-sm border border-border/20 rounded-xl">
      <CardHeader>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <WalletCards className="h-6 w-6 text-primary" />
            <CardTitle className="text-xl font-semibold">
              Escrow Wallet
            </CardTitle>
          </div>
          {publicKey && <Badge variant="secondary">Connected</Badge>}
          {!publicKey && <Badge variant="destructive">Disconnected</Badge>}
        </div>
        <CardDescription>
          Manage funds within the AleoFolio escrow contract ({ESCROW_PROGRAM_ID}
          ).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Address Display */}
        {publicKey && (
          <div className="space-y-1">
            <Label htmlFor="walletAddress">Your Wallet Address</Label>
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50 text-sm font-mono break-all">
              <span id="walletAddress" className="flex-1">
                {publicKey}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyAddress}
                aria-label="Copy address"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Balance Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Escrow Balance (microcredits)</Label>
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchBalance}
              disabled={isLoadingBalance || !publicKey}
              className="text-xs gap-1"
            >
              <RefreshCw
                className={`h-3 w-3 ${isLoadingBalance ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
          {isLoadingBalance && publicKey && (
            <Skeleton className="h-10 w-full rounded-md" />
          )}
          {!isLoadingBalance && publicKey && (
            <div className="text-3xl font-bold p-3 border rounded-md bg-gradient-to-r from-background to-muted/30">
              {/* Render 0 as requested, even after "fetch" */}
              {balance.toLocaleString()}{" "}
              <span className="text-base font-normal text-muted-foreground">
                microALE
              </span>
              O
            </div>
          )}
          {!publicKey && (
            <div className="text-center text-muted-foreground p-3 border rounded-md border-dashed h-10 flex items-center justify-center">
              Connect wallet to view balance.
            </div>
          )}
          {lastBalanceFetchTime && !isLoadingBalance && publicKey && (
            <p className="text-xs text-muted-foreground text-right">
              Balance displayed as 0 (last check:{" "}
              {lastBalanceFetchTime.toLocaleTimeString()})
            </p>
          )}
        </div>

        {/* Funding Section */}
        {publicKey && (
          <div className="space-y-2 pt-4 border-t">
            <Label htmlFor="fundingAmount">Fund Your Escrow Account</Label>
            <div className="flex items-center gap-2">
              <Input
                id="fundingAmount"
                type="number"
                placeholder="Microcredits (e.g., 1000000)"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                disabled={isFunding || !publicKey}
                min="1"
              />
              <Button
                onClick={handleFundAccount}
                disabled={
                  isFunding ||
                  !fundingAmount ||
                  !publicKey ||
                  parseInt(fundingAmount, 10) <= 0
                }
                className="gap-2 shrink-0"
              >
                {isFunding ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <PlusCircle className="h-4 w-4" />
                )}
                Fund Escrow
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Initiates a transaction to add funds to your balance within the{" "}
              {ESCROW_PROGRAM_ID} contract. Requires transaction confirmation
              and network fees.
            </p>
          </div>
        )}
      </CardContent>
      {/* <CardFooter className="pt-4 text-xs text-muted-foreground">
            Note: Balance display is currently simulated (shows 0). Actual balance requires backend integration.
       </CardFooter> */}
    </Card>
  );
}
