'use client';

import { useEffect, useState, useCallback } from 'react';
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
 import {
  Calendar,
  Clock,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
 import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ProjectUpdates } from './project-updates';
import { ProjectDashboard } from './project-dashboard';
import { ProjectReport } from './project-report';
import { useProjectStore } from '@/Store/projects';
import { InvitationCard } from '@/components/cards/projects-Invitation-card';
import { mongoIdToAleoU64,MainnetProgramId,TestnetProgramId } from '@/libs/util';
import { EventType, useRequestCreateEvent } from '@puzzlehq/sdk';
import { useAccount } from '@puzzlehq/sdk';

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
    fetchFreelancerCompletedProjects,
    freelancer_completed_projects,
    freelancer_projects
  } = useProjectStore();
  const router = useRouter();
  const { account } = useAccount();

  // Loading state with more detailed information
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    stage: 'idle', // 'idle', 'accepting-backend', 'creating-blockchain', 'completed', 'failed'
    message: '',
    currentProjectId: '',
    currentInvitationId: ''
  });

  // State to store the current project ID for blockchain operation
  const [blockchainProjectId, setBlockchainProjectId] = useState('');

   const {
    createEvent,
    eventId,
    loading: blockchainLoading,
    error: blockchainError,
    settlementStatus: blockchainStatus
  } = useRequestCreateEvent();
  // Monitor blockchain status changes
  useEffect(() => {
    if (blockchainStatus === 'Settled' && eventId) {
      console.log('Blockchain transaction settled successfully:', eventId);

      // Update loading state to completed
      setLoadingState((prev) => ({
        ...prev,
        stage: 'completed',
        message:
          'Invitation accepted and blockchain record created successfully!'
      }));

      // Show success message
      toast({
        title: 'Invite Accepted',
        description:
          'The invite has been accepted successfully and payment released on blockchain.'
      });

      // Reset after a delay
      setTimeout(() => {
        setLoadingState({
          isLoading: false,
          stage: 'idle',
          message: '',
          currentProjectId: '',
          currentInvitationId: ''
        });
        setBlockchainProjectId('');
      }, 2000);
    } else if (blockchainStatus === 'Failed' && eventId) {
      console.error('Blockchain transaction failed:', eventId);

      // Update loading state to failed
      setLoadingState((prev) => ({
        ...prev,
        stage: 'failed',
        message: 'Blockchain transaction failed. Please try again.'
      }));

      // Show error message
      toast({
        title: 'Blockchain Error',
        description:
          'The blockchain transaction failed. The invitation was accepted in the database, but the blockchain record could not be created.',
        variant: 'destructive'
      });

      // Reset after a delay
      setTimeout(() => {
        setLoadingState({
          isLoading: false,
          stage: 'idle',
          message: '',
          currentProjectId: '',
          currentInvitationId: ''
        });
        setBlockchainProjectId('');
      }, 3000);
    }
  }, [blockchainStatus, eventId]);

  // Monitor blockchain errors
  useEffect(() => {
    if (blockchainError && loadingState.stage === 'creating-blockchain') {
      console.error('Blockchain error:', blockchainError);

      // Update loading state to failed
      setLoadingState((prev) => ({
        ...prev,
        stage: 'failed',
        message: `Blockchain error: ${
          blockchainError || 'Unknown error'
        }`
      }));

      // Show error message
      toast({
        title: 'Blockchain Error',
        description:
          blockchainError ||
          'An error occurred during the blockchain operation',
        variant: 'destructive'
      });
    }
  }, [blockchainError, loadingState.stage]);

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
  // Combined function to handle both backend and blockchain operations
  const handleAcceptOnchain = async (projectId: string) => {
    // Hash the project ID for blockchain
    const hashedProjectId = mongoIdToAleoU64(projectId);
    console.log('Project ID:', projectId);
    console.log('Hashed Project ID for blockchain:', hashedProjectId);

    // Store the hashed project ID
    setBlockchainProjectId(hashedProjectId);

    // Update loading state
    setLoadingState((prev) => ({
      ...prev,
      stage: 'creating-blockchain',
      message: 'Creating blockchain record...'
    }));

    try {
      // Execute the blockchain transaction with the correct parameters
      await createEvent({
        type: EventType.Execute,
        programId:
          account?.network === 'AleoTestnet'
            ? TestnetProgramId
            : MainnetProgramId,
        functionId: 'accept_job',
        fee: 1.23,
        inputs: [hashedProjectId]
      });

      console.log('Blockchain transaction initiated with event ID:', eventId);
    } catch (blockchainError: any) {
      console.error('Error executing blockchain transaction:', blockchainError);

      // Update loading state to failed
      setLoadingState((prev) => ({
        ...prev,
        stage: 'failed',
        message:
          blockchainError.message || 'Failed to create blockchain record'
      }));

      // Show error message
      toast({
        title: 'Blockchain Error',
        description:
          blockchainError.message || 'Failed to create blockchain record',
        variant: 'destructive'
      });
    }
  }
  const handleAcceptInner = async (invitationId: string, projectId: string) => {
    // Reset loading state and set initial values
    setLoadingState({
      isLoading: true,
      stage: 'accepting-backend',
      message: 'Accepting invitation...',
      currentProjectId: projectId,
      currentInvitationId: invitationId
    });

    try {
      // Log the input values
      console.log('Invitation ID:', invitationId);
      console.log('Project ID:', projectId);

      // Check if wallet is connected
      if (!account?.address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        );
      }

      // Step 1: Accept the invitation in the backend
      setLoadingState((prev) => ({
        ...prev,
        stage: 'accepting-backend',
        message: 'Accepting invitation in the database...'
      }));

      const response = await handleProjectInviteResponse(
        invitationId,
        'accept'
      );
      console.log('Backend response:', response);

      // Check if the backend operation was successful
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
          // Step 2: Create the blockchain record

          // Hash the project ID for blockchain
          const hashedProjectId = mongoIdToAleoU64(projectId);
          console.log('Project ID:', projectId);
          console.log('Hashed Project ID for blockchain:', hashedProjectId);

          // Store the hashed project ID
          setBlockchainProjectId(hashedProjectId);

          // Update loading state
          setLoadingState((prev) => ({
            ...prev,
            stage: 'creating-blockchain',
            message: 'Creating blockchain record...'
          }));

          try {
            // Execute the blockchain transaction with the correct parameters
            await createEvent({
              type: EventType.Execute,
              programId:
                account?.network === 'AleoTestnet'
                  ? TestnetProgramId
                  : MainnetProgramId,
              functionId: 'accept_job',
              fee: 1.23,
              inputs: [hashedProjectId]
            });

            console.log(
              'Blockchain transaction initiated with event ID:',
              eventId
            );

            // Note: The success/failure handling is done in the useEffect hooks that monitor blockchainStatus
          } catch (blockchainError: any) {
            console.error(
              'Error executing blockchain transaction:',
              blockchainError
            );

            // Update loading state to failed
            setLoadingState((prev) => ({
              ...prev,
              stage: 'failed',
              message:
                blockchainError.message || 'Failed to create blockchain record'
            }));

            // Show error message
            toast({
              title: 'Blockchain Error',
              description:
                blockchainError.message || 'Failed to create blockchain record',
              variant: 'destructive'
            });

            // Show partial success message since the backend operation succeeded
            toast({
              title: 'Partial Success',
              description:
                'The invitation was accepted in the database, but the blockchain operation failed.',
              variant: 'default'
            });

            // Reset after a delay
            setTimeout(() => {
              setLoadingState({
                isLoading: false,
                stage: 'idle',
                message: '',
                currentProjectId: '',
                currentInvitationId: ''
              });
              setBlockchainProjectId('');
            }, 3000);
          }
        } else {
          throw new Error('Invalid response from backend');
        }
      } else {
        throw new Error('Failed to accept invitation in backend');
      }
    } catch (error: any) {
      console.error('Error accepting invitation:', error);

      // Update loading state to failed
      setLoadingState((prev) => ({
        ...prev,
        stage: 'failed',
        message: error.message || 'Failed to accept invitation'
      }));

      toast({
        title: 'Error',
        description: error.message || 'Failed to accept invitation',
        variant: 'destructive'
      });

      // Reset after a delay
      setTimeout(() => {
        setLoadingState({
          isLoading: false,
          stage: 'idle',
          message: '',
          currentProjectId: '',
          currentInvitationId: ''
        });
        setBlockchainProjectId('');
      }, 2000);
    } finally {
      // Refresh data regardless of outcome
      fetchProjects();
      fetchFreelancerProjects();
    }
  };

  const handleAccept = useCallback(handleAcceptInner, [
    account?.address,
    handleProjectInviteResponse,
    createEvent,
    eventId,
    fetchProjects,
    fetchFreelancerProjects
  ]);

  const handleReject = async (id: string) => {
    setLoadingState({
      isLoading: true,
      stage: 'accepting-backend',
      message: 'Rejecting invitation...',
      currentProjectId: '',
      currentInvitationId: id
    });

    try {
      const res = await handleProjectInviteResponse(id, 'reject');
      console.log(res);

      toast({
        title: 'Invite Rejected',
        description: 'The invitation has been rejected successfully.'
      });
    } catch (error) {
      console.error('Error rejecting invitation:', error);

      toast({
        title: 'Error',
        description: 'Failed to reject invitation',
        variant: 'destructive'
      });
    } finally {
      setLoadingState({
        isLoading: false,
        stage: 'idle',
        message: '',
        currentProjectId: '',
        currentInvitationId: ''
      });

      fetchProjects();
      fetchFreelancerProjects();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await handleViewProjectInvitationsList();
      await fetchFreelancerProjects();
      await fetchFreelancerCompletedProjects();
    };
    fetchData();
  }, [handleViewProjectInvitationsList, fetchFreelancerProjects]);

  // Loading overlay component
  const LoadingOverlay = () => {
    if (!loadingState.isLoading) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <div className="flex flex-col items-center text-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {loadingState.stage === 'accepting-backend'
                ? 'Processing Invitation'
                : loadingState.stage === 'creating-blockchain'
                ? 'Creating Blockchain Record'
                : loadingState.stage === 'completed'
                ? 'Operation Complete'
                : loadingState.stage === 'failed'
                ? 'Operation Failed'
                : 'Processing...'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">{loadingState.message}</p>

            {loadingState.stage === 'creating-blockchain' && (
              <div className="w-full mb-4">
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full animate-pulse"
                    style={{ width: '60%' }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Please wait while the blockchain transaction is being
                  processed. Do not close this window.
                </p>
              </div>
            )}

            {(loadingState.stage === 'completed' ||
              loadingState.stage === 'failed') && (
              <Button
                onClick={() => {
                  setLoadingState({
                    isLoading: false,
                    stage: 'idle',
                    message: '',
                    currentProjectId: '',
                    currentInvitationId: ''
                  });
                  setBlockchainProjectId('');
                }}
                className="mt-2"
              >
                Close
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Loading overlay */}
      <LoadingOverlay />

      <div>
        <h2 className="lg:text-2xl text-lg font-semibold text-gray-900">
          My Projects
        </h2>
        <p className="text-gray-700 lg:text-base text-xs">
          Manage your active projects and view completed work.
        </p>
      </div>

      <Tabs defaultValue="active">
        <TabsList className=" p-1 bg-white/50 backdrop-blur-sm rounded-xl shadow-sm border border-gray-100">
          <TabsTrigger
            value="active"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
          >
            Active Projects
          </TabsTrigger>
          <TabsTrigger
            value="invites"
            className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 transition-all duration-200"
          >
            {' '}
            Projects Invites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="mt-4 space-y-4">
          {Array.isArray(freelancer_projects?.data) &&
            freelancer_projects.data.map((project: any, index: number) => (
              <Card
                key={index}
                className={expandedProject === index ? 'border-blue-300' : ''}
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

                  {/* <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {project?.clientContact
                          ?.split(' ')
                          ?.map((n: string) => n[0])
                          ?.join('')}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{project?.clientContact}</span>
                  </div> */}

                  {expandedProject === project?.id && (
                    <div className="mt-4 space-y-4 bg-gray-100 rounded p-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">
                          Project Description
                        </h4>
                        <p className="text-sm">{project?.description}</p>
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
                                        className="flex justify-between items-center p-2 bg-white rounded-md"
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
                                          <div>
                                            {' '}
                                            {getStatusBadge(milestone?.status)}
                                          </div>

                                          {/* <Select
                                            defaultValue={milestone.status}
                                          >
                                            <SelectTrigger className="h-7 w-[130px]">
                                              <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              <SelectItem value="planning">
                                                Planning
                                              </SelectItem>
                                               <SelectItem value="in_progress">
                                                In Progress
                                              </SelectItem>
                                              <SelectItem value="on_hold">
                                                on hold
                                              </SelectItem> 
                                              <SelectItem value="completed">
                                                Completed
                                              </SelectItem>
                                            </SelectContent>
                                          </Select> */}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              </div>

                              {/* <ProjectUpdates project={project} /> */}
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
                    {expandedProject === index ? (
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
                    onClick={() =>
                      router.replace(`project-dashboard/${project._id}`)
                    }
                  >
                    Project Dashboard
                  </Button>
                </CardFooter>
              </Card>
            ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-4 space-y-4">
          {Array.isArray(freelancer_completed_projects?.data) &&
            freelancer_completed_projects.data.map((project: any) => (
              <Card key={project?._id}>
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
                          {project?.milestones.map((milestone: any) => (
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
              acceptOnchain={handleAcceptOnchain}
              isLoading={
                loadingState.isLoading &&
                loadingState.currentInvitationId === project._id
              }
              rejectLoading={
                loadingState.isLoading &&
                loadingState.currentInvitationId === project._id &&
                loadingState.stage === 'accepting-backend'
              }
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
