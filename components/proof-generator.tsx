'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Check, Copy, Shield } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ProofGenerator() {
  const [proofType, setProofType] = useState('skills');
  const [generatedProof, setGeneratedProof] = useState('');

  const generateProof = () => {
    // In a real implementation, this would create a zero-knowledge proof
    // using Aleo's cryptographic primitives

    // Simulate proof generation with a shorter example proof
    setTimeout(() => {
      setGeneratedProof(
        'proof1qyqsqzgex0wjzanku9q9wz3vk8yeahs9v90ghuv4ks8qt4tg4c4u4xvnc4vxm2rzn4fk0t7vmc8c24j3tnqnyv07kzzkgm5cq3v0nq9q9qyqsyqsrzjfkta4vrxgeskfa9v0nz3vscvrzd3sxgarzd3jxgarjd3jxgc'
      );

      toast({
        title: 'Proof Generated',
        description: 'Your zero-knowledge proof has been created successfully'
      });
    }, 1500);
  };

  const copyProof = () => {
    navigator.clipboard.writeText(generatedProof);
    toast({
      title: 'Copied to Clipboard',
      description: 'The proof has been copied to your clipboard'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Generate Zero-Knowledge Proofs
        </h2>
        <p className="text-slate-600">
          Create verifiable proofs of your credentials without revealing
          sensitive information.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Privacy-Preserving Verification</AlertTitle>
        <AlertDescription>
          Zero-knowledge proofs allow you to prove facts about your credentials
          without revealing the actual data.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Create New Proof</CardTitle>
          <CardDescription>
            Select what you want to prove about your credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="proofType">Proof Type</Label>
            <Select value={proofType} onValueChange={setProofType}>
              <SelectTrigger>
                <SelectValue placeholder="Select proof type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="skills">Skills Verification</SelectItem>
                <SelectItem value="experience">Years of Experience</SelectItem>
                <SelectItem value="certification">
                  Certification Ownership
                </SelectItem>
                <SelectItem value="education">Education Level</SelectItem>
                <SelectItem value="income">Income Range</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {proofType === 'skills' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Skills to Prove</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="react" />
                    <label
                      htmlFor="react"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      React
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="typescript" />
                    <label
                      htmlFor="typescript"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      TypeScript
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="node" />
                    <label
                      htmlFor="node"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Node.js
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="graphql" />
                    <label
                      htmlFor="graphql"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      GraphQL
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Recipient (Optional)</Label>
                <Input
                  id="recipient"
                  placeholder="e.g. client@example.com or Aleo address"
                />
                <p className="text-xs text-slate-500">
                  Who will be verifying this proof?
                </p>
              </div>
            </div>
          )}

          {proofType === 'experience' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Prove Experience Level</Label>
                <Select defaultValue="3plus">
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1plus">1+ years</SelectItem>
                    <SelectItem value="3plus">3+ years</SelectItem>
                    <SelectItem value="5plus">5+ years</SelectItem>
                    <SelectItem value="10plus">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="field">In Field</Label>
                <Input id="field" placeholder="e.g. Web Development" />
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Reset</Button>
          <Button
            onClick={generateProof}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Generate Zero-Knowledge Proof
          </Button>
        </CardFooter>
      </Card>

      {generatedProof && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Generated Proof</CardTitle>
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                <Shield className="h-3 w-3 mr-1" />
                Zero-Knowledge
              </Badge>
            </div>
            <CardDescription>
              Share this proof with anyone who needs to verify your credentials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 p-3 rounded-md border relative">
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap break-all">
                {generatedProof}
              </pre>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={copyProof}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <Check className="h-4 w-4 mr-1" />
              This proof can be verified without revealing your private data
            </div>
          </CardContent>
          <CardFooter>
            <div className="text-sm text-slate-500">
              <p>Proof generated on {new Date().toLocaleString()}</p>
              <p>Valid for 30 days</p>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
