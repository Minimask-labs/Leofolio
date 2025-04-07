"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, CheckCircle, Clock, AlertCircle, Users, FileBarChart, Gift, Star, Award } from "lucide-react"

interface ProjectReportProps {
  project: any
  userType: "freelancer" | "employee"
}

export function ProjectReport({ project, userType }: ProjectReportProps) {
  const [activeTab, setActiveTab] = useState("summary")

  // Function to calculate project stats
  const calculateProjectStats = () => {
    const totalMilestones = project.milestones.length
    const completedMilestones = project.milestones.filter((m: any) => m.status === "completed").length

    const startDate = new Date(project.startDate)
    const endDate = project.completionDate ? new Date(project.completionDate) : new Date(project.deadline)
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Calculate on-time completion percentage
    const onTimeCompletionRate = 90 // This would be calculated based on milestone completion dates

    return {
      totalMilestones,
      completedMilestones,
      completionRate: totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0,
      totalDays,
      onTimeCompletionRate,
    }
  }

  const stats = calculateProjectStats()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Project Completion Report</h1>
          <p className="text-slate-600">{project.name || project.title}</p>
        </div>
        <Button className="gap-2">
          <FileBarChart className="h-4 w-4" />
          Download Report
        </Button>
      </div>

      <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-full border-4 border-white">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg font-medium text-emerald-800">Project Completed Successfully!</h3>
              <p className="text-emerald-700">
                This project was completed on{" "}
                {new Date(project.completionDate || project.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="summary" className="space-y-6 mt-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-2">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                    <CheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stats.completionRate}%</div>
                <p className="text-sm text-slate-500">Completion Rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-2">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stats.totalDays}</div>
                <p className="text-sm text-slate-500">Days to Complete</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-2">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{project.freelancers.length}</div>
                <p className="text-sm text-slate-500">Team Members</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="mb-2">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold">{stats.onTimeCompletionRate}%</div>
                <p className="text-sm text-slate-500">On-Time Completion</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Start Date</p>
                    <p className="font-medium">{new Date(project.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Completion Date</p>
                    <p className="font-medium">
                      {new Date(project.completionDate || project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Client</p>
                    <p className="font-medium">{project.client || project.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Project ID</p>
                    <p className="font-medium">PRJ-{project.id || "0001"}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Description</p>
                  <p className="text-sm">{project.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Project Delivered on Schedule</p>
                      <p className="text-sm text-slate-500">
                        Successfully delivered all deliverables by the agreed deadline.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">All Requirements Met</p>
                      <p className="text-sm text-slate-500">Implemented all project requirements with high quality.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Client Satisfaction</p>
                      <p className="text-sm text-slate-500">Received excellent feedback from the client.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium">Comprehensive Documentation</p>
                      <p className="text-sm text-slate-500">
                        Provided detailed documentation for all project components.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-8 space-y-6 before:absolute before:left-4 before:top-0 before:h-full before:w-[2px] before:bg-slate-200">
                <div className="relative pt-2">
                  <div className="absolute -left-8 mt-1 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Project Kick-off</p>
                    <p className="text-sm text-slate-500">{new Date(project.startDate).toLocaleDateString()}</p>
                    <p className="text-sm mt-1">Project requirements finalized and team assembled</p>
                  </div>
                </div>

                {project.milestones.map((milestone: any, idx: number) => (
                  <div key={idx} className="relative pt-2">
                    <div className="absolute -left-8 mt-1 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium">{milestone.title}</p>
                      <p className="text-sm text-slate-500">{new Date(milestone.dueDate).toLocaleDateString()}</p>
                      <p className="text-sm mt-1">Milestone completed</p>
                    </div>
                  </div>
                ))}

                <div className="relative pt-2">
                  <div className="absolute -left-8 mt-1 h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle className="h-3 w-3 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Project Completion</p>
                    <p className="text-sm text-slate-500">
                      {new Date(project.completionDate || project.deadline).toLocaleDateString()}
                    </p>
                    <p className="text-sm mt-1">All deliverables finalized and project closed</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="border rounded-md overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="text-left p-3 font-medium">Team Member</th>
                        <th className="text-left p-3 font-medium">Role</th>
                        <th className="text-center p-3 font-medium">Tasks Completed</th>
                        <th className="text-center p-3 font-medium">On-Time Rate</th>
                        <th className="text-center p-3 font-medium">Quality Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {project.freelancers.map((freelancer: any, idx: number) => (
                        <tr key={idx}>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="text-xs">
                                  {freelancer.name
                                    .split(" ")
                                    .map((n: string) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{freelancer.name}</span>
                            </div>
                          </td>
                          <td className="p-3 text-slate-600">{freelancer.role}</td>
                          <td className="p-3 text-center font-medium">{4 + idx}</td>
                          <td className="p-3 text-center">
                            <span className="inline-block bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">
                              {95 - idx * 5}%
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= (5 - idx * 0.5) ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                                />
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Milestone Completion Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.milestones.map((milestone: any, idx: number) => (
                        <div key={idx} className="space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{milestone.title}</span>
                            <span className="text-xs text-slate-500">
                              {new Date(milestone.dueDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${100 - idx * 5}%` }}></div>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500">
                            <span>Completed on time</span>
                            <span>{100 - idx * 5}% efficiency</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Project Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-base font-medium mb-3">Productivity Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Task Completion Rate</span>
                        <span className="text-sm font-medium">95%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "95%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">On-Time Delivery</span>
                        <span className="text-sm font-medium">90%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "90%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Code Quality</span>
                        <span className="text-sm font-medium">88%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "88%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Resource Utilization</span>
                        <span className="text-sm font-medium">92%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "92%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-medium mb-3">Quality Metrics</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Client Satisfaction</span>
                        <span className="text-sm font-medium">100%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "100%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Test Coverage</span>
                        <span className="text-sm font-medium">85%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "85%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Bug-Free Delivery</span>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "94%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm">Documentation Quality</span>
                        <span className="text-sm font-medium">96%</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: "96%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button className="gap-2">
              <FileBarChart className="h-4 w-4" />
              Download Detailed Analytics
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Client Feedback</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {project.clientContact
                          ?.split(" ")
                          .map((n: string) => n[0])
                          .join("") || "CL"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{project.clientContact || "Client Representative"}</p>
                      <p className="text-xs text-slate-500">
                        {new Date(project.completionDate || project.deadline).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-auto flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className={`h-4 w-4 fill-amber-400 text-amber-400`} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-lg italic mb-2">
                      "The team delivered exceptional work on this project. They were responsive, professional, and met
                      all our requirements with high quality. I would definitely work with them again."
                    </p>
                    <p className="text-sm text-slate-600">
                      The project was completed on time and within budget. The development team was very communicative
                      throughout the process, and they were quick to address any concerns we had. The final product
                      exceeded our expectations.
                    </p>
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b">
                    <h3 className="font-medium">Feedback Categories</h3>
                  </div>
                  <div className="divide-y">
                    {[
                      {
                        category: "Communication",
                        rating: 5,
                        comment: "Excellent communication throughout the project",
                      },
                      { category: "Quality of Work", rating: 5, comment: "Delivered high-quality code and design" },
                      { category: "Timeliness", rating: 4.5, comment: "Met all deadlines with minor adjustments" },
                      { category: "Problem Solving", rating: 5, comment: "Creative solutions to complex requirements" },
                      { category: "Documentation", rating: 4.5, comment: "Comprehensive and well-organized" },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center p-3">
                        <div className="w-1/3">
                          <p className="font-medium">{item.category}</p>
                        </div>
                        <div className="w-1/3 flex items-center">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= item.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-sm font-medium">{item.rating}</span>
                        </div>
                        <div className="w-1/3 text-sm text-slate-600">{item.comment}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team Reflections</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-4">
                    <h3 className="text-base font-medium mb-2">What Went Well</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>Clear requirements and project scope</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>Effective team collaboration and communication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>Regular progress updates and feedback cycles</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>Efficient problem-solving and decision-making</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>Well-structured code and documentation</span>
                      </li>
                    </ul>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="text-base font-medium mb-2">Areas for Improvement</h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Earlier integration testing could have identified issues sooner</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>More detailed initial planning for complex features</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Additional time for refactoring and optimization</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="text-base font-medium text-blue-800 mb-2">Key Learnings</h3>
                  <p className="text-sm text-blue-700 mb-2">
                    This project provided valuable insights that will benefit future projects:
                  </p>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Establish clear communication protocols at project start</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Implement continuous integration practices early</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Regular code reviews improve overall quality</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Award className="h-4 w-4 text-blue-600 mt-0.5" />
                      <span>Thorough documentation saves time in the long run</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recognition</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Highest Quality Code", recipient: project.freelancers[0]?.name, icon: Award },
                    { title: "Best Team Player", recipient: project.freelancers[1]?.name || "Jamie Chen", icon: Users },
                    {
                      title: "Most Innovative Solution",
                      recipient: project.freelancers[2]?.name || "Sam Wilson",
                      icon: Gift,
                    },
                  ].map((award, idx) => (
                    <Card key={idx} className="bg-gradient-to-b from-amber-50 to-white border-amber-200">
                      <CardContent className="p-4 text-center">
                        <div className="mt-2 mb-3">
                          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                            <award.icon className="h-6 w-6 text-amber-600" />
                          </div>
                        </div>
                        <h3 className="font-bold text-amber-800 mb-1">{award.title}</h3>
                        <p className="text-sm text-amber-700">{award.recipient}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Button className="gap-2">
                    <Award className="h-4 w-4" />
                    View Project Certificate
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

