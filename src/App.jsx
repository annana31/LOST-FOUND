import './style.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import Register from "./pages/Register";

function App() {
  // Shared Lost Items
  const [lostItems, setLostItems] = useState([
    { id: 1, name: "Wallet", description: "Black leather wallet", location: "Library", date: "March 5", contact: "Anna", status: "Lost" },
    { id: 2, name: "Umbrella", description: "Blue folding umbrella", location: "Cafeteria", date: "March 6", contact: "Ben", status: "Lost" }
  ]);

  // Shared Found Items
  const [foundItems, setFoundItems] = useState([
    { id: 3, name: "Keys", description: "House keys", location: "Gym", date: "March 4", finder: "Clara", status: "Found" }
  ]);

  // Function to move Lost → Found
  const markAsFound = (item) => {
    // Remove from lost
    setLostItems(lostItems.filter(i => i.id !== item.id));

    // Add to found
    const newFoundItem = { ...item, finder: item.contact, status: "Found" };
    delete newFoundItem.contact; // remove contact field
    setFoundItems([newFoundItem, ...foundItems]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard lostItems={lostItems} foundItems={foundItems} />} />
        <Route 
          path="/lost-items" 
          element={
            <LostItems 
              lostItems={lostItems} 
              setLostItems={setLostItems} 
              foundItems={foundItems} 
              setFoundItems={setFoundItems}
              markAsFound={markAsFound}
            />
          } 
        />
        <Route 
          path="/found-items" 
          element={
            <FoundItems 
              foundItems={foundItems} 
              setFoundItems={setFoundItems} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;