"use client";

import { useEffect } from "react";
// import { useSearchParams } from "next/navigation";
import { Header } from "@/components/header";
import ProjectChat from "@/components/project-chat";
import { Suspense } from 'react';

export default function ChatPage() {
  // const searchParams = useSearchParams();
  // const conversationId = searchParams.get("id");

  return (
    <main className="min-h-screen bg-black">
      <Header />
      <div className="container mx-auto">
        <Suspense>
           <ProjectChat />
        </Suspense>
      </div>
    </main>
  );
}
