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
import { ProjectUpdates } from '@/components/project-updates';
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
  Edit,
  Plus,
  ArrowRight,
  FileBarChart,
  Download,
  Gift,
  ArrowLeft
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { ProjectTeam } from './projectTeam';
interface DashboardProps {
  userType: 'freelancer' | 'employer';
}
 import { BackButton } from "../back-button";
 import { useRouter, useParams } from 'next/navigation';
import { useProjectStore } from "@/Store/projects";
import ProjectChat from "../project-chat";

export function Dashboard({ userType }: DashboardProps) {
  const {
    handleCreateProject,
    fetchProjects,
    projects,
    handleViewProjectDetail,
    project_details
  } = useProjectStore();
  const [project, setProject] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [isAssigningFreelancer, setIsAssigningFreelancer] = useState(false);
  const [isEditingMilestone, setIsEditingMilestone] = useState<number | null>(
    null
  );
  const [newMilestone, setNewMilestone] = useState({
    title: '',
    dueDate: '',
    status: 'not-started'
  });
  const router = useRouter();
  const params = useParams();
  const projectId = params.id;

  // Mock available freelancers for assignment
  const availableFreelancers = [
    { id: 1, name: 'Alex Morgan', role: 'Full Stack Developer' },
    { id: 2, name: 'Jamie Chen', role: 'UI/UX Designer' },
    { id: 3, name: 'Sam Wilson', role: 'DevOps Engineer' },
    { id: 4, name: 'Taylor Reed', role: 'Mobile Developer' },
    { id: 5, name: 'Jordan Lee', role: 'Data Scientist' },
    { id: 6, name: 'Casey Kim', role: 'Blockchain Developer' }
  ];

  // Function to update milestone status
  const updateMilestoneStatus = (milestoneId: number, newStatus: string) => {
    const updatedMilestones = project.milestones.map((milestone: any) =>
      milestone.id === milestoneId
        ? { ...milestone, status: newStatus }
        : milestone
    );

    setProject({
      ...project,
      milestones: updatedMilestones,
      // Recalculate progress based on completed milestones
      progress: Math.round(
        (updatedMilestones.filter((m: any) => m.status === 'completed').length /
          updatedMilestones.length) *
          100
      )
    });

    toast({
      title: 'Milestone Updated',
      description: `The milestone status has been updated to ${newStatus}.`
    });
  };

  // Function to add a new milestone
  const addMilestone = () => {
    if (!newMilestone.title || !newMilestone.dueDate) {
      toast({
        title: 'Missing Information',
        description: 'Please provide a title and due date for the milestone.',
        variant: 'destructive'
      });
      return;
    }

    const newMilestoneObj = {
      id: Math.max(0, ...project.milestones.map((m: any) => m.id)) + 1,
      title: newMilestone.title,
      status: newMilestone.status,
      dueDate: newMilestone.dueDate
    };

    const updatedMilestones = [...project.milestones, newMilestoneObj];

    setProject({
      ...project,
      milestones: updatedMilestones,
      progress: Math.round(
        (updatedMilestones.filter((m: any) => m.status === 'completed').length /
          updatedMilestones.length) *
          100
      )
    });

    setNewMilestone({ title: '', dueDate: '', status: 'not-started' });

    toast({
      title: 'Milestone Added',
      description: `The new milestone "${newMilestone.title}" has been added to the project.`
    });
  };

  // Function to add a freelancer to the project
  const addFreelancer = (freelancerId: number) => {
    const freelancer = availableFreelancers.find((f) => f.id === freelancerId);

    if (!freelancer) return;

    // Check if freelancer is already assigned
    if (project.freelancers.some((f: any) => f.name === freelancer.name)) {
      toast({
        title: 'Freelancer Already Assigned',
        description: `${freelancer.name} is already assigned to this project.`,
        variant: 'destructive'
      });
      return;
    }

    setProject({
      ...project,
      freelancers: [...project.freelancers, freelancer]
    });

    setIsAssigningFreelancer(false);

    toast({
      title: 'Freelancer Assigned',
      description: `${freelancer.name} has been assigned to the project.`
    });
  };

  // Function to calculate project stats
  const calculateProjectStats = () => {
    const totalMilestones = project?.milestones?.length;
    const completedMilestones = project?.milestones?.filter(
      (m: any) => m.status === 'completed'
    )?.length;
    const inProgressMilestones = project?.milestones?.filter(
      (m: any) => m.status === 'in-progress'
    )?.length;

    const startDate = new Date(project?.startDate);
    const endDate = project?.completionDate
      ? new Date(project?.completionDate)
      : new Date(project?.deadline);
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
          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">
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
    console.log('Projects:', projects);
    if (project_details?.data) {
      setProject(project_details?.data);
      console.log('Project:', project_details);
    }
  }, [fetchProjects]);

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <BackButton path="/employer" />
      </div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">
            {project?.name || project?.title}
          </h1>
          <p className="text-slate-600">
            {project?.client || project?.company}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {project?.status !== 'completed' && userType === 'employer' && (
            <Dialog>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Project</DialogTitle>
                  <DialogDescription>
                    Update project details, deadlines, and settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <p>Project editing form would go here...</p>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {getStatusBadge(project?.status)}
        </div>
      </div>

      {/* Project Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
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
                    <span className="text-sm">{project?.progress}%</span>
                  </div>
                  <Progress value={project?.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Start Date</p>
                    <p className="font-medium">
                      {new Date(project?.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500">Deadline</p>
                    <p className="font-medium">
                      {new Date(project?.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-1">Description</p>
                  <p className="text-sm">{project?.description}</p>
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
                  {project?.milestones?.slice(0, 3)?.map((milestone: any) => (
                    <div
                      key={milestone.id}
                      className="flex justify-between items-center rounded-md bg-slate-50/20 p-2"
                    >
                      <div className="flex items-center gap-2">
                        {milestone.status === 'completed' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
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
                  onClick={() => setActiveTab('milestones')}
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
                  {project?.freelancers
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

                  {project?.freelancers?.length > 3 && (
                    <p className="text-xs text-slate-500 mt-2">
                      + {project?.freelancers?.length - 3} more
                    </p>
                  )}

                  {userType === 'employer' && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 text-xs"
                      onClick={() => setActiveTab('team')}
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
                  {project?.updates?.slice(0, 3).map((update: any) => (
                    <div key={update.id} className="text-sm">
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
                  onClick={() => setActiveTab('communication')}
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
                    <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-xs font-medium">Project Started</p>
                      <p className="text-xs text-slate-500">
                        {new Date(project?.startDate).toLocaleDateString()}
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
                        {project?.milestones?.find(
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
                        {new Date(project?.deadline).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {project?.status === 'completed' && (
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-medium">Completed</p>
                        <p className="text-xs text-slate-500">
                          {new Date(
                            project?.completionDate
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {project?.status === 'completed' && (
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
                    <p className="text-3xl font-bold text-emerald-600">
                      {project?.progress}%
                    </p>
                    <p className="text-sm text-slate-500">Completion Rate</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      {stats.totalDays}
                    </p>
                    <p className="text-sm text-slate-500">Days to Complete</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      {project?.freelancers.length}
                    </p>
                    <p className="text-sm text-slate-500">Team Members</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg text-center">
                    <p className="text-3xl font-bold text-amber-600">
                      {project?.milestones?.length}
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
                            {project?.clientContact
                              ?.split(' ')
                              .map((n: string) => n[0])
                              .join('') || 'CL'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">
                            {project?.clientContact || 'Client'}
                          </p>
                          <p className="text-xs text-slate-500">
                            {new Date(
                              project?.completionDate
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
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>
                          Delivered project on schedule and within budget
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>
                          Implemented all requested features with high quality
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span>
                          Maintained excellent communication throughout
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
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
            {userType === 'employer' && project?.status !== 'completed' && (
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
                        onValueChange={(value) =>
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
                    <Button onClick={addMilestone}>Add Milestone</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="space-y-4">
            {project?.milestones?.map((milestone: any) => (
              <Card key={milestone.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
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
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
                {userType === 'employer' && project?.status !== 'completed' && (
                  <CardFooter>
                    <Select
                      defaultValue={milestone.status}
                      onValueChange={(value) =>
                        updateMilestoneStatus(milestone.id, value)
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="not-started">Not Started</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </CardFooter>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team" className="space-y-6 mt-6">
          <ProjectTeam projectDetails={project} />
          {/* <div className="flex items-center justify-between">
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
                        !project?.freelancers?.some(
                          (pf: any) => pf.name === f.name
                        )
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
          )} */}
        </TabsContent>

        {/* Communication Tab */}
        <TabsContent value="communication" className="space-y-6 mt-6">
          <h2 className="text-lg font-medium">Project Communication</h2>
       
          {/* <ProjectUpdates project={project} /> */}
          <ProjectChat/>
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
                      <div className="h-10 w-10 bg-emerald-100 rounded-md flex items-center justify-center text-emerald-700">
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
      {project?.status === 'completed' && (
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
