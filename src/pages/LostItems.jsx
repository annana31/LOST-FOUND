import Navbar from "../components/Navbar";
import React, { useEffect } from "react";
import axios from "axios";

function LostItems({ lostItems, setLostItems, foundItems, setFoundItems }) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredItems, setFilteredItems] = React.useState([]);
  const [form, setForm] = React.useState({
    name: "",
    description: "",
    location: "",
    date: "",
    contact: "",
    status: "Lost",
  });

  // ==========================
  // FETCH LOST ITEMS FROM BACKEND
  // ==========================
  const fetchLostItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/lost-items/");
      setLostItems(res.data);
    } catch (err) {
      console.error("Failed to fetch lost items:", err);
    }
  };

  useEffect(() => {
    fetchLostItems();
  }, []);

  // ==========================
  // FILTER ITEMS WHEN SEARCH TERM OR LOST ITEMS CHANGE
  // ==========================
  useEffect(() => {
    // Only show items with "Lost" status
    const lostStatusItems = lostItems.filter((i) => i.status === "Lost");
    
    if (!searchTerm) {
      setFilteredItems(lostStatusItems);
    } else {
      const searchLower = searchTerm.toLowerCase();
      const filtered = lostStatusItems.filter(item => {
        const searchableFields = [
          item.name,
          item.description,
          item.location,
          item.contact,
          item.date
        ].map(field => field?.toLowerCase() || '');
        
        return searchableFields.some(field => field.includes(searchLower));
      });
      setFilteredItems(filtered);
    }
  }, [searchTerm, lostItems]);

  // ==========================
  // MODAL HANDLERS
  // ==========================
  const openEdit = (item) => {
    setCurrentItem(item);
    setForm(
      item
        ? { ...item }
        : { name: "", description: "", location: "", date: "", contact: "", status: "Lost" }
    );
    setShowEdit(true);
  };

  const saveEdit = async () => {
    try {
      if (currentItem?.id) {
        await axios.put(`http://localhost:8000/api/lost-items/update/${currentItem.id}/`, form);
      } else {
        await axios.post("http://localhost:8000/api/lost-items/add/", form);
      }
      await fetchLostItems(); // refresh list from backend
      setShowEdit(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save item. Check console for errors.");
    }
  };

  const openDelete = (item) => {
    setCurrentItem(item);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/lost-items/delete/${currentItem.id}/`);
      await fetchLostItems();
      setShowDelete(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    }
  };

  // ==========================
  // MOVE LOST ITEM TO FOUND ITEMS
  // ==========================
  const markAsFound = async (item) => {
    try {
      // Call backend endpoint to move to FoundItem
      await axios.put(`http://localhost:8000/api/lost-items/return/${item.id}/`);

      // Refresh LostItems from backend (the item will no longer appear)
      await fetchLostItems();

      // Optionally, also update FoundItems in frontend
      const foundItem = { ...item, finder: item.contact, status: "Found" };
      delete foundItem.contact;
      setFoundItems([foundItem, ...foundItems]);
    } catch (err) {
      console.error(err);
      alert("Failed to move item to found items.");
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
          <h1 style={{ margin: 0 }}>Lost Items</h1>
          
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
              placeholder="Search by name, description, location, contact..."
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
          <button className="add-btn" onClick={() => openEdit(null)}>
            Add Lost Item
          </button>
          
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
              <th>Location Lost</th>
              <th>Date Lost</th>
              <th>Contact</th>
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
                  <td>{item.contact}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    {/* ONLY EDIT AND DELETE */}
                    <button className="edit-btn" onClick={() => openEdit(item)}>
                      Edit
                    </button>
                    <button className="delete-btn" onClick={() => openDelete(item)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#999" }}>
                  {searchTerm ? "No items match your search" : "No lost items to display"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODALS: EDIT / DELETE */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{currentItem?.id ? "Edit Lost Item" : "Add Lost Item"}</h2>
            <input
              placeholder="Item Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              placeholder="Location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <input
              placeholder="Contact"
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
            />
            <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowEdit(false)}>Cancel</button>
              <button onClick={saveEdit}>{currentItem?.id ? "Save" : "Add"}</button>
            </div>
          </div>
        </div>
      )}

      {showDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>
              Are you sure you want to delete <strong>{currentItem.name}</strong>?
            </p>
            <div style={{ marginTop: "15px", display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button onClick={() => setShowDelete(false)}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LostItems;