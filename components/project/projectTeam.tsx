"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
  import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Plus
} from 'lucide-react';
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

interface Project {
  freelancers: { name: string; role: string }[];
  status?: string;
}

export function ProjectTeam({
  projectDetails,
  userType = 'employer'
}: {
  projectDetails: Project;
  userType?: string;
}) {
  const [isAssigningFreelancer, setIsAssigningFreelancer] = useState(false);
  const [project, setProject] = useState(projectDetails);

  // Mock available freelancers for assignment
  const availableFreelancers = [
    { id: 1, name: 'Alex Morgan', role: 'Full Stack Developer' },
    { id: 2, name: 'Jamie Chen', role: 'UI/UX Designer' },
    { id: 3, name: 'Sam Wilson', role: 'DevOps Engineer' },
    { id: 4, name: 'Taylor Reed', role: 'Mobile Developer' },
    { id: 5, name: 'Jordan Lee', role: 'Data Scientist' },
    { id: 6, name: 'Casey Kim', role: 'Blockchain Developer' }
  ];

  // Function to add a freelancer to the project
  const addFreelancer = (freelancerId: number) => {
    const freelancer = availableFreelancers.find((f) => f.id === freelancerId);

    if (!freelancer) return;

    // Check if freelancer is already assigned
    if (project?.freelancers.some((f: any) => f.name === freelancer.name)) {
      toast({
        title: 'Freelancer Already Assigned',
        description: `${freelancer.name} is already assigned to this project.`,
        variant: 'destructive'
      });
      return;
    }

    // setProject({
    //   ...project,
    //   freelancers: [...project.freelancers, freelancer]
    // });

    setIsAssigningFreelancer(false);

    toast({
      title: 'Freelancer Assigned',
      description: `${freelancer.name} has been assigned to the project.`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Project Team</h2>
        {userType === 'employer' && project?.status !== 'completed' && (
          <Button
            size="sm"
            className="gap-2"
            onClick={() => setIsAssigningFreelancer(true)}
          >
            <Plus className="h-4 w-4" />
            Assign Freelancer
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {project?.freelancers?.map((freelancer: any, idx: number) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-lg">
                    {freelancer.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{freelancer.name}</p>
                  <p className="text-sm text-slate-500">{freelancer.role}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Joined Project</span>
                  <span>2 weeks ago</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Completed Milestones</span>
                  <span>3</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Current Tasks</span>
                  <span>2</span>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isAssigningFreelancer && (
        <Card>
          <CardHeader>
            <CardTitle>Assign Freelancer</CardTitle>
            <CardDescription>
              Select a freelancer to add to the project team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {availableFreelancers
                ?.filter(
                  (f) =>
                    !project?.freelancers?.some((pf: any) => pf.name === f.name)
                )
                ?.map((freelancer) => (
                  <div
                    key={freelancer.id}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                    onClick={() => addFreelancer(freelancer.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>
                          {freelancer.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{freelancer.name}</p>
                        <p className="text-sm text-slate-500">
                          {freelancer.role}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsAssigningFreelancer(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setIsAssigningFreelancer(false)}>
              Done
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

