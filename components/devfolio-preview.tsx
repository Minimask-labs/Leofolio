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
import { motion } from 'framer-motion';

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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="border border-blue-100 rounded-lg w-full shadow-lg overflow-hidden bg-gradient-to-b from-white to-blue-50"
    >
      {/* Header Section */}
      <div className="border-b border-blue-100  p-6">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <Avatar className="h-20 w-20 rounded-full ring-4 ring-blue-100">
              <AvatarFallback className="text-4xl bg-blue-100 text-blue-600">
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
              />
            </Avatar>
          </motion.div>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 ">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {profile?.fullName || 'Your Name'}
                </h1>
                <p className="text-blue-600 text-lg">
                  @{profile?.username || 'username'}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-700 ">
              {profile?.professionalTitle || 'Your Professional Title'}
            </p>

            <p className="text-gray-600 text-sm leading-relaxed">
              {profile?.bio || ''}
            </p>

            <div className="flex flex-wrap gap-4">
              {profile?.socials?.github && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={profile?.socials?.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Github className="h-4 w-4" />
                </motion.a>
              )}
              {profile?.socials?.linkedin && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  title="blank_tag"
                  href={profile?.socials?.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </motion.a>
              )}
              {profile?.socials?.twitter && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={profile?.socials?.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </motion.a>
              )}
              {profile?.socials?.instagram && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={profile?.socials?.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </motion.a>
              )}
              {profile?.socials?.website && (
                <motion.a
                  whileHover={{ scale: 1.1 }}
                  href={profile?.socials?.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Globe className="h-4 w-4" />
                </motion.a>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.length > 0 ? (
              profile?.skills?.map((skill) => (
                <motion.div key={skill} whileHover={{ scale: 1.05 }}>
                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-2 py-1 text-[12px]">
                    {skill}
                  </Badge>
                </motion.div>
              ))
            ) : (
              <></>
            )}
          </div>
        </div>

        {/* Location */}
        {profile?.location && (
          <div className="mt-4 flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span className="text-[12px]">{profile?.location}</span>
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="w-full grid grid-cols-1 bg-blue-50/50 p-1">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700"
          >
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Section */}
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Leofolio Stats
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <motion.div whileHover={{ y: -5 }}>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-2 flex items-center gap-4">
                    <div className="bg-blue-200 p-3 rounded-lg">
                      <FileText className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl text-gray-900 font-bold">
                        {freelancer_projects?.meta?.total || 0}
                      </p>
                      <p className="text-sm text-blue-600">Projects</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-2 flex items-center gap-4">
                    <div className="bg-blue-200 p-3 rounded-lg">
                      <Trophy className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl text-gray-900 font-bold">0</p>
                      <p className="text-sm text-blue-600">Prizes</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-2 flex items-center gap-4">
                    <div className="bg-blue-200 p-3 rounded-lg">
                      <Award className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl text-gray-900 font-bold">0</p>
                      <p className="text-sm text-blue-600">Hackathons</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -5 }}>
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                  <CardContent className="p-2 flex items-center gap-4">
                    <div className="bg-blue-200 p-3 rounded-lg">
                      <Award className="h-7 w-7 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-3xl text-gray-900 font-bold">0</p>
                      <p className="text-sm text-blue-600">Certifications</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Activity Sections */}
          <div className="p-4 border-t border-blue-100">
            <h2 className="text-lg font-semibold mb-6 text-gray-900">
              Activity Overview
            </h2>
            <div className="grid md:grid-rows-2 gap-6">
              {/* GitHub Activity */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium text-gray-800">
                  GitHub Activity
                </h3>
                <div className="w-full flex justify-center">
                  {username ? (
                    <div className="transform hover:scale-105 transition-transform">
                      <GitHubCalendar
                        username={username}
                        colorScheme="light"
                        fontSize={12}
                        blockSize={10}
                        blockMargin={4}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No GitHub activity to display
                    </p>
                  )}
                </div>
              </div>

              {/* Aleo Chain Activity */}
              <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-100">
                <h3 className="text-lg font-medium text-gray-800">
                  Aleo Chain Activity
                </h3>
                <div className="w-full flex justify-center">
                  {username ? (
                    <div className="transform hover:scale-105 transition-transform">
                      <GitHubCalendar
                        username={username}
                        colorScheme="light"
                        fontSize={12}
                        blockSize={10}
                        blockMargin={4}
                      />
                    </div>
                  ) : (
                    <p className="text-gray-500">
                      No Aleo chain activity to display
                    </p>
                  )}
                </div>
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
    </motion.div>
  );
}
