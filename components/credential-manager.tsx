"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Award, FileText, Plus, Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function CredentialManager() {
  const [credentials, setCredentials] = useState([
    {
      id: 1,
      type: "certification",
      name: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "2023-05-15",
      private: true,
    },
    { id: 2, type: "degree", name: "Computer Science", issuer: "State University", date: "2020-06-10", private: true },
  ])

  const [isAdding, setIsAdding] = useState(false)

  const addCredential = () => {
    // In a real implementation, this would create an Aleo transaction
    // to store the credential privately on-chain
    toast({
      title: "Credential Added",
      description: "Your credential has been encrypted and stored on Aleo",
    })
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Private Credentials</h2>
        <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Credential
        </Button>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Credential</CardTitle>
            <CardDescription>This information will be stored privately on Aleo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="type">Credential Type</Label>
              <Select defaultValue="certification">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="certification">Certification</SelectItem>
                  <SelectItem value="degree">Degree</SelectItem>
                  <SelectItem value="course">Course</SelectItem>
                  <SelectItem value="award">Award</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Credential Name</Label>
              <Input id="name" placeholder="e.g. AWS Certified Developer" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuer">Issuing Organization</Label>
              <Input id="issuer" placeholder="e.g. Amazon Web Services" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date Issued</Label>
              <Input id="date" type="date" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="document">Upload Document (Optional)</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:bg-slate-50">
                <Upload className="mx-auto h-8 w-8 text-slate-400" />
                <p className="mt-2 text-sm text-slate-600">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500">PDF, JPG, PNG (max. 10MB)</p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={addCredential} className="bg-emerald-600 hover:bg-emerald-700">
              Store Privately on Aleo
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {credentials.map((credential) => (
            <Card key={credential.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    {credential.type === "certification" ? (
                      <FileText className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Award className="h-5 w-5 text-emerald-600" />
                    )}
                    <CardTitle className="text-lg">{credential.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {credential.private ? "Private" : "Public"}
                  </Badge>
                </div>
                <CardDescription>{credential.issuer}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-500">Issued: {new Date(credential.date).toLocaleDateString()}</p>
              </CardContent>
              <CardFooter className="pt-1">
                <Button variant="outline" size="sm" className="text-xs">
                  Generate Proof
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

