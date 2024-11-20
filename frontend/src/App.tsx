// src/App.js
import './App.css';
import Chat from "./pages/Chat";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FriendsList from "./pages/FriendsList";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* <Route path="/chat" element={<Chat />} /> */}
          <Route path="/friends" element={<FriendsList />} />
          <Route path="/" element={<Chat />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
