"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ArrowDownRight, ArrowUpRight, DollarSign, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function PaymentManager() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      type: "received",
      amount: 2500,
      client: "Client A",
      date: "2023-06-15",
      currency: "USDC",
      status: "completed",
    },
    {
      id: 2,
      type: "received",
      amount: 1800,
      client: "Client B",
      date: "2023-05-22",
      currency: "USDC",
      status: "completed",
    },
    {
      id: 3,
      type: "sent",
      amount: 500,
      recipient: "Contractor X",
      date: "2023-06-01",
      currency: "USDC",
      status: "completed",
    },
  ])

  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)

  const createInvoice = () => {
    toast({
      title: "Invoice Created",
      description: "Your private invoice has been created and sent",
    })
    setIsCreatingInvoice(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Private Payments</h2>
        <Button onClick={() => setIsCreatingInvoice(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Privacy-Preserving Payments</AlertTitle>
        <AlertDescription>
          All payment information is stored privately on Aleo. Only you can see the full details of your transactions.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Earned</CardTitle>
            <CardDescription>Private Balance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-emerald-600 mr-1" />
              <span className="text-2xl font-bold">4,300</span>
              <span className="ml-1 text-slate-500">USDC</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
            <CardDescription>Awaiting Payment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-amber-500 mr-1" />
              <span className="text-2xl font-bold">750</span>
              <span className="ml-1 text-slate-500">USDC</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expenses</CardTitle>
            <CardDescription>Paid Out</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 text-red-500 mr-1" />
              <span className="text-2xl font-bold">500</span>
              <span className="ml-1 text-slate-500">USDC</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {isCreatingInvoice ? (
        <Card>
          <CardHeader>
            <CardTitle>Create Private Invoice</CardTitle>
            <CardDescription>This invoice will be stored privately on Aleo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input id="client" placeholder="e.g. Client Company" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input id="amount" type="number" placeholder="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select defaultValue="USDC">
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USDC">USDC</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="DAI">DAI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" placeholder="e.g. Website Development - June 2023" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreatingInvoice(false)}>
              Cancel
            </Button>
            <Button onClick={createInvoice} className="bg-emerald-600 hover:bg-emerald-700">
              Create Private Invoice
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          <h3 className="font-medium">Transaction History</h3>
          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                <div className="flex items-center gap-3">
                  {transaction.type === "received" ? (
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <ArrowDownRight className="h-5 w-5 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                      <ArrowUpRight className="h-5 w-5 text-red-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">
                      {transaction.type === "received" ? `From ${transaction.client}` : `To ${transaction.recipient}`}
                    </p>
                    <p className="text-sm text-slate-500">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${transaction.type === "received" ? "text-emerald-600" : "text-red-600"}`}>
                    {transaction.type === "received" ? "+" : "-"}
                    {transaction.amount} {transaction.currency}
                  </p>
                  <Badge variant="outline" className="text-xs">
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

