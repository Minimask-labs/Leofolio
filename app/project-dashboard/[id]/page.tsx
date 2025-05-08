"use client"

import { useState, useEffect } from "react"
import { UserTypeSelection } from "@/components/user-type-selection"
import { FreelancerDashboard } from "@/components/freelancer-dashboard"
import { EmployeeDashboard } from "@/components/employee-dashboard"
import { LandingPage } from "@/components/landing-page"
import { OnboardingFlow } from "@/components/onboarding-flow"
import { useRouter, redirect } from 'next/navigation';
import { Dashboard } from '@/components/project/dashboard';
import { Header } from "@/components/header"

export default function projectDashboard() {
  return (
    <main className="min-h-screen   ">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Dashboard   />
      </div>
    </main>
  );
}

