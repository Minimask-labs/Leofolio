'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Check,
  X,
  Calendar,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Define types for the component props
export type Employer = {
  _id: string;
  walletAddress: string;
  role: string;
  profileImage?: string;
  bio: string;
  location: string;
  skills: string[];
  socials: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    website?: string;
  };
  fullName: string;
  username: string;
};
export type Project = {
  _id: string;
  user: string;
  name: string;
  description: string;
  medias: [
    {
      name: string;
      url: string;
      _id: string;
    }
  ];
  deadline: string;
  status: string;
  milestones: [
    {
      _id: string;
      title: string;
      description: string;
      deadline: string;
      status: string;
    }
  ];
  price: 2000000;
  progress: 0;
  isDeleted: false;
  createdAt: string;
  updatedAt: string;
  __v: 0;
};
export type Invitation = {
  _id: string;
  project: Project;
  freelancer: string;
  employer: Employer;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  sentAt: string;
  message: string;
  respondedAt?: string;
  isDeleted?: boolean;
};

export interface InvitationCardProps {
  invitation: Invitation;
  onAccept?: (id: string, projectId: string) => void;
  onReject?: (id: string) => void;
  acceptOnchain: (projectId: string) => void;
  className?: string;
  isLoading?: boolean;
  rejectLoading?: boolean;
}

export function InvitationCard({
  invitation,
  onAccept,
  onReject,
  className = '',
  isLoading = false,
  rejectLoading = false,
  acceptOnchain
}: InvitationCardProps) {
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showEmployerDetails, setShowEmployerDetails] = useState(false);
  const [expandedProject, setExpandedProject] = useState<
    number | string | null
  >(null);
  const sentDate = new Date(invitation?.sentAt);
  const timeAgo = formatDistanceToNow(sentDate, { addSuffix: true });

  // Determine status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'accepted':
        return 'bg-green-500 hover:bg-green-600';
      case 'rejected':
        return 'bg-red-500 hover:bg-red-600';
      case 'expired':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-blue-500 hover:bg-blue-600';
    }
  };
  const toggleProjectExpansion = (projectId: any) => {
    if (expandedProject === projectId) {
      setExpandedProject(null);
    } else {
      setExpandedProject(projectId);
    }
  };

  // Check if invitation is actionable
  const isActionable = invitation?.status === 'pending';

  // Handle accept and reject actions
  const handleAccept = () => {
    if (onAccept && isActionable) {
      onAccept(invitation?._id, invitation?.project?._id);
      acceptOnchain(invitation?.project?._id);
    }
  };

  const handleReject = () => {
    if (onReject && isActionable) {
      onReject(invitation?._id);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src={
                  invitation?.employer?.profileImage ||
                  '/placeholder.svg?height=40&width=40'
                }
                alt={invitation?.employer?.fullName}
              />
              <AvatarFallback>
                {invitation?.employer.fullName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{invitation?.employer?.fullName}</CardTitle>
              <CardDescription>
                @{invitation?.employer?.username}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(invitation?.status)}>
            {invitation?.status?.charAt(0)?.toUpperCase() +
              invitation?.status?.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Sent {timeAgo}
          </p>
          <div className="flex items-center gap-1 mb-3 text-sm font-bold text-white">
            <Calendar className="h-4 w-4" />
            <span>
              Deadline:{' '}
              {new Date(invitation?.project?.deadline).toLocaleDateString()}
            </span>
          </div>

          {/* <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" /> {invitation?.employer?.location}
          </p> */}
        </div>
        <div className="mb-4 font-bold ">
          Price: ALEO {invitation?.project?.price}
        </div>

        <div className="bg-muted p-3 rounded-md my-3">
          <p className="italic">{invitation?.message}</p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {' '}
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-1 mt-2"
              onClick={() => setShowEmployerDetails(!showEmployerDetails)}
            >
              {showEmployerDetails ? (
                <>
                  Hide Employer Details <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  View Employer Details
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-1 mt-2"
              onClick={() => toggleProjectExpansion(invitation?._id)}
            >
              {expandedProject === invitation?._id ? (
                <>
                  Hide Project Details <ChevronUp className="h-4 w-4 mr-1" />
                </>
              ) : (
                <>
                  Show Project Details <ChevronDown className="h-4 w-4 mr-1" />
                </>
              )}
            </Button>
          </div>

          {showEmployerDetails && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div>
                <h4 className="text-sm font-bold border-y border-white py-2">
                  About {invitation?.employer?.fullName}
                </h4>
                <p className="text-sm mt-1">{invitation?.employer?.bio}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Skills</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {invitation?.employer?.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-muted">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* <div>
                <h4 className="font-semibold text-sm">Wallet Address</h4>
                <p className="text-xs mt-1 font-mono bg-muted p-2 rounded overflow-x-auto">
                  {invitation?.employer.walletAddress}
                </p>
              </div> */}

              {invitation?.respondedAt && (
                <div>
                  <h4 className="font-semibold text-sm">Response Date</h4>
                  <p className="text-sm mt-1">
                    {new Date(invitation?.respondedAt)?.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}

          {expandedProject === invitation?._id && (
            <div className="mt-4 space-y-4">
              <div>
                <h4 className="text-sm font-bold border-y border-white py-2">
                  Project Description
                </h4>
                <p className="text-sm text-slate-200">
                  {invitation?.project?.description}
                </p>
              </div>

              <div>
                {/* <h4 className="text-sm font-medium mb-2">Milestones</h4> */}
                <div className="space-y-2">
                  {expandedProject === invitation._id && (
                    <div className="mt-6 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Milestones</h4>
                        <div className="space-y-2">
                          {invitation?.project?.milestones?.map(
                            (milestone: any, index: number) => (
                              <div
                                key={index}
                                className="flex justify-between items-center p-2 bg-slate-50/20 rounded-md"
                              >
                                <div className="flex items-center gap-2">
                                  {milestone.status === 'completed' ? (
                                    <CheckCircle className="h-4 w-4 text-blue-500" />
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
                                                          <SelectItem value="cancelled">
                                                            cancelled
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

              {/* <ProjectUpdates project={project} /> */}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="w-full">
        <button
          onClick={() => acceptOnchain(invitation?.project?._id)}
          className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
        >
          Accept Onchain
        </button>
        {isActionable === true ? (
          <div className="flex gap-2 pt-2 w-full">
            <Button
              variant="outline"
              className="flex-1 border-red-600 !text-white hover:bg-red-700"
              disabled={!isActionable}
              onClick={handleReject}
            >
              {rejectLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <X className="h-4 w-4 mr-2" /> Reject
                </>
              )}
            </Button>
            <Button
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              disabled={!isActionable}
              onClick={handleAccept}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" /> Accept
                </>
              )}
            </Button>
          </div>
        ) : (
          <></>
        )}
      </CardFooter>
    </Card>
  );
}
