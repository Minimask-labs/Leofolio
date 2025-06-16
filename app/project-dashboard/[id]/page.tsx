"use client"
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

