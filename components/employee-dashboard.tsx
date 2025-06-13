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
    <div className=" w-full">
      <Header />
      <div className="container mx-auto w-full px-4 py-8">
        <div className="w-full grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="w-full col-span-4">
            <ProjectManagement />
          </div>
          <div className="w-full col-span-2">
            <EscrowWallet />
          </div>
        </div>
      </div>
    </div>
  );
}
