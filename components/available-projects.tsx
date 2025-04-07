"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, Calendar, Search, Filter, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export function AvailableProjects() {
  const [selectedProject, setSelectedProject] = useState<any>(null)

  // Mock project data
  const projects = [
    {
      id: 1,
      title: "E-commerce Platform Redesign",
      company: "Retail Innovations Inc.",
      description:
        "Complete overhaul of our e-commerce platform with focus on user experience and conversion optimization.",
      skills: ["React", "Node.js", "UI/UX", "GraphQL"],
      budget: "$5,000 - $10,000",
      duration: "2-3 months",
      postedBy: "Sarah Johnson",
      postedDate: "2023-07-15",
      status: "open",
    },
    {
      id: 2,
      title: "Blockchain Wallet Integration",
      company: "CryptoTech Solutions",
      description:
        "Integrate multiple blockchain wallets into our existing financial platform with focus on security and privacy.",
      skills: ["Blockchain", "Solidity", "Web3.js", "Security"],
      budget: "$8,000 - $15,000",
      duration: "3-4 months",
      postedBy: "Michael Chen",
      postedDate: "2023-07-10",
      status: "open",
    },
    {
      id: 3,
      title: "Mobile App Development",
      company: "HealthTrack",
      description:
        "Develop a cross-platform mobile application for health tracking with integration to wearable devices.",
      skills: ["React Native", "Firebase", "API Integration", "UI/UX"],
      budget: "$12,000 - $20,000",
      duration: "4-6 months",
      postedBy: "Jessica Williams",
      postedDate: "2023-07-05",
      status: "open",
    },
    {
      id: 4,
      title: "AI-Powered Content Recommendation Engine",
      company: "MediaStream",
      description:
        "Build a machine learning based content recommendation system to improve user engagement on our platform.",
      skills: ["Python", "Machine Learning", "API Development", "Data Science"],
      budget: "$15,000 - $25,000",
      duration: "5-7 months",
      postedBy: "David Rodriguez",
      postedDate: "2023-06-28",
      status: "open",
    },
  ]

  const handleApplyForProject = (project: any) => {
    toast({
      title: "Application Submitted",
      description: `Your application for "${project.title}" has been submitted privately.`,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Available Projects</h2>
        <p className="text-slate-600">Discover projects from companies looking for freelancers with your skills.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search projects by title, skills, or company..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="blockchain">Blockchain</SelectItem>
            <SelectItem value="mobile">Mobile Dev</SelectItem>
            <SelectItem value="ai">AI/ML</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="space-y-4">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    <CardTitle>{project.title}</CardTitle>
                  </div>
                  <CardDescription>{project.company}</CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {project.status === "open" ? "Open" : "Closed"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 mb-4">{project.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {project.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 mb-1">Budget</p>
                  <p className="font-medium">{project.budget}</p>
                </div>
                <div>
                  <p className="text-slate-500 mb-1">Duration</p>
                  <p className="font-medium">{project.duration}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 mt-4 text-sm text-slate-500">
                <Calendar className="h-4 w-4" />
                <span>Posted on {new Date(project.postedDate).toLocaleDateString()}</span>
                <span className="mx-2">•</span>
                <span>by {project.postedBy}</span>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedProject(project)}>
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  {selectedProject && (
                    <>
                      <DialogHeader>
                        <div className="flex justify-between items-center">
                          <DialogTitle>{selectedProject.title}</DialogTitle>
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                            {selectedProject.status === "open" ? "Open" : "Closed"}
                          </Badge>
                        </div>
                        <DialogDescription>{selectedProject.company}</DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <div className="mb-6">
                          <h4 className="font-medium mb-2">Project Description</h4>
                          <p className="text-slate-700">{selectedProject.description}</p>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium mb-2">Required Skills</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedProject.skills.map((skill: string) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                          <div>
                            <h4 className="font-medium mb-2">Budget</h4>
                            <p className="text-slate-700">{selectedProject.budget}</p>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Estimated Duration</h4>
                            <p className="text-slate-700">{selectedProject.duration}</p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <h4 className="font-medium mb-2">Posted By</h4>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {selectedProject.postedBy
                                  .split(" ")
                                  .map((n: string) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{selectedProject.postedBy}</p>
                              <div className="flex items-center gap-1 text-sm">
                                <Shield className="h-3 w-3 text-blue-600" />
                                <span className="text-blue-600">Verified Client</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-lg">
                          <h4 className="font-medium mb-2">Application Process</h4>
                          <p className="text-sm text-slate-600 mb-2">When you apply for this project:</p>
                          <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5 mb-2">
                            <li>Your application will be sent privately to the client</li>
                            <li>You can choose which credentials to share as verifiable proofs</li>
                            <li>Your contact information remains private until you accept an offer</li>
                          </ul>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => handleApplyForProject(selectedProject)}
                        >
                          Apply for this Project
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => handleApplyForProject(project)}
              >
                Apply Now
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

