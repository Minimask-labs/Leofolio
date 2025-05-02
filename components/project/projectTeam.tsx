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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { Briefcase, Filter, Loader, Search, Shield, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter, useParams } from 'next/navigation';
import { useUserProfileStore } from '@/Store/userProfile';
import { useProjectStore } from '@/Store/projects';
interface Project {
  freelancers: { name: string; role: string }[];
  status?: string;
  _id: string;
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
  const {
    handleFindUsers,
    users,
    loading: usersLoading
  } = useUserProfileStore();
  const {
    handleSendProjectInvite,
    handleViewProjectInvitationsList,
    projects_invites,
    loading: projectsLoading
  } = useProjectStore();

  const [message, setMessage] = useState('');
  const [selectedFreelancer, setSelectedFreelancer] = useState<any>(null);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  const handleSendInvite = async (freelancerId: string) => {
    try {
      setSendingInvite(true);
      const response = await handleSendProjectInvite(
        project._id,
        freelancerId,
        message
      );
      if (response !== undefined) {
        toast({
          title: 'Project Invite Sent',
          description: 'The freelancer has been invited to join the project.'
        });
        // Close all dialogs and reset state
        setIsAssigningFreelancer(false);
        setSelectedFreelancer(null);
        setMessage('');
        setShowInviteModal(false);
      } else {
        toast({
          title: 'Error Sending Invite',
          description:
            'There was an error sending the invite. Please try again later.'
        });
      }
    } catch (error) {
      toast({
        title: 'Error Sending Invite',
        description:
          'There was an error sending the invite. Please try again later.'
      });
    } finally {
      setSendingInvite(false);
    }
  };

  // Function to open the invite modal with a specific freelancer
  const openInviteModal = (freelancer: any) => {
    setSelectedFreelancer(freelancer);
    setShowInviteModal(true);
  };

  useEffect(() => {
    handleFindUsers({ role: 'freelancer' });
  }, [handleFindUsers]);

  useEffect(() => {
    if (projectId) {
      handleViewProjectInvitationsList({ projectId });
    }
  }, [projectId, handleViewProjectInvitationsList]);

  // Filter freelancers based on search query
  const filteredFreelancers = users?.data?.filter((freelancer: any) => {
    if (!searchQuery) return true;

    const fullName = freelancer.fullName?.toLowerCase() || '';
    const role = freelancer.role?.toLowerCase() || '';
    const skills = freelancer.skills?.join(' ').toLowerCase() || '';
    const query = searchQuery.toLowerCase();

    return (
      fullName.includes(query) || role.includes(query) || skills.includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="freelancers" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            {userType === 'employer' && project?.status !== 'completed' && (
              <TabsTrigger value="freelancers">Find Freelancers</TabsTrigger>
            )}
            <TabsTrigger value="team">Team Members</TabsTrigger>
            <TabsTrigger value="invites">Sent Invites</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="freelancers" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Assign Freelancer</CardTitle>
              <CardDescription>
                Select a freelancer to add to the project team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search freelancers by name, role, or skills..."
                    className="w-full pl-9 pr-4 py-2 border rounded-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {usersLoading ? (
                // Loading skeleton for freelancers
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between">
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div>
                              <Skeleton className="h-5 w-32 mb-1" />
                              <Skeleton className="h-4 w-24" />
                            </div>
                          </div>
                          <Skeleton className="h-5 w-10" />
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-6 w-14" />
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Skeleton className="h-4 w-4" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-4 ml-2" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="flex justify-between items-center">
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-6 w-20" />
                        </div>
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Skeleton className="h-9 flex-1" />
                        <Skeleton className="h-9 flex-1" />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : filteredFreelancers?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredFreelancers
                    ?.filter(
                      (freelancer: any) =>
                        !project?.freelancers?.some(
                          (pf: any) => pf.name === freelancer.name
                        )
                    )
                    ?.map((freelancer: any) => (
                      <Card key={freelancer._id} className="overflow-hidden">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12">
                                <AvatarFallback>
                                  {freelancer?.fullName
                                    ?.split(' ')
                                    ?.map((n: any) => n[0])
                                    ?.join('')}
                                </AvatarFallback>{' '}
                                <AvatarImage
                                  src={
                                    freelancer.profileImage ||
                                    '/placeholder.svg'
                                  }
                                  className="w-full h-full object-cover"
                                />{' '}
                              </Avatar>
                              <div>
                                <CardTitle>{freelancer.fullName}</CardTitle>
                                <CardDescription>
                                  {freelancer.role}
                                </CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                              <span className="font-medium">
                                {freelancer.rating}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pb-2">
                          <div className="flex flex-wrap gap-2 mb-3">
                            {freelancer?.skills.map((skill: any) => (
                              <Badge key={skill} variant="secondary">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Briefcase className="h-4 w-4 text-slate-500" />
                            <span className="text-sm text-slate-600">
                              {freelancer?.experience}
                            </span>
                            <Shield className="h-4 w-4 text-blue-600 ml-2" />
                            <span className="text-sm text-blue-600">
                              Verified
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <div>
                              <span className="font-medium text-lg">
                                ${freelancer.hourlyRate}
                              </span>
                              <span className="text-slate-500 text-sm">
                                /hour
                              </span>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                freelancer?.availability === 'Available'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }
                            >
                              {freelancer?.availability}
                            </Badge>
                          </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                          <Button
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                            onClick={() => openInviteModal(freelancer)}
                          >
                            Send Invite
                          </Button>
                          <Button
                            variant="outline"
                            className="flex-1"
                            onClick={() => setSelectedFreelancer(freelancer)}
                          >
                            View Profile
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500">
                    No freelancers found matching your search criteria.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {project?.freelancers?.length > 0 ? (
              project.freelancers.map((freelancer: any, idx: number) => (
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
              ))
            ) : (
              <div className="col-span-3 p-8 text-center">
                <p className="text-slate-500">
                  No team members have been added to this project yet.
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="invites" className="mt-0">
          {projectsLoading ? (
            // Loading skeleton for invites
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div>
                        <Skeleton className="h-5 w-32 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-6 w-16" />
                      </div>
                    </div>
                    <div className="mt-4">
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {projects_invites?.length > 0 ? (
                projects_invites.map((invite: any, idx: number) => (
                  <Card key={idx}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="text-lg">
                            {invite.freelancer?.fullName
                              ? invite.freelancer.fullName
                                  .split(' ')
                                  .map((n: string) => n[0])
                                  .join('')
                              : 'FL'}
                          </AvatarFallback>
                          {invite.freelancer?.profileImage && (
                            <AvatarImage
                              src={
                                invite.freelancer.profileImage ||
                                '/placeholder.svg'
                              }
                              className="w-full h-full object-cover"
                            />
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium">
                            {invite.freelancer?.fullName || 'Freelancer'}
                          </p>
                          <p className="text-sm text-slate-500">
                            {invite.freelancer?.role || 'Unknown Role'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Invite Sent</span>
                          <span>
                            {new Date(invite.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-slate-500">Status</span>
                          <Badge
                            variant={
                              invite.status === 'pending'
                                ? 'outline'
                                : invite.status === 'accepted'
                                ? 'default'
                                : 'destructive'
                            }
                          >
                            {invite.status.charAt(0).toUpperCase() +
                              invite.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-sm text-slate-600 mb-2">Message:</p>
                        <p className="text-sm italic">
                          {invite.message || 'No message provided'}
                        </p>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={invite.status !== 'pending'}
                          className="text-red-500 border-red-200 hover:bg-red-50"
                        >
                          Cancel Invite
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-3 p-8 text-center">
                  <p className="text-slate-500">
                    No invites have been sent yet.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => setIsAssigningFreelancer(true)}
                  >
                    Find Freelancers
                  </Button>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* View Profile Dialog */}
      {selectedFreelancer && (
        <Dialog
          open={!!selectedFreelancer && !showInviteModal}
          onOpenChange={(open) => {
            if (!open) setSelectedFreelancer(null);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedFreelancer.fullName}</DialogTitle>
              <DialogDescription>{selectedFreelancer.role}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
              <div className="md:col-span-1">
                <Avatar className="h-24 w-24 mx-auto">
                  <AvatarFallback className="text-xl">
                    {selectedFreelancer?.fullName
                      ?.split(' ')
                      ?.map((n: string) => n[0])
                      ?.join('')}
                  </AvatarFallback>
                  <AvatarImage
                    src={selectedFreelancer?.profileImage || '/placeholder.svg'}
                    className="w-full h-full object-cover"
                  />{' '}
                </Avatar>
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center gap-1 mb-2">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-medium">
                      {selectedFreelancer?.rating}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {selectedFreelancer?.experience}
                  </p>
                  <p className="font-medium mt-2">
                    ${selectedFreelancer?.hourlyRate}/hour
                  </p>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Verified Credentials</h4>
                  <ul className="space-y-2">
                    {selectedFreelancer?.verifiedCredentials?.map(
                      (credential: string) => (
                        <li
                          key={credential}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Shield className="h-4 w-4 text-blue-600" />
                          {credential}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-medium mb-2">About</h4>
                <p className="text-sm text-slate-600 mb-4">
                  {selectedFreelancer?.bio}
                </p>

                <h4 className="font-medium mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {selectedFreelancer?.skills.map((skill: string) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <h4 className="font-medium mb-2">Availability</h4>
                <Badge
                  variant="outline"
                  className={
                    selectedFreelancer?.availability === 'Available'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'
                  }
                >
                  {selectedFreelancer?.availability}
                </Badge>

                <div className="mt-6">
                  <h4 className="font-medium mb-2">Work History</h4>
                  <p className="text-sm text-slate-500 italic">
                    Work history is private. The freelancer can generate proofs
                    of experience without revealing client details.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSelectedFreelancer(null)}
              >
                Close
              </Button>
              <Button
                className="bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => {
                  setShowInviteModal(true);
                }}
              >
                Send Project Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Send Invitation Dialog */}
      <Dialog
        open={showInviteModal}
        onOpenChange={(open) => {
          if (!open) setShowInviteModal(false);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Send Project Invitation</DialogTitle>
            <DialogDescription>
              {selectedFreelancer &&
                `Send an invitation to ${selectedFreelancer.fullName} to join your project.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="block text-sm font-medium mb-2">
              Invitation Message
            </label>
            <textarea
              className="w-full min-h-[100px] p-2 border rounded-md"
              placeholder="Describe your project and why you'd like to work with this freelancer..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowInviteModal(false);
              }}
              disabled={sendingInvite}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (selectedFreelancer) {
                  handleSendInvite(selectedFreelancer._id);
                }
              }}
              disabled={sendingInvite}
            >
              {sendingInvite ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Invitation'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
