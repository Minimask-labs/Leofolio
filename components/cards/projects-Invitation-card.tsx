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
import { ChevronDown, ChevronUp, Clock, MapPin, Check, X } from 'lucide-react';
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

export type Invitation = {
  _id: string;
  project: string | null;
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
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  className?: string;
}

export function InvitationCard({
  invitation,
  onAccept,
  onReject,
  className = ''
}: InvitationCardProps) {
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [showEmployerDetails, setShowEmployerDetails] = useState(false);
  // Format the date to be more readable
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

  // Check if invitation is actionable
  const isActionable = invitation?.status === 'pending';

  // Handle accept and reject actions
  const handleAccept = () => {
    if (onAccept && isActionable) {
      onAccept(invitation?._id);
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
                  invitation?.employer.profileImage ||
                  '/placeholder.svg?height=40&width=40'
                }
                alt={invitation?.employer.fullName}
              />
              <AvatarFallback>
                {invitation?.employer.fullName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{invitation?.employer.fullName}</CardTitle>
              <CardDescription>
                @{invitation?.employer.username}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor(invitation?.status)}>
            {invitation?.status.charAt(0).toUpperCase() +
              invitation?.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="mb-4">
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" /> Sent {timeAgo}
          </p>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3 w-3" /> {invitation?.employer.location}
          </p>
        </div>

        <div className="bg-muted p-3 rounded-md my-3">
          <p className="italic">{invitation?.message}</p>
        </div>
        <div className="flex flex-col">
          <Button
            variant="ghost"
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
          {showEmployerDetails && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div>
                <h4 className="font-semibold text-sm">
                  About {invitation?.employer.fullName}
                </h4>
                <p className="text-sm mt-1">{invitation?.employer.bio}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Skills</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {invitation?.employer.skills.map((skill, index) => (
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
                    {new Date(invitation?.respondedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )}
          {/* <Button
            variant="ghost"
            className="w-full flex items-center justify-center gap-1 mt-2"
            onClick={() => setShowProjectDetails(!showProjectDetails)}
          >
            {showProjectDetails ? (
              <>
                Hide Project Details <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                View Project Details
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </Button>
          {showProjectDetails && (
            <div className="mt-4 space-y-3 border-t pt-3">
              <div>
                <h4 className="font-semibold text-sm">
                  About {invitation?.employer.fullName}
                </h4>
                <p className="text-sm mt-1">{invitation?.employer.bio}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Skills</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {invitation?.employer.skills.map((skill, index) => (
                    <Badge key={index} variant="outline" className="bg-muted">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm">Wallet Address</h4>
                <p className="text-xs mt-1 font-mono bg-muted p-2 rounded overflow-x-auto">
                  {invitation?.employer.walletAddress}
                </p>
              </div>

              {invitation?.respondedAt && (
                <div>
                  <h4 className="font-semibold text-sm">Response Date</h4>
                  <p className="text-sm mt-1">
                    {new Date(invitation?.respondedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          )} */}
        </div>
      </CardContent>
      <CardFooter className="w-full">
        {isActionable !== true ? (
          <div className="flex gap-2 pt-2 w-full">
            <Button
              variant="outline"
              className="flex-1 border-red-600 !text-white hover:bg-red-700"
              disabled={!isActionable}
              onClick={handleReject}
            >
              <X className="h-4 w-4 mr-2" /> Reject
            </Button>
            <Button
              className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
              disabled={!isActionable}
              onClick={handleAccept}
            >
              <Check className="h-4 w-4 mr-2" /> Accept
            </Button>
          </div>
        ) : (
          <></>
        )}
      </CardFooter>
    </Card>
  );
}
