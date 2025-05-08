
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {useChatStore} from "@/Store/chat";
import { MessageSquare, Send, Paperclip, Search, ChevronLeft, User, Users } from "lucide-react"
import { formatDateTime } from "./utils/utils"
import { useStore } from "@/Store/user"


interface Conversation {
  id: string;
  name: string;
  content: string;
  updatedAt: string;
  unreadCounts: number;
  type: string;
 lastMessage?: { content: string; sender: { _id: string }; createdAt: string }
  isOwn: boolean;
  sender: string;
}
// Mock data for conversations
const mockConversations = [
  {
    id: "1",
    name: "John Doe",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I've completed the milestone for the project",
    timestamp: "10:30 AM",
    unread: 2,
    type: "client",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "When is the next team meeting?",
    timestamp: "Yesterday",
    unread: 0,
    type: "employee",
  },
  {
    id: "3",
    name: "Michael Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "I need the updated project timeline",
    timestamp: "May 1",
    unread: 1,
    type: "client",
  },
  {
    id: "4",
    name: "Emily Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "The design files are ready for review",
    timestamp: "Apr 29",
    unread: 0,
    type: "employee",
  },
]

// Mock data for messages in a conversation
const mockMessages = [
  {
    id: "m1",
    sender: "John Doe",
    senderId: "1",
    content: "Hello, I wanted to discuss the project timeline.",
    timestamp: "10:15 AM",
    isOwn: false,
  },
  {
    id: "m2",
    sender: "You",
    senderId: "current-user",
    content: "Hi John, sure. What specifically would you like to discuss?",
    timestamp: "10:20 AM",
    isOwn: true,
  },
  {
    id: "m3",
    sender: "John Doe",
    senderId: "1",
    content: "I'm concerned about the deadline for the second milestone. Can we extend it by a week?",
    timestamp: "10:25 AM",
    isOwn: false,
  },
  {
    id: "m4",
    sender: "You",
    senderId: "current-user",
    content: "I understand your concern. Let me check our schedule and get back to you shortly.",
    timestamp: "10:30 AM",
    isOwn: true,
  },
]

function ProjectChat() {
  const router = useRouter()
   const {
    fetchMychat,
    chat,
      handleGetSingleConversation,
      handleViewMessages,
        handleSendMessage
      } = useChatStore();

      const {userData } = useStore();
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("clients")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [conversations, setConversations] = useState([])
  const [chatData, setChatData] = useState([])
  const [messages, setMessages] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("")
  const tabParam = searchParams.get('tab');
  const [conversationId, setConversationId] = useState("")
  const currentUserId = userData?.data?.user._id
  let recipientId;

  useEffect(() => {
    const conversationId = searchParams.get("id")
    if (conversationId) {
      setSelectedConversation(conversationId)
    }
  }, [searchParams])

  useEffect(()=> {
    if(selectedConversation){
    setConversationId(selectedConversation)
    }
    if(conversations){
        
    }
  }, [selectedConversation])

  useEffect(()=> {
    const fetchChats = async ()=> {
        try {
        fetchMychat()
        } catch (error) {
            console.log(error)
        }
    }
    fetchChats()
  }, [tabParam === "chat"])


  useEffect(()=> {
    if(chat?.data)
    setChatData(chat?.data)
    setConversations(chat?.data)
  }, [chat?.data])


  useEffect(() => {
    const viewMessages = async () => {
      try {
       handleViewMessages(conversationId)
       console.log(chat, " messages data")
        
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    viewMessages();
  }, [conversationId]); 
  useEffect(() => {
    const getSingleConvo = async () => {
      try {
        handleGetSingleConversation(conversationId)
        console.log(chat, " single convo")
        setMessages(chat?.data)
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    getSingleConvo();
  }, [conversationId]); 
 


//   console.log(recipientId, " recipient id")
  console.log(chat?.data?.participants, " chat id")


   const formattedConversations = chatData.map((conversation: { 
    _id: string; 
    participants: { _id: string; walletAddress: string; role: string }[]; 
    unreadCounts: Record<string, number>; 
    createdAt: string; 
    lastMessage?: { content: string; sender: { _id: string }; createdAt: string } 
  }) => {
    const otherParticipant = conversation.participants.find(p => p._id !== currentUserId)
    
    return {
      id: conversation._id,
      name: otherParticipant ? 
        `${otherParticipant.walletAddress.substring(0, 8)}...` : 
        "Unknown User",

      lastMessage: conversation.lastMessage?.content || "No messages yet",
      timestamp: new Date(conversation.lastMessage?.createdAt || conversation.createdAt)
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      unreadCounts: conversation.unreadCounts[currentUserId] || 0,
      type: otherParticipant?.role === "freelancer" ? "employee" : "client"
    }
  })

  const filteredConversations = formattedConversations?.filter(
    (conversation: { id: string; name: string; lastMessage: string; timestamp: string; unreadCounts: number; type: string }) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const sendMessage = () => {
    if (!message.trim()) return

    handleSendMessage("6813938b133f29d4d618df05", message)
    const newMessage = {
      id: `m${messages.length + 1}`,
      sender: "You",
      senderId: "current-user",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    }

    setMessages([
      ...messages,
      {
        ...newMessage,
        name: "Unknown", // Provide default or appropriate values
        updatedAt: new Date().toISOString(),
        unreadCounts: 0,
        type: "client",
      } as Conversation,
    ])
    setMessage("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-screen bg-black text-white">
      <div className="flex flex-1 overflow-hidden">
        <div className="w-max pt-4 border-r border-gray-800 flex flex-col">
          <div className="px-4 mb-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search conversations..."
                className="pl-8 bg-gray-800 border-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">

            {/* <div className="space-y-1 p-2">
              {filteredConversations?.map((conversation: { id: string; name: string; lastMessage: string; timestamp: string; unread: number; type: string }) => (
                <div
                  key={conversation.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-800 ${
                    selectedConversation === conversation.id ? "bg-gray-800" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <Avatar className="h-10 w-10 mr-3">
                    <img src={"/placeholder.svg"} alt={conversation.name} />
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate">{conversation.name}</p>
                      <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">{conversation.lastMessage}</p>
                  </div>
                  {conversation.unread > 0 && (
                    <div className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {conversation.unread}
                    </div>
                  )}
                </div>
              ))}
            </div> */}

         <div className="flex-1 overflow-y-auto">
            <div className="space-y-1 p-2">
              {filteredConversations?.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-800 ${
                    selectedConversation === conversation.id ? "bg-gray-800" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation.id)}
                >
                  <div className="h-10 w-10 mr-3 rounded-full bg-gray-700 flex items-center justify-center">
                    {/* <img src={conversation.avatar} alt="" className="rounded-full" /> */}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="font-medium truncate text-sm">{conversation.name}</p>
                      <span className="text-xs text-gray-400">{conversation.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{conversation.lastMessage}</p>
                  </div>
                  {Object.keys(conversation.unreadCounts).length > 0 &&
                    <div className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {Object.keys(conversation.unreadCounts).length}
                    </div>
                  }
                </div>
              ))}
            </div>
          </div>
          </ScrollArea>
        </div>

    
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <>
              <div className="p-4 border-b border-gray-800 flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden mr-2"
                  onClick={() => setSelectedConversation(null)}
                >
                  <ChevronLeft />
                </Button>
                <Avatar className="h-10 w-10 mr-3">
                  <img
                    src={
                    //   conversations.find((c) => c.id === selectedConversation)?.avatar ||
                      "/placeholder.svg?height=40&width=40"
                    }
                    alt="Avatar"
                  />
                </Avatar>
                <div>
                  <h2 className="font-medium">
                    {/* {conversations.find((c) => c.id === selectedConversation)?.name || "Conversation"} */}
                  </h2>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages?.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          msg.isOwn ? "bg-blue-600 text-white" : "bg-gray-800 text-white"
                        }`}
                      >
                        <p className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>{!msg.isOwn ? msg.lastMessage?.content : msg?.content}</p>
                        <p className="text-xs mt-1 opacity-70 text-right italic">{formatDateTime(msg.updatedAt)}</p>
                      </div>
                    </div>
                
                  ))}
                </div>
              </ScrollArea>
              <div className="p-4 border-t border-gray-800">
                <div className="flex items-center bg-gray-800 rounded-lg p-2">
                  <Input
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700 ml-2"
                    onClick={sendMessage}
                    disabled={!message?.trim()}
                  >
                    <Send size={18} />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <MessageSquare size={48} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Your Messages</h3>
              <p className="text-gray-400 max-w-md">Select a conversation from the sidebar to view your messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProjectChat
