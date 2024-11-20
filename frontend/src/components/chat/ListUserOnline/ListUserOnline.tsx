import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Separator } from "@radix-ui/react-separator";
import io from "socket.io-client";
import { Item } from "@radix-ui/react-dropdown-menu";

const ListUserOnline = ({ setReceive }) => {
  const [friends, setFriends] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const socket = React.useRef(null);
  const userId = localStorage.getItem("sender");
  useEffect(() => {
    socket.current = io("http://localhost:3000");

    const fetchFriends = async () => {
      try {
        const response = await fetch("http://localhost:3000/friends/" + userId);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json(); // Convertir la réponse en JSON
        setFriends(data); // Mettre à jour la liste des amis

        console.log(data);
        setLoading(false);
      } catch (err) {
        setError("Erreur lors de la récupération des amis");
        console.error(err);
        setLoading(false);
      }
    };

    fetchFriends();

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

  if (loading) {
    return <div>Loading friends...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }



  return (
    <div className="w-80 border-l p-4">
      <h3 className="font-semibold mb-4">Online Friends</h3>
      <div className="space-y-4">
        {friends
          .filter((user) => user.friendId.status === "online")
          .map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.friendId.image} alt={user.username} />
                  <AvatarFallback>{user.friendId.username[0]}</AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
              </div>
              <span
                className="text-sm cursor-pointer"
                onClick={() =>
                  setReceive({
                    username: user.friendId.username,
                    id: user.friendId._id,
                  })
                }
              >
                {user.friendId.username}
              </span>
            </div>
          ))}
      </div>
      <Separator className="my-4" />
      <h3 className="font-semibold mb-4">Offline</h3>
      <div className="space-y-4">
        {friends
          .filter((user) => user.friendId.status === "offline")
          .map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={user.friendId.image} alt={user.username} />
                <AvatarFallback>{user.friendId.username[0]}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">
                {user.friendId.username}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ListUserOnline;
