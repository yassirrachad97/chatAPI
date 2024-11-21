import React, { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from "axios";
// import "../css/FriendsList.css";
import { ToastContainer, toast } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css"; 
import { Button } from "@/components/ui/button";
import { Home, Users } from "lucide-react";
import { Link } from "react-router-dom";

const suggestionList = () => {
  const userId: any = localStorage.getItem("sender");

  const [suggestions, setsuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/friends/suggestions/" + userId
        );
        if (Array.isArray(response.data)) {
          setsuggestions(response.data);
        } else {
          throw new Error(
            "La réponse de l'API n'est pas dans le format attendu"
          );
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setError("Failed to load suggestions");
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId, count]);

  const sendFriendRequest = async (recipientId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/friends/request`,
        {
          requesterId: userId,
          recipientId,
        }
      );
      toast.success("Invitation envoyée avec succès !");
      if (response) setCount((pre) => pre + 1);

      setSuggestions((prev) => prev.filter((user) => user._id !== recipientId));
    } catch (err) {
      console.error("Error sending friend request:", err);
      if (err.response && err.response.data.message) {
        toast.error(err.response.data.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <span className="text-gray-500 text-sm">Loading suggestions...</span>
        <div className="mt-2 border-4 border-blue-500 border-t-transparent rounded-full w-6 h-6 animate-spin"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="text-center text-red-500">
        <span>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto border p-4 rounded-md shadow-md">
      <ToastContainer />
  {/* Section Titre avec Icone */}
  <div className="flex items-center mb-4">
    {/* Icone */}
    <Button variant="ghost" size="icon" className="mr-2">
      <Link to="/">
        <Home className="h-5 w-5 text-gray-700" />
      </Link>
    </Button>
    {/* Titre */}
    <h3 className="font-semibold text-lg text-gray-700">
      Suggestions d'Amis
    </h3>
  </div>
  {/* Liste des suggestions */}
  <div className="space-y-3">
    {suggestions.length === 0 ? (
      <p className="text-gray-500">Aucune suggestion disponible.</p>

        ) : (
          suggestions.map((user: any) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-2 rounded-md bg-gray-50 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={user.image}
                  alt={user.username}
                  className="rounded-full"
                />
                <AvatarFallback>{user.username[0]}</AvatarFallback>
              </Avatar>
              {/* Username */}
              <span className="text-sm font-medium text-gray-700 flex-1 pl-3">
                {user.username}
              </span>
              {/* Button */}
              <button
                onClick={() => sendFriendRequest(user._id)}
                className="bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Inviter
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default suggestionList;
