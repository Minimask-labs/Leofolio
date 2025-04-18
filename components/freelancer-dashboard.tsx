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
    name: "Alex Morgan",
    username: "alexmorgan",
    title: "Full Stack Developer",
    bio: "A Frontend Developer & Design Enthusiast. I work with web technologies, making interactive user interfaces, exploring the JavaScript ecosystem.",
    location: "San Francisco, CA",
    skills: ["JavaScript", "React", "Node.js", "GraphQL", "TypeScript"],
    github: "https://github.com/alexmorgan",
    linkedin: "https://linkedin.com/in/alexmorgan",
    twitter: "https://twitter.com/alexmorgan",
    instagram: "",
    website: "https://alexmorgan.dev",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <Header connected={connected} setConnected={setConnected} userType="freelancer" />

      <Tabs defaultValue="devfolio" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="devfolio">Devfolio</TabsTrigger>
          <TabsTrigger value="my-projects">My Projects</TabsTrigger>
          {/* <TabsTrigger value="available-projects">Available Projects</TabsTrigger> */}
          <TabsTrigger value="payments">Payments</TabsTrigger>
          {/* <TabsTrigger value="proofs">Generate Proofs</TabsTrigger> */}
        </TabsList>
        <TabsContent value="devfolio" className="mt-6">
          <DevfolioView profile={profile} setProfile={setProfile} />
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
  )
}

