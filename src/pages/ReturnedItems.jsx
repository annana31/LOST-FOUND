import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

function ReturnedItems() {
  const [returnedItems, setReturnedItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDelete, setShowDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch returned items on mount
  useEffect(() => {
    fetchReturnedItems();
  }, []);

  // Filter items when search term or returned items change
  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(returnedItems);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = returnedItems.filter(item => {
        const searchableFields = [
          item.item_name,
          item.finder_name,
          item.remarks,
          item.date_returned
        ].map(field => field?.toLowerCase() || '');
        
        return searchableFields.some(field => field.includes(searchLower));
      });
      setFilteredItems(filtered);
    }
  }, [searchTerm, returnedItems]);

  const fetchReturnedItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/returned-items/");
      setReturnedItems(res.data);
    } catch (error) {
      console.error("Fetch Returned Items Error:", error);
    }
  };

  const openDelete = (item) => {
    setCurrentItem(item);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/returned-items/delete/${currentItem.id}/`
      );
      fetchReturnedItems();
      setShowDelete(false);
    } catch (error) {
      console.error("Delete Error:", error.response?.data || error);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Lost":
        return "status-lost";
      case "Found":
        return "status-found";
      case "Returned":
        return "status-returned";
      default:
        return "";
    }
  };

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
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <h1 style={{ margin: 0 }}>Returned Items</h1>
          
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
              placeholder="Search by item name, finder, remarks..."
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

        {/* Results Info */}
        {searchTerm && (
          <div style={{
            marginBottom: "15px",
            color: "#666"
          }}>
            <p style={{ margin: 0 }}>
              Found {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} matching "{searchTerm}"
            </p>
          </div>
        )}

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Finder / Owner</th>
              <th>Date Returned</th>
              <th>Remarks</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_name}</td>
                  <td>{item.finder_name}</td>
                  <td>{item.date_returned}</td>
                  <td>{item.remarks}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass("Returned")}`}>
                      Returned
                    </span>
                  </td>
                  <td>
                    <button 
                      className="delete-btn"
                      onClick={() => openDelete(item)}
                      style={{
                        backgroundColor: "#ff4444",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        borderRadius: "4px",
                        cursor: "pointer"
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#cc0000"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "#ff4444"}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ 
                  textAlign: "center", 
                  padding: "30px", 
                  color: "#999" 
                }}>
                  {searchTerm ? "No items match your search" : "No returned items found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete <strong>{currentItem.item_name}</strong>?
            </p>
            <div
              style={{
                marginTop: "15px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={() => setShowDelete(false)}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReturnedItems;