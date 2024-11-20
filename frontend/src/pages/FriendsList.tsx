import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/FriendsList.css'; // Ajouter un fichier CSS externe pour mieux styliser

const FriendsList = () => {
  const userId = "63ecfbe3b8f9e5e874f1a242";  // ID statique de l'utilisateur

  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/friends/${userId}`);
        if (Array.isArray(response.data)) {
          setFriends(response.data);
        } else {
          throw new Error('La réponse de l\'API n\'est pas dans le format attendu');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching friends:', err);
        setError('Failed to load friends');
        setLoading(false);
      }
    };

    fetchFriends();
  }, [userId]);

  if (loading) {
    return (
      <div className="loading-container">
        <span className="loading-text">Loading friends...</span>
        <div className="loading-spinner"></div> {/* Spinner de chargement */}
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
    <div className="friends-list-container">
      <h1 className="friends-list-title">My Friends List</h1>
      {friends.length === 0 ? (
        <p className="no-friends-message">You have no friends yet.</p>
      ) : (
        <ul className="friends-list">
          {friends.map((friend) => (
            <li key={friend._id} className="friend-item">
              <div className="friend-info">
                <span className="friend-username">{friend.friendId.username}</span>
                <span
                  className={`friend-status ${friend.friendId.status === 'online' ? 'online' : 'offline'}`}
                >
                  {friend.friendId.status === 'online' ? 'Online' : 'Offline'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendsList;
