"use client"

import { useState, useEffect } from "react"
import { UserTypeSelection } from "@/components/user-type-selection"
import { FreelancerDashboard } from "@/components/freelancer-dashboard"
import { EmployeeDashboard } from "@/components/employee-dashboard"
import { LandingPage } from "@/components/landing-page"
import { OnboardingFlow } from "@/components/onboarding-flow"

export default function Home() {
  const [userType, setUserType] = useState<'freelancer' | 'employer' >(
    'freelancer'
  );
  const [connected, setConnected] = useState(false)
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(true)
  const [showLanding, setShowLanding] = useState(true)

  // Simulate checking if user has completed onboarding
  useEffect(() => {
    // In a real app, this would check if the user has completed their profile
    if (userType === "freelancer") {
      // For demo purposes, we'll set this to false to show the onboarding flow
      setHasCompletedOnboarding(false)
    }
  }, [userType])

  // if (showLanding && !connected) {
  //   return <LandingPage onGetStarted={() => setShowLanding(false)} />
  // }

  // if (!connected) {
  //   return (
  //     <main className="min-h-screen  flex items-center justify-center p-4">
  //       <UserTypeSelection onConnect={() => setConnected(true)} onSelectUserType={(type) => setUserType(type)} />
  //     </main>
  //   )
  // }

  // if (userType === "freelancer" && !hasCompletedOnboarding) {
  //   return <OnboardingFlow onComplete={() => setHasCompletedOnboarding(true)} userType={userType} />
  // }

  return (
    <main className="min-h-screen   ">
      <OnboardingFlow
        onComplete={() => setHasCompletedOnboarding(true)}
        userType={userType}
      />{' '}
    </main>
  );
}

