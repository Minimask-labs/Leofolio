"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Calendar, Plus } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export function WorkHistory() {
  const [projects, setProjects] = useState([
    {
      id: 1,
      title: "E-commerce Platform Redesign",
      client: "Major Retail Company",
      startDate: "2023-01-10",
      endDate: "2023-04-15",
      skills: ["React", "Node.js", "GraphQL"],
      private: true,
    },
    {
      id: 2,
      title: "Financial Dashboard Development",
      client: "Investment Firm",
      startDate: "2022-08-05",
      endDate: "2022-12-20",
      skills: ["TypeScript", "D3.js", "Firebase"],
      private: true,
    },
  ])

  const [isAdding, setIsAdding] = useState(false)

  const addProject = () => {
    // In a real implementation, this would create an Aleo transaction
    // to store the work history privately on-chain
    toast({
      title: "Project Added",
      description: "Your project has been encrypted and stored on Aleo",
    })
    setIsAdding(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Private Work History</h2>
        <Button onClick={() => setIsAdding(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {isAdding ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Project</CardTitle>
            <CardDescription>This information will be stored privately on Aleo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input id="title" placeholder="e.g. E-commerce Platform Redesign" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client Name</Label>
              <Input id="client" placeholder="e.g. Major Retail Company" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input id="endDate" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills Used (comma separated)</Label>
              <Input id="skills" placeholder="e.g. React, Node.js, GraphQL" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea id="description" placeholder="Describe your role and achievements..." />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button onClick={addProject} className="bg-emerald-600 hover:bg-emerald-700">
              Store Privately on Aleo
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-5 w-5 text-emerald-600" />
                      <CardTitle>{project.title}</CardTitle>
                    </div>
                    <CardDescription>{project.client}</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    {project.private ? "Private" : "Public"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">
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

