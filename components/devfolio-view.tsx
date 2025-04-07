"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DevfolioPreview } from "./devfolio-preview"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Globe, Linkedin, Twitter, Instagram, Plus, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CredentialManager } from "./credential-manager"
import { WorkHistory } from "./work-history"

interface DevfolioViewProps {
  profile: {
    name: string
    username: string
    title: string
    bio: string
    location: string
    skills: string[]
    github: string
    linkedin: string
    twitter: string
    instagram: string
    website: string
  }
  setProfile: React.Dispatch<
    React.SetStateAction<{
      name: string
      username: string
      title: string
      bio: string
      location: string
      skills: string[]
      github: string
      linkedin: string
      twitter: string
      instagram: string
      website: string
    }>
  >
}

export function DevfolioView({ profile, setProfile }: DevfolioViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState(profile)
  const [newSkill, setNewSkill] = useState("")
  const [activeTab, setActiveTab] = useState("overview")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedProfile((prev) => ({ ...prev, [name]: value }))
  }

  const addSkill = () => {
    if (newSkill && !editedProfile.skills.includes(newSkill)) {
      setEditedProfile((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill],
      }))
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setEditedProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }))
  }

  const saveChanges = () => {
    setProfile(editedProfile)
    setIsEditing(false)
    toast({
      title: "Profile Updated",
      description: "Your devfolio has been updated successfully.",
    })
  }

  if (isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Edit Your Devfolio</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={saveChanges}>
              Save Changes
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your personal and professional details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" value={editedProfile.name} onChange={handleChange} />
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
                  value={editedProfile.username}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Professional Title</Label>
              <Input id="title" name="title" value={editedProfile.title} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" rows={4} value={editedProfile.bio} onChange={handleChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" value={editedProfile.location} onChange={handleChange} />
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
                {editedProfile.skills.map((skill) => (
                  <Badge key={skill} className="bg-slate-100 text-slate-800 hover:bg-slate-200 pl-2 pr-1 py-1">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="ml-1 rounded-full hover:bg-slate-300 p-1">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                {editedProfile.skills.length === 0 && (
                  <p className="text-slate-400 text-sm">Add your technical skills below</p>
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
                    if (e.key === "Enter") {
                      e.preventDefault()
                      addSkill()
                    }
                  }}
                />
              </div>
              <Button type="button" onClick={addSkill} className="bg-emerald-600 hover:bg-emerald-700">
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
                value={editedProfile.github}
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
                value={editedProfile.linkedin}
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
                value={editedProfile.twitter}
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
                value={editedProfile.instagram}
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
                value={editedProfile.website}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={saveChanges}>
              Save All Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Your Devfolio</h2>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => setIsEditing(true)}>
          Edit Devfolio
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="credentials">Credentials</TabsTrigger>
          <TabsTrigger value="work-history">Work History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DevfolioPreview profile={profile} />
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4">
          <CredentialManager />
        </TabsContent>

        <TabsContent value="work-history" className="space-y-4">
          <WorkHistory />
        </TabsContent>
      </Tabs>
    </div>
  )
}

