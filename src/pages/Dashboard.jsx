import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

function Dashboard() {

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");

  // FETCH DATA FROM DJANGO
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/dashboard/")
      .then(res => res.json())
      .then(data => {

        const combinedItems = [
          ...data.lost_items,
          ...data.found_items,
          ...data.returned_items
        ];

        setItems(combinedItems);
      })
      .catch(error => console.error("Error fetching dashboard:", error));

  }, []);

  const filteredItems = items.filter(item =>
    filter === "All" ? true : item.status === filter
  );

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
                fontWeight: 600
              }}
            >
              {tab} Items
            </span>
          ))}
        </div>

        {/* CARDS */}
        <div className="cards">
          <div className="card">
            <h3>Total Lost Items</h3>
            <p>{totalLost}</p>
          </div>

          <div className="card">
            <h3>Total Found Items</h3>
            <p>{totalFound}</p>
          </div>

          <div className="card">
            <h3>Returned Items</h3>
            <p>{totalReturned}</p>
          </div>
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
                <td>{item.name || item.item_name}</td>
                <td>{item.description}</td>
                <td>{item.location}</td>
                <td>{item.date || item.date_returned}</td>
                <td>{item.contact || item.finder || item.finder_name}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status || "Returned")}`}>
                    {item.status || "Returned"}
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
