"use client"

import { useState, useEffect } from "react"
import { UserTypeSelection } from "@/components/puzzle-user-type-selection"
import { FreelancerDashboard } from "@/components/freelancer-dashboard"
import { EmployeeDashboard } from "@/components/employee-dashboard"
import { LandingPage } from "@/components/landing-page"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { useRouter, redirect } from 'next/navigation';

export default function Home() {
  const [userType, setUserType] = useState<"freelancer" | "employer" | null>(null)
  const [connected, setConnected] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true)
  const [showLanding, setShowLanding] = useState(true)
  const router = useRouter();

  // Simulate checking if user has completed onboarding
  useEffect(() => {
    // In a real app, this would check if the user has completed their profile
    if (userType === "freelancer") {
      // For demo purposes, we'll set this to false to show the onboarding flow
      setHasCompletedOnboarding(false)
    }
  }, [userType])

//   if (showLanding && !connected) {
//     return <LandingPage onGetStarted={() => setShowLanding(false)} />
//   }

//   if (!connected) {
//     if (userType === 'freelancer') {
//                   router.replace('/seller/dashboard');
//     } else if (userType === 'employer') {
//                   router.replace('/seller/dashboard');
//     }
//   }

  return (
      <main className="min-h-screen  flex items-center justify-center p-4">
        <UserTypeSelection  />
      </main>
  );
}

