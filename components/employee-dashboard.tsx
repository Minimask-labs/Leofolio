"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FreelancerDirectory } from "./employee/freelancer-directory"
import { InvoicePayment } from "./employee/invoice-payment"
import { ProjectManagement } from "./employee/project-management"
import { Header } from "./header"

interface EmployeeDashboardProps {
  connected: boolean
  setConnected: (connected: boolean) => void
}

export function EmployeeDashboard({ connected, setConnected }: EmployeeDashboardProps) {
  return (
    <div className="">
      <Header
        connected={connected}
        setConnected={setConnected}
        userType="employee"
      />
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="directory" className="mt-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="directory">Find Freelancers</TabsTrigger>
            <TabsTrigger value="invoices">Pay Invoices</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>
          <TabsContent value="directory" className="mt-6">
            <FreelancerDirectory />
          </TabsContent>
          <TabsContent value="invoices" className="mt-6">
            <InvoicePayment />
          </TabsContent>
          <TabsContent value="projects" className="mt-6">
            <ProjectManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

