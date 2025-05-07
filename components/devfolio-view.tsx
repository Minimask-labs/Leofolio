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
  const [emailToVerify, setEmailToVerify] = useState('');
  const [previousEmail, setPreviousEmail] = useState('');
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    // Check if email is being changed
    if (name === 'email' && value !== user?.email) {
      if (!previousEmail) {
        setPreviousEmail(user?.email || '');
      }
      setEmailToVerify(value);
    }

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
      const response = await handleRequestVerifyEmailOtp(emailToVerify);
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
  const validateEmailOtp = async () => {
    setIsUploading(true);
    try {
      const response = await handleValidateVerifyEmailOtp(
        editedProfile?.email,
        emailVerificationCode
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

  const verifyEmail = async () => {
    setIsUploading(true);
    try {
      const response = await handleVerifyEmail(
        editedProfile?.email,
        emailVerificationCode
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
    if (emailToVerify && emailToVerify !== user?.email) {
      await requestEmailverifyOtp();
      setIsEmailVerificationModalOpen(true);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setEmailVerificationCode(otp);
    try {
      // First validate the OTP
      await validateEmailOtp();

      // Then verify the email
      await verifyEmail();

      // Close the modal after successful verification
      setIsEmailVerificationModalOpen(false);
      setPreviousEmail('');

      toast({
        title: 'Email Updated',
        description: 'Your email has been successfully verified and updated.'
      });
    } catch (error) {
      // Error handling is already in the validateEmailOtp and verifyEmail functions
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
      setEmailToVerify('');
      setPreviousEmail('');
    }
  }, [user]);
  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Your Devfolio</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button
              disabled={isUploading}
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={saveChanges}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Save changes</span>
              )}
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Update your personal and professional details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={editedProfile?.fullName}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex gap-2">
                <Input
                  id="email"
                  name="email"
                  value={editedProfile?.email}
                  onChange={handleChange}
                />
                {emailToVerify && emailToVerify !== user?.email && (
                  <Button
                    type="button"
                    onClick={handleEmailChange}
                    disabled={isUploading}
                  >
                    Verify
                  </Button>
                )}
              </div>
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
                  value={editedProfile?.username}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                value={editedProfile?.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professionalTitle">Professional Title</Label>
              <Input
                id="professionalTitle"
                name="professionalTitle"
                value={editedProfile?.professionalTitle}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                rows={4}
                value={editedProfile?.bio}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={editedProfile?.location}
                onChange={handleChange}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
            <CardDescription>Showcase your technical skills</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Your Skills</Label>
              <div className="flex flex-wrap gap-2 p-3 border rounded-md min-h-[100px]">
                {editedProfile?.skills?.map((skill: string) => (
                  <Badge
                    key={skill}
                    className="bg-slate-100 text-slate-800  h-fit hover:bg-slate-200 pl-2 pr-1 py-1"
                  >
                    {skill}
                    <button
                      title="remove skills"
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="ml-1 rounded-full hover:bg-slate-300 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {editedProfile?.skills?.length === 0 && (
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
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
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
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Profiles</CardTitle>
            <CardDescription>Connect your online presence</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github" className="flex items-center gap-2">
                <Github className="h-4 w-4" /> GitHub Profile
              </Label>
              <Input
                id="github"
                name="github"
                placeholder="https://github.com/username"
                value={editedProfile?.socials?.github}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="flex items-center gap-2">
                <Linkedin className="h-4 w-4" /> LinkedIn Profile
              </Label>
              <Input
                id="linkedin"
                name="linkedin"
                placeholder="https://linkedin.com/in/username"
                value={editedProfile?.socials?.linkedin}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter" className="flex items-center gap-2">
                <Twitter className="h-4 w-4" /> Twitter Profile
              </Label>
              <Input
                id="twitter"
                name="twitter"
                placeholder="https://twitter.com/username"
                value={editedProfile?.socials?.twitter}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instagram" className="flex items-center gap-2">
                <Instagram className="h-4 w-4" /> Instagram Profile
              </Label>
              <Input
                id="instagram"
                name="instagram"
                placeholder="https://instagram.com/username"
                value={editedProfile?.socials?.instagram}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="flex items-center gap-2">
                <Globe className="h-4 w-4" /> Personal Website
              </Label>
              <Input
                id="website"
                name="website"
                placeholder="https://yourwebsite.com"
                value={editedProfile?.socials?.website}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full bg-blue-600 text-white hover:bg-blue-700"
              onClick={saveChanges}
            >
              Save All Changes
            </Button>
          </CardFooter>
        </Card>
        {/* Email Verification Modal */}
        <EmailVerificationModal
          isOpen={isEmailVerificationModalOpen}
          onClose={() => setIsEmailVerificationModalOpen(false)}
          email={emailToVerify}
          onVerify={handleVerifyOtp}
          isLoading={isUploading}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Devfolio</h2>
        <Button
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => setIsEditing(true)}
        >
          Edit Devfolio
        </Button>
      </div>
      <DevfolioPreview profile={user} />
    </div>
  );
}
