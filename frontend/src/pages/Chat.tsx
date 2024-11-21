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
import { io, Socket } from "socket.io-client";

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

interface JoinRoomData {
  roomName: string;
}

type Messages = {
  createdAt: string;
  message: string;
  receiver: {
    _id: string;
    username: string;
    image: string;
  };
  roomName: string;
  sender: {
    _id: string;
    username: string;
    image: string;
  };
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

const mockMessages = [
  {
    _id: "67346d797577d404e390a2e6",
    message: "hi",
    sender: { id: "1", name: "Jimmy", avatar: "avatar1.jpg" },
    receiver: { id: "2", name: "Admin", avatar: "avatar2.jpg" },
    roomName: "room1",
    timestamp: new Date("2024-01-10T10:10:00"),
    read: true,
  },
  {
    _id: "67346d827577d404e390a2eb",
    message: "hello",
    sender: { id: "2", name: "Admin", avatar: "avatar2.jpg" },
    receiver: { id: "1", name: "Jimmy", avatar: "avatar1.jpg" },
    roomName: "room1",
    timestamp: new Date("2024-01-10T10:12:00"),
    read: true,
  },
  {
    _id: "6734be05ea40fae2e2b6a674",
    message: "sss",
    sender: { id: "1", name: "Jimmy", avatar: "avatar1.jpg" },
    receiver: { id: "2", name: "Admin", avatar: "avatar2.jpg" },
    roomName: "room1",
    timestamp: new Date("2024-01-10T10:13:00"),
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

const socket: Socket = io("http://localhost:3000");
export default function Chat() {
  const [co, setco] = useState<number>(0);
  const [message, setMessage] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("");
  const [typing, settyping] = useState<boolean>(false);
  const currentUserId = localStorage.getItem("sender");
  const receiver = localStorage.getItem("receiver");
  const [selectedUser, setSelectedUser] = useState<User>(mockUsers[0]);
  const [messages, setMessages] = useState<Message[]>();
  const [contacts, setContacts] = useState([]);
  const [messagess, setMessagess] = useState<any>();
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [receive, setReceive] = useState<any>();
  const [socketid, setSocketid] = useState<any>(socket.id);
  const [idreciver, setIdreciver] = useState();
  const [socketidback, setSocketidback] = useState<any>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [co]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await socket.emit("message", {
        sender: currentUserId,
        receiver: receive && receive.id,
        message: newMessage,
      });

      // console.log(receive.id);

      setNewMessage("");
      await setco((pre) => pre + 1);

      console.log(co);

      scrollToBottom();
    }

    console.log(newMessage);

    console.log("yeeeeessssssssssssssssssssssssssss");
  };

  const handleTypingStart = (e) => {
    console.log(roomName);

    const data = {
      id: socket.id,
      roomName: roomName,
      ec: e,
    };
    console.log(data);

    socket.emit("start-typing", { data });
  };

  const handleTypingStop = () => {
    const data = {
      id: socket.id,
      roomName: roomName,
    };
    socket.emit("stop-typing", { data });
  };

  const handleEmojiClick = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  // const getMessageGroups = () => {
  //   const groups: { [key: string]: Message[] } = {};
  //   messages.forEach((message) => {
  //     const date = format(message.timestamp, "yyyy-MM-dd");
  //     if (!groups[date]) groups[date] = [];
  //     groups[date].push(message);
  //   });
  //   return groups;
  // };

  const handlRoom = (idReciver: string) => {
    console.log(idReciver);
    const participants = [currentUserId, idReciver].sort();
    const roomNam = `${participants[0]}-${participants[1]}`;

    setRoomName(roomNam);
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");

    if (currentUserId) {
      const currentUserId = localStorage.getItem("sender");
      socket.emit("userConnected", { currentUserId });
    }

    // Join room event
    socket.emit("joinRoom", { roomName } as JoinRoomData);

    socket.emit("getContacts", { roomName: currentUserId });

    // Listen for new messages in the room
    socket.on("roomMessage", (data: { message: Message }) => {
      setMessagess((prevMessages: any) => [...prevMessages, data.message]);

      setco((pre) => pre + 1);
    });

    if (receive)
      socket.emit("markAsRead", {
        receiver: currentUserId,
        sender: receive.id,
      });

    socket.on("getTyping", (data) => {
      console.log("yes typing  backend ");
      console.log("front ", socket.id);

      console.log("data");

      console.log(data);

      console.log("data");
      setSocketidback(data.id);
      console.log("yes typing");

      settyping(data.typing);
    });

    socket.on("contacts", (data) => {
      console.log(data);

      setContacts(data);
    });

    socket.on("getConvirsation", (data) => {
      console.log("getConvirsation====================================");
      console.log(data);

      console.log("getConvirsation====================================");

      setco((pre) => (pre += 1));
    });

    // Load initial messages for the room
    socket.on("roomMessages", (msgs: Message[]) => {
      console.log("hhhh");

      console.log(roomName);
      console.log("hhhh");

      console.log(msgs);

      setMessagess(msgs);
    });

    // Emit user connected event
    socket.emit("connection", selectedUser.id);

    // Log when the user connects
    socket.on("connect", () => {
      console.log(`Connected to the server with socket ID: ${socket.id}`);
    });

    return () => {
      socket.off("getTyping");
      socket.disconnect();
    };
  }, [roomName, co]);

  return (
    <div className="flex h-[100vh] w-full max-w-[13 00px] mx-auto border rounded-lg overflow-hidden pt-[48px] bg-white dark:bg-black">
      {/* Left sidebar */}
      <YourChats
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        mockUsers={contacts}
        setRoomName={setRoomName}
        setReceive={setReceive}
      />

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          {receive ? (
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={receive.username} alt={receive.username} />
                <AvatarFallback>{receive.username[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{receive.username}</h2>
                {/* {selectedUser.online && (
                  <p className="text-sm text-green-600">Online</p>
                )} */}

                {socketidback !== socket.id && typing && (
                  <p className="text-sm text-green-600">typing...</p>
                )}
              </div>
            </div>
          ) : null}
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
          {messagess?.map((message: any) => (
            <div
              key={message._id}
              className={`flex items-start gap-3 mb-4 ${
                message?.sender?._id === currentUserId ? "flex-row-reverse" : ""
              }`}
            >
              <Avatar>
                <AvatarImage
                  src={message?.sender?.image}
                  alt={message?.sender?.username}
                />
                <AvatarFallback>{message?.sender?.username[0]}</AvatarFallback>
              </Avatar>
              <div
                className={`flex flex-col ${
                  message?.sender?._id === currentUserId
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <Card
                  className={`p-3 max-w-md ${
                    message?.sender?._id === currentUserId
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-200"
                  }`}
                >
                  {message.message}
                </Card>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(message.createdAt), "HH:mm")}
                  </span>
                  {/* {message.read && (
                    <span className="text-xs text-blue-500">✓✓</span>
                  )} */}
                </div>
              </div>
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
                // onChange={(e) => handlTiyping(e)}
                rows={1}
                value={newMessage}
                onFocus={handleTypingStart}
                onBlur={handleTypingStop}
                onChange={(e) => {
                  setNewMessage(e.target.value);
                  handleTypingStart(e.target.value);

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
      <ListUserOnline setReceive={setReceive} handlRoom={handlRoom} />
    </div>
  );
}