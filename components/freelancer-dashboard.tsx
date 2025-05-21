"use client"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PaymentManager } from "./payment-manager"
import { ProofGenerator } from "./proof-generator"
import { Header } from "./header"
import { DevfolioView } from "./devfolio-view"
import { AvailableProjects } from "./available-projects"
import { MyProjects } from "./my-projects"

interface FreelancerDashboardProps {
  connected: boolean
  setConnected: (connected: boolean) => void
}

export function FreelancerDashboard({ connected, setConnected }: FreelancerDashboardProps) {
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
    <div className=" ">
      <Header
      />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="devfolio" className="mt-8">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="devfolio">Devfolio</TabsTrigger>
            <TabsTrigger value="my-projects">My Projects</TabsTrigger>
            {/* <TabsTrigger value="available-projects">Available Projects</TabsTrigger> */}
            {/* <TabsTrigger value="payments">Payments</TabsTrigger> */}
            {/* <TabsTrigger value="proofs">Generate Proofs</TabsTrigger> */}
          </TabsList>
          <TabsContent value="devfolio" className="mt-6">
            <DevfolioView />
          </TabsContent>
          <TabsContent value="my-projects" className="mt-6">
            <MyProjects />
          </TabsContent>
          <TabsContent value="available-projects" className="mt-6">
            <AvailableProjects />
          </TabsContent>
          <TabsContent value="payments" className="mt-6">
            <PaymentManager />
          </TabsContent>
          <TabsContent value="proofs" className="mt-6">
            <ProofGenerator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

