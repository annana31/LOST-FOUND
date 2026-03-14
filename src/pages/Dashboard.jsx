import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";

function Dashboard() {

  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

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

  // Filter items based on both status filter and search term
  const filteredItems = items.filter(item => {
    // First apply status filter
    const statusMatch = filter === "All" ? true : item.status === filter;
    
    // Then apply search filter (if search term exists)
    if (!searchTerm) return statusMatch;
    
    const searchLower = searchTerm.toLowerCase();
    const searchableFields = [
      item.name || item.item_name,
      item.description,
      item.location,
      item.contact || item.finder || item.finder_name,
      item.date || item.date_returned
    ].map(field => field?.toLowerCase() || '');
    
    const searchMatch = searchableFields.some(field => 
      field.includes(searchLower)
    );
    
    return statusMatch && searchMatch;
  });

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="container">

      <Navbar />

      <div className="content">

        <h1>Dashboard</h1>

        {/* FILTER TABS AND SEARCH BAR */}
        <div style={{ 
          marginBottom: "25px", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          {/* Filter Tabs */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
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

          {/* Search Bar */}
          <div style={{ position: "relative", minWidth: "300px" }}>
            {/* Search Icon */}
            <span style={{
              position: "absolute",
              left: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#999",
              fontSize: "16px",
              zIndex: 1,
              lineHeight: 1,
              display: "flex",
              alignItems: "center"
            }}>
              🔍
            </span>
            
            {/* Input Field */}
            <input
              type="text"
              placeholder="Search by name, description, location..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{
                width: "100%",
                padding: "12px 40px 12px 40px",
                borderRadius: "25px",
                border: "2px solid #eaeaea",
                fontSize: "14px",
                outline: "none",
                transition: "border-color 0.3s",
                boxSizing: "border-box"
              }}
              onFocus={(e) => e.target.style.borderColor = "#FFD150"}
              onBlur={(e) => e.target.style.borderColor = "#eaeaea"}
            />
            
            {/* Clear Button */}
            {searchTerm && (
              <button
                onClick={clearSearch}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "20px",
                  color: "#999",
                  padding: "0",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  zIndex: 1
                }}
              >
                ×
              </button>
            )}
          </div>
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

        {/* Results Info */}
        <div style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: "#666"
        }}>
          <p>
            Showing {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            {searchTerm && ` matching "${searchTerm}"`}
          </p>
          {filteredItems.length === 0 && (
            <p style={{ color: "#FF6B6B" }}>
              No items found. Try adjusting your search or filter.
            </p>
          )}
        </div>

        {/* TABLE */}
        <table style={{ marginTop: "10px" }}>
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
            {filteredItems.length > 0 ? (
              filteredItems.map(item => (
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
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                  No items to display
                </td>
              </tr>
            )}
          </tbody>
        </table>

      </div>

    </div>
  );
}

export default Dashboard;