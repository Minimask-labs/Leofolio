'use client';

import { useState, useEffect } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import {
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  FileBarChart,
  Download,
  Gift
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProjectTeam } from './projectTeam';
import { BackButton } from '../back-button2';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useProjectStore } from '@/Store/projects';
import ProjectChat from '../project-chat';
import { useStore } from '@/Store/user';
import { mongoIdToAleoU64Hash } from '@/libs/util';
import { EventType, useRequestCreateEvent } from '@puzzlehq/sdk';
import { useAccount } from '@puzzlehq/sdk';

export function Dashboard() {
  const { userType, loadUserType, userData } = useStore();

  const {
    handleCreateProject,
    fetchProjects,
    projects,
    handleViewProjectDetail,
    project_details,
    handleCompleteProject,
    handleApproveProject,
    handleCompleteMilestone,
    handleApproveMilestone
  } = useProjectStore();
  const searchParams = useSearchParams();
  const validTabs = ['overview', 'milestones', 'team', 'chat', 'files'];
  const tabParam = searchParams.get('tab');
  const activeTab =
    tabParam && validTabs.includes(tabParam) ? tabParam : 'overview';

  const updateUrlTab = (tab: string) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', tab);
    router.replace(`?${newSearchParams.toString()}`);
  };

  const [newMilestone, setNewMilestone] = useState({
    title: '',
    dueDate: '',
    status: 'not-started'
  });
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;
  const [isApprovingMilestone, setIsApprovingMilestone] = useState<
    string | null
  >(null);
  const [isApprovingProject, setIsApprovingProject] = useState(false);
  const [isCompletingProject, setIsCompletingProject] = useState(false);
  const [isCompletingMilestone, setIsCompletingMilestone] = useState<
    string | null
  >(null);
  const { account, error, loading } = useAccount();
  // Validate blockchain data
  const hashProjectId = projectId
    ? mongoIdToAleoU64Hash(String(projectId))
    : null;
    const [hashProjectIdInput, setHashProjectIdInput] = useState(hashProjectId);
  const assignedFreelancer = project_details?.assignedFreelancer?.walletAddress;
  const price = project_details?.price;

  // Log blockchain data for debugging
  useEffect(() => {
    if (project_details) {
      console.log('Blockchain data:', {
        hashProjectId,
        assignedFreelancer,
        price
      });
    }
  }, [project_details, hashProjectId, assignedFreelancer, price]);

  // Configure blockchain event handlers
  const {
    createEvent: handleOnchainFreelancerCompletProject,
    loading: completingOnchain
  } = useRequestCreateEvent({
    type: EventType.Execute,
    programId: 'escrow_contract11.aleo',
    functionId: 'complete_job',
    fee: 1.23,
    inputs: [hashProjectIdInput? hashProjectIdInput : '0u64']
  });

  const {
    createEvent: handleOnchainEmployerAproveProject,
    loading: approvingOnchain
  } = useRequestCreateEvent({
    type: EventType.Execute,
    programId: 'escrow_contract11.aleo',
    functionId: 'release_payment',
    fee: 1.23,
    inputs: [hashProjectId, assignedFreelancer, price ? price + 'u64' : '0u64']
  });
  // Function to update milestone status
  const approveMilestone = async (milestoneId: string) => {
    setIsApprovingMilestone(milestoneId);
    try {
      const response = await handleApproveMilestone(
        String(projectId),
        milestoneId
      );
      console.log(response, 'response');
      toast({
        title: 'Milestone Approved',
        description: `The milestone has been approved successfully.`
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to approve milestone.',
        variant: 'destructive'
      });
    } finally {
      setIsApprovingMilestone(null);
    }
  };
  const approveProject = async () => {
    setIsApprovingProject(true);
    try {
      const response = await handleApproveProject(String(projectId));
      console.log(response, 'response');

      // Only trigger blockchain operation if API call was successful
      if (
        response !== undefined &&
        typeof response === 'object' &&
        'data' in response
      ) {
        const { data, success } = response as {
          data: { _id: string };
          success: boolean;
        };

        if (success && data && data._id) {
          // Make sure we have all required data before calling blockchain function
          if (assignedFreelancer && price) {
            await handleOnchainEmployerAproveProject();
            toast({
              title: 'Project Approved',
              description: `The project has been approved successfully and payment released on blockchain.`
            });
          } else {
            toast({
              title: 'Project Approved',
              description: `The project has been approved successfully, but blockchain operation failed due to missing data.`,
              variant: 'destructive'
            });
          }
        }
      } else {
        toast({
          title: 'Project Approved',
          description: `The project has been approved successfully.`
        });
      }
    } catch (error) {
      console.error('Error approving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to approve project.',
        variant: 'destructive'
      });
    } finally {
      setIsApprovingProject(false);
    }
  };
  const completeProject = async () => {
    setIsCompletingProject(true);
    try {
      const response = await handleCompleteProject(String(projectId));
      console.log(response, 'response');

      // Only trigger blockchain operation if API call was successful
      if (
        response !== undefined &&
        typeof response === 'object' &&
        'data' in response
      ) {
        const { data, success } = response as {
          data: { _id: string };
          success: boolean;
        };

        if (success && data && data._id) {
          // Make sure we have valid project hash before calling blockchain function
          if (hashProjectId) {
            await handleOnchainFreelancerCompletProject();
            toast({
              title: 'Project Completed',
              description: `The project has been completed successfully and recorded on blockchain.`
            });
          } else {
            toast({
              title: 'Project Completed',
              description: `The project has been completed successfully, but blockchain operation failed due to invalid project ID.`,
              variant: 'destructive'
            });
          }
        }
      } else {
        toast({
          title: 'Project Completed',
          description: `The project has been completed successfully.`
        });
      }
    } catch (error) {
      console.error('Error completing project:', error);
      toast({
        title: 'Error',
        description: 'Failed to complete project.',
        variant: 'destructive'
      });
    } finally {
      setIsCompletingProject(false);
    }
  };
  const completedMilestone = async (milestoneId: string) => {
    setIsCompletingMilestone(milestoneId);
    try {
      const response = await handleCompleteMilestone(
        String(projectId),
        milestoneId
      );
      console.log(response, 'response');
      toast({
        title: 'Milestone Completed',
        description: `The milestone has been completed successfully.`
      });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to complete milestone.',
        variant: 'destructive'
      });
    } finally {
      setIsCompletingMilestone(null);
    }
  };
  const updateMilestoneStatus = (milestoneId: number, newStatus: string) => {
    if (newStatus === 'completed') {
      completedMilestone(String(milestoneId));
      toast({
        title: 'Milestone Updated',
        description: `The milestone status has been updated to ${newStatus}.`
      });
    }
  };

  // Function to calculate project stats
  const calculateProjectStats = () => {
    const totalMilestones = project_details?.milestones?.length;
    const completedMilestones = project_details?.milestones?.filter(
      (m: any) => m.status === 'completed'
    )?.length;
    const inProgressMilestones = project_details?.milestones?.filter(
      (m: any) => m.status === 'in-progress'
    )?.length;

    const startDate = new Date(project_details?.startDate);
    const endDate = project_details?.completionDate
      ? new Date(project_details?.completionDate)
      : new Date(project_details?.deadline);
    const totalDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    return {
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      completionRate:
        totalMilestones > 0
          ? Math.round((completedMilestones / totalMilestones) * 100)
          : 0,
      totalDays
    };
  };

  const stats = calculateProjectStats();

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
      case 'planning':
        return (
          <Badge className="bg-amber-100 text-amber-800 border-amber-200">
            Planning
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
  useEffect(() => {
    if (projectId !== undefined) {
      handleViewProjectDetail(String(projectId));
    }
    console.log('project_details:', project_details);
  }, [fetchProjects]);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <BackButton />
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {project_details?.name || project_details?.title}
          </h1>
          <p className="text-slate-600">
            {project_details?.client || project_details?.company}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div>
            {userType === 'employer' ? (
              <Button
                type="button"
                variant="outline"
                onClick={approveProject}
                disabled={isApprovingProject || approvingOnchain}
              >
                {isApprovingProject || approvingOnchain ? (
                  <>
                    <span className="mr-2">
                      {approvingOnchain
                        ? 'Confirming on blockchain...'
                        : 'Approving...'}
                    </span>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  </>
                ) : (
                  'Approve Project'
                )}
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                onClick={completeProject}
                disabled={isCompletingProject || completingOnchain}
              >
                {isCompletingProject || completingOnchain ? (
                  <>
                    <span className="mr-2">
                      {completingOnchain
                        ? 'Confirming on blockchain...'
                        : 'Submitting...'}
                    </span>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  </>
                ) : (
                  'Submit Project'
                )}
              </Button>
            )}
          </div>
          {getStatusBadge(project_details?.status)}
        </div>
      </div>

      {/* Project Tabs */}
      <Tabs value={activeTab} onValueChange={(tab) => updateUrlTab(tab)}>
        <TabsList
          className={`${
            userType !== 'freelancer' ? 'grid-cols-5' : 'grid-cols-4'
          } grid  w-full`}
        >
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          {userType !== 'freelancer' ? (
            <TabsTrigger value="team">Team</TabsTrigger>
          ) : (
            <></>
          )}
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
                <CardDescription>Project timeline and progress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">
                      Overall Progress
                    </span>
                    <span className="text-sm">
                      {project_details?.progress}%
                    </span>
                  </div>
                  <Progress value={project_details?.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Start Date</p>
                    <p className="font-medium">
                      {new Date(
                        project_details?.startDate
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Deadline</p>
                    <p className="font-medium">
                      {new Date(project_details?.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Description</p>
                  <p className="text-sm">{project_details?.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Milestone Progress</CardTitle>
                <CardDescription>Summary of project milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm mb-2">
                  <div>
                    <p className="font-medium text-2xl">
                      {stats.completedMilestones}
                    </p>
                    <p className="text-slate-500">Completed</p>
                  </div>
                  <div>
                    <p className="font-medium text-2xl">
                      {stats.inProgressMilestones}
                    </p>
                    <p className="text-slate-500">In Progress</p>
                  </div>
                  <div>
                    <p className="font-medium text-2xl">
                      {/* {stats.totalMilestones -
                        stats.completedMilestones -
                        stats.inProgressMilestones} */}
                      {Number(stats.totalMilestones || 0) -
                        Number(stats.completedMilestones || 0) -
                        Number(stats.inProgressMilestones || 0)}
                    </p>
                    <p className="text-slate-500">Pending</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {project_details?.milestones
                    ?.slice(0, 3)
                    ?.map((milestone: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center rounded-md bg-slate-50/20 p-2"
                      >
                        <div className="flex items-center gap-2">
                          {milestone.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          ) : milestone.status === 'in-progress' ? (
                            <Clock className="h-4 w-4 text-blue-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-slate-400" />
                          )}
                          <span className="text-sm">{milestone.title}</span>
                        </div>
                        {getStatusBadge(milestone.status)}
                      </div>
                    ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-2 text-sm"
                  onClick={() => updateUrlTab('milestones')}
                >
                  View All Milestones <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {project_details?.freelancers
                    ?.slice(0, 3)
                    .map((freelancer: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {freelancer.name
                              .split(' ')
                              .map((n: string) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {freelancer.name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {freelancer.role}
                          </p>
                        </div>
                      </div>
                    ))}

                  {project_details?.freelancers?.length > 3 && (
                    <p className="text-xs text-slate-500 mt-2">
                      + {project_details?.freelancers?.length - 3} more
                    </p>
                  )}

                  {userType === 'employer' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-xs"
                      onClick={() => updateUrlTab('team')}
                    >
                      Manage Team
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-[150px] overflow-y-auto">
                  {project_details?.updates?.slice(0, 3).map((update: any) => (
                    <div key={update._id} className="text-sm">
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{update.author}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(update.date).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-xs text-slate-600 truncate">
                        {update.content.substring(0, 60)}...
                      </p>
                    </div>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 text-xs"
                  onClick={() => updateUrlTab('chat')}
                >
                  View All Updates
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Project Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Project Started</p>
                      <p className="text-xs text-slate-500">
                        {new Date(
                          project_details?.startDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-3 w-3 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Current Phase</p>
                      <p className="text-xs text-slate-500">
                        {project_details?.milestones?.find(
                          (m: any) => m.status === 'in-progress'
                        )?.title || 'Planning'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded-full bg-amber-100 flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Deadline</p>
                      <p className="text-xs text-slate-500">
                        {new Date(
                          project_details?.deadline
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {project_details?.status === 'completed' && (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Completed</p>
                        <p className="text-xs text-slate-500">
                          {new Date(
                            project_details?.completionDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {project_details?.status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle>Project Completion Report</CardTitle>
                <CardDescription>
                  Project performance summary and final stats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {project_details?.progress}%
                    </p>
                    <p className="text-sm text-slate-500">Completion Rate</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.totalDays}
                    </p>
                    <p className="text-sm text-slate-500">Days to Complete</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      {project_details?.freelancers?.length}
                    </p>
                    <p className="text-sm text-slate-500">Team Members</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-amber-600">
                      {project_details?.milestones?.length}
                    </p>
                    <p className="text-sm text-slate-500">Milestones</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">Project Summary</h3>
                  <p className="text-sm text-slate-600">
                    This project was completed successfully, meeting all primary
                    objectives and deliverables. The team overcame several
                    challenges including [specific challenges] and delivered
                    high-quality work that exceeded client expectations.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-base font-medium mb-2">
                      Client Feedback
                    </h3>
                    <div className="border rounded-md p-4 bg-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {project_details?.clientContact
                              ?.split(' ')
                              .map((n: string) => n[0])
                              .join('') || 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {project_details?.clientContact || 'Client'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(
                              project_details?.completionDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm italic">
                        "The team delivered exceptional work on this project.
                        They were responsive, professional, and met all our
                        requirements. I would definitely work with them again."
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-base font-medium mb-2">
                      Key Achievements
                    </h3>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>
                          Delivered project on schedule and within budget
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>
                          Implemented all requested features with high quality
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Maintained excellent Chat throughout</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span>Provided comprehensive documentation</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button className="gap-2">
                    <FileBarChart className="h-4 w-4" />
                    Download Full Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Milestones Tab */}
        <TabsContent value="milestones" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Project Milestones</h2>
            {userType === 'employer' &&
              project_details?.status === 'completed' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Milestone</DialogTitle>
                      <DialogDescription>
                        Add a new milestone to track project progress
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="milestone-title">Milestone Title</Label>
                        <Input
                          id="milestone-title"
                          placeholder="e.g. Design Completion"
                          value={newMilestone.title}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              title: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="milestone-date">Due Date</Label>
                        <Input
                          id="milestone-date"
                          type="date"
                          value={newMilestone.dueDate}
                          onChange={(e) =>
                            setNewMilestone({
                              ...newMilestone,
                              dueDate: e.target.value
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="milestone-status">Status</Label>
                        <Select
                          defaultValue={newMilestone.status}
                          onValueChange={(value: any) =>
                            setNewMilestone({ ...newMilestone, status: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="not-started">
                              Not Started
                            </SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() =>
                          setNewMilestone({
                            title: '',
                            dueDate: '',
                            status: 'not-started'
                          })
                        }
                      >
                        Cancel
                      </Button>
                      {/* <Button onClick={addMilestone}>Add Milestone</Button> */}
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
          </div>

          <div className="space-y-4">
            {project_details?.milestones?.map(
              (milestone: any, index: number) => (
                <Card key={index}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-blue-500" />
                        ) : milestone.status === 'in-progress' ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-slate-400" />
                        )}
                        <CardTitle className="text-base">
                          {milestone.title}
                        </CardTitle>
                      </div>
                      {getStatusBadge(milestone.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-slate-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Due: {new Date(milestone.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                  {/* // project_details?.status !== 'completed' && ( */}

                  <CardFooter>
                    {userType === 'employer' ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => approveMilestone(milestone?._id)}
                        disabled={isApprovingMilestone === milestone?._id}
                      >
                        {isApprovingMilestone === milestone?._id ? (
                          <>
                            <span className="mr-2">Approving...</span>
                            <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          </>
                        ) : (
                          'Approve Milestone'
                        )}
                      </Button>
                    ) : (
                      <Select
                        defaultValue={milestone.status}
                        onValueChange={(value: any) =>
                          updateMilestoneStatus(milestone._id, value)
                        }
                        disabled={isCompletingMilestone === milestone?._id}
                      >
                        <SelectTrigger className="w-[180px]">
                          {isCompletingMilestone === milestone?._id ? (
                            <div className="flex items-center">
                              <span className="mr-2">Updating...</span>
                              <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            </div>
                          ) : (
                            <SelectValue placeholder="Update status" />
                          )}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="in-progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </CardFooter>
                </Card>
              )
            )}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6 mt-6">
          <ProjectTeam projectDetails={project_details} />
          {/* <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Project Team</h2>
            {userType === 'employer' && project_details?.status !== 'completed' && (
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
            {project_details?.freelancers?.map((freelancer: any, idx: number) => (
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
                      <p className="text-sm text-slate-500">
                        {freelancer.role}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Joined Project</span>
                      <span>2 weeks ago</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">
                        Completed Milestones
                      </span>
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
                        !project_details?.freelancers?.some(
                          (pf: any) => pf.name === f.name
                        )
                    )
                    ?.map((freelancer) => (
                      <div
                        key={freelancer._id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 cursor-pointer"
                        onClick={() => addFreelancer(freelancer._id)}
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
          )} */}
        </TabsContent>

        {/* Chat Tab */}
        <TabsContent value="chat" className="space-y-6 mt-6">
          <h2 className="text-lg font-medium"> Project Chat</h2>

          {/* <ProjectUpdates project={project} /> */}
          <ProjectChat />
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Project Files</h2>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              Upload File
            </Button>
          </div>

          <div className="space-y-4">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-slate-50/10 px-4 py-2 border-b">
                <h3 className="font-medium">Project Documents</h3>
              </div>
              <div className="divide-y">
                {[
                  {
                    name: 'Project Proposal.pdf',
                    type: 'pdf',
                    size: '2.4 MB',
                    date: '2023-07-01'
                  },
                  {
                    name: 'Requirements Specification.docx',
                    type: 'docx',
                    size: '1.8 MB',
                    date: '2023-07-05'
                  },
                  {
                    name: 'Design Assets.zip',
                    type: 'zip',
                    size: '15.2 MB',
                    date: '2023-07-15'
                  }
                ].map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 hover:text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-700">
                        {file.type}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {file.size} • Uploaded on{' '}
                          {new Date(file.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-md overflow-hidden">
              <div className="bg-slate-50/10 px-4 py-2 border-b">
                <h3 className="font-medium">Deliverables</h3>
              </div>
              <div className="divide-y">
                {[
                  {
                    name: 'Final Presentation.pptx',
                    type: 'pptx',
                    size: '5.7 MB',
                    date: '2023-09-20'
                  },
                  {
                    name: 'Source Code.zip',
                    type: 'zip',
                    size: '28.3 MB',
                    date: '2023-09-25'
                  }
                ].map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 hover:bg-slate-50 hover:text-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-md flex items-center justify-center text-blue-700">
                        {file.type}
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {file.size} • Uploaded on{' '}
                          {new Date(file.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* If the project is completed, show the certificate/reward section */}
      {project_details?.status === 'completed' && (
        <Card className="mt-6 bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="bg-amber-100 p-4 rounded-full">
                <Gift className="h-8 w-8 text-amber-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-medium text-amber-800">
                  Project Completed Successfully!
                </h3>
                <p className="text-amber-700">
                  This project has been completed and approved. A certificate of
                  completion is available.
                </p>
              </div>
              <Button className="bg-amber-600 hover:bg-amber-700">
                View Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
