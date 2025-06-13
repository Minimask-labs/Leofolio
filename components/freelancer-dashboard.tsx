'use client';
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentManager } from './payment-manager';
import { ProofGenerator } from './proof-generator';
import { Header } from './header';
import { DevfolioView } from './devfolio-view';
import { AvailableProjects } from './available-projects';
import { MyProjects } from './my-projects';
import { EscrowWallet } from './wallet/escrow-wallet';

interface FreelancerDashboardProps {
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

export function FreelancerDashboard({
  connected,
  setConnected
}: FreelancerDashboardProps) {
  const [profile, setProfile] = useState({
    fullName: '',
    username: '',
    profileImage: ' ',
    professionalTitle: 'Senior Blockchain Developer',
    bio: 'Experienced blockchain developer specializing in smart contracts and DeFi applications. Passionate about open source and decentralized tech.',
    location: 'San Francisco, CA',
    skills: ['Solidity', 'React', 'Node.js', 'Web3.js'],
    socials: {
      twitter: 'janedoe',
      linkedin: 'janedoe-linkedin',
      github: 'janedoe',
      instagram: 'janedoe_insta',
      website: 'https://janedoe.dev'
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Header />
      <div className="container mx-auto max-w-7xl">
        <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="w-full col-span-4">
            <Tabs defaultValue="devfolio" className="mt-8">
              <TabsList className="grid w-full grid-cols-2 p-1 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
                <TabsTrigger
                  value="devfolio"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
                >
                  Devfolio
                </TabsTrigger>
                <TabsTrigger
                  value="my-projects"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
                >
                  My Projects
                </TabsTrigger>
                {/* <TabsTrigger value="available-projects">Available Projects</TabsTrigger> */}
                {/* <TabsTrigger value="payments">Payments</TabsTrigger> */}
                {/* <TabsTrigger value="proofs">Generate Proofs</TabsTrigger> */}
              </TabsList>
              <TabsContent value="devfolio" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
                  <DevfolioView />
                </div>
              </TabsContent>
              <TabsContent value="my-projects" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
                  <MyProjects />
                </div>
              </TabsContent>
              <TabsContent value="available-projects" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
                  <AvailableProjects />
                </div>
              </TabsContent>
              <TabsContent value="payments" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
                  <PaymentManager />
                </div>
              </TabsContent>
              <TabsContent value="proofs" className="mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100 p-6">
                  <ProofGenerator />
                </div>
              </TabsContent>
            </Tabs>{' '}
          </div>
          <div className="w-full col-span-2 pt-20">
            <EscrowWallet />
          </div>
        </div>
      </div>
    </div>
  );
}
