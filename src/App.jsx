import './style.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LostItems from "./pages/LostItems";
import FoundItems from "./pages/FoundItems";
import Register from "./pages/Register";
import ReturnedItems from "./pages/ReturnedItems";

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

  // Shared Returned Items
  const [returnedItems, setReturnedItems] = useState([]);

  // Move Lost → Found
  const markAsFound = (item) => {
    setLostItems(lostItems.filter(i => i.id !== item.id));
    const newFoundItem = { ...item, finder: item.contact, status: "Found" };
    delete newFoundItem.contact;
    setFoundItems([newFoundItem, ...foundItems]);
  };

  // Move Found → Returned
  const markAsReturned = (item) => {
    setFoundItems(foundItems.filter(i => i.id !== item.id));
    const returnedItem = { ...item, status: "Returned" };
    setReturnedItems([returnedItem, ...returnedItems]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={
          <Dashboard 
            lostItems={lostItems} 
            foundItems={foundItems} 
            returnedItems={returnedItems}
          />
        } />
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
              returnedItems={returnedItems}         // ✅ added
              setReturnedItems={setReturnedItems}   // ✅ added
              markAsReturned={markAsReturned}       // optional
            />
          } 
        />
        <Route 
          path="/returned-items" 
          element={
            <ReturnedItems 
              returnedItems={returnedItems} 
              setReturnedItems={setReturnedItems} 
            />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;