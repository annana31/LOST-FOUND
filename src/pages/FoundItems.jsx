import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import AriIcon from "../assets/Ari.png"; // Adjust the path as needed

function FoundItems({ returnedItems, setReturnedItems }) {
  const [foundItems, setFoundItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [thankYouItem, setThankYouItem] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", location: "", date: "", finder: "", status: "Found" });

  // Fetch items on component mount
  useEffect(() => {
    fetchFoundItems();
  }, []);

  // Filter items when search term or found items change
  useEffect(() => {
    if (!searchTerm) {
      setFilteredItems(foundItems);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = foundItems.filter(item => {
        const searchableFields = [
          item.name,
          item.description,
          item.location,
          item.finder,
          item.date
        ].map(field => field?.toLowerCase() || '');
        
        return searchableFields.some(field => field.includes(searchLower));
      });
      setFilteredItems(filtered);
    }
  }, [searchTerm, foundItems]);

  const fetchFoundItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/found-items/");
      setFoundItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEdit = (item) => {
    setCurrentItem(item);
    setForm(item ? { ...item } : { name: "", description: "", location: "", date: "", finder: "", status: "Found" });
    setShowEdit(true);
  };

  const saveEdit = async () => {
  try {

    const payload = {
      name: form.name,
      description: form.description,
      location: form.location,
      date: form.date,
      finder: form.finder,
      status: "Found"
    };

    if (currentItem && currentItem.id) {

      await axios.put(
        `http://localhost:8000/api/found-items/update/${currentItem.id}/`,
        payload
      );

    } else {

      await axios.post(
        "http://localhost:8000/api/found-items/add/",
        payload
      );

    }

    fetchFoundItems();
    setShowEdit(false);
    setCurrentItem(null);

  } catch (error) {
    console.error("Edit Error:", error.response?.data || error);
  }
};

  const openDelete = (item) => {
    setCurrentItem(item);
    setShowDelete(true);
  };

 const confirmDelete = async () => {
  try {

    await axios.delete(
      `http://localhost:8000/api/found-items/delete/${currentItem.id}/`
    );

    fetchFoundItems();
    setShowDelete(false);
    setCurrentItem(null);

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

  const markAsReturned = async (item) => {
    try {
      // Immediately remove the item from the UI
      setFoundItems(prevItems => prevItems.filter(i => i.id !== item.id));
      
      // Call backend endpoint to mark as returned
      await axios.put(
        `http://localhost:8000/api/found-items/return/${item.id}/`
      );

      // Set the thank you message with the item name
      setThankYouItem(item.name);
      setShowThankYou(true);
      
      // Auto-hide the thank you popup after 3 seconds
      setTimeout(() => {
        setShowThankYou(false);
        setThankYouItem(null);
      }, 3000);

    } catch (error) {
      console.error("Return Error:", error.response?.data || error);
      // If there's an error, fetch the items again to ensure consistency
      fetchFoundItems();
    }
  };

  const closeThankYou = () => {
    setShowThankYou(false);
    setThankYouItem(null);
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
          <h1 style={{ margin: 0 }}>Found Items</h1>
          
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
              placeholder="Search by name, description, location, finder..."
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

        {/* Add Button and Results Info */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px"
        }}>
          <button className="add-btn" onClick={() => openEdit(null)}>Add Found Item</button>
          
          {searchTerm && (
            <p style={{ color: "#666", margin: 0 }}>
              Found {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'} matching "{searchTerm}"
            </p>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Description</th>
              <th>Location Found</th>
              <th>Date Found</th>
              <th>Finder</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.description}</td>
                  <td>{item.location}</td>
                  <td>{item.date}</td>
                  <td>{item.finder}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span>
                  </td>
                  <td>
                    <button className="edit-btn" onClick={() => openEdit(item)}>Edit</button>
                    <button className="delete-btn" onClick={() => openDelete(item)}>Delete</button>
                    <button className="return-btn" onClick={() => markAsReturned(item)}>Mark as Returned</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                  {searchTerm ? "No items match your search" : "No found items to display"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* EDIT / ADD MODAL */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{currentItem?.id ? "Edit Found Item" : "Add Found Item"}</h2>
            <input placeholder="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}/>
            <input placeholder="Finder" value={form.finder} onChange={(e) => setForm({ ...form, finder: e.target.value })} />
            <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowEdit(false)}>Cancel</button>
              <button onClick={saveEdit}>{currentItem?.id ? "Save" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{currentItem.name}</strong>?</p>
            <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowDelete(false)}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* THANK YOU POPUP */}
      {showThankYou && (
        <div className="modal-overlay">
          <div className="modal" style={{ 
            maxWidth: "450px",
            textAlign: "center",
            padding: "35px",
            animation: "popIn 0.4s ease-in-out"
          }}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <img 
                src={AriIcon} 
                alt="Thank You Icon" 
                style={{ 
                  width: "300px", 
                  height: "300px", 
                  objectFit: "contain",
                  marginBottom: "15px",
                  animation: "bounce 0.5s ease-in-out"
                }} 
              />
              <h2 style={{ color: "#4CAF50", margin: 0, fontSize: "28px" }}>Thank You!</h2>
            </div>
            
            <p style={{ fontSize: "18px", marginBottom: "15px", lineHeight: "1.6" }}>
              Thank you for returning <strong style={{ color: "#FFD150", fontSize: "20px" }}>"{thankYouItem}"</strong>
            </p>
            
            <p style={{ fontSize: "15px", color: "#666", marginBottom: "25px", fontStyle: "italic" }}>
              "No act of kindness, no matter how small, is ever wasted."
            </p>
            
            <p style={{ fontSize: "14px", color: "#4CAF50", marginBottom: "25px", fontWeight: "bold" }}>
              ✓ This item has been removed from the Found Items list
            </p>
            
            <button 
              onClick={closeThankYou}
              style={{
                backgroundColor: "#FFD150",
                color: "#0D1A63",
                border: "none",
                padding: "12px 35px",
                borderRadius: "30px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "all 0.3s",
                boxShadow: "0 4px 10px rgba(255, 209, 80, 0.3)"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#e6bc3c";
                e.target.style.transform = "scale(1.05)";
                e.target.style.boxShadow = "0 6px 15px rgba(255, 209, 80, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#FFD150";
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "0 4px 10px rgba(255, 209, 80, 0.3)";
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
}

export default FoundItems;