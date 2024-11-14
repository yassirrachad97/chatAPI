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

const YourChats = ({
  searchQuery,
  setSearchQuery,
  mockUsers,
  selectedUser,
  setSelectedUser,
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
        {mockUsers.map((user) => (
          <div
            key={user.id}
            className={`p-4 flex items-center gap-3 hover:bg-muted/50 cursor-pointer ${
              selectedUser?.id === user.id
                ? "bg-muted border-l-black border-l-2 dark:border-l-white"
                : ""
            }`}
            onClick={() => setSelectedUser(user)}
          >
            {/* Avatar Section */}
            <div className="relative">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              {user.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              )}
            </div>

            {/* User Info Section */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium">{user.name}</p>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(), "HH:mm")}
                </span>
              </div>
              {user.typing ? (
                <p className="text-sm text-green-600">
                  {user.name} is typing...
                </p>
              ) : (
                <p className="text-sm text-muted-foreground truncate">
                  Last message preview...
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                2
              </div>
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
