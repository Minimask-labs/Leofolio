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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Shield,
  Github,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Plus,
  X,
  ImagePlus,
  Loader2
} from 'lucide-react';
import { DevfolioPreview } from './devfolio-preview';
import { useUserProfileStore } from '@/Store/userProfile';
import { useToast } from '@/components/ui/use-toast';
import { useRouter, redirect } from 'next/navigation';

interface OnboardingFlowProps {
  onComplete: () => void;
  userType: 'freelancer' | 'employer';
}

export function OnboardingFlow({ onComplete, userType }: OnboardingFlowProps) {
const [step, setStep] = useState(1);
const { handleUpdateUser, handleUploadMedia,fetchUser, media } = useUserProfileStore();
const [previewImage, setPreviewImage] = useState('');
  const { toast } = useToast();
const [profile, setProfile] = useState({
  fullName: '',
  username: '',
  profileImage: media?.length > 0 ? media[0] : '',
  professionalTitle: '',
  bio: '',
  location: '',
  skills: [] as string[],
  socials: {
    twitter: '',
    linkedin: '',
    github: '',
    instagram: '',
    website: ''
  },
   newSkill: ''
});
  const router = useRouter();

// const data = {
//   fullName: '',
//   username: '',
//   profileImage: ' ',
//   professionalTitle: 'Senior Blockchain Developer',
//   bio: 'Experienced blockchain developer specializing in smart contracts and DeFi applications. Passionate about open source and decentralized tech.',
//   location: 'San Francisco, CA',
//   skills: ['Solidity', 'React', 'Node.js', 'Web3.js'],
//   socials: {
//     twitter: 'janedoe',
//     linkedin: 'janedoe-linkedin',
//     github: 'janedoe',
//     instagram: 'janedoe_insta',
//     website: 'https://janedoe.dev'
//   }
// };
const [previewMode, setPreviewMode] = useState(false);
const [errors, setErrors] = useState<Record<string, string>>({});
const [isUploading, setIsUploading] = useState(false);

const handleChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
  const { name, value } = e.target;

  // Handle nested social properties
  if (
    name === 'github' ||
    name === 'linkedin' ||
    name === 'twitter' ||
    name === 'instagram' ||
    name === 'website'
  ) {
    setProfile((prev) => ({
      ...prev,
      socials: {
        ...prev.socials,
        [name]: value
      }
    }));
  } else {
    setProfile((prev) => ({ ...prev, [name]: value }));
  }

  // Clear error for this field if it exists
  if (errors[name]) {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[name];
      return newErrors;
    });
  }
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

const uploadedImage = async (image: any) => {
  setIsUploading(true);
  const formData = new FormData();
  if (image) {
    formData.append('media', image);
  }

  try {
    const response = await handleUploadMedia(formData); // Explicitly define the response type
     if (media) {
      setProfile((prev) => ({
        ...prev,
        profileImage: media[0]
      }));
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

const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  // if (file) {
    // const reader = new FileReader();
    // reader.onloadend = () => {
    //   setProfile((prev) => ({
    //     ...prev,
    //     profileImage: reader.result as string
    //   }));
    // };
    // reader.readAsDataURL(file);
    if (file) {
      uploadedImage(file);
    }
  // }
};
const UpdateUserProfile = async () => {
            setIsUploading(true);
   const { newSkill, ...dataWithoutnewSkill } = profile;
console.log('Profile data:', dataWithoutnewSkill);
  try {
  let response = await handleUpdateUser(dataWithoutnewSkill);
  if (response !== undefined && typeof response === 'object' && 'data' in response) {
           fetchUser();

    const { data } = response as { data: {} };
    const { role } = data as { role: 'freelancer' | 'employer'};
    if (role === 'freelancer') {
      router.replace('/freelancer');
    } else if (role === 'employer') {
      router.replace('/employer');
    }
  }
    // if (response?.role === 'freelancer') {
    //   // Use router.replace for faster navigation (no history entry)
    //     router.replace('/freelancer');
    //   // Show toast after navigation
    // } else if (response?.role === 'employer') {
    //     router.replace('/employer');
    // }
    toast({
      title: 'Profile Image  Updated',
      description: 'Your profile was updated successfully.',
      variant: 'default'
    });
  } catch (error: any) {
    const errorMessage =
      (error as any)?.response?.data?.message || 'An unknown error occurred';
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive'
    });
  }finally {
    setIsUploading(false);
   }
};

const validateStep = (currentStep: number): boolean => {
  const newErrors: Record<string, string> = {};

  if (currentStep === 1) {
    if (!profile.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!profile.username.trim()) newErrors.username = 'Username is required';
    if (!profile.professionalTitle.trim())
      newErrors.professionalTitle = 'Professional title is required';
    if (!profile.bio.trim()) newErrors.bio = 'Bio is required';
    if (!profile.location.trim()) newErrors.location = 'Location is required';
  } else if (currentStep === 2) {
    if (profile.skills.length === 0)
      newErrors.skills = 'At least one skill is required';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const nextStep = () => {
  if (!validateStep(step)) {
    toast({
      title: 'Validation Error',
      description: 'Please fill in all required fields before proceeding.',
      variant: 'destructive'
    });
    return;
  }

  if (step < 3) {
    setStep(step + 1);
  } else {
    // UpdateUserProfile();
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
                disabled={isUploading}
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                  onClick={UpdateUserProfile}
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <span>Save Setup</span>
                  )}
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

          <div className="lg:my-4 my-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
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
                    <div className="flex flex-col relative items-center">
                      <Avatar className="h-24 w-24">
                        <AvatarFallback className="bg-emerald-100 text-emerald-800 text-xl">
                          {profile.fullName
                            ? profile.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                            : 'U'}
                        </AvatarFallback>
                        <AvatarImage
                          src={profile.profileImage}
                          className="w-full h-full object-cover"
                        />{' '}
                        {isUploading && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
                            <Loader2 className="h-8 w-8 text-white animate-spin" />
                          </div>
                        )}
                      </Avatar>
                      <Button
                        variant="outline"
                        className="mt-2 rounded-full absolute bottom-0 right-0"
                        onClick={() =>
                          document.getElementById('fileInput')?.click()
                        }
                      >
                        {isUploading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <ImagePlus />
                        )}
                      </Button>
                      <input
                        type="file"
                        id="fileInput"
                        accept="image/*"
                        onChange={handleUploadImage}
                        className="hidden"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      placeholder="e.g. John Doe"
                      value={profile.fullName}
                      onChange={handleChange}
                      className={errors.fullName ? 'border-red-500' : ''}
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.fullName}
                      </p>
                    )}
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
                        className={`rounded-l-none ${
                          errors.username ? 'border-red-500' : ''
                        }`}
                        placeholder="username"
                        value={profile.username}
                        onChange={handleChange}
                      />
                    </div>{' '}
                    {errors.username && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.username}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professionalTitle">
                      Professional Title
                    </Label>
                    <Input
                      id="professionalTitle"
                      name="professionalTitle"
                      placeholder="e.g. Full Stack Developer"
                      value={profile.professionalTitle}
                      onChange={handleChange}
                      className={
                        errors.professionalTitle ? 'border-red-500' : ''
                      }
                    />
                    {errors.professionalTitle && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.professionalTitle}
                      </p>
                    )}
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
                      className={errors.bio ? 'border-red-500' : ''}
                    />
                    {errors.bio && (
                      <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      name="location"
                      placeholder="e.g. San Francisco, CA"
                      value={profile.location}
                      onChange={handleChange}
                      className={errors.location ? 'border-red-500' : ''}
                    />{' '}
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label>Your Skills</Label>
                    <div
                      className={`flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px] ${
                        errors.skills ? 'border-red-500' : ''
                      }`}
                    >
                      {profile.skills.map((skill) => (
                        <Badge
                          key={skill}
                          className="bg-slate-100 text-slate-800 h-fit hover:bg-slate-200 pl-2 pr-1 py-1"
                        >
                          {skill}
                          <button
                            type="button"
                            title="button"
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
                    </div>{' '}
                    {errors.skills && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.skills}
                      </p>
                    )}
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
                      value={profile.socials.github}
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
                      value={profile.socials.linkedin}
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
                      value={profile.socials.twitter}
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
                      value={profile.socials.instagram}
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
                      value={profile.socials.website}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
            </CardContent>
            <CardFooter
              className={
                step === 1 ? `flex justify-end` : `flex justify-between`
              }
            >
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={step === 1}
                className={step === 1 ? `hidden` : ``}
              >
                Back
              </Button>
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700"
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
