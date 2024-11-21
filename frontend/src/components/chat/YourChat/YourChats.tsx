import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { MoreVertical, Search } from "lucide-react";
import { format } from "date-fns";

// const handleRoomAndReceive = (room, username) => {
//   console.log(username);
//   setReceive(username);
//   setRoomName(room);
// };
const YourChats = ({
  searchQuery,
  setSearchQuery,
  mockUsers,
  setRoomName,
  setReceive,
}) => {
  return (
    <div className="w-80 border-r flex flex-col">
      {/* Search Component */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* User List */}
      <ScrollArea className="flex-1">
        {mockUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setRoomName(user.roomName),
                setReceive({ username: user.username, id: user._id });
            }}
            className={`p-4 flex items-center gap-3 hover:bg-muted/50 cursor-pointer border-b border-gray-300 ${
              user?.username === "JaneSmith456"
                ? "bg-muted border-l-black border-l-2 dark:border-l-white"
                : ""
            }`}
          >
            {/* Avatar Section */}
            <div className="relative">
              <Avatar>
                <AvatarImage src={user.image} alt={user.username} />
                <div className="h-10 w-10 bg-gray-100 rounded-full flex justify-center items-center">
                  {user.username[0]}
                </div>
              </Avatar>
            </div>

            {/* User Info Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                {/* <p className="font-medium">{user.username}</p> */}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(user.lastMessageDate), "HH:mm")}
                </span>
              </div>
              <p className="text-sm text-muted-foreground truncate text-start">
                {user.lastMessage}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {user.unreadCount > 0 ? (
                <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {user.unreadCount}
                </div>
              ) : null}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Delete chat</DropdownMenuItem>
                  <DropdownMenuItem className="text-red-500">
                    Block user
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};

export default YourChats;
