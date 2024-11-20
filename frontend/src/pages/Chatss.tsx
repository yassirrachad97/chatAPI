import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define types for message and user
interface Message {
  sender: {
    _id: string;
    username: string;
  };
  message: string;
}

interface JoinRoomData {
  roomName: string;
}

interface SendMessageData {
  sender: string;
  receiver: string;
  roomName: string;
  message: string;
}

// Initialize the socket connection
const socket: Socket = io("http://localhost:3000");

function Chatss() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [roomName, setRoomName] = useState<string>("room1");

  const currentUserId = localStorage.getItem("sender");
  const receiver = localStorage.getItem("receiver");

  if (!currentUserId || !receiver) {
    return <div>Error: sender or receiver not found in localStorage</div>;
  }

  useEffect(() => {
    // Join room event
    socket.emit("joinRoom", { roomName } as JoinRoomData);

    // Listen for new messages in the room
    socket.on("roomMessage", (data: { message: Message }) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    // Load initial messages for the room
    socket.on("roomMessages", (msgs: Message[]) => {
      setMessages(msgs);
    });

    // Clean up socket listeners on component unmount
    return () => {
      socket.off("roomMessage");
      socket.off("roomMessages");
    };
  }, [roomName]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("message", {
        sender: currentUserId,
        receiver,
        roomName,
        message,
      } as SendMessageData);
      setMessage("");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
          Chat Room
        </h2>

        <div className="flex flex-col space-y-4 mb-4 overflow-y-auto h-80 p-2">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender._id === currentUserId
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs p-3 rounded-lg shadow-md ${
                  msg.sender._id === currentUserId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-900"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-400" />
                <div className="flex flex-col space-y-1">
                  <div className="text-sm font-medium">
                    {msg.sender.username}
                  </div>
                  <div>{msg.message}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center mt-4">
          <input
            type="text"
            className="flex-1 p-3 border border-gray-300 rounded-l-lg focus:outline-none focus:border-blue-400"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white p-3 rounded-r-lg hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatss;
