"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { AlertCircle, Check, Clock, DollarSign, FileText, Shield } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function InvoicePayment() {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  // Mock invoice data
  const invoices = [
    {
      id: "INV-001",
      freelancer: "Alex Morgan",
      amount: 2550,
      currency: "USDC",
      date: "2023-07-15",
      dueDate: "2023-07-30",
      status: "pending",
      description: "Full Stack Development - July 2023",
      items: [
        { description: "Frontend Development", hours: 20, rate: 85, amount: 1700 },
        { description: "Backend API Integration", hours: 10, rate: 85, amount: 850 },
      ],
    },
    {
      id: "INV-002",
      freelancer: "Jamie Chen",
      amount: 1900,
      currency: "USDC",
      date: "2023-07-10",
      dueDate: "2023-07-25",
      status: "pending",
      description: "UI/UX Design - Dashboard Redesign",
      items: [
        { description: "User Research", hours: 8, rate: 95, amount: 760 },
        { description: "UI Design", hours: 12, rate: 95, amount: 1140 },
      ],
    },
    {
      id: "INV-003",
      freelancer: "Sam Wilson",
      amount: 1800,
      currency: "USDC",
      date: "2023-06-28",
      dueDate: "2023-07-12",
      status: "paid",
      description: "DevOps Consulting - CI/CD Pipeline Setup",
      items: [
        { description: "Infrastructure Setup", hours: 10, rate: 90, amount: 900 },
        { description: "Pipeline Configuration", hours: 10, rate: 90, amount: 900 },
      ],
    },
  ]

  const handlePayInvoice = (invoice: any) => {
    toast({
      title: "Payment Successful",
      description: `You've paid invoice ${invoice.id} to ${invoice.freelancer}.`,
    })
  }

  const handleVerifyInvoice = (invoice: any) => {
    toast({
      title: "Invoice Verified",
      description: "The invoice has been verified using zero-knowledge proofs.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Manage Invoices</h2>
        <p className="text-slate-600">Pay invoices from freelancers with privacy-preserving verification.</p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Private Payment System</AlertTitle>
        <AlertDescription>
          All payments are processed through Aleo's private payment system, ensuring confidentiality for both parties.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="all">All Invoices</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          <div className="space-y-4">
            {invoices
              .filter((inv) => inv.status === "pending")
              .map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <CardTitle>{invoice.id}</CardTitle>
                        </div>
                        <CardDescription>{invoice.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        {invoice.status === "pending" ? "Pending" : "Paid"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {invoice.freelancer
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{invoice.freelancer}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          Due: {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-slate-700" />
                      <span className="text-xl font-bold">{invoice.amount}</span>
                      <span className="ml-1 text-slate-500">{invoice.currency}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1" onClick={() => setSelectedInvoice(invoice)}>
                          View Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        {selectedInvoice && (
                          <>
                            <DialogHeader>
                              <div className="flex justify-between items-center">
                                <DialogTitle>Invoice {selectedInvoice.id}</DialogTitle>
                                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                  {selectedInvoice.status === "pending" ? "Pending" : "Paid"}
                                </Badge>
                              </div>
                              <DialogDescription>{selectedInvoice.description}</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <div className="flex justify-between mb-4">
                                <div>
                                  <h4 className="font-medium text-sm text-slate-500">From</h4>
                                  <p className="font-medium">{selectedInvoice.freelancer}</p>
                                  <div className="flex items-center gap-1 mt-1">
                                    <Shield className="h-4 w-4 text-blue-600" />
                                    <span className="text-xs text-blue-600">Verified Freelancer</span>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <h4 className="font-medium text-sm text-slate-500">Invoice Date</h4>
                                  <p>{new Date(selectedInvoice.date).toLocaleDateString()}</p>
                                  <h4 className="font-medium text-sm text-slate-500 mt-2">Due Date</h4>
                                  <p>{new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                                </div>
                              </div>

                              <div className="border rounded-md overflow-hidden mt-4">
                                <table className="w-full text-sm">
                                  <thead className="bg-slate-50">
                                    <tr>
                                      <th className="text-left p-3 font-medium">Description</th>
                                      <th className="text-right p-3 font-medium">Hours</th>
                                      <th className="text-right p-3 font-medium">Rate</th>
                                      <th className="text-right p-3 font-medium">Amount</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedInvoice.items.map((item: any, index: number) => (
                                      <tr key={index} className="border-t">
                                        <td className="p-3">{item.description}</td>
                                        <td className="p-3 text-right">{item.hours}</td>
                                        <td className="p-3 text-right">${item.rate}</td>
                                        <td className="p-3 text-right">${item.amount}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot className="bg-slate-50 border-t">
                                    <tr>
                                      <td colSpan={3} className="p-3 font-medium text-right">
                                        Total
                                      </td>
                                      <td className="p-3 font-medium text-right">${selectedInvoice.amount}</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>

                              <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
                                <Shield className="h-4 w-4 text-blue-600" />
                                <span>This invoice has been cryptographically signed by the freelancer</span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-xs ml-auto"
                                  onClick={() => handleVerifyInvoice(selectedInvoice)}
                                >
                                  Verify
                                </Button>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handlePayInvoice(selectedInvoice)}
                              >
                                Pay Invoice
                              </Button>
                            </DialogFooter>
                          </>
                        )}
                      </DialogContent>
                    </Dialog>
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handlePayInvoice(invoice)}>
                      Pay Now
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="paid" className="mt-4">
          <div className="space-y-4">
            {invoices
              .filter((inv) => inv.status === "paid")
              .map((invoice) => (
                <Card key={invoice.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <CardTitle>{invoice.id}</CardTitle>
                        </div>
                        <CardDescription>{invoice.description}</CardDescription>
                      </div>
                      <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                        Paid
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarFallback className="text-xs">
                            {invoice.freelancer
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{invoice.freelancer}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Check className="h-4 w-4 text-emerald-500" />
                        <span className="text-sm text-emerald-600">
                          Paid on {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-slate-700" />
                      <span className="text-xl font-bold">{invoice.amount}</span>
                      <span className="ml-1 text-slate-500">{invoice.currency}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => setSelectedInvoice(invoice)}>
                      View Receipt
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="all" className="mt-4">
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <Card key={invoice.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle>{invoice.id}</CardTitle>
                      </div>
                      <CardDescription>{invoice.description}</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        invoice.status === "pending"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }
                    >
                      {invoice.status === "pending" ? "Pending" : "Paid"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {invoice.freelancer
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{invoice.freelancer}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {invoice.status === "pending" ? (
                        <>
                          <Clock className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-500">
                            Due: {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm text-emerald-600">
                            Paid on {new Date(invoice.dueDate).toLocaleDateString()}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-slate-700" />
                    <span className="text-xl font-bold">{invoice.amount}</span>
                    <span className="ml-1 text-slate-500">{invoice.currency}</span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedInvoice(invoice)}>
                    View Details
                  </Button>
                  {invoice.status === "pending" && (
                    <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handlePayInvoice(invoice)}>
                      Pay Now
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

