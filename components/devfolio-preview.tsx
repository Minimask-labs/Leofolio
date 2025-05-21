import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CredentialManager } from './credential-manager';
import { WorkHistory } from './work-history';
import { useState, useEffect } from 'react';
import GitHubCalendar from 'react-github-calendar';
import { useProjectStore } from '@/Store/projects';

import {
  Github,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  MapPin,
  FileText,
  Trophy,
  Award
} from 'lucide-react';

interface DevfolioPreviewProps {
  profile: {
    fullName: string;
    username: string;
    email: string;
    professionalTitle: string;
    profileImage: string;
    bio: string;
    location: string;
    skills: string[];
    socials: {
      twitter: string;
      linkedin: string;
      github: string;
      instagram: string;
      website: string;
    };
  };
}

export function DevfolioPreview({ profile }: DevfolioPreviewProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [username, setUsername] = useState('');
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
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
  
  // if (profile?.socials?.github !== '') {
  //   const url = new URL(profile?.socials?.github);
  //   const pathname = url.pathname; // ""
  //   setUsername(pathname.replace(/^\/+|\/+$/g, '')); // remove slashes
  // }
  // const url = profile?.socials?.github || '';
  // const segments = url.split('/');
  // setUsername(segments.pop() || segments.pop() || ''); // handles trailing slash
  // console.log(username); // "kufre-abasi"
  const extractUsername = (githubUrlOrUsername: string) => {
    try {
      const url = new URL(githubUrlOrUsername);
      return setUsername(url.pathname.replace(/^\/+|\/+$/g, ''));
    } catch {
      // If it's not a valid URL, assume it's a raw username
      return githubUrlOrUsername?.trim();
    }
  };

  useEffect(() => {
    if (profile?.socials?.github !== '') {
      extractUsername(profile?.socials?.github); // extractUsername(profile?.socials?.github);
    }
  }, []);
  const fetchData = async () => {
    await fetchFreelancerProjects();
  };

  useEffect(() => {
    fetchData();
   }, []);

  return (
    <div className=" border rounded-lg w-full shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="border-b lg:p-8 p-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-32 w-32 rounded-full">
            <AvatarFallback className="text-3xl bg-blue-100 text-blue-800">
              {profile?.fullName
                ? profile.fullName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                : 'U'}
            </AvatarFallback>
            <AvatarImage
              src={profile?.profileImage}
              className="w-full h-full object-cover"
            />{' '}
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {profile?.fullName || 'Your Name'}
                </h1>
                <p className="text-slate-500">
                  @{profile?.username || 'username'}
                </p>
              </div>
              {/* <Button className="bg-blue-600 hover:bg-blue-700 self-start">
                Edit Profile
              </Button> */}
            </div>

            <p className="text-lg mb-4">
              {profile?.professionalTitle || 'Your Professional Title'}
            </p>

            <p className="text-[#E0E0E0] mb-4">{profile?.bio || ''}</p>

            <div className="flex flex-wrap gap-4">
              {profile?.socials?.github && (
                <a
                  href={profile?.socials?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-blue-600"
                >
                  <Github className="h-6 w-6" />
                </a>
              )}
              {profile?.socials?.linkedin && (
                <a
                  title="blank_tag"
                  href={profile?.socials?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-blue-600"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {profile?.socials?.twitter && (
                <a
                  href={profile?.socials?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-blue-600"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {profile?.socials?.instagram && (
                <a
                  href={profile?.socials?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-blue-600"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {profile?.socials?.website && (
                <a
                  href={profile?.socials?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-blue-600"
                >
                  <Globe className="h-6 w-6" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-6">
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.length > 0 ? (
              profile?.skills?.map((skill) => (
                <Badge
                  key={skill}
                  className="bg-slate-100 text-slate-800 hover:bg-slate-200"
                >
                  {skill}
                </Badge>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Location */}
        {profile?.location && (
          <div className="mt-4 flex items-center capitalize text-[#E0E0E0]">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{profile?.location}</span>
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="w-full grid grid-cols-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {/* <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="work-history">Work History</TabsTrigger> */}
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Section */}
          <div className="lg:p-8 p-2">
            <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">
              Leofolio Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-amber-50">
                <CardContent className="lg:p-4 p-2 flex items-center gap-3">
                  <div className="bg-amber-100 p-2 rounded-md">
                    <FileText className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl text-[#121212] font-bold">
                      {freelancer_projects?.meta?.total || 0}
                    </p>
                    <p className="text-sm text-slate-600">Projects</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="lg:p-4 p-2 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Trophy className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl text-black font-bold">0</p>
                    <p className="text-sm text-slate-600">Prizes</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-blue-50">
                <CardContent className="lg:p-4 p-2 flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-md">
                    <Award className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl text-black font-bold">0</p>
                    <p className="text-sm text-slate-600">Hackathons</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-purple-50">
                <CardContent className="lg:p-4 p-2 flex items-center gap-3">
                  <div className="bg-purple-100 p-2 rounded-md">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl text-black font-bold">0</p>
                    <p className="text-sm text-slate-600">Certifications</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {/* Aleo chain Activity */}

          <div className="p-8 border-t">
            <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">
              Aleo chain Activity
            </h2>
            <div className="bg-[#121212] p-6 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between mb-6"></div>
              <div className="w-full flex justify-center">
                {username ? <GitHubCalendar username={username} /> : ''}
              </div>
              {/* Contribution graph placeholder */}
            </div>
          </div>
          {/* GitHub Activity */}
          <div className="p-8 border-t">
            <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">
              GitHub Activity
            </h2>
            <div className="bg-[#121212] p-6 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between mb-6"></div>
              <div className="w-full flex justify-center">
                {username ? <GitHubCalendar username={username} /> : ''}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <CredentialManager className="lg:p-8 p-2" />
        </TabsContent>

        <TabsContent value="work-history" className="space-y-4">
          <WorkHistory className="lg:p-8 p-2" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
