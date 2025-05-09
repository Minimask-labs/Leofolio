"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/Store/chat";
import { MessageSquare, Send, Search, ChevronLeft } from "lucide-react";
import { formatDateTime } from "./utils/utils";
import { useStore } from "@/Store/user";

// Define a new interface for individual messages
interface IMessage {
  _id: string;
  sender: {
    _id: string;
    fullName?: string;
    role?: string; // Added role to identify employer/freelancer
    // profileImage?: string; // Add if available and needed
  };
  content: string;
  createdAt: string;
  updatedAt: string;
  isOwn: boolean;
  isEmployer?: boolean; // Added to identify if the message is from employer
}

// This interface seems to be for conversation list items
interface IConversationSummary {
  id: string;
  name: string;
  // avatar?: string; // From mock, placeholder used directly now
  lastMessage: string;
  timestamp: string;
  unreadCounts: number; // Corrected to number based on usage
  type: string;
}

function ProjectChat() {
  const router = useRouter();
  const {
    fetchMychat,
    chat,
    handleGetSingleConversation,
    handleViewMessages,
    handleSendMessage,
  } = useChatStore();

  const { userData } = useStore();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [message, setMessage] = useState("");
  const [chatData, setChatData] = useState<any[]>([]); // Holds all conversation items from API
  const [messages, setMessages] = useState<IMessage[]>([]); // State for messages of selected conversation
  const [searchQuery, setSearchQuery] = useState("");
  const tabParam = searchParams.get("tab"); // tabParam is read but not used to control component behavior
  const [conversationId, setConversationId] = useState("");
  const currentUserId = userData?.data?.user._id;
  const [recipientId, setRecipientId] = useState("");
  const [isLoading, setIsLoading] = useState(false); // General loading for messages
  const [isSending, setIsSending] = useState(false); // Specific loading for sending a message
  const [isInitialLoading, setIsInitialLoading] = useState(false); // Only for first load of messages

  useEffect(() => {
    const id = searchParams.get("id");
    const conversationIdParam = searchParams.get("conversationId");
    if (id || conversationIdParam) {
      setSelectedConversation(id || conversationIdParam);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedConversation) {
      setConversationId(selectedConversation);
      setRecipientId(""); // Reset recipientId when conversation changes
      setMessages([]); // Clear previous messages
    } else {
      setConversationId("");
      setMessages([]);
      setRecipientId("");
    }
  }, [selectedConversation]);

  // Fetch all conversations when component mounts or relevant params change
  useEffect(() => {
    const fetchChats = async () => {
      try {
        await fetchMychat();
      } catch (error) {
        console.log("Error fetching my chats:", error);
      }
    };
    // Initial fetch
    if (tabParam === "chat" || pathname?.includes("/chat")) {
      fetchChats();
    }
    // Polling every 2 seconds
    const interval = setInterval(() => {
      if (tabParam === "chat" || pathname?.includes("/chat")) {
        fetchChats();
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [fetchMychat, tabParam, pathname]);

  // Update local state when chat (all conversations) data changes from store
  useEffect(() => {
    if (chat?.data) {
      setChatData(chat.data.items || chat.data); // Adapt to potential 'items' wrapper from API for all conversations
    }
  }, [chat?.data]);

  // Refactored message fetching logic for reuse
  const fetchMessagesForConversation = async (convId: string) => {
    if (!convId) {
      setMessages([]);
      setIsInitialLoading(false);
      return;
    }
    try {
      setIsLoading(true);
      const response = await handleViewMessages(convId);
      if (response?.data?.data) {
        // Get the conversation details to check roles
        const conversationResponse = await handleGetSingleConversation(convId);
        let conversationData = conversationResponse?.data;
        const fetchedMessages = response.data.data.map((msg: any) => {
          // Find the participant that matches the sender
          const senderParticipant = conversationData?.participants?.find(
            (p: any) => p._id === (msg.sender?._id || msg.sender)
          );
          // Check if the sender is an employer (client)
          const isEmployer = senderParticipant?.role !== "freelancer";
          return {
            _id: msg._id,
            sender: {
              ...msg.sender,
              role: senderParticipant?.role,
            },
            content: msg.content,
            createdAt: msg.createdAt,
            updatedAt: msg.updatedAt,
            isOwn: msg.sender === currentUserId,
            isEmployer: isEmployer,
          };
        });
        setMessages(
          fetchedMessages.sort(
            (a: IMessage, b: IMessage) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        );
        setIsInitialLoading(false);
      } else {
        setMessages([]);
        setIsInitialLoading(false);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
      setIsInitialLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch messages when conversation ID changes
  useEffect(() => {
    if (conversationId) {
      setIsInitialLoading(true);
    }
    fetchMessagesForConversation(conversationId);
  }, [conversationId, handleViewMessages, currentUserId]);

  // Poll messages for open conversation every 2 seconds
  useEffect(() => {
    if (!conversationId) return;
    const interval = setInterval(() => {
      fetchMessagesForConversation(conversationId);
    }, 2000);
    return () => clearInterval(interval);
  }, [conversationId, handleViewMessages, currentUserId]);

  // Get conversation details (e.g., for recipientId) when conversation ID changes
  useEffect(() => {
    const getConversationDetails = async () => {
      if (!conversationId) {
        setRecipientId("");
        return;
      }
      try {
        const response = await handleGetSingleConversation(conversationId);
        if (response?.data) {
          // Participants array is in response.data for a single conversation
          const conversationData = response.data;
          if (
            conversationData.participants &&
            Array.isArray(conversationData.participants)
          ) {
            const otherParticipant = conversationData.participants.find(
              (p: any) => p._id !== currentUserId
            );
            if (otherParticipant) {
              setRecipientId(otherParticipant._id);
            } else {
              setRecipientId("");
              console.warn(
                "Could not find other participant in conversation:",
                conversationId
              );
            }
          } else {
            setRecipientId("");
          }
        } else {
          setRecipientId("");
        }
      } catch (error) {
        console.error("Error fetching conversation details:", error);
        setRecipientId("");
      }
    };

    getConversationDetails();
  }, [conversationId, currentUserId, handleGetSingleConversation]);

  const formattedConversations: IConversationSummary[] = Array.isArray(chatData)
    ? chatData.map(
        (conversation: {
          _id: string;
          participants: {
            _id: string;
            walletAddress: string;
            role: string;
            fullName?: string;
          }[];
          unreadCounts: Record<string, number>;
          createdAt: string;
          updatedAt: string; // Added updatedAt for more accurate sorting if lastMessage is null
          lastMessage?: {
            content: string;
            sender: { _id: string };
            createdAt: string;
          };
        }) => {
          const otherParticipant = conversation.participants.find(
            (p) => p._id !== currentUserId
          );

          const displayName =
            otherParticipant?.fullName ||
            (otherParticipant?.walletAddress
              ? `${otherParticipant.walletAddress.substring(
                  0,
                  6
                )}...${otherParticipant.walletAddress.substring(
                  otherParticipant.walletAddress.length - 4
                )}`
              : "Unknown User");

          return {
            id: conversation._id,
            name: displayName,
            lastMessage: conversation.lastMessage?.content || "No messages yet",
            timestamp: formatDateTime(
              conversation.lastMessage?.createdAt ||
                conversation.updatedAt ||
                conversation.createdAt
            ),
            unreadCounts: conversation.unreadCounts?.[currentUserId] || 0,
            type:
              otherParticipant?.role === "freelancer" ? "employee" : "client",
          };
        }
      )
    : [];

  const filteredConversations = formattedConversations
    ?.filter((conversation: IConversationSummary) =>
      conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // Basic sort by timestamp, assuming formatDateTime provides sortable string or convert to Date
      // This might need adjustment based on formatDateTime output. For robust sorting, use original date objects.
      // For simplicity, if timestamp is "10:30 AM" vs "Yesterday", direct string sort is not ideal.
      // Here, we assume newer conversations (based on last activity) should appear first.
      // This requires original date from 'conversation.updatedAt' or 'conversation.lastMessage.createdAt'
      // The current `timestamp` field is already formatted string.
      // We'd need to sort based on the original date from chatData before formatting.
      // For now, let's skip complex sorting on the formatted string.
      return 0;
    });

  const sendMessage = async () => {
    if (!message.trim() || !recipientId) {
      if (!recipientId)
        console.error("No recipient ID available for sending message.");
      return;
    }

    let optimisticMessageId: string | null = null;

    try {
      setIsSending(true);

      const optimisticMessage: IMessage = {
        _id: `temp-${Date.now()}`,
        sender: {
          _id: currentUserId,
          fullName: userData?.data?.user?.fullName || "You",
          role: userData?.data?.user?.role,
        },
        content: message,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isOwn: true,
        isEmployer: userData?.data?.user?.role !== "freelancer",
      };

      optimisticMessageId = optimisticMessage._id;

      setMessages((prevMessages) => [...prevMessages, optimisticMessage]);
      const messageCopy = message;
      setMessage("");

      await handleSendMessage(recipientId, messageCopy);

      // Remove explicit refetch and let polling handle updating messages
      // The polling will naturally update the messages within 2 seconds
    } catch (error) {
      console.error("Error sending message:", error);
      // Optionally, remove optimistic message or show error state
      if (optimisticMessageId) {
        setMessages((prevMessages) =>
          prevMessages.filter((m) => m._id !== optimisticMessageId)
        );
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

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
                      selectedConversation === conversation.id
                        ? "bg-gray-800"
                        : ""
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="h-10 w-10 mr-3 rounded-full bg-gray-700 flex items-center justify-center text-white">
                      {conversation.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <p className="font-medium truncate text-sm">
                          {conversation.name}
                        </p>
                        <span className="text-xs text-gray-400">
                          {conversation.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 truncate">
                        {conversation.lastMessage}
                      </p>
                    </div>
                    {conversation.unreadCounts > 0 && ( // Changed from unreadCounts object to direct number
                      <div className="ml-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unreadCounts}
                      </div>
                    )}
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
                  <img src="/placeholder.svg?height=40&width=40" alt="Avatar" />
                </Avatar>
                <div>
                  <h2 className="font-medium">
                    {formattedConversations.find(
                      (c) => c.id === selectedConversation
                    )?.name || "Conversation"}
                  </h2>
                  <p className="text-xs text-gray-400">
                    {formattedConversations.find(
                      (c) => c.id === selectedConversation
                    )?.type === "employee"
                      ? "Freelancer"
                      : "Client"}
                  </p>
                </div>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {isLoading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full py-8">
                      <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                    </div>
                  ) : messages?.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg._id}
                        className={`flex ${
                          msg.isOwn ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-3 ${
                            msg.isOwn
                              ? "bg-blue-600 text-white"
                              : "bg-gray-800 text-white"
                          }`}
                        >
                          <p>{msg.content}</p>
                          <p className="text-xs mt-1 opacity-70 text-right italic">
                            {formatDateTime(msg.createdAt)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No messages yet</p>
                      <p className="text-sm mt-2">
                        Start the conversation by sending a message
                      </p>
                    </div>
                  )}
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
                    disabled={isInitialLoading || isSending || !recipientId} // Disable only for initial load, sending, or no recipient
                  />
                  <Button
                    size="icon"
                    className="bg-blue-600 hover:bg-blue-700 ml-2"
                    onClick={sendMessage}
                    disabled={
                      !message?.trim() ||
                      isSending ||
                      !recipientId ||
                      isInitialLoading
                    }
                  >
                    {isSending ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Send size={18} />
                    )}
                  </Button>
                </div>
                {!recipientId &&
                  conversationId &&
                  !isLoading && ( // Only show if not loading and conversation is selected
                    <p className="text-xs text-red-400 mt-2 text-center">
                      Unable to identify recipient. Please select the
                      conversation again or check connection.
                    </p>
                  )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
              <MessageSquare size={48} className="text-gray-500 mb-4" />
              <h3 className="text-xl font-medium mb-2">Your Messages</h3>
              <p className="text-gray-400 max-w-md">
                Select a conversation from the sidebar to view your messages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectChat;
