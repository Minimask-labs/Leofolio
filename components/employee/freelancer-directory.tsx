"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Briefcase, Filter, Search, Shield, Star } from "lucide-react"
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

export function FreelancerDirectory() {
  const [selectedFreelancer, setSelectedFreelancer] = useState<any>(null)

  // Mock freelancer data
  const freelancers = [
    {
      id: 1,
      name: "Alex Morgan",
      title: "Full Stack Developer",
      skills: ["React", "Node.js", "GraphQL"],
      experience: "5+ years",
      rating: 4.9,
      verifiedCredentials: ["AWS Certified", "Computer Science Degree"],
      hourlyRate: 85,
      availability: "Available",
      bio: "Specialized in building scalable web applications with modern JavaScript frameworks.",
    },
    {
      id: 2,
      name: "Jamie Chen",
      title: "UI/UX Designer",
      skills: ["Figma", "Adobe XD", "User Research"],
      experience: "7+ years",
      rating: 4.8,
      verifiedCredentials: ["UX Certification", "Design Degree"],
      hourlyRate: 95,
      availability: "Available in 2 weeks",
      bio: "Creating intuitive and beautiful user experiences for web and mobile applications.",
    },
    {
      id: 3,
      name: "Sam Wilson",
      title: "DevOps Engineer",
      skills: ["AWS", "Docker", "Kubernetes"],
      experience: "4+ years",
      rating: 4.7,
      verifiedCredentials: ["AWS Solutions Architect", "Kubernetes Admin"],
      hourlyRate: 90,
      availability: "Limited Availability",
      bio: "Automating infrastructure and optimizing deployment pipelines for maximum efficiency.",
    },
    {
      id: 4,
      name: "Taylor Reed",
      title: "Mobile Developer",
      skills: ["React Native", "Swift", "Kotlin"],
      experience: "3+ years",
      rating: 4.6,
      verifiedCredentials: ["Apple Developer Certification"],
      hourlyRate: 80,
      availability: "Available",
      bio: "Building cross-platform mobile applications with a focus on performance and user experience.",
    },
  ]

  const handleHireFreelancer = (freelancer: any) => {
    toast({
      title: "Hiring Request Sent",
      description: `Your request to hire ${freelancer.name} has been sent privately.`,
    })
  }

  const handleVerifyCredentials = (freelancer: any) => {
    toast({
      title: "Credentials Verified",
      description: "The credentials have been verified using zero-knowledge proofs.",
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Find Verified Freelancers</h2>
        <p className="text-slate-600">Discover freelancers with verified credentials while respecting their privacy.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Search by skills, title, or expertise..." className="pl-10" />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by skill" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Skills</SelectItem>
            <SelectItem value="react">React</SelectItem>
            <SelectItem value="node">Node.js</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="mobile">Mobile Dev</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="flex gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {freelancers.map((freelancer) => (
          <Card key={freelancer.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {freelancer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>{freelancer.name}</CardTitle>
                    <CardDescription>{freelancer.title}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium">{freelancer.rating}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex flex-wrap gap-2 mb-3">
                {freelancer.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Briefcase className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">{freelancer.experience}</span>
                <Shield className="h-4 w-4 text-blue-600 ml-2" />
                <span className="text-sm text-blue-600">Verified</span>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-lg">${freelancer.hourlyRate}</span>
                  <span className="text-slate-500 text-sm">/hour</span>
                </div>
                <Badge
                  variant="outline"
                  className={
                    freelancer.availability === "Available"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }
                >
                  {freelancer.availability}
                </Badge>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedFreelancer(freelancer)}>
                    View Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  {selectedFreelancer && (
                    <>
                      <DialogHeader>
                        <DialogTitle>{selectedFreelancer.name}</DialogTitle>
                        <DialogDescription>{selectedFreelancer.title}</DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
                        <div className="md:col-span-1">
                          <Avatar className="h-24 w-24 mx-auto">
                            <AvatarFallback className="text-xl">
                              {selectedFreelancer.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="mt-4 text-center">
                            <div className="flex items-center justify-center gap-1 mb-2">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium">{selectedFreelancer.rating}</span>
                            </div>
                            <p className="text-sm text-slate-600">{selectedFreelancer.experience}</p>
                            <p className="font-medium mt-2">${selectedFreelancer.hourlyRate}/hour</p>
                          </div>
                          <div className="mt-4">
                            <h4 className="font-medium mb-2">Verified Credentials</h4>
                            <ul className="space-y-2">
                              {selectedFreelancer.verifiedCredentials.map((credential: string) => (
                                <li key={credential} className="flex items-center gap-2 text-sm">
                                  <Shield className="h-4 w-4 text-blue-600" />
                                  {credential}
                                </li>
                              ))}
                            </ul>
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full text-xs"
                              onClick={() => handleVerifyCredentials(selectedFreelancer)}
                            >
                              Verify Credentials
                            </Button>
                          </div>
                        </div>
                        <div className="md:col-span-2">
                          <h4 className="font-medium mb-2">About</h4>
                          <p className="text-sm text-slate-600 mb-4">{selectedFreelancer.bio}</p>

                          <h4 className="font-medium mb-2">Skills</h4>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {selectedFreelancer.skills.map((skill: string) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <h4 className="font-medium mb-2">Availability</h4>
                          <Badge
                            variant="outline"
                            className={
                              selectedFreelancer.availability === "Available"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }
                          >
                            {selectedFreelancer.availability}
                          </Badge>

                          <div className="mt-6">
                            <h4 className="font-medium mb-2">Work History</h4>
                            <p className="text-sm text-slate-500 italic">
                              Work history is private. The freelancer can generate proofs of experience without
                              revealing client details.
                            </p>
                          </div>
                        </div>
                      </div>
                      <DialogFooter>
                        <Button
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handleHireFreelancer(selectedFreelancer)}
                        >
                          Send Hiring Request
                        </Button>
                      </DialogFooter>
                    </>
                  )}
                </DialogContent>
              </Dialog>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => handleHireFreelancer(freelancer)}>
                Hire
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

