import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CredentialManager } from "./credential-manager"
import { WorkHistory } from "./work-history"
import { useState } from "react"

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
    name: string;
    username: string;
    title: string;
    bio: string;
    location: string;
    skills: string[];
    github: string;
    linkedin: string;
    twitter: string;
    instagram: string;
    website: string;
  };
}

export function DevfolioPreview({ profile }: DevfolioPreviewProps) {
    const [activeTab, setActiveTab] = useState("overview")
    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
    }
  return (
    <div className=" border rounded-lg w-full shadow-sm overflow-hidden">
      {/* Header Section */}
      <div className="border-b lg:p-8 p-4">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <Avatar className="h-32 w-32 rounded-full">
            <AvatarFallback className="text-3xl bg-emerald-100 text-emerald-800">
              {profile.name
                ? profile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                : 'U'}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-3xl font-bold">
                  {profile.name || 'Your Name'}
                </h1>
                <p className="text-slate-500">
                  @{profile.username || 'username'}
                </p>
              </div>
              {/* <Button className="bg-emerald-600 hover:bg-emerald-700 self-start">
                Edit Profile
              </Button> */}
            </div>

            <p className="text-lg mb-4">
              {profile.title || 'Your Professional Title'}
            </p>

            <p className="text-[#E0E0E0] mb-4">
              {profile.bio ||
                "Your professional bio will appear here. Describe your expertise, experience, and what you're passionate about in the tech world."}
            </p>

            <div className="flex flex-wrap gap-4">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-emerald-600"
                >
                  <Github className="h-6 w-6" />
                </a>
              )}
              {profile.linkedin && (
                <a
                  title="blank_tag"
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-emerald-600"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {profile.twitter && (
                <a
                  href={profile.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-emerald-600"
                >
                  <Twitter className="h-6 w-6" />
                </a>
              )}
              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-emerald-600"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#E0E0E0] hover:text-emerald-600"
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
            {profile.skills.length > 0
              ? profile.skills.map((skill) => (
                  <Badge
                    key={skill}
                    className="bg-slate-100 text-slate-800 hover:bg-slate-200"
                  >
                    {skill}
                  </Badge>
                ))
              : ['JavaScript', 'React', 'Node.js', 'TypeScript'].map(
                  (skill) => (
                    <Badge
                      key={skill}
                      className="bg-slate-100 text-slate-800 hover:bg-slate-200"
                    >
                      {skill}
                    </Badge>
                  )
                )}
          </div>
        </div>

        {/* Location */}
        {profile.location && (
          <div className="mt-4 flex items-center text-[#E0E0E0]">
            <MapPin className="h-4 w-4 mr-1" />
            <span>{profile.location}</span>
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="work-history">Work History</TabsTrigger>
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
                    <p className="text-2xl text-[#121212] font-bold">3</p>
                    <p className="text-sm text-slate-600">Projects</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-emerald-50">
                <CardContent className="lg:p-4 p-2 flex items-center gap-3">
                  <div className="bg-emerald-100 p-2 rounded-md">
                    <Trophy className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-2xl text-black font-bold">5</p>
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
                    <p className="text-2xl text-black font-bold">5</p>
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
                    <p className="text-2xl text-black font-bold">2</p>
                    <p className="text-sm text-slate-600">Certifications</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* GitHub Activity */}
          <div className="p-8 border-t">
            <h2 className="text-xl font-semibold mb-4 text-[#E0E0E0]">
              GitHub Activity
            </h2>
            <div className="bg-[#121212] p-6 rounded-lg">
              <div className="flex flex-col md:flex-row justify-between mb-6">
                <div>
                  <p className="text-3xl font-bold">1,240</p>
                  <p className="text-sm text-[#E0E0E0]">
                    contributions in the last year
                  </p>
                </div>
                <Button variant="outline" className="mt-4 md:mt-0">
                  View on GitHub
                </Button>
              </div>

              {/* Contribution graph placeholder */}
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 12 }).map((_, rowIndex) => (
                  <div key={`row-${rowIndex}`} className="flex flex-col gap-1">
                    {Array.from({ length: 12 }).map((_, colIndex) => {
                      // Generate random intensity for the demo
                      const intensity = Math.floor(Math.random() * 5);
                      let bgColor = 'bg-slate-100';
                      if (intensity === 1) bgColor = 'bg-emerald-100';
                      if (intensity === 2) bgColor = 'bg-emerald-200';
                      if (intensity === 3) bgColor = 'bg-emerald-300';
                      if (intensity === 4) bgColor = 'bg-emerald-400';

                      return (
                        <div
                          key={`cell-${rowIndex}-${colIndex}`}
                          className={`w-3 h-3 rounded-sm ${bgColor}`}
                        ></div>
                      );
                    })}
                  </div>
                ))}
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
