'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { DevfolioPreview } from './devfolio-preview';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Github,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CredentialManager } from './credential-manager';
import { WorkHistory } from './work-history';
import { EmailVerificationModal } from '@/components/auth/email-verification-modal';
import { useUserProfileStore } from '@/Store/userProfile';

// interface DevfolioViewProps {
//   profile: {
//     fullName: string;
//     username: string;
//     professionalTitle: string;
//     bio: string;
//     location: string;
//     skills: string[];
//     socials: {
//       twitter: string;
//       linkedin: string;
//       github: string;
//       instagram: string;
//       website: string;
//     };
//   };
//   setProfile: React.Dispatch<
//     React.SetStateAction<{
//       fullName: string;
//       username: string;
//       professionalTitle: string;
//       bio: string;
//       location: string;
//       skills: string[];
//       socials: {
//         twitter: string;
//         linkedin: string;
//         github: string;
//         instagram: string;
//         website: string;
//       };
//     }>
//   >;
// }

export function DevfolioView() {
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const {
    handleUpdateUser,
    handleUploadMedia,
    media,
    fetchUser,
    user,
    handleVerifyEmail,
    handleRequestVerifyEmailOtp,
    handleValidateVerifyEmailOtp
  } = useUserProfileStore();
  const [editedProfile, setEditedProfile] = useState(user);
  const [isUploading, setIsUploading] = useState(false);
  const [emailVerificationCode, setEmailVerificationCode] = useState('');
  const [isEmailVerificationModalOpen, setIsEmailVerificationModalOpen] =
    useState(false);
  // const [emailToVerify, setEmailToVerify] = useState('');
  // const [previousEmail, setPreviousEmail] = useState('');
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Check if email is being changed
    // if (name === 'email' && value !== user?.email) {
    //   if (!previousEmail) {
    //     setPreviousEmail(user?.email || '');
    //   }
    //   setEmailToVerify(value);
    // }

    setEditedProfile((prev: any) => ({ ...prev, [name]: value }));
  };

  // const handleChange = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const { name, value } = e.target;
  //   setEditedProfile((prev: any) => ({ ...prev, [name]: value }));
  // };

  const addSkill = () => {
    if (newSkill && !editedProfile?.skills?.includes(newSkill)) {
      setEditedProfile((prev: { skills: any }) => ({
        ...prev,
        skills: [...prev?.skills, newSkill]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setEditedProfile((prev: { skills: any[] }) => ({
      ...prev,
      skills: prev?.skills.filter((s: string) => s !== skill)
    }));
  };

  const saveChanges = async () => {
    // setProfile(editedProfile)
    setIsUploading(true);

    toast({
      title: 'Profile Updated',
      description: 'Your devfolio has been updated successfully.'
    });
    try {
      let response = await handleUpdateUser(editedProfile);
      if (
        response !== undefined &&
        typeof response === 'object' &&
        'data' in response
      ) {
        const { data, success } = response as { data: {}; success: boolean };
        const { role } = data as { role: 'freelancer' | 'employer' };
        if (success) {
          setIsEditing(false);
          fetchUser();
        }
      }
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
    } finally {
      setIsUploading(false);
    }
  };

  const requestEmailverifyOtp = async () => {
    setIsUploading(true);
    try {
      const response = await handleRequestVerifyEmailOtp(
        editedProfile?.email ? editedProfile?.email : user?.email
      );
      if (
        response !== undefined &&
        typeof response === 'object' &&
        'data' in response
      ) {
        const { data, success } = response as { data: {}; success: boolean };
        if (success) {
          toast({
            title: 'Email Verification Code Sent',
            description: 'A verification code has been sent to your email.'
          });
        }
      }
    } catch (error: any) {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  const validateEmailOtp = async (otp: string) => {
    setIsUploading(true);
    try {
      const response = await handleValidateVerifyEmailOtp(
        editedProfile?.email ? editedProfile?.email : user?.email,
        otp
      );
      if (
        response !== undefined &&
        typeof response === 'object' &&
        'data' in response
      ) {
        const { data, success } = response as { data: {}; success: boolean };
        if (success) {
          toast({
            title: 'Email Verified',
            description: 'Your email has been verified successfully.'
          });
        }
      }
    } catch (error: any) {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const verifyEmail = async (otp: string) => {
    setIsUploading(true);
    try {
      const response = await handleVerifyEmail(
        editedProfile?.email ? editedProfile?.email : user?.email,
        otp
      );
      if (
        response !== undefined &&
        typeof response === 'object' &&
        'data' in response
      ) {
        const { data, success } = response as { data: {}; success: boolean };
        if (success) {
          toast({
            title: 'Email Verified',
            description: 'Your email has been verified successfully.'
          });
        }
      }
    } catch (error: any) {
      const errorMessage =
        (error as any)?.response?.data?.message || 'An unknown error occurred';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };
  const handleEmailChange = async () => {
    if (user?.isEmailVerified === false && user?.email) {
      await requestEmailverifyOtp();
      setIsEmailVerificationModalOpen(true);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setEmailVerificationCode(otp);
    try {
      // First validate the OTP
      await validateEmailOtp(otp);

      // Then verify the email
      await verifyEmail(otp);

      // Close the modal after successful verification
      setIsEmailVerificationModalOpen(false);
      // setPreviousEmail('');

      toast({
        title: 'Email Updated',
        description: 'Your email has been successfully verified and updated.'
      });
    } catch (error) {
      // Error handling is already in the validateEmailOtp and verifyEmail functions
    } finally {
      fetchUser();
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Update editedProfile whenever user data changes
  useEffect(() => {
    if (user) {
      setEditedProfile(user);
      // Reset email verification state when user data changes
      // setEmailToVerify('');
      // setPreviousEmail('');
    }
  }, [user]);
  if (isEditing) {
    return (
      <div className="space-y-8 p-8 bg-gradient-to-br from-white via-gray-50 to-gray-100 min-h-screen">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
              Edit Your Devfolio
            </h2>
            <p className="text-gray-700 mt-1">
              Customize your professional profile
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="hover:bg-gray-100 transition-all duration-300 border-2 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              disabled={isUploading}
              className="bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-200 px-6"
              onClick={saveChanges}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              <span>Save changes</span>
            </Button>
          </div>
        </div>

        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 p-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Basic Information
            </CardTitle>
            <CardDescription className="text-gray-700 text-base">
              Update your personal and professional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-900"
                >
                  Full Name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={editedProfile?.fullName}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-900"
                >
                  Email
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    value={editedProfile?.email}
                    onChange={handleChange}
                    disabled={user?.email}
                    className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900"
                  />
                  {user?.isEmailVerified === false && user?.email && (
                    <Button
                      type="button"
                      onClick={handleEmailChange}
                      disabled={isUploading}
                      className="bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-600 hover:to-blue-500 transition-all duration-300 h-11"
                    >
                      Verify
                    </Button>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-900"
                >
                  Username
                </Label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-700 text-sm h-11">
                    @
                  </span>
                  <Input
                    id="username"
                    name="username"
                    className="rounded-l-none border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900"
                    value={editedProfile?.username}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="professionalTitle"
                  className="text-sm font-medium text-gray-900"
                >
                  Professional Title
                </Label>
                <Input
                  id="professionalTitle"
                  name="professionalTitle"
                  value={editedProfile?.professionalTitle}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-sm font-medium text-gray-900"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                value={editedProfile?.bio}
                onChange={handleChange}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 resize-none min-h-[120px] bg-white text-gray-900"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-sm font-medium text-gray-900"
              >
                Location
              </Label>
              <Input
                id="location"
                name="location"
                value={editedProfile?.location}
                onChange={handleChange}
                className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 p-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Skills & Expertise
            </CardTitle>
            <CardDescription className="text-gray-700 text-base">
              Showcase your technical skills and expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="space-y-3">
              <Label className="text-sm font-medium text-gray-900">
                Your Skills
              </Label>
              <div className="flex flex-wrap gap-2 p-4 border border-gray-200 rounded-lg min-h-[120px] bg-gray-50 transition-all duration-300 hover:border-blue-200">
                {editedProfile?.skills?.map((skill: string) => (
                  <Badge
                    key={skill}
                    className="bg-gradient-to-r from-blue-100 to-blue-50 text-blue-800 hover:from-blue-200 hover:to-blue-100 h-fit pl-3 pr-2 py-1.5 transition-all duration-300 text-sm font-medium"
                  >
                    {skill}
                    <button
                      title="remove skills"
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1.5 rounded-full hover:bg-blue-200 p-1 transition-colors"
                    >
                      <X className="h-3.5 w-3.5 text-blue-700" />
                    </button>
                  </Badge>
                ))}
                {editedProfile?.skills?.length === 0 && (
                  <p className="text-gray-600 text-sm">
                    Add your technical skills below
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex-grow">
                <Input
                  placeholder="Add a skill (e.g. JavaScript, React, AWS)"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <Button
                type="button"
                onClick={addSkill}
                className="bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-600 hover:to-blue-500 transition-all duration-300 h-11 w-11 p-0"
              >
                <Plus className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden bg-white">
          <CardHeader className="bg-gradient-to-r from-gray-50 via-white to-gray-50 border-b border-gray-200 p-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Social Profiles
            </CardTitle>
            <CardDescription className="text-gray-700 text-base">
              Connect your online presence and professional networks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label
                  htmlFor="github"
                  className="flex items-center gap-2 text-sm font-medium text-gray-900"
                >
                  <Github className="h-4 w-4" /> GitHub Profile
                </Label>
                <Input
                  id="github"
                  name="github"
                  placeholder="https://github.com/username"
                  value={editedProfile?.socials?.github}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="linkedin"
                  className="flex items-center gap-2 text-sm font-medium text-gray-900"
                >
                  <Linkedin className="h-4 w-4" /> LinkedIn Profile
                </Label>
                <Input
                  id="linkedin"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  value={editedProfile?.socials?.linkedin}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="twitter"
                  className="flex items-center gap-2 text-sm font-medium text-gray-900"
                >
                  <Twitter className="h-4 w-4" /> Twitter Profile
                </Label>
                <Input
                  id="twitter"
                  name="twitter"
                  placeholder="https://twitter.com/username"
                  value={editedProfile?.socials?.twitter}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="instagram"
                  className="flex items-center gap-2 text-sm font-medium text-gray-900"
                >
                  <Instagram className="h-4 w-4" /> Instagram Profile
                </Label>
                <Input
                  id="instagram"
                  name="instagram"
                  placeholder="https://instagram.com/username"
                  value={editedProfile?.socials?.instagram}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label
                  htmlFor="website"
                  className="flex items-center gap-2 text-sm font-medium text-gray-900"
                >
                  <Globe className="h-4 w-4" /> Personal Website
                </Label>
                <Input
                  id="website"
                  name="website"
                  placeholder="https://yourwebsite.com"
                  value={editedProfile?.socials?.website}
                  onChange={handleChange}
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300 h-11 bg-white text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        <EmailVerificationModal
          isOpen={isEmailVerificationModalOpen}
          onClose={() => setIsEmailVerificationModalOpen(false)}
          email={editedProfile?.email ? editedProfile?.email : user?.email}
          onVerify={handleVerifyOtp}
          isLoading={isUploading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8  min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-700 via-blue-600 to-blue-500 bg-clip-text text-transparent">
            Your Aleo Profile
          </h2>
          <p className="text-gray-700 mt-1">Your professional portfolio</p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-700 to-blue-600 text-white hover:from-blue-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-blue-200 px-6"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      </div>
      <DevfolioPreview profile={user} />
    </div>
  );
}
