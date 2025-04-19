'use client';

import { useState } from 'react';
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

interface UserTypeSelectionProps {
  onConnect: () => void;
  onSelectUserType: (type: 'freelancer' | 'employee') => void;
}

export function UserTypeSelection({
  onConnect,
  onSelectUserType
}: UserTypeSelectionProps) {
  const [selectedType, setSelectedType] = useState<'freelancer' | 'employee'>(
    'freelancer'
  );

  const handleConnect = () => {
    onSelectUserType(selectedType);
    onConnect();
  };

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
            setSelectedType(value as 'freelancer' | 'employee')
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="freelancer">Freelancer</TabsTrigger>
            <TabsTrigger value="employee">Employee</TabsTrigger>
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
          <TabsContent value="employee" className="mt-4 space-y-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
              <Briefcase className="h-10 w-10 text-blue-600 p-2 bg-blue-100 rounded-full" />
              <div>
                <h3 className="font-medium text-blue-700">Employee Account</h3>
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
          onClick={handleConnect}
          className={`w-full ${
            selectedType === 'freelancer'
              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          Connect Wallet
        </Button>
      </CardFooter>
    </Card>
  );
}
