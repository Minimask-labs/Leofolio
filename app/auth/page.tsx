"use client"
import { UserTypeSelection } from "@/components/puzzle-user-type-selection"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-blue-600/80  flex items-center justify-center p-4">
      <UserTypeSelection />
    </main>
  );
}

