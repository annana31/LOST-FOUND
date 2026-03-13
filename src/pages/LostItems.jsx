import Navbar from "../components/Navbar";
import React, { useEffect } from "react";
import axios from "axios";

function LostItems({ lostItems, setLostItems, foundItems, setFoundItems }) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState(null);
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

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h1>Lost Items</h1>
        <button className="add-btn" onClick={() => openEdit(null)}>
          Add Lost Item
        </button>

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
            {lostItems
              .filter((i) => i.status === "Lost")
              .map((item) => (
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
              ))}
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
