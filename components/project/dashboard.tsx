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
import { BackButton } from '../back-button';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { useProjectStore } from '@/Store/projects';
import ProjectChat from '../project-chat';
import { useStore } from '@/Store/user';
import { mongoIdToAleoU64 } from '@/libs/util';
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
  const hashProjectId = projectId ? mongoIdToAleoU64(String(projectId)) : null;
  const [hashProjectIdInput, setHashProjectIdInput] = useState(hashProjectId);
  const [assignedFreelancer, setassignedFreelancer] = useState(
    project_details?.assignedFreelancer?.walletAddress
  );
  // const assignedFreelancer = project_details?.assignedFreelancer?.walletAddress;
  const price = project_details?.price;

  // Log blockchain data for debugging
  useEffect(() => {
    if (project_details) {
      console.log('Blockchain data:', {
        hashProjectId,
        assignedFreelancer,
        price
      });
      setassignedFreelancer(project_details?.assignedFreelancer?.walletAddress);
      setHashProjectIdInput(hashProjectId);
      console.log('Hash Project ID:', hashProjectId);
      console.log('Assigned Freelancer:', assignedFreelancer);
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
    inputs: [hashProjectIdInput ? hashProjectIdInput : '0u64']
  });

  const {
    createEvent: handleOnchainEmployerAproveProject,
    loading: approvingOnchain
  } = useRequestCreateEvent({
    type: EventType.Execute,
    programId: 'escrow_contract11.aleo',
    functionId: 'release_payment',
    fee: 1.23,
    inputs: [
      hashProjectIdInput ? hashProjectIdInput : '0u64',
      assignedFreelancer ? assignedFreelancer : '0u64',
      price ? price + 'u64' : '0u64'
    ]
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
      handleViewProjectDetail(String(projectId));
      return response;
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
      if (project_details?.status !== 'completed') {
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
              handleViewProjectDetail(String(projectId));
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
        return response;
      } else {
        // Make sure we have all required data before calling blockchain function
        if (assignedFreelancer && price) {
          await handleOnchainEmployerAproveProject();
          toast({
            title: 'Project Approved',
            description: `The project has been approved successfully and payment released on blockchain.`
          });
          handleViewProjectDetail(String(projectId));
        } else {
          toast({
            title: 'Project Approved',
            description: `The project has been approved successfully, but blockchain operation failed due to missing data.`,
            variant: 'destructive'
          });
        }
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
      if (project_details?.status !== 'completed') {
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
              handleViewProjectDetail(String(projectId));
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
        return response;
      } else {
        if (hashProjectId) {
          await handleOnchainFreelancerCompletProject();
          toast({
            title: 'Project Completed',
            description: `The project has been completed successfully and recorded on blockchain.`
          });
          handleViewProjectDetail(String(projectId));
        } else {
          toast({
            title: 'Project Completed',
            description: `The project has been completed successfully, but blockchain operation failed due to invalid project ID.`,
            variant: 'destructive'
          });
        }
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
      handleViewProjectDetail(String(projectId));
      return response;
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

    const startDate = new Date(project_details?.createdAt);
    const endDate = new Date(project_details?.deadline);
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
  useEffect(() => {
    if (project_details?.status === 'completed') {
      if (userType === 'freelancer') {
        handleOnchainFreelancerCompletProject();
      } else if (userType === 'employer') {
        handleOnchainEmployerAproveProject();
      }
    }
  }, [userType]);
  return (
    <div className="space-y-6">
      <div className="mb-2">
        <BackButton path={`/${userType}`} />
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
            {project_details?.name || project_details?.title}
          </h1>
          <p className="text-gray-600 font-medium">
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
                className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 transition-all duration-200"
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
                className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 transition-all duration-200"
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
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                View Certificate
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Project Tabs */}
      <Tabs value={activeTab} onValueChange={(tab) => updateUrlTab(tab)}>
        <TabsList
          className={`${
            userType !== 'freelancer' ? 'grid-cols-4' : 'grid-cols-3'
          } grid w-full bg-white border border-blue-100 rounded-xl p-1`}
        >
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="milestones"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
          >
            Milestones
          </TabsTrigger>
          {userType !== 'freelancer' ? (
            <TabsTrigger
              value="team"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
            >
              Team
            </TabsTrigger>
          ) : (
            <></>
          )}
          <TabsTrigger
            value="files"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600 rounded-lg transition-all duration-200"
          >
            Files
          </TabsTrigger>
        </TabsList>
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl">
                  Project Overview
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Project timeline and progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">
                      Overall Progress
                    </span>
                    <span className="text-sm text-blue-600 font-medium">
                      {project_details?.progress}%
                    </span>
                  </div>
                  <Progress
                    value={project_details?.progress}
                    className="h-2 bg-blue-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p className="font-medium text-gray-900">
                      {new Date(
                        project_details?.createdAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="bg-blue-50/50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Deadline</p>
                    <p className="font-medium text-gray-900">
                      {new Date(project_details?.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Description</p>
                  <p className="text-sm text-gray-700 bg-blue-50/30 p-3 rounded-lg">
                    {project_details?.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl">
                  Milestone Progress
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Summary of project milestones
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50/50 p-4 rounded-lg text-center">
                    <p className="font-medium text-2xl text-blue-600">
                      {stats.completedMilestones}
                    </p>
                    <p className="text-gray-500">Completed</p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-lg text-center">
                    <p className="font-medium text-2xl text-blue-600">
                      {stats.inProgressMilestones}
                    </p>
                    <p className="text-gray-500">In Progress</p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-lg text-center">
                    <p className="font-medium text-2xl text-blue-600">
                      {Number(stats.totalMilestones || 0) -
                        Number(stats.completedMilestones || 0) -
                        Number(stats.inProgressMilestones || 0)}
                    </p>
                    <p className="text-gray-500">Pending</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {project_details?.milestones
                    ?.slice(0, 3)
                    ?.map((milestone: any, index: number) => (
                      <div
                        key={index}
                        className="flex justify-between items-center rounded-lg bg-blue-50/30 p-3 hover:bg-blue-50/50 transition-all duration-200"
                      >
                        <div className="flex items-center gap-2">
                          {milestone.status === 'completed' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : milestone.status === 'in-progress' ? (
                            <Clock className="h-4 w-4 text-blue-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-gray-700">
                            {milestone.title}
                          </span>
                        </div>
                        {getStatusBadge(milestone.status)}
                      </div>
                    ))}
                </div>

                <Button
                  variant="outline"
                  className="w-full mt-2 text-sm bg-white hover:bg-blue-50 border-blue-200 text-blue-600 transition-all duration-200"
                  onClick={() => updateUrlTab('milestones')}
                >
                  View All Milestones <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <Card className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-gray-900">
                  Project Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Project Started
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          project_details?.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Clock className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Current Phase
                      </p>
                      <p className="text-xs text-gray-500">
                        {project_details?.milestones?.find(
                          (m: any) => m.status === 'in-progress'
                        )?.title || 'Planning'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Deadline
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(
                          project_details?.deadline
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {project_details?.status === 'completed' && (
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Completed
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            project_details?.deadline
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
            <Card className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <CardHeader>
                <CardTitle className="text-gray-900 text-xl">
                  Project Completion Report
                </CardTitle>
                <CardDescription className="text-gray-500">
                  Project performance summary and final stats
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50/50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {project_details?.progress}%
                    </p>
                    <p className="text-sm text-gray-500">Completion Rate</p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {stats?.totalDays}
                    </p>
                    <p className="text-sm text-gray-500">Days to Complete</p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">1</p>
                    <p className="text-sm text-gray-500">Team Members</p>
                  </div>
                  <div className="bg-blue-50/50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {project_details?.milestones?.length}
                    </p>
                    <p className="text-sm text-gray-500">Milestones</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900">
                    Project Summary
                  </h3>
                  <p className="text-sm text-gray-700 bg-blue-50/30 p-4 rounded-lg">
                    {project_details?.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <h3 className="text-base font-medium mb-2 text-gray-900">
                      Client Feedback
                    </h3>
                    <div className="border border-blue-100 rounded-lg text-gray-500 p-4 bg-blue-50/30">
                      <div className="flex items-center gap-2 mb-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {project_details?.clientContact
                              ?.split(' ')
                              .map((n: string) => n[0])
                              .join('') || 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {project_details?.clientContact || 'Client'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(
                              project_details?.completionDate
                            ).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm italic text-gray-600">
                        "The team delivered exceptional work on this project.
                        They were responsive, professional, and met all our
                        requirements. I would definitely work with them again."
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <Button className="gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
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
            <h2 className="text-xl font-medium text-gray-900">
              Project Milestones
            </h2>
            {userType === 'employer' &&
              project_details?.status === 'completed' && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      className="gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
                    >
                      <Plus className="h-4 w-4" />
                      Add Milestone
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white border border-blue-100 rounded-xl">
                    <DialogHeader>
                      <DialogTitle className="text-gray-900 text-xl">
                        Add New Milestone
                      </DialogTitle>
                      <DialogDescription className="text-gray-500">
                        Add a new milestone to track project progress
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="milestone-title"
                          className="text-gray-700"
                        >
                          Milestone Title
                        </Label>
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
                          className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="milestone-date"
                          className="text-gray-700"
                        >
                          Due Date
                        </Label>
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
                          className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="milestone-status"
                          className="text-gray-700"
                        >
                          Status
                        </Label>
                        <Select
                          defaultValue={newMilestone.status}
                          onValueChange={(value: any) =>
                            setNewMilestone({ ...newMilestone, status: value })
                          }
                        >
                          <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
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
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 transition-all duration-200"
                      >
                        Cancel
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
          </div>

          <div className="space-y-4">
            {project_details?.milestones?.map(
              (milestone: any, index: number) => (
                <Card
                  key={index}
                  className="bg-white border border-blue-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : milestone.status === 'in-progress' ? (
                          <Clock className="h-5 w-5 text-blue-500" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                        <CardTitle className="text-base text-gray-900">
                          {milestone.title}
                        </CardTitle>
                      </div>
                      {getStatusBadge(milestone.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>
                        Due: {new Date(milestone.deadline).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>

                  <CardFooter>
                    {userType === 'employer' ? (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => approveMilestone(milestone?._id)}
                        disabled={
                          isApprovingMilestone === milestone?._id ||
                          milestone?.status === 'completed'
                        }
                        className="bg-white hover:bg-blue-50 border-blue-200 text-blue-600 transition-all duration-200"
                      >
                        {milestone.status === 'completed' ? (
                          <span className="text-gray-500">
                            Milestone Completed
                          </span>
                        ) : (
                          <>
                            {isApprovingMilestone === milestone?._id ? (
                              <>
                                <span className="mr-2">Approving...</span>
                                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                              </>
                            ) : (
                              'Approve Milestone'
                            )}
                          </>
                        )}
                      </Button>
                    ) : (
                      <>
                        {' '}
                        {milestone.status === 'completed' ? (
                          <span className="text-gray-500">
                            Milestone Completed
                          </span>
                        ) : (
                          <Select
                            defaultValue={milestone.status}
                            onValueChange={(value: any) =>
                              updateMilestoneStatus(milestone._id, value)
                            }
                            disabled={
                              isCompletingMilestone === milestone?._id ||
                              milestone.status === 'completed'
                            }
                          >
                            <SelectTrigger className="w-[180px] bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
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
                              <SelectItem value="completed">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      </>
                    )}
                  </CardFooter>
                </Card>
              )
            )}
          </div>
        </TabsContent>

        {/* Files Tab */}
        <TabsContent value="files" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-gray-900">Project Files</h2>
            <Button
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200"
            >
              <Plus className="h-4 w-4" />
              Upload File
            </Button>
          </div>

          <div className="space-y-4">
            <div className="border border-blue-100 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all duration-200">
              <div className="bg-blue-50/50 px-4 py-2 border-b border-blue-100">
                <h3 className="font-medium text-gray-900">Project Documents</h3>
              </div>
              <div className="divide-y divide-blue-100">
                {project_details?.medias?.map((file: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 hover:bg-blue-50/30 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-gray-900">{file.name}</p>
                        <p className="text-xs text-gray-500"></p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hover:bg-blue-50 text-blue-600"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
