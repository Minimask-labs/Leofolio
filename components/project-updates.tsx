"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, PaperclipIcon } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface ProjectUpdatesProps {
  project: {
    id: number
    updates: {
      id: number
      author: string
      role: string
      date: string
      content: string
      isClient: boolean
    }[]
  }
}

export function ProjectUpdates({ project }: ProjectUpdatesProps) {
  const [newUpdate, setNewUpdate] = useState("")

  const handleSubmitUpdate = () => {
    if (!newUpdate.trim()) return

    // In a real implementation, this would send the update to the server
    toast({
      title: "Update Posted",
      description: "Your update has been shared with the client.",
    })

    setNewUpdate("")
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium">Project Communication</h4>

      <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 bg-slate-50 rounded-md">
        {project.updates.map((update) => (
          <div key={update.id} className={`flex gap-3 ${update.isClient ? "justify-start" : "justify-end"}`}>
            {update.isClient && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                  {update.author
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            )}

            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                update.isClient ? "bg-white border border-slate-200" : "bg-emerald-100 text-emerald-900"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-medium">
                  {update.author} ({update.role})
                </span>
                <span className="text-xs text-slate-500">{new Date(update.date).toLocaleDateString()}</span>
              </div>
              <p className="text-sm">{update.content}</p>
            </div>

            {!update.isClient && (
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-emerald-100 text-emerald-800">AM</AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Textarea
          placeholder="Add a project update or response..."
          value={newUpdate}
          onChange={(e) => setNewUpdate(e.target.value)}
          className="min-h-[80px]"
        />
      </div>

      <div className="flex justify-between">
        <Button variant="outline" size="sm" className="gap-1">
          <PaperclipIcon className="h-4 w-4" />
          Attach File
        </Button>

        <Button
          onClick={handleSubmitUpdate}
          disabled={!newUpdate.trim()}
          className="bg-emerald-600 hover:bg-emerald-700 gap-1"
        >
          <Send className="h-4 w-4" />
          Post Update
        </Button>
      </div>
    </div>
  )
}

