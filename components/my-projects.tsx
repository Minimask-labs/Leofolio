'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ProjectUpdates } from './project-updates';
import { ProjectDashboard } from './project-dashboard';
import { ProjectReport } from './project-report';
import { useProjectStore } from '@/Store/projects';
// import projects-Invitation-card from "./projects-Invitation-card"
import { InvitationCard } from '@/components/cards/projects-Invitation-card';
export function MyProjects() {
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const {
    handleViewProjectInvitationsList,
    projects_invites,
    handleProjectInviteResponse,
    fetchProjects,
    projects,
    fetchFreelancerProjects,
    freelancer_projects
  } = useProjectStore();
  // Mock active projects data
  const activeProjects = [
    {
      id: 1,
      title: 'E-commerce Platform Redesign',
      client: 'Retail Innovations Inc.',
      clientContact: 'Sarah Johnson',
      description:
        'Complete overhaul of the e-commerce platform with focus on user experience and conversion optimization.',
      startDate: '2023-07-01',
      deadline: '2023-09-30',
      status: 'in-progress',
      progress: 65,
      milestones: [
        {
          id: 1,
          title: 'Requirements Gathering',
          status: 'completed',
          dueDate: '2023-07-10'
        },
        {
          id: 2,
          title: 'UI/UX Design',
          status: 'completed',
          dueDate: '2023-07-31'
        },
        {
          id: 3,
          title: 'Frontend Development',
          status: 'in-progress',
          dueDate: '2023-08-31'
        },
        {
          id: 4,
          title: 'Backend Integration',
          status: 'not-started',
          dueDate: '2023-09-15'
        },
        {
          id: 5,
          title: 'Testing & Launch',
          status: 'not-started',
          dueDate: '2023-09-30'
        }
      ],
      updates: [
        {
          id: 1,
          author: 'Sarah Johnson',
          role: 'Client',
          date: '2023-08-15',
          content:
            "The designs look great! I've shared some feedback on the checkout flow in the attached document.",
          isClient: true
        },
        {
          id: 2,
          author: 'Alex Morgan',
          role: 'Freelancer',
          date: '2023-08-16',
          content:
            "Thanks for the feedback! I've updated the checkout flow based on your suggestions. Please take a look at the latest designs.",
          isClient: false
        },
        {
          id: 3,
          author: 'Sarah Johnson',
          role: 'Client',
          date: '2023-08-18',
          content:
            'The updated checkout flow looks perfect. Please proceed with the implementation.',
          isClient: true
        }
      ],
      freelancers: [
        { name: 'Alex Morgan', role: 'Full Stack Developer' },
        { name: 'Jamie Chen', role: 'UI/UX Designer' }
      ]
    },
    {
      id: 2,
      title: 'Mobile App Development',
      client: 'HealthTrack',
      clientContact: 'Jessica Williams',
      description:
        'Developing a cross-platform mobile application for health tracking with integration to wearable devices.',
      startDate: '2023-06-15',
      deadline: '2023-10-30',
      status: 'in-progress',
      progress: 40,
      milestones: [
        {
          id: 1,
          title: 'Requirements Analysis',
          status: 'completed',
          dueDate: '2023-06-30'
        },
        {
          id: 2,
          title: 'UI/UX Design',
          status: 'completed',
          dueDate: '2023-07-31'
        },
        {
          id: 3,
          title: 'Core Functionality',
          status: 'in-progress',
          dueDate: '2023-09-15'
        },
        {
          id: 4,
          title: 'Wearable Integration',
          status: 'not-started',
          dueDate: '2023-10-15'
        },
        {
          id: 5,
          title: 'Testing & Deployment',
          status: 'not-started',
          dueDate: '2023-10-30'
        }
      ],
      updates: [
        {
          id: 1,
          author: 'Jessica Williams',
          role: 'Client',
          date: '2023-08-10',
          content: 'Can we add a feature to track water intake in the app?',
          isClient: true
        },
        {
          id: 2,
          author: 'Alex Morgan',
          role: 'Freelancer',
          date: '2023-08-11',
          content:
            "Yes, I can add that feature. It will require an additional screen in the nutrition section. I'll update the designs and share them with you by tomorrow.",
          isClient: false
        },
        {
          id: 3,
          author: 'Jessica Williams',
          role: 'Client',
          date: '2023-08-13',
          content: 'The designs look good. Please proceed with implementation.',
          isClient: true
        }
      ],
      freelancers: [{ name: 'Taylor Reed', role: 'Mobile Developer' }]
    }
  ];

  // Mock completed projects data
  const completedProjects = [
    {
      id: 3,
      title: 'Company Website Redesign',
      client: 'Tech Solutions Inc.',
      clientContact: 'Michael Chen',
      description:
        'Redesigned the company website with modern design and improved user experience.',
      startDate: '2023-03-15',
      completionDate: '2023-06-10',
      deadline: '2023-06-15',
      status: 'completed',
      progress: 100,
      milestones: [
        {
          id: 1,
          title: 'Requirements Gathering',
          status: 'completed',
          dueDate: '2023-03-25'
        },
        {
          id: 2,
          title: 'Design Phase',
          status: 'completed',
          dueDate: '2023-04-20'
        },
        {
          id: 3,
          title: 'Development',
          status: 'completed',
          dueDate: '2023-05-25'
        },
        {
          id: 4,
          title: 'Testing & Launch',
          status: 'completed',
          dueDate: '2023-06-10'
        }
      ],
      updates: [
        {
          id: 1,
          author: 'Michael Chen',
          role: 'Client',
          date: '2023-06-12',
          content:
            'The website looks fantastic! Thank you for your excellent work.',
          isClient: true
        },
        {
          id: 2,
          author: 'Alex Morgan',
          role: 'Freelancer',
          date: '2023-06-12',
          content:
            "Thank you for the opportunity! It was a pleasure working with you. Don't hesitate to reach out if you need any adjustments or have questions about the site.",
          isClient: false
        }
      ],
      freelancers: [{ name: 'Alex Morgan', role: 'Full Stack Developer' }]
    }
  ];

  const toggleProjectExpansion = (projectId: number) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            Completed
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-blue-100 text-blue-800 border-blue-200">
            In Progress
          </Badge>
        );
      case 'not-started':
        return (
          <Badge className="bg-slate-100 text-slate-800 border-slate-200">
            Not Started
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // If showing the project dashboard
  if (showDashboard && selectedProject) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setShowDashboard(false);
              setSelectedProject(null);
            }}
          >
            Back to Projects
          </Button>
        </div>

        <ProjectDashboard project={selectedProject} userType="freelancer" />
      </div>
    );
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
              setShowReport(false);
              setSelectedProject(null);
            }}
          >
            Back to Projects
          </Button>
        </div>

        <ProjectReport project={selectedProject} userType="freelancer" />
      </div>
    );
  }
  const [loading, setLoading] = useState(false);
  const [rejectLoading, setRrejectLoading] = useState(false);
  const handleAccept = async (id: string) => {
     setLoading(true);
    try {
      let res = await handleProjectInviteResponse(id, 'accept');
      console.log(res);
    } catch (error) {
      console.log(error);
    }finally {
      setLoading(false);
          fetchProjects();
    fetchFreelancerProjects();

    }
  };

  const handleReject = async (id: string) => {
     setRrejectLoading(true);
    try {
      let res = await handleProjectInviteResponse(id, 'reject');
      console.log(res);
    } catch (error) {
      console.log(error);
    }finally {
      setRrejectLoading(false);
          fetchProjects();
          fetchFreelancerProjects();

    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleViewProjectInvitationsList();
          fetchFreelancerProjects();

    };
    fetchData();
  }, [handleViewProjectInvitationsList]);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">My Projects</h2>
        <p className="text-slate-600">
          Manage your active projects and view completed work.
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Projects</TabsTrigger>
          {/* <TabsTrigger value="completed">Completed Projects</TabsTrigger> */}
          <TabsTrigger value="invites"> Projects Invites</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-4">
          {Array.isArray(freelancer_projects?.data) &&
            freelancer_projects.data.map((project: any) => (
              <Card
                key={project?._id}
                className={
                  expandedProject === project?._id ? 'border-blue-300' : ''
                }
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <CardTitle>{project?.name}</CardTitle>
                      </div>
                      <CardDescription>{project?.client}</CardDescription>
                    </div>
                    {getStatusBadge(project?.status)}
                  </div>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Progress</span>
                      <span className="text-sm">{project?.progress}%</span>
                    </div>
                    <Progress value={project?.progress} className="h-2" />
                  </div>

                  <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Deadline:{' '}
                      {new Date(project?.deadline).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {project?.clientContact?.split(' ')?.map((n: string) => n[0])?.join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{project?.clientContact}</span>
                  </div>

                  {expandedProject === project?.id && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Project Description
                        </h4>
                        <p className="text-sm text-white">
                          {project?.description}
                        </p>
                      </div>

                      <div>
                         <div className="space-y-2">
                          {expandedProject === project?.id && (
                            <div className="mt-6 space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-2">
                                  Milestones
                                </h4>
                                <div className="space-y-2">
                                  {project?.milestones?.map(
                                    (milestone: any, index: number) => (
                                      <div
                                        key={index}
                                        className="flex justify-between items-center p-2 bg-slate-50/20 rounded-md"
                                      >
                                        <div className="flex items-center gap-2">
                                          {milestone.status === 'completed' ? (
                                            <CheckCircle className="h-4 w-4 text-blue-500" />
                                          ) : milestone.status ===
                                            'in_progress' ? (
                                            <Clock className="h-4 w-4 text-blue-500" />
                                          ) : (
                                            <AlertCircle className="h-4 w-4 text-slate-400" />
                                          )}
                                          <span className="text-sm">
                                            {milestone.title}
                                          </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <span className="text-xs text-blue-300">
                                            Due:{' '}
                                            {new Date(
                                              milestone.deadline
                                            ).toLocaleDateString()}
                                          </span>
                                          <Select
                                            defaultValue={milestone.status}
                                          >
                                            <SelectTrigger className="h-7 w-[130px]">
                                              <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="planning">
                                                Planning
                                              </SelectItem>
                                              {/* <SelectItem value="in_progress">
                                                In Progress
                                              </SelectItem>
                                              <SelectItem value="on_hold">
                                                on hold
                                              </SelectItem> */}
                                              <SelectItem value="completed">
                                                Completed
                                              </SelectItem>
                                            </SelectContent>
                                          </Select>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              <ProjectUpdates project={project} />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    className="text-sm"
                    onClick={() => toggleProjectExpansion(project?.id)}
                  >
                    {expandedProject === project?.id ? (
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
                    className="bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => {
                      setSelectedProject(project);
                      setShowDashboard(true);
                    }}
                  >
                    Project Dashboard
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {completedProjects.map((project) => (
            <Card key={project?.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      <CardTitle>{project?.title}</CardTitle>
                    </div>
                    <CardDescription>{project?.client}</CardDescription>
                  </div>
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    Completed
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pb-2">
                <div className="flex items-center gap-1 text-sm text-slate-500 mb-3">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Completed:{' '}
                    {new Date(project?.completionDate).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-sm text-slate-700 mb-3">
                  {project?.description}
                </p>

                {expandedProject === project?.id && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Milestones</h4>
                      <div className="space-y-2">
                        {project?.milestones.map((milestone) => (
                          <div
                            key={milestone?.id}
                            className="flex justify-between items-center p-2 bg-slate-50 rounded-md"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">
                                {milestone?.title}
                              </span>
                            </div>
                            <span className="text-xs text-slate-500">
                              Completed on{' '}
                              {new Date(
                                milestone?.dueDate
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <ProjectUpdates project={project} />
                  </div>
                )}
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  className="text-sm"
                  onClick={() => toggleProjectExpansion(project?.id)}
                >
                  {expandedProject === project?.id ? (
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
                  className="bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => {
                    setSelectedProject(project);
                    setShowReport(true);
                  }}
                >
                  View Report
                </Button>
              </CardFooter>
            </Card>
          ))}
        </TabsContent>
        <TabsContent value="invites" className="mt-4 space-y-4">
          {projects_invites?.map((project: any, index: number) => (
            <InvitationCard
              key={index}
              invitation={project}
              onAccept={handleAccept}
              onReject={handleReject}
              isLoading={loading}
              rejectLoading={rejectLoading}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
