"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FreelancerDirectory } from "./employee/freelancer-directory";
import { InvoicePayment } from "./employee/invoice-payment";
import { ProjectManagement } from "./employee/project-management";
import { Header } from "./header";
import { EscrowWallet } from "./wallet/escrow-wallet";

interface EmployeeDashboardProps {
  connected: boolean;
  setConnected: (connected: boolean) => void;
}

export function EmployeeDashboard({
  connected,
  setConnected,
}: EmployeeDashboardProps) {
  return (
    <div className="">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-center md:justify-start">
          <EscrowWallet />
        </div>
        {/* <Tabs defaultValue="directory" className="mt-8"> */}
        <ProjectManagement />

        {/* <Tabs defaultValue="directory" className="mt-8">

          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="directory">Find Freelancers</TabsTrigger>
             <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="directory" className="mt-6">
            <FreelancerDirectory />
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <ProjectManagement />
          </TabsContent>
        </Tabs> */}
      </div>
    </div>
  );
}
