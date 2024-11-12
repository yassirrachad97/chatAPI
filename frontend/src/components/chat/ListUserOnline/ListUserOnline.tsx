import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";

const ListUserOnline = ({mockUsers}) => {
  return (
    <div className="w-80 border-l p-4">
      <h3 className="font-semibold mb-4">Online Friends</h3>
      <div className="space-y-4">
        {mockUsers
          .filter((user) => user.online)
          .map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <span className="text-sm">{user.name}</span>
            </div>
          ))}
      </div>
      <Separator className="my-4" />
      <h3 className="font-semibold mb-4">Offline</h3>
      <div className="space-y-4">
        {mockUsers
          .filter((user) => !user.online)
          .map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{user.name}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListUserOnline;
