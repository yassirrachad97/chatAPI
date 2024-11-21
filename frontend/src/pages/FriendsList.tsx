import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import axios from 'axios';
import '../css/FriendsList.css'; 

const suggestionList = () => {
  const userId = localStorage.getItem("sender");  

  const [suggestions, setsuggestions] = useState([] );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/friends/suggestions/${userId}`);
        if (Array.isArray(response.data)) {
          setsuggestions(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas dans le format attendu');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching suggestions:', err);
        setError('Failed to load suggestions');
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [userId]);

  const sendFriendRequest = async (recipientId) => {
    try {
     
      const response = await axios.post(`http://localhost:3000/friends/request`, {
        requesterId: userId, 
        recipientId,        
      });
      alert(response.data);
     
      setSuggestions((prev) => prev.filter((user) => user._id !== recipientId));
    } catch (err) {
      console.error('Error sending friend request:', err);
      if (err.response && err.response.data.message) {
        alert(err.response.data.message); 
      } else {
        alert('Une erreur est survenue lors de l\'envoi de l\'invitation.');
      }
    }
  };
  

  if (loading) {
    return (
      <div className="loading-container">
        <span className="loading-text">Loading suggestions...</span>
        <div className="loading-spinner"></div> 
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        <span style={{ color: 'red' }}>Error: {error}</span>
      </div>
    );
  }

  return (
    <div className="w-80 border-l p-4">
      <h3 className="font-semibold mb-4">Suggestions d'Amis</h3>
      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <p className="text-muted-foreground">Aucune suggestion disponible.</p>
        ) : (
          suggestions.map((user) => (
            <div key={user._id} className="flex items-center gap-3">
              <div className="relative">
                {/* Avatar */}
                <Avatar>
                  <AvatarImage src={user.image} alt={user.username} />
                  <AvatarFallback>{user.username[0]}</AvatarFallback>
                </Avatar>
              </div>
              {/* Username and Send Button */}
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.username}</span>
                <button
                  onClick={() => sendFriendRequest(user._id)}
                  className="mt-1 bg-blue-500 text-white text-xs px-3 py-1 rounded-md hover:bg-blue-600"
                >
                  Envoyer une invitation
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};



export default suggestionList;
