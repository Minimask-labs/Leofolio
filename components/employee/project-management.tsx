"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Plus, Users, ChevronDown, ChevronUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProjectUpdates } from "@/components/project-updates"
import { ProjectDashboard } from "@/components/project-dashboard"
import { ProjectReport } from "@/components/project-report"

export function ProjectManagement() {
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [selectedProject, setSelectedProject] = useState<any>(null)
  const [showDashboard, setShowDashboard] = useState(false)
  const [showReport, setShowReport] = useState(false)

  // Mock project data
  const projects = [
    {
      id: 1,
      name: "Website Redesign",
      description: "Complete overhaul of company website with new branding",
      status: "in-progress",
      deadline: "2023-09-30",
      startDate: "2023-07-01",
      freelancers: [
        { name: "Alex Morgan", role: "Full Stack Developer" },
        { name: "Jamie Chen", role: "UI/UX Designer" },
      ],
      progress: 65,
      milestones: [
        { id: 1, title: "Requirements Gathering", status: "completed", dueDate: "2023-07-10" },
        { id: 2, title: "UI/UX Design", status: "completed", dueDate: "2023-07-31" },
        { id: 3, title: "Frontend Development", status: "in-progress", dueDate: "2023-08-31" },
        { id: 4, title: "Backend Integration", status: "not-started", dueDate: "2023-09-15" },
        { id: 5, title: "Testing & Launch", status: "not-started", dueDate: "2023-09-30" },
      ],
      updates: [
        {
          id: 1,
          author: "Sarah Johnson",
          role: "Client",
          date: "2023-08-15",
          content: "The designs look great! I've shared some feedback on the checkout flow in the attached document.",
          isClient: true,
        },
        {
          id: 2,
          author: "Alex Morgan",
          role: "Freelancer",
          date: "2023-08-16",
          content:
            "Thanks for the feedback! I've updated the checkout flow based on your suggestions. Please take a look at the latest designs.",
          isClient: false,
        },
        {
          id: 3,
          author: "Sarah Johnson",
          role: "Client",
          date: "2023-08-18",
          content: "The updated checkout flow looks perfect. Please proceed with the implementation.",
          isClient: true,
        },
      ],
      client: "Retail Innovations Inc.",
      clientContact: "Sarah Johnson",
    },
    {
      id: 2,
      name: "Mobile App Development",
      description: "Cross-platform mobile application for customer engagement",
      status: "planning",
      deadline: "2023-11-15",
      startDate: "2023-06-15",
      freelancers: [{ name: "Taylor Reed", role: "Mobile Developer" }],
      progress: 20,
      milestones: [
        { id: 1, title: "Requirements Analysis", status: "completed", dueDate: "2023-07-30" },
        { id: 2, title: "UI/UX Design", status: "in-progress", dueDate: "2023-08-31" },
        { id: 3, title: "Core Functionality", status: "not-started", dueDate: "2023-09-30" },
        { id: 4, title: "Testing & Deployment", status: "not-started", dueDate: "2023-11-15" },
      ],
      updates: [
        {
          id: 1,
          author: "Sarah Johnson",
          role: "Client",
          date: "2023-07-25",
          content: "I've shared the requirements document. Let me know if you have any questions.",
          isClient: true,
        },
        {
          id: 2,
          author: "Taylor Reed",
          role: "Freelancer",
          date: "2023-07-26",
          content: "Thanks for the document. I'll review it and get back to you with any questions.",
          isClient: false,
        },
      ],
      client: "HealthTrack",
      clientContact: "Jessica Williams",
    },
    {
      id: 3,
      name: "DevOps Infrastructure",
      description: "Modernize deployment pipeline and cloud infrastructure",
      status: "completed",
      deadline: "2023-06-15",
      startDate: "2023-05-01",
      completionDate: "2023-06-10",
      freelancers: [{ name: "Sam Wilson", role: "DevOps Engineer" }],
      progress: 100,
      milestones: [
        { id: 1, title: "Infrastructure Assessment", status: "completed", dueDate: "2023-05-15" },
        { id: 2, title: "CI/CD Pipeline Setup", status: "completed", dueDate: "2023-05-31" },
        { id: 3, title: "Cloud Migration", status: "completed", dueDate: "2023-06-15" },
      ],
      updates: [
        {
          id: 1,
          author: "Sarah Johnson",
          role: "Client",
          date: "2023-06-16",
          content: "Great work on the infrastructure upgrade! Everything is running smoothly.",
          isClient: true,
        },
        {
          id: 2,
          author: "Sam Wilson",
          role: "Freelancer",
          date: "2023-06-16",
          content:
            "Thank you! I've documented everything in the handover document. Let me know if you need any clarification.",
          isClient: false,
        },
      ],
      client: "Tech Solutions Inc.",
      clientContact: "Michael Chen",
    },
  ]

  const createProject = () => {
    toast({
      title: "Project Created",
      description: "Your new project has been created successfully.",
    })
    setIsCreatingProject(false)
  }

  const toggleProjectExpansion = (projectId: number) => {
    if (expandedProject === projectId) {
      setExpandedProject(null)
    } else {
      setExpandedProject(projectId)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Completed
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case "planning":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            Planning
          </Badge>
        )
      case "not-started":
        return (
          <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-200">
            Not Started
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  // If showing the project dashboard
  if (showDashboard && selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowDashboard(false)
              setSelectedProject(null)
            }}
          >
            Back to Projects
          </Button>
        </div>

        <ProjectDashboard project={selectedProject} userType="employee" />
      </div>
    )
  }

  // If showing the project report
  if (showReport && selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowReport(false)
              setSelectedProject(null)
            }}
          >
            Back to Projects
          </Button>
        </div>

        <ProjectReport project={selectedProject} userType="employee" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Manage Projects</h2>
          <p className="text-slate-600">Organize and track projects with your hired freelancers.</p>
        </div>
        <Button onClick={() => setIsCreatingProject(true)} className="bg-blue-600 text-white hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {isCreatingProject ? (
        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>Set up a new project and assign freelancers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input id="name" placeholder="e.g. Website Redesign" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea id="description" placeholder="Describe the project scope and goals..." />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input id="deadline" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <Select defaultValue="planning">
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="review">Under Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assign Freelancers</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" id="freelancer1" className="rounded" />
                  <label htmlFor="freelancer1" className="text-sm font-medium">
                    Alex Morgan (Developer)
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" id="freelancer2" className="rounded" />
                  <label htmlFor="freelancer2" className="text-sm font-medium">
                    Jamie Chen (Designer)
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" id="freelancer3" className="rounded" />
                  <label htmlFor="freelancer3" className="text-sm font-medium">
                    Sam Wilson (DevOps)
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" id="freelancer4" className="rounded" />
                  <label htmlFor="freelancer4" className="text-sm font-medium">
                    Taylor Reed (Mobile)
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Initial Milestones</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" id="milestone1" className="rounded" defaultChecked />
                  <label htmlFor="milestone1" className="text-sm font-medium">
                    Requirements Gathering
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" id="milestone2" className="rounded" defaultChecked />
                  <label htmlFor="milestone2" className="text-sm font-medium">
                    Design Phase
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" id="milestone3" className="rounded" defaultChecked />
                  <label htmlFor="milestone3" className="text-sm font-medium">
                    Development
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input type="checkbox" id="milestone4" className="rounded" defaultChecked />
                  <label htmlFor="milestone4" className="text-sm font-medium">
                    Testing & Launch
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => setIsCreatingProject(false)}>
              Cancel
            </Button>
            <Button onClick={createProject} className="bg-blue-600 text-white hover:bg-blue-700">
              Create Project
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active Projects</TabsTrigger>
            <TabsTrigger value="completed">Completed Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {projects
                .filter((p) => p.status !== "completed")
                .map((project) => (
                  <Card key={project.id} className={expandedProject === project.id ? "border-blue-300" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{project.name}</CardTitle>
                        {getStatusBadge(project.status)}
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                      </div>

                      <div className="flex items-center gap-1 mb-3 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {new Date(project.deadline).toLocaleDateString()}</span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium">Assigned Freelancers</span>
                        </div>
                        <div className="space-y-2">
                          {project.freelancers.map((freelancer, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {freelancer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{freelancer.name}</p>
                                <p className="text-xs text-slate-500">{freelancer.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {expandedProject === project.id && (
                        <div className="mt-6 space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Milestones</h4>
                            <div className="space-y-2">
                              {project.milestones.map((milestone) => (
                                <div
                                  key={milestone.id}
                                  className="flex justify-between items-center p-2 bg-slate-50 rounded-md"
                                >
                                  <div className="flex items-center gap-2">
                                    {milestone.status === "completed" ? (
                                      <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    ) : milestone.status === "in-progress" ? (
                                      <Clock className="h-4 w-4 text-blue-500" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4 text-slate-400" />
                                    )}
                                    <span className="text-sm">{milestone.title}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-slate-500">
                                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                                    </span>
                                    <Select defaultValue={milestone.status}>
                                      <SelectTrigger className="h-7 w-[130px]">
                                        <SelectValue placeholder="Status" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="not-started">Not Started</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <ProjectUpdates project={project} />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => toggleProjectExpansion(project.id)}>
                        {expandedProject === project.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" /> Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" /> Show Details
                          </>
                        )}
                      </Button>

                      <Button
                        className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => {
                          setSelectedProject(project)
                          setShowDashboard(true)
                        }}
                      >
                        Project Dashboard
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {projects
                .filter((p) => p.status === "completed")
                .map((project) => (
                  <Card key={project.id} className={expandedProject === project.id ? "border-emerald-300" : ""}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle>{project.name}</CardTitle>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          Completed
                        </Badge>
                      </div>
                      <CardDescription>{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="flex items-center gap-1 mb-3 text-sm text-slate-500">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Completed on:{" "}
                          {project.completionDate
                            ? new Date(project.completionDate).toLocaleDateString()
                            : "N/A"}
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-slate-500" />
                          <span className="text-sm font-medium">Freelancers</span>
                        </div>
                        <div className="space-y-2">
                          {project.freelancers.map((freelancer, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">
                                  {freelancer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm font-medium">{freelancer.name}</p>
                                <p className="text-xs text-slate-500">{freelancer.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {expandedProject === project.id && (
                        <div className="mt-6 space-y-4">
                          <ProjectUpdates project={project} />
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="flex gap-2">
                      <Button variant="outline" className="flex-1" onClick={() => toggleProjectExpansion(project.id)}>
                        {expandedProject === project.id ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" /> Hide Details
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" /> Show Details
                          </>
                        )}
                      </Button>
                      <Button
                        className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => {
                          setSelectedProject(project)
                          setShowReport(true)
                        }}
                      >
                        View Report
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

