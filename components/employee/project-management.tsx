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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Calendar,
  Plus,
  Users,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProjectDashboard } from '@/components/project-dashboard';
import { ProjectReport } from '@/components/project-report';
import { useRouter } from 'next/navigation';
import { useUserProfileStore } from '@/Store/userProfile';
import { useProjectStore } from '@/Store/projects';
import {
  mongoIdToAleoU64,
  MainnetProgramId,
  TestnetProgramId,
  TestnetEscrowAddress,
  MainnetEscrowAddress
} from '@/libs/util';
import { EventType, useRequestCreateEvent } from '@puzzlehq/sdk';
import { useAccount } from '@puzzlehq/sdk';

export function ProjectManagement() {
  const router = useRouter();
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const { handleUploadMedia, media } = useUserProfileStore();
  const [previewImage, setPreviewImage] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Replace the simple isUploading state with a more detailed loading state
  const [isUploading, setIsUploading] = useState(false);
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    stage: 'idle', // 'idle', 'validating', 'creating-backend', 'creating-blockchain', 'completed', 'failed'
    message: '',
    isBlockchainProcessing: false
  });
  const {
    handleCreateProject,
    fetchProjects,
    fetchCompletedProjects,
    completed_projects,
    projects
  } = useProjectStore();
  const [projectPayload, setProjectPayload] = useState({
    name: 'Website Redesign',
    description:
      'A project to redesign the company website for better UX and performance.',
    deadline: '2025-08-30T23:59:59.000Z',
    medias: [
      {
        name: 'Homepage Mockup',
        url: 'https://example.com/media/homepage-mockup.png'
      },
      {
        name: 'Logo',
        url: 'https://example.com/media/logo.svg'
      }
    ],
    status: 'planning',
    milestones: [
      {
        title: 'Wireframe Approval',
        description: 'Get wireframes approved by stakeholders.',
        deadline: '2025-08-10T12:00:00.000Z',
        status: 'planning'
      }
    ],
    price: 2 // aleo token
  });

  const {
    account,
    error: accountError,
    loading: accountLoading
  } = useAccount();

  // We'll use these directly in the createProject function
  const { createEvent } = useRequestCreateEvent({
    type: EventType.Execute,
    programId:
      account?.network === 'AleoTestnet' ? TestnetProgramId : MainnetProgramId,
    functionId: 'create_job',
    fee: 1.23,
    inputs: ['', '0u64', ''] // These will be updated before calling createEvent
  });

  const uploadedImage = async (image: any) => {
    setIsUploading(true);
    const formData = new FormData();
    if (image) {
      formData.append('media', image);
    }

    try {
      const response = await handleUploadMedia(formData);
      if (media) {
        toast({
          title: 'Image uploaded successfully',
          description: 'Your profile image has been updated.',
          variant: 'default'
        });
        setPreviewImage(media[0]);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: 'Upload failed',
        description:
          'There was a problem uploading your image. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Merged function that handles both project creation and blockchain job creation
  const createProject = async () => {
    // Reset previous errors
    setErrors({});

    // Update loading state for validation
    setLoadingState({
      isLoading: true,
      stage: 'validating',
      message: 'Validating project information...',
      isBlockchainProcessing: false
    });

    // Validate required fields
    const newErrors: Record<string, string> = {};

    if (!projectPayload.name.trim()) {
      newErrors.name = 'Project name is required';
    }

    if (!projectPayload.description.trim()) {
      newErrors.description = 'Project description is required';
    }

    if (!projectPayload.deadline) {
      newErrors.deadline = 'Deadline is required';
    }

    if (!projectPayload.price || projectPayload.price <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (projectPayload.milestones.length === 0) {
      newErrors.milestones = 'At least one milestone is required';
    } else {
      // Validate each milestone
      projectPayload.milestones.forEach((milestone, index) => {
        if (!milestone.title.trim()) {
          newErrors[`milestone-${index}-title`] = 'Milestone title is required';
        }
        if (!milestone.deadline) {
          newErrors[`milestone-${index}-deadline`] =
            'Milestone deadline is required';
        }
      });
    }

    // If there are validation errors, show them and stop
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        variant: 'destructive'
      });

      // Reset loading state
      setLoadingState({
        isLoading: false,
        stage: 'idle',
        message: '',
        isBlockchainProcessing: false
      });

      return;
    }

    // Check wallet connection before proceeding
    if (!account?.address) {
      toast({
        title: 'Wallet Error',
        description:
          'Please connect your wallet to create a blockchain project',
        variant: 'destructive'
      });

      setLoadingState({
        isLoading: false,
        stage: 'idle',
        message: '',
        isBlockchainProcessing: false
      });

      return;
    }

    // Update loading state for backend creation
    setLoadingState({
      isLoading: true,
      stage: 'creating-backend',
      message: 'Creating project in database...',
      isBlockchainProcessing: false
    });

    try {
      // Step 1: Create the project in the backend
      const response = await handleCreateProject(projectPayload);

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
          // Project created successfully in backend
          console.log('Project created successfully with ID:', data._id);

          // Step 2: Create the blockchain job with the new project ID
          try {
            // Update loading state for blockchain creation
            setLoadingState({
              isLoading: true,
              stage: 'creating-blockchain',
              message: 'Creating blockchain record...',
              isBlockchainProcessing: true
            });

            // Hash the jobId properly using mongoIdToAleoU64
            // 1000000 microAleos = 1 Aleo token
            const hashedJobId = mongoIdToAleoU64(data._id);
            const baseAmount = Number(projectPayload.price) * 1000000;
            const paymentAmount =
              (baseAmount + baseAmount * 0.02).toString() + 'u64';

            // Log the values for debugging
            console.log('Creating blockchain job with:', {
              originalJobId: data._id,
              hashedJobId,
              paymentAmount,
              walletAddress: account.address
            });
      const EscrowAddress = account.network === 'AleoTestnet'?
              TestnetEscrowAddress :
              MainnetEscrowAddress;
            // Execute the blockchain transaction
            await createEvent({
              type: EventType.Execute,
              programId:
                account?.network === 'AleoTestnet'
                  ? TestnetProgramId
                  : MainnetProgramId,
              functionId: 'create_job',
              fee: 1.4,
              inputs: [hashedJobId, paymentAmount, EscrowAddress]
            });

            // Blockchain job created successfully
            toast({
              title: 'Project Created',
              description:
                'Your project has been created successfully and recorded on blockchain.'
            });

            // Update loading state to completed
            setLoadingState({
              isLoading: true,
              stage: 'completed',
              message:
                'Project created successfully and recorded on blockchain!',
              isBlockchainProcessing: false
            });

            // Fetch updated projects list
            fetchProjects();

            // Close the form after a short delay to show the success message
            setTimeout(() => {
              setIsCreatingProject(false);
              setLoadingState({
                isLoading: false,
                stage: 'idle',
                message: '',
                isBlockchainProcessing: false
              });
            }, 2000);
          } catch (blockchainError) {
            // Blockchain job creation failed
            console.error('Blockchain job creation failed:', blockchainError);

            toast({
              title: 'Partial Success',
              description:
                'Project was created but blockchain recording failed. You can try again later.',
              variant: 'destructive'
            });

            // Update loading state to failed
            setLoadingState({
              isLoading: true,
              stage: 'failed',
              message: 'Project was created but blockchain recording failed.',
              isBlockchainProcessing: false
            });

            // Fetch updated projects list anyway
            fetchProjects();

            // Close the form after a short delay
            setTimeout(() => {
              setIsCreatingProject(false);
              setLoadingState({
                isLoading: false,
                stage: 'idle',
                message: '',
                isBlockchainProcessing: false
              });
            }, 3000);
          }
        } else {
          // Backend project creation failed
          throw new Error('Failed to create project in backend');
        }
      } else {
        // Invalid response from backend
        throw new Error('Invalid response from backend');
      }
    } catch (error: any) {
      // Handle any errors from the backend project creation
      console.error('Error creating project:', error);

      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });

      // Reset loading state
      setLoadingState({
        isLoading: false,
        stage: 'idle',
        message: '',
        isBlockchainProcessing: false
      });
    }
  };

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
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            Completed
          </Badge>
        );
      case 'in_progress':
        return (
          <Badge
            variant="outline"
            className="bg-blue-50 text-blue-700 border-blue-200"
          >
            In Progress
          </Badge>
        );
      case 'planning':
        return (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200"
          >
            Planning
          </Badge>
        );
      case 'not_started':
        return (
          <Badge
            variant="outline"
            className="bg-slate-100 text-slate-800 border-slate-200"
          >
            Not Started
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  useEffect(() => {
    fetchProjects();
    fetchCompletedProjects({ status: 'completed' });
    console.log('completed_projects:', completed_projects);
  }, []);

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

        <ProjectDashboard project={selectedProject} userType="employee" />
      </div>
    );
  }

  // If showing the project report
  if (showReport && selectedProject) {
    return (
      <div className="space-y-6 w-full">
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

        <ProjectReport project={selectedProject} userType="employee" />
      </div>
    );
  }

  // Add this right after the return statement
  return (
    <>
      {/* Loading Overlay */}
      {loadingState.isLoading && (
        <div className="fixed inset-0 bg-blue-500/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full border border-slate-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin mb-6"></div>
              <h3 className="text-xl font-semibold mb-3 text-slate-900">
                {loadingState.stage === 'validating' &&
                  'Validating Project Information'}
                {loadingState.stage === 'creating-backend' &&
                  'Creating Project'}
                {loadingState.stage === 'creating-blockchain' &&
                  'Recording on Blockchain'}
                {loadingState.stage === 'completed' && 'Project Created!'}
                {loadingState.stage === 'failed' && 'Operation Failed'}
              </h3>
              <p className="text-slate-600 mb-6">{loadingState.message}</p>

              {loadingState.stage === 'creating-blockchain' && (
                <div className="w-full mb-6">
                  <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 animate-pulse"></div>
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Blockchain operations may take a few minutes. Please don't
                    close this window.
                  </p>
                </div>
              )}

              {(loadingState.stage === 'completed' ||
                loadingState.stage === 'failed') && (
                <Button
                  onClick={() =>
                    setLoadingState((prev) => ({ ...prev, isLoading: false }))
                  }
                  className="mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loadingState.stage === 'completed' ? 'Continue' : 'Close'}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8 w-full">
        <div className="flex lg:flex-row flex-col justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-slate-900">
              Manage Projects
            </h2>
            <p className="text-slate-600">
              Organize and track projects with your hired freelancers.
            </p>
          </div>
          <Button
            onClick={() => setIsCreatingProject(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        {isCreatingProject ? (
          <Card className="border-slate-200 bg-white shadow-lg">
            {/* create project */}
            <CardHeader className="bg-slate-50 border-b border-slate-200">
              <CardTitle className="text-xl text-slate-900">
                Create New Project
              </CardTitle>
              <CardDescription className="text-slate-600">
                Set up a new project and assign freelancers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700">
                  Project Name
                </Label>
                <Input
                  id="name"
                  placeholder="e.g. Website Redesign"
                  value={projectPayload.name}
                  onChange={(e) =>
                    setProjectPayload({
                      ...projectPayload,
                      name: e.target.value
                    })
                  }
                  className={`${
                    errors.name ? 'border-red-500' : 'border-slate-200'
                  } focus:ring-2 focus:ring-blue-500`}
                  disabled={loadingState.isLoading}
                />
                {errors.name && (
                  <p className="text-sm text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700" htmlFor="description">
                  Project Description
                </Label>
                <Textarea
                  id="description"
                  value={projectPayload.description}
                  onChange={(e) =>
                    setProjectPayload({
                      ...projectPayload,
                      description: e.target.value
                    })
                  }
                  rows={3}
                  placeholder="Describe the project scope and goals..."
                  className={errors.description ? 'border-red-500' : ''}
                  disabled={loadingState.isLoading}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid gap-4">
                {/* <div className="space-y-2">
                  <Label className="text-slate-700" htmlFor="startDate">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    disabled={loadingState.isLoading}
                  />
                </div> */}
                <div className="space-y-2 ">
                  <Label className="text-slate-700" htmlFor="deadline">
                    Deadline
                  </Label>
                  <Input
                    id="deadline"
                    type="date"
                     value={
                      projectPayload.deadline
                        ? new Date(projectPayload.deadline)
                            .toISOString()
                            .split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setProjectPayload({
                        ...projectPayload,
                        deadline: e.target.value
                      })
                    }
                    className={errors.deadline ? 'border-red-500' : ''}
                    disabled={loadingState.isLoading}
                  />
                  {errors.deadline && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.deadline}
                    </p>
                  )}
                </div>
              </div>
              {/* [planning, in_progress, completed, on_hold, cancelled] */}
              <div className="space-y-2">
                <Label className="text-slate-700" htmlFor="status">
                  Project Status
                </Label>
                <Select
                  defaultValue="planning"
                  onValueChange={(value) =>
                    setProjectPayload({ ...projectPayload, status: value })
                  }
                  value={projectPayload.status}
                  disabled={loadingState.isLoading}
                >
                  <SelectTrigger className="text-slate-700">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="on_hold">on hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>{' '}
              <div className="space-y-2">
                <Label className="text-slate-700" htmlFor="price">
                  Project Price (Aleo tokens) + 2% fee
                </Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={projectPayload.price}
                    onChange={(e) =>
                      setProjectPayload({
                        ...projectPayload,
                        price: Number.parseFloat(e.target.value) || 0
                      })
                    }
                    className={errors.price ? 'border-red-500' : ''}
                    disabled={loadingState.isLoading}
                  />
                  {errors.price && (
                    <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Project Milestones</Label>
                {errors.milestones && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.milestones}
                  </p>
                )}
                <div className="space-y-4 border border-slate-200 rounded-md p-4">
                  {projectPayload.milestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="space-y-2 pb-4 border-b border-slate-200 last:border-b-0 last:pb-0"
                    >
                      <div className="flex justify-between">
                        <h4 className="text-sm text-slate-700 font-medium">
                          Milestone {index + 1}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500"
                          onClick={() => {
                            const updatedMilestones = [
                              ...projectPayload.milestones
                            ];
                            updatedMilestones.splice(index, 1);
                            setProjectPayload({
                              ...projectPayload,
                              milestones: updatedMilestones
                            });
                          }}
                          disabled={loadingState.isLoading}
                        >
                          <span className="sr-only text-slate-700">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <Label htmlFor={`milestone-title-${index}`}>
                            Title
                          </Label>
                          <Input
                            id={`milestone-title-${index}`}
                            value={milestone.title}
                            onChange={(e) => {
                              const updatedMilestones = [
                                ...projectPayload.milestones
                              ];
                              updatedMilestones[index].title = e.target.value;
                              setProjectPayload({
                                ...projectPayload,
                                milestones: updatedMilestones
                              });
                            }}
                            placeholder="Milestone title"
                            className={
                              errors[`milestone-${index}-title`]
                                ? 'border-red-500'
                                : ''
                            }
                            disabled={loadingState.isLoading}
                          />
                          {errors[`milestone-${index}-title`] && (
                            <p className="text-xs text-red-500 mt-1">
                              {errors[`milestone-${index}-title`]}
                            </p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor={`milestone-description-${index}`}>
                            Description
                          </Label>
                          <Textarea
                            id={`milestone-description-${index}`}
                            value={milestone.description}
                            onChange={(e) => {
                              const updatedMilestones = [
                                ...projectPayload.milestones
                              ];
                              updatedMilestones[index].description =
                                e.target.value;
                              setProjectPayload({
                                ...projectPayload,
                                milestones: updatedMilestones
                              });
                            }}
                            placeholder="Describe this milestone"
                            rows={2}
                            disabled={loadingState.isLoading}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <Label htmlFor={`milestone-deadline-${index}`}>
                              Deadline
                            </Label>
                            <Input
                              id={`milestone-deadline-${index}`}
                              type="date"
                              value={
                                milestone.deadline
                                  ? new Date(milestone.deadline)
                                      .toISOString()
                                      .split('T')[0]
                                  : ''
                              }
                              onChange={(e) => {
                                const updatedMilestones = [
                                  ...projectPayload.milestones
                                ];
                                updatedMilestones[index].deadline = new Date(
                                  e.target.value
                                ).toISOString();
                                setProjectPayload({
                                  ...projectPayload,
                                  milestones: updatedMilestones
                                });
                              }}
                              className={
                                errors[`milestone-${index}-deadline`]
                                  ? 'border-red-500'
                                  : ''
                              }
                              disabled={loadingState.isLoading}
                            />
                            {errors[`milestone-${index}-deadline`] && (
                              <p className="text-xs text-red-500 mt-1">
                                {errors[`milestone-${index}-deadline`]}
                              </p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor={`milestone-status-${index}`}>
                              Status
                            </Label>
                            <Select
                              value={milestone.status}
                              onValueChange={(value) => {
                                const updatedMilestones = [
                                  ...projectPayload.milestones
                                ];
                                updatedMilestones[index].status = value;
                                setProjectPayload({
                                  ...projectPayload,
                                  milestones: updatedMilestones
                                });
                              }}
                              disabled={loadingState.isLoading}
                            >
                              <SelectTrigger
                                id={`milestone-status-${index}`}
                                className="text-slate-700"
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="planning">
                                  Planning
                                </SelectItem>
                                <SelectItem value="in_progress">
                                  In Progress
                                </SelectItem>
                                <SelectItem value="on_hold">on hold</SelectItem>
                                <SelectItem value="completed">
                                  Completed
                                </SelectItem>
                                <SelectItem value="cancelled">
                                  cancelled
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {projectPayload.milestones.length < 10 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full mt-2 !bg-slate-100 !text-slate-700 hover:!bg-blue-500 hover:!text-slate-100 !border-slate-200"
                      onClick={() => {
                        const newMilestone = {
                          title: '',
                          description: '',
                          deadline: new Date().toISOString(),
                          status: 'planning'
                        };
                        setProjectPayload({
                          ...projectPayload,
                          milestones: [
                            ...projectPayload.milestones,
                            newMilestone
                          ]
                        });
                      }}
                      disabled={loadingState.isLoading}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Milestone
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700">Project Media</Label>
                <div className="border border-slate-200 rounded-md p-4">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {projectPayload.medias.map((media, index) => (
                      <div
                        key={index}
                        className="relative border border-slate-200 rounded-md p-2"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-12 bg-slate-100 rounded flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-6 w-6"
                            >
                              <rect
                                width="18"
                                height="18"
                                x="3"
                                y="3"
                                rx="2"
                                ry="2"
                              ></rect>
                              <circle cx="9" cy="9" r="2"></circle>
                              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                            </svg>
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-sm text-slate-700 font-medium truncate">
                              {media.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {media.url}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 text-red-500"
                          onClick={() => {
                            const updatedMedias = [...projectPayload.medias];
                            updatedMedias.splice(index, 1);
                            setProjectPayload({
                              ...projectPayload,
                              medias: updatedMedias
                            });
                          }}
                          disabled={loadingState.isLoading}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M18 6 6 18"></path>
                            <path d="m6 6 12 12"></path>
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>

                  {projectPayload.medias.length < 5 && (
                    <div className="text-center">
                      <Label
                        htmlFor="media-upload"
                        className={`cursor-pointer ${
                          loadingState.isLoading
                            ? 'opacity-50 pointer-events-none'
                            : ''
                        }`}
                      >
                        <div className="border-2 border-dashed border-slate-200 rounded-md p-6 flex flex-col items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-8 w-8 text-slate-400 mb-2"
                          >
                            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"></path>
                            <line x1="16" x2="22" y1="5" y2="5"></line>
                            <line x1="19" x2="19" y1="2" y2="8"></line>
                            <circle cx="9" cy="9" r="2"></circle>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
                          </svg>
                          <p className="text-sm font-medium">
                            Click to upload media
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {5 - projectPayload.medias.length} uploads remaining
                          </p>
                        </div>
                        <Input
                          id="media-upload"
                          type="file"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file && projectPayload.medias.length < 5) {
                              uploadedImage(file).then(() => {
                                if (media && media[0]) {
                                  const newMedia = {
                                    name: file.name,
                                    url: media[0]
                                  };
                                  setProjectPayload({
                                    ...projectPayload,
                                    medias: [...projectPayload.medias, newMedia]
                                  });
                                }
                              });
                            }
                            // Reset the input value so the same file can be selected again
                            e.target.value = '';
                          }}
                          disabled={loadingState.isLoading}
                        />
                      </Label>
                      {isUploading && (
                        <p className="text-sm text-blue-600 mt-2">
                          Uploading media...
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-2 text-xs text-slate-500">
                    Upload up to 5 images or documents related to your project.
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between p-6 bg-slate-50 border-t border-slate-200">
              <Button
                variant="outline"
                onClick={() => setIsCreatingProject(false)}
                disabled={loadingState.isLoading}
                className="border-slate-200 hover:bg-slate-100 !bg-slate-100 !text-slate-700 hover:!bg-blue-500 hover:!text-slate-100 !border-slate-200"
              >
                Cancel
              </Button>
              <Button
                onClick={createProject}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                disabled={loadingState.isLoading}
              >
                {loadingState.isLoading ? (
                  <>
                    <span className="mr-2">
                      {loadingState.stage === 'validating' && 'Validating...'}
                      {loadingState.stage === 'creating-backend' &&
                        'Creating...'}
                      {loadingState.stage === 'creating-blockchain' &&
                        'Recording on Blockchain...'}
                    </span>
                    <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  </>
                ) : (
                  'Create Project'
                )}
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="bg-slate-100 p-1 rounded-lg">
              <TabsTrigger
                value="active"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-500 rounded-md"
              >
                Active Projects
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-500 rounded-md"
              >
                Completed Projects
              </TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {Array.isArray(projects?.data) &&
                  projects.data.map((project: any) => (
                    <Card
                      key={project._id}
                      className={`transition-all duration-200 hover:shadow-md bg-white ${
                        expandedProject === project._id
                          ? 'border-blue-300 shadow-lg'
                          : 'border-slate-200'
                      }`}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-slate-900">
                            {project.name}
                          </CardTitle>
                          {getStatusBadge(project.status)}
                        </div>
                        <CardDescription className="text-slate-600">
                          {project.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-slate-700">
                              Progress
                            </span>
                            <span className="text-sm text-slate-600">
                              {project.progress}%
                            </span>
                          </div>
                          <Progress
                            value={project.progress}
                            className="h-2 bg-slate-100"
                          />
                        </div>

                        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Deadline:{' '}
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>

                        {expandedProject === project._id && (
                          <div className="mt-6 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-3 text-slate-900">
                                Milestones
                              </h4>
                              <div className="space-y-3">
                                {project?.milestones?.map(
                                  (milestone: any, index: number) => (
                                    <div
                                      key={index}
                                      className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200"
                                    >
                                      <div className="flex items-center gap-3">
                                        {milestone.status === 'completed' ? (
                                          <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : milestone.status ===
                                          'in_progress' ? (
                                          <Clock className="h-5 w-5 text-blue-500" />
                                        ) : (
                                          <AlertCircle className="h-5 w-5 text-slate-400" />
                                        )}
                                        <span className="text-sm text-slate-900">
                                          {milestone.title}
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500">
                                          Due:{' '}
                                          {new Date(
                                            milestone.deadline
                                          ).toLocaleDateString()}
                                        </span>
                                        <div>
                                          {getStatusBadge(milestone.status)}
                                        </div>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-3 p-4 bg-slate-50 border-t border-slate-200">
                        <Button
                          variant="outline"
                          className="flex-1 border-slate-200 hover:bg-slate-100 hover:text-slate-700 text-slate-500"
                          onClick={() => toggleProjectExpansion(project._id)}
                        >
                          {expandedProject === project._id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-2" /> Hide
                              Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-2" /> Show
                              Details
                            </>
                          )}
                        </Button>

                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
                          onClick={() =>
                            router.replace(`project-dashboard/${project._id}`)
                          }
                        >
                          Project Dashboard
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <div className="grid grid-cols-1 gap-6">
                {Array.isArray(projects?.data) &&
                  projects.data.map((project: any) => (
                    <Card
                      key={project?._id}
                      className="border-slate-200 hover:shadow-md transition-all bg-white duration-200"
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-slate-900">
                            {project?.name}
                          </CardTitle>
                          <div>{getStatusBadge(project?.status)}</div>
                        </div>
                        <CardDescription className="text-slate-600">
                          {project?.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-2 mb-4 text-sm text-slate-600">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Completed on:{' '}
                            {project?.updatedAt
                              ? new Date(
                                  project?.updatedAt
                                ).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-3 p-4 bg-slate-50 border-t border-slate-200">
                        <Button
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200"
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
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </>
  );
}
