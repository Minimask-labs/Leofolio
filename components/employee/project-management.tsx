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
import { ProjectUpdates } from '@/components/project-updates';
import { ProjectDashboard } from '@/components/project-dashboard';
import { ProjectReport } from '@/components/project-report';
import { AnyAaaaRecord } from 'dns';
import { useRouter } from 'next/navigation';
import { useUserProfileStore } from '@/Store/userProfile';
import { useProjectStore } from '@/Store/projects';
import {
  Transaction,
  WalletAdapterNetwork,
  WalletNotConnectedError
} from '@demox-labs/aleo-wallet-adapter-base';
import { useWallet } from '@demox-labs/aleo-wallet-adapter-react';
import React, { FC, useCallback } from 'react';
const ESCROW_PROGRAM_ID = 'escrow_contract_v2.aleo';
import {mongoIdToAleoField} from '@/libs/util';
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
  const [isUploading, setIsUploading] = useState(false);
  const { handleCreateProject, fetchProjects, projects } = useProjectStore();
  const [projectPayload, setProjectPayload] = useState({
    name: 'Website Redesign',
    description:
      'A project to redesign the company website for better UX and performance.',
    deadline: '2025-06-30T23:59:59.000Z',
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
        deadline: '2025-05-10T12:00:00.000Z',
        status: 'planning'
      },
      {
        title: 'Development Phase',
        description: 'Start frontend and backend development.',
        deadline: '2025-05-25T12:00:00.000Z',
        status: 'planning'
      }
    ],
    price: 5000 // aleo token
  });
  const uploadedImage = async (image: any) => {
    setIsUploading(true);
    const formData = new FormData();
    if (image) {
      formData.append('media', image);
    }

    try {
      const response = await handleUploadMedia(formData); // Explicitly define the response type
      if (media) {
        toast({
          title: 'Image uploaded successfully',
          description: 'Your profile image has been updated.',
          variant: 'default'
        });
        console.log('Image uploaded successfully:', media);
        setPreviewImage(media[0]);
        console.log('Image uploaded successfully:', response);
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
  const { publicKey, wallet, requestTransaction } = useWallet();

  const onCreateJob = async ({
    jobId,
    paymentAmount
  }: {
    jobId: string;
    paymentAmount: number;
  }) => {
    if (!publicKey) throw new Error('Wallet not connected');

    // Format inputs as required by the Leo contract
    const inputs = [
      mongoIdToAleoField(jobId), // job_id as u64
      paymentAmount + 'u64' // payment_amount as u64
    ];
    console.log('Inputs:', inputs);
    const fee = 50_000; // Set an appropriate fee

    // Create the transaction
    const aleoTransaction = Transaction.createTransaction(
      publicKey,
      WalletAdapterNetwork.TestnetBeta,
      'escrow_contract_v2.aleo',
      'create_job',
      inputs,
      fee
    );

    // Send the transaction
    if (requestTransaction) {
      await requestTransaction(aleoTransaction);
    }
  };
  const handleFundAccount = async ({
    jobId,
    paymentAmount
  }: {
    jobId: string;
    paymentAmount: number;
  }) => {
    if (!publicKey || !wallet) {
      toast({
        title: 'Wallet Not Connected',
        description: 'Please connect your wallet to fund your account.',
        variant: 'destructive'
      });
      return;
    }
    if (!requestTransaction) {
      toast({
        title: 'Wallet Error',
        description: 'Request Transaction function not available.',
        variant: 'destructive'
      });
      return;
    }

    // const amountMicrocredits = parseInt(fundingAmount, 10);
    // if (isNaN(amountMicrocredits) || amountMicrocredits <= 0) {
    //   toast({
    //     title: "Invalid Amount",
    //     description:
    //       "Please enter a valid positive amount to fund (microcredits).",
    //     variant: "destructive",
    //   });
    //   return;
    // }

    // setIsFunding(true);
    try {
      // IMPORTANT: Adjust fee as needed. This is a placeholder.
      // You might need a fee record or a dynamic fee estimation strategy.
      const inputs = [
        BigInt(`0x${jobId}`).toString() + 'u64', // job_id as u64
        paymentAmount.toString() + 'u64' // payment_amount as u64
      ];
      console.log('Inputs:', inputs);
      const fee = 50_000; // Set an appropriate fee

      const feeInMicrocredits = 1000000;

      const aleoTransaction = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta, // Ensure this matches your contract deployment network
        ESCROW_PROGRAM_ID,
        'create_job',
        inputs, // Input argument(s) as strings
        feeInMicrocredits
        // undefined, // feeRecord - Pass undefined if not providing a specific record
      );

      console.log('Requesting funding transaction:', aleoTransaction);
      const txId = await requestTransaction(aleoTransaction);
      console.log('Transaction ID:', txId);

      if (txId) {
        // toast({
        //   title: "Funding Transaction Sent",
        //   description: `Transaction ID: ${txId.substring(
        //     0,
        //     20
        //   )}... Monitor your wallet or explorer for confirmation.`,
        //   action: (
        //     <a
        //       href={`https://explorer.aleo.org/transaction/${txId}`} // Adjust explorer URL if needed (e.g., testnet3.aleo.network)
        //       target="_blank"
        //       rel="noopener noreferrer"
        //       className="ml-2 underline"
        //     >
        //       View on Explorer
        //     </a>
        //   ),
        // });
        // setFundingAmount(""); // Clear input on success
        // Optionally, trigger a simulated balance refresh after a delay
        // Note: This won't show the *actual* new balance yet.
        // setTimeout(fetchBalance, 7000); // Refresh balance simulation after 7s
      } else {
        toast({
          title: 'Transaction Not Broadcast',
          description: 'The transaction was likely cancelled in the wallet.',
          variant: 'destructive'
        });
      }
    } catch (e) {
      console.error('Funding error:', e);
      let description = 'An unknown error occurred during funding.';
      if (e instanceof WalletNotConnectedError) {
        description = 'Wallet disconnected. Please reconnect.';
      } else if (e instanceof Error) {
        // Attempt to provide a more specific error if possible
        description = e.message.includes('rejected')
          ? 'Transaction rejected by user in wallet.'
          : e.message;
      }
      toast({
        title: 'Funding Failed',
        description: description,
        variant: 'destructive'
      });
    } finally {
      // setIsFunding(false);
    }
  };
  const createProject = async () => {
    // Reset previous errors
    setErrors({});

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
      return;
    }
    setIsUploading(true);

    try {
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
        if (success) {
          onCreateJob({
            jobId: data._id,
            paymentAmount: projectPayload.price
          });
          fetchProjects();
          // If validation passes, log the payload
          console.log('Project payload:', projectPayload);
          setIsCreatingProject(false);
          setProjectPayload({
            name: '',
            description: '',
            deadline: '',
            medias: [],
            status: 'planning',
            milestones: [],
            price: 0
          });
          toast({
            title: 'Project Created',
            description: 'Your new project has been created successfully.'
          });
          setIsUploading(false);
        }
      }
    } catch (error: any) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project. Please try again.',
        variant: 'destructive'
      });
      setIsUploading(false);

      return;
    }
    // Show success message

    // Close the form
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
            className="bg-emerald-50 text-emerald-700 border-emerald-200"
          >
            Completed
          </Badge>
        );
      case 'in-progress':
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
      case 'not-started':
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
    console.log('Projects:', projects);
  }, [fetchProjects]);

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

        <ProjectReport project={selectedProject} userType="employee" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold mb-2">Manage Projects</h2>
          <p className="text-slate-600">
            Organize and track projects with your hired freelancers.
          </p>
        </div>
        <Button
          onClick={() => setIsCreatingProject(true)}
          className="bg-blue-600 text-white hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {isCreatingProject ? (
        <Card>
          {/* create project */}
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>
              Set up a new project and assign freelancers
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                placeholder="e.g. Website Redesign"
                value={projectPayload.name}
                onChange={(e) =>
                  setProjectPayload({ ...projectPayload, name: e.target.value })
                }
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
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
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.description}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input id="startDate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={projectPayload.deadline}
                  onChange={(e) =>
                    setProjectPayload({
                      ...projectPayload,
                      deadline: e.target.value
                    })
                  }
                  className={errors.deadline ? 'border-red-500' : ''}
                />
                {errors.deadline && (
                  <p className="text-xs text-red-500 mt-1">{errors.deadline}</p>
                )}
              </div>
            </div>
            {/* [planning, in_progress, completed, on_hold, cancelled] */}
            <div className="space-y-2">
              <Label htmlFor="status">Project Status</Label>
              <Select
                defaultValue="planning"
                onValueChange={(value) =>
                  setProjectPayload({ ...projectPayload, status: value })
                }
                value={projectPayload.status}
              >
                <SelectTrigger>
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
              <Label htmlFor="price">Project Price (Aleo tokens)</Label>
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
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Project Milestones</Label>
              {errors.milestones && (
                <p className="text-xs text-red-500 mt-1">{errors.milestones}</p>
              )}
              <div className="space-y-4 border rounded-md p-4">
                {projectPayload.milestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="space-y-2 pb-4 border-b last:border-b-0 last:pb-0"
                  >
                    <div className="flex justify-between">
                      <h4 className="text-sm font-medium">
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
                          >
                            <SelectTrigger id={`milestone-status-${index}`}>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="planning">Planning</SelectItem>
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
                    className="w-full mt-2"
                    onClick={() => {
                      const newMilestone = {
                        title: '',
                        description: '',
                        deadline: new Date().toISOString(),
                        status: 'planning'
                      };
                      setProjectPayload({
                        ...projectPayload,
                        milestones: [...projectPayload.milestones, newMilestone]
                      });
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Milestone
                  </Button>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Project Media</Label>
              <div className="border rounded-md p-4">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {projectPayload.medias.map((media, index) => (
                    <div key={index} className="relative border rounded-md p-2">
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
                          <p className="text-sm font-medium truncate">
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
                    <Label htmlFor="media-upload" className="cursor-pointer">
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
            {/* <div className="space-y-2">
              <Label htmlFor="price">Project Price (in ALEO tokens)</Label>
              <Input
                id="price"
                type="number"
                value={projectPayload.price}
                onChange={(e) =>
                  setProjectPayload({
                    ...projectPayload,
                    price: parseFloat(e.target.value)
                  })
                }
                placeholder="Enter project price"
              />
            </div> */}
            {/* <div className="space-y-2">
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
            </div> */}
            {/* <div className="space-y-2">
              <Label>Initial Milestones</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input
                    type="checkbox"
                    id="milestone1"
                    className="rounded"
                    defaultChecked
                  />
                  <label htmlFor="milestone1" className="text-sm font-medium">
                    Requirements Gathering
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input
                    type="checkbox"
                    id="milestone2"
                    className="rounded"
                    defaultChecked
                  />
                  <label htmlFor="milestone2" className="text-sm font-medium">
                    Design Phase
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input
                    type="checkbox"
                    id="milestone3"
                    className="rounded"
                    defaultChecked
                  />
                  <label htmlFor="milestone3" className="text-sm font-medium">
                    Development
                  </label>
                </div>
                <div className="flex items-center space-x-2 p-2 border rounded-md">
                  <input
                    type="checkbox"
                    id="milestone4"
                    className="rounded"
                    defaultChecked
                  />
                  <label htmlFor="milestone4" className="text-sm font-medium">
                    Testing & Launch
                  </label>
                </div>
              </div>
            </div> */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setIsCreatingProject(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={createProject}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
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
              {Array.isArray(projects?.data) &&
                projects.data
                  .filter((p: any) => p.status !== 'completed')
                  .map((project: any) => (
                    <Card
                      key={project._id}
                      className={
                        expandedProject === project._id ? 'border-blue-300' : ''
                      }
                    >
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
                            <span className="text-sm font-medium">
                              Progress
                            </span>
                            <span className="text-sm">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} className="h-2" />
                        </div>

                        <div className="flex items-center gap-1 mb-3 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Deadline:{' '}
                            {new Date(project.deadline).toLocaleDateString()}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium">
                              Assigned Freelancers
                            </span>
                          </div>
                          <div className="space-y-2">
                            {project?.freelancers?.map(
                              (freelancer: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {freelancer.name
                                        .split(' ')
                                        .map((n: any) => n[0])
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
                              )
                            )}
                          </div>
                        </div>

                        {expandedProject === project.id && (
                          <div className="mt-6 space-y-4">
                            <div>
                              <h4 className="text-sm font-medium mb-2">
                                Milestones
                              </h4>
                              <div className="space-y-2">
                                {project?.milestones?.map((milestone: any, index: number) => (
                                  <div
                                    key={index}
                                    className="flex justify-between items-center p-2 bg-slate-50/20 rounded-md"
                                  >
                                    <div className="flex items-center gap-2">
                                      {milestone.status === 'completed' ? (
                                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                                      ) : milestone.status === 'in_progress' ? (
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
                                      <Select defaultValue={milestone.status}>
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
                                          <SelectItem value="cancelled">
                                            cancelled
                                          </SelectItem>
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
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => toggleProjectExpansion(project.id)}
                        >
                          {expandedProject === project.id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" /> Hide
                              Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" /> Show
                              Details
                            </>
                          )}
                        </Button>

                        <Button
                          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() =>
                            router.replace(
                              `employer/project-dashboard/${project._id}`
                            )
                          }
                        >
                          Project Dashboard
                        </Button>
                      </CardFooter>
                      {/*                           onClick={() => {
                            setSelectedProject(project);
                            setShowDashboard(true);
                          }}
 */}
                    </Card>
                  ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="mt-4">
            <div className="grid grid-cols-1 gap-4">
              {Array.isArray(projects) &&
                projects
                  .filter((p: any) => p.status === 'completed')
                  .map((project: any) => (
                    <Card
                      key={project.id}
                      className={
                        expandedProject === project.id
                          ? 'border-emerald-300'
                          : ''
                      }
                    >
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <CardTitle>{project.name}</CardTitle>
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200"
                          >
                            Completed
                          </Badge>
                        </div>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex items-center gap-1 mb-3 text-sm text-slate-500">
                          <Calendar className="h-4 w-4" />
                          <span>
                            Completed on:{' '}
                            {project.completionDate
                              ? new Date(
                                  project.completionDate
                                ).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-medium">
                              Freelancers
                            </span>
                          </div>
                          <div className="space-y-2">
                            {project?.freelancers?.map(
                              (freelancer: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <Avatar className="h-6 w-6">
                                    <AvatarFallback className="text-xs">
                                      {freelancer.name
                                        .split(' ')
                                        .map((n: any) => n[0])
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
                              )
                            )}
                          </div>
                        </div>

                        {expandedProject === project.id && (
                          <div className="mt-6 space-y-4">
                            <ProjectUpdates project={project} />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => toggleProjectExpansion(project.id)}
                        >
                          {expandedProject === project.id ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" /> Hide
                              Details
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" /> Show
                              Details
                            </>
                          )}
                        </Button>
                        <Button
                          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700"
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
  );
}
