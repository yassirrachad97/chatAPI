import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import { Bell, MoreVertical, Search, Send, Smile, Users } from "lucide-react";
import { format } from "date-fns";
import YourChats from "@/components/chat/YourChat/YourChats";
import ListUserOnline from "@/components/chat/ListUserOnline/ListUserOnline";
import { io } from "socket.io-client";

// Types
type Message = {
  id: string;
  content: string;
  sender: User;
  timestamp: Date;
  read: boolean;
};

type User = {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
  typing?: boolean;
};

// Mock data
const mockUsers: User[] = [
  {
    id: "1",
    name: "Jimmy Seinz",
    avatar: "/placeholder.svg?height=32&width=32",
    online: true,
  },
  {
    id: "2",
    name: "Selly Deluna",
    avatar: "/placeholder.svg?height=32&width=32",
    online: true,
  },
  {
    id: "3",
    name: "Lana Delrey",
    avatar: "/placeholder.svg?height=32&width=32",
    online: false,
  },
];

const mockMessages: Message[] = [
  {
    id: "1",
    content: "Hi Admin, I wanted to ask about my salary this month 💰",
    sender: mockUsers[0],
    timestamp: new Date("2024-01-10T10:10:00"),
    read: true,
  },
  {
    id: "2",
    content: "Hello Jimmy! I'll check that for you right away 👍",
    sender: mockUsers[1],
    timestamp: new Date("2024-01-10T10:12:00"),
    read: true,
  },
  {
    id: "3",
    content: "There was actually a bonus added this month! 🎉",
    sender: mockUsers[1],
    timestamp: new Date("2024-01-10T10:13:00"),
    read: true,
  },
  {
    id: "4",
    content: "Oh wow, that's great news! Thank you 😊",
    sender: mockUsers[0],
    timestamp: new Date("2024-01-10T10:15:00"),
    read: true,
  },
  {
    id: "5",
    content: "You deserve it! Keep up the great work 🌟",
    sender: mockUsers[1],
    timestamp: new Date("2024-01-10T10:16:00"),
    read: true,
  },
];

// Emoji data
const emojiCategories = {
  reactions: {
    title: "Reactions",
    emojis: ["👍", "👏", "🤝", "💯", "✅"],
  },
  work: {
    title: "Work",
    emojis: ["💼", "📊", "📈", "💡", "✏️", "📝", "📌", "🎯", "⚡"],
  },
  tech: {
    title: "Tech",
    emojis: ["💻", "📱", "⌨️", "🖥️", "📧", "🔍"],
  },
  communication: {
    title: "Communication",
    emojis: ["👋", "✋", "📢", "👥", "✨"],
  },
  time: {
    title: "Time",
    emojis: ["⏰", "📅", "⌛", "✔️", "⭐"],
  },
};

export default function Chat() {
  const [selectedUser, setSelectedUser] = useState<User>(mockUsers[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: mockUsers[0],
      timestamp: new Date(),
      read: false,
    };

    setMessages([...messages, message]);
    setNewMessage("");

    // Simulate reply after 2 seconds
    setTimeout(() => {
      const replyMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! 👋",
        sender: mockUsers[1],
        timestamp: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, replyMessage]);
    }, 2000);
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const getMessageGroups = () => {
    const groups: { [key: string]: Message[] } = {};
    messages.forEach((message) => {
      const date = format(message.timestamp, "yyyy-MM-dd");
      if (!groups[date]) groups[date] = [];
      groups[date].push(message);
    });
    return groups;
  };


  useEffect(() => {
    // Connect to the Socket.IO server
    const socket = io("http://localhost:3000"); // Update with your server URL

    // Emit user connected event
    socket.emit("connection", selectedUser.id);

    // Log when the user connects
    socket.on("connect", () => {
      console.log(`Connected to the server with socket ID: ${socket.id}`);
    });

    // Listen for new messages
    socket.on("new-message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    // Listen for typing events
    socket.on("user-typing", (userId) => {
      if (selectedUser.id === userId) {
        setSelectedUser((prev) => ({ ...prev, typing: true }));
      }
    });

    socket.on("user-stopped-typing", (userId) => {
      if (selectedUser.id === userId) {
        setSelectedUser((prev) => ({ ...prev, typing: false }));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [selectedUser.id]);

  return (
    <div className="flex h-[100vh] w-full max-w-[13 00px] mx-auto border rounded-lg overflow-hidden pt-[48px] bg-white dark:bg-black">
      {/* Left sidebar */}
      <YourChats
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mockUsers={mockUsers}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} />
              <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">{selectedUser.name}</h2>
              {selectedUser.online && (
                <p className="text-sm text-green-600">Online</p>
              )}
              {!selectedUser.typing && (
                <p className="text-sm text-green-600">Typing...</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Users className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Delete chat</DropdownMenuItem>
                <DropdownMenuItem className="text-red-500 hover:text-red-600">
                  Block user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          {Object.entries(getMessageGroups()).map(([date, groupMessages]) => (
            <div key={date}>
              <div className="flex items-center gap-2 my-4">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground px-2">
                  {format(new Date(date), "MMMM d, yyyy")}
                </span>
                <Separator className="flex-1" />
              </div>
              {groupMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 mb-4 ${
                    message.sender.id === "1" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar>
                    <AvatarImage
                      src={message.sender.avatar}
                      alt={message.sender.name}
                    />
                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`flex flex-col ${
                      message.sender.id === "1" ? "items-end" : "items-start"
                    }`}
                  >
                    <Card
                      className={`p-3 max-w-md ${
                        message.sender.id === "1"
                          ? "bg-primary text-primary-foreground"
                          : ""
                      }`}
                    >
                      {message.content}
                    </Card>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {format(message.timestamp, "HH:mm")}
                      </span>
                      {message.read && (
                        <span className="text-xs text-blue-500">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </ScrollArea>

        <div className="p-4 border-t">
          <div className="flex items-center gap-2">
            <DropdownMenu
              open={showEmojiPicker}
              onOpenChange={setShowEmojiPicker}
            >
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Smile className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuPortal>
                <DropdownMenuContent className="p-2 w-64">
                  {Object.entries(emojiCategories).map(([key, category]) => (
                    <div key={key} className="mb-2">
                      <h3 className="text-xs font-medium text-muted-foreground mb-1 px-1">
                        {category.title}
                      </h3>
                      <div className="grid grid-cols-6 gap-1">
                        {category.emojis.map((emoji, index) => (
                          <Button
                            key={index}
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-muted"
                            onClick={() => handleEmojiClick(emoji)}
                          >
                            {emoji}
                          </Button>
                        ))}
                      </div>
                      {key !== Object.keys(emojiCategories).slice(-1)[0] && (
                        <Separator className="my-2" />
                      )}
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenuPortal>
            </DropdownMenu>
            <div className="flex-1">
              <textarea
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="Type a message..."
                rows={1}
                value={newMessage}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            <Button onClick={handleSendMessage} variant="default" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right sidebar - Online Friends */}
      <ListUserOnline mockUsers={mockUsers} />
    </div>
  );
}
