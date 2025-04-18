'use client';

import type React from 'react';

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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Shield,
  Github,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Plus,
  X
} from 'lucide-react';
import { DevfolioPreview } from './devfolio-preview';

interface OnboardingFlowProps {
  onComplete: () => void;
  userType: 'freelancer' | 'employee';
}

export function OnboardingFlow({ onComplete, userType }: OnboardingFlowProps) {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    name: '',
    username: '',
    title: '',
    bio: '',
    location: '',
    skills: [] as string[],
    github: '',
    linkedin: '',
    twitter: '',
    instagram: '',
    website: '',
    newSkill: ''
  });
  const [previewMode, setPreviewMode] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (profile.newSkill && !profile.skills.includes(profile.newSkill)) {
      setProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, prev.newSkill],
        newSkill: ''
      }));
    }
  };

  const removeSkill = (skill: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill)
    }));
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      setPreviewMode(true);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (previewMode) {
    return (
      <div className="min-h-screen max-h-screen  py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex lg:flex-row flex-col justify-between items-center lg:mb-8 mb-2">
              <h1 className="text-2xl font-bold">Preview Your Devfolio</h1>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setPreviewMode(false)}>
                  Edit Profile
                </Button>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-700"
                  onClick={onComplete}
                >
                  Complete Setup
                </Button>
              </div>
            </div>
            <div className="w-full h-[85vh] overflow-y-auto pb-12 ">
              {' '}
              <DevfolioPreview profile={profile} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-h-screen  py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-center ">
            <Shield className="h-8 w-8 text-emerald-600 mr-2" />
            <h1 className="lg:text-2xl text-lg font-bold">
              Leofolio Onboarding
            </h1>
          </div>

          <div className="lg:my-8 my-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  1
                </div>
                <div
                  className={`h-1 w-16 ${
                    step >= 2 ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                ></div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 2
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  2
                </div>
                <div
                  className={`h-1 w-16 ${
                    step >= 3 ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                ></div>
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step >= 3
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  3
                </div>
              </div>
              <p className="text-slate-600">Step {step} of 3</p>
            </div>
          </div>

          <Card className="w-full h-[80vh] overflow-y-auto pb-12">
            <CardHeader>
              <CardTitle>
                {step === 1 && 'Basic Information'}
                {step === 2 && 'Skills & Expertise'}
                {step === 3 && 'Social Profiles'}
              </CardTitle>
              <CardDescription>
                {step === 1 &&
                  "Let's set up your developer portfolio with some basic information"}
                {step === 2 &&
                  'Add your technical skills and areas of expertise'}
                {step === 3 &&
                  'Connect your social profiles and online presence'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {step === 1 && (
                <>
                  <div className="flex justify-center mb-6">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xl">
                        {profile.name
                          ? profile.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                          : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. John Doe"
                      value={profile.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        @
                      </span>
                      <Input
                        id="username"
                        name="username"
                        className="rounded-l-none"
                        placeholder="username"
                        value={profile.username}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g. Full Stack Developer"
                      value={profile.title}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      placeholder="Tell us about yourself and your expertise..."
                      rows={4}
                      value={profile.bio}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. San Francisco, CA"
                      value={profile.location}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Your Skills</Label>
                    <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px]">
                      {profile.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-slate-100 text-slate-800 h-fit hover:bg-slate-200 pl-2 pr-1 py-1"
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="ml-1 rounded-full hover:bg-slate-300 p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {profile.skills.length === 0 && (
                        <p className="text-slate-400 text-sm">
                          Add your technical skills below
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-grow">
                      <Input
                        placeholder="Add a skill (e.g. JavaScript, React, AWS)"
                        value={profile.newSkill}
                        name="newSkill"
                        onChange={handleChange}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addSkill();
                          }
                        }}
                      />
                    </div>
                    <Button
                      type="button"
                      onClick={addSkill}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="pt-4">
                    <Label className="mb-2 block">Popular Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'JavaScript',
                        'TypeScript',
                        'React',
                        'Node.js',
                        'Python',
                        'AWS',
                        'Docker',
                        'GraphQL',
                        'Solidity',
                        'Rust'
                      ].map((skill) => (
                        <Badge
                          key={skill}
                          variant="outline"
                          className="cursor-pointer hover:bg-slate-100 hover:text-[#121212]"
                          onClick={() => {
                            if (!profile.skills.includes(skill)) {
                              setProfile((prev) => ({
                                ...prev,
                                skills: [...prev.skills, skill]
                              }));
                            }
                          }}
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="github" className="flex items-center gap-2">
                      <Github className="h-4 w-4" /> GitHub Profile
                    </Label>
                    <Input
                      id="github"
                      name="github"
                      placeholder="https://github.com/username"
                      value={profile.github}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="linkedin"
                      className="flex items-center gap-2"
                    >
                      <Linkedin className="h-4 w-4" /> LinkedIn Profile
                    </Label>
                    <Input
                      id="linkedin"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={profile.linkedin}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="twitter"
                      className="flex items-center gap-2"
                    >
                      <Twitter className="h-4 w-4" /> Twitter Profile
                    </Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      placeholder="https://twitter.com/username"
                      value={profile.twitter}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="instagram"
                      className="flex items-center gap-2"
                    >
                      <Instagram className="h-4 w-4" /> Instagram Profile
                    </Label>
                    <Input
                      id="instagram"
                      name="instagram"
                      placeholder="https://instagram.com/username"
                      value={profile.instagram}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="website"
                      className="flex items-center gap-2"
                    >
                      <Globe className="h-4 w-4" /> Personal Website
                    </Label>
                    <Input
                      id="website"
                      name="website"
                      placeholder="https://yourwebsite.com"
                      value={profile.website}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
              >
                Back
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={nextStep}
              >
                {step < 3 ? 'Next' : 'Preview Profile'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
