import Navbar from "../components/Navbar";
import { useState } from "react";

function Dashboard() {
  // Sample data
  const [items, setItems] = useState([
    { id: 1, name: "Wallet", description: "Black leather wallet", location: "Library", date: "March 5", contact: "Anna", status: "Lost" },
    { id: 2, name: "Umbrella", description: "Blue folding umbrella", location: "Cafeteria", date: "March 6", contact: "Ben", status: "Found" },
    { id: 3, name: "Keys", description: "House keys with keychain", location: "Gym", date: "March 4", contact: "Clara", status: "Returned" },
    { id: 4, name: "Backpack", description: "Red backpack", location: "Cafeteria", date: "March 7", contact: "Dana", status: "Lost" },
  ]);

  const [filter, setFilter] = useState("All"); // current filter

  const filteredItems = items.filter(item => filter === "All" ? true : item.status === filter);

  // Compute totals
  const totalLost = items.filter(item => item.status === "Lost").length;
  const totalFound = items.filter(item => item.status === "Found").length;
  const totalReturned = items.filter(item => item.status === "Returned").length;

  const getStatusClass = (status) => {
    switch(status){
      case "Lost": return "status-lost";
      case "Found": return "status-found";
      case "Returned": return "status-returned";
      default: return "";
    }
  }

  return (
    <div className="container">

      <Navbar />

      <div className="content">

        <h1>Dashboard</h1>

        {/* FILTER TABS */}
        <div style={{ marginBottom: "25px", display: "flex", gap: "15px" }}>
          {["All", "Lost", "Found", "Returned"].map(tab => (
            <span
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                cursor: "pointer",
                padding: "8px 16px",
                borderRadius: "8px",
                background: filter === tab ? "#FFD150" : "#eaeaea",
                color: filter === tab ? "#0D1A63" : "#555",
                fontWeight: 600,
                transition: "0.3s"
              }}
            >
              {tab} Items
            </span>
          ))}
        </div>

        {/* CARDS */}
        <div className="cards">
          {filter === "All" || filter === "Lost" ? (
            <div className="card">
              <h3>Total Lost Items</h3>
              <p>{totalLost}</p>
            </div>
          ) : null}
          {filter === "All" || filter === "Found" ? (
            <div className="card">
              <h3>Total Found Items</h3>
              <p>{totalFound}</p>
            </div>
          ) : null}
          {filter === "All" || filter === "Returned" ? (
            <div className="card">
              <h3>Returned Items</h3>
              <p>{totalReturned}</p>
            </div>
          ) : null}
        </div>

        {/* TABLE */}
        <table style={{ marginTop: "30px" }}>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Date</th>
              <th>Contact</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.location}</td>
                <td>{item.date}</td>
                <td>{item.contact}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Dashboard;