'use client';

import type React from 'react';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface EmailVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  onVerify: (otp: string) => Promise<void>;
  isLoading: boolean;
}

export function EmailVerificationModal({
  isOpen,
  onClose,
  email,
  onVerify,
  isLoading
}: EmailVerificationModalProps) {
  const [otp, setOtp] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.trim()) {
      await onVerify(otp);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Your Email</DialogTitle>
          <DialogDescription>
            We've sent a verification code to {email}. Please enter the code
            below to verify your email address.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              id="otp"
              placeholder="Enter verification code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-lg tracking-widest"
              maxLength={6}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!otp.trim() || isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify Email'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
