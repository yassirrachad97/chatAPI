import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import io from "socket.io-client"; 

const ListUserOnline = () => {
  const [friends, setFriends] = useState([]);
  const socket = React.useRef(null);

  useEffect(() => {
  
    socket.current = io("http://localhost:3000"); 

   
    fetch("/api/friends/USER_ID") 
      .then((response) => response.json())
      .then((data) => {
        setFriends(data);
      })
      .catch((error) => console.error("Error fetching friends:", error));

    socket.current.on("friendOnline", ({ userId }) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === userId ? { ...friend, online: true } : friend
        )
      );
    });

    socket.current.on("friendOffline", ({ userId }) => {
      setFriends((prevFriends) =>
        prevFriends.map((friend) =>
          friend.id === userId ? { ...friend, online: false } : friend
        )
      );
    });

   
    return () => {
      socket.current.disconnect();
    };
  }, []);

  return (
    <div className="w-80 border-l p-4">
      <h3 className="font-semibold mb-4">Online Friends</h3>
      <div className="space-y-4">
        {friends
          .filter((user) => user.online)
          .map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <span className="text-sm">{user.username}</span>
            </div>
          ))}
      </div>
      <Separator className="my-4" />
      <h3 className="font-semibold mb-4">Offline</h3>
      <div className="space-y-4">
        {friends
          .filter((user) => !user.online)
          .map((user) => (
            <div key={user.id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.avatar} alt={user.username} />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">{user.username}</span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListUserOnline;
