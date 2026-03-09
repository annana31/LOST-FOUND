import Navbar from "../components/Navbar";
import React from "react";
import axios from "axios"; // ✅ Add this for API calls

function LostItems({ lostItems, setLostItems, foundItems, setFoundItems }) {
  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);
  const [currentItem, setCurrentItem] = React.useState(null);
  const [form, setForm] = React.useState({ name: "", description: "", location: "", date: "", contact: "", status: "Lost" });

  // Open Add/Edit modal
  const openEdit = (item) => {
    setCurrentItem(item);
    setForm(item ? { ...item } : { name: "", description: "", location: "", date: "", contact: "", status: "Lost" });
    setShowEdit(true);
  };

  // Save Add/Edit → UPDATED to call backend
  const saveEdit = async () => {
    try {
      if (currentItem?.id) {
        // UPDATE existing item
        await axios.put(`http://localhost:8000/api/lost-items/update/${currentItem.id}/`, form);
      } else {
        // ADD new item
        await axios.post("http://localhost:8000/api/lost-items/add/", form);
      }

      // REFRESH lost items from backend
      const res = await axios.get("http://localhost:8000/api/lost-items/");
      setLostItems(res.data);
      setShowEdit(false);
    } catch (err) {
      console.error(err);
      alert("Failed to save item. Check console for errors.");
    }
  };

  // Open Delete modal
  const openDelete = (item) => {
    setCurrentItem(item);
    setShowDelete(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/lost-items/delete/${currentItem.id}/`);
      const res = await axios.get("http://localhost:8000/api/lost-items/");
      setLostItems(res.data);
      setShowDelete(false);
    } catch (err) {
      console.error(err);
      alert("Failed to delete item.");
    }
  };

  // Move item Lost -> Found
  const markAsFound = async (item) => {
    try {
      // 1. Remove from lost items in backend
      await axios.put(`http://localhost:8000/api/lost-items/return/${item.id}/`);

      // 2. Add to found items locally
      const foundItem = { ...item, finder: item.contact, status: "Found" };
      delete foundItem.contact;
      setFoundItems([foundItem, ...foundItems]);

      // 3. Refresh lost items from backend
      const res = await axios.get("http://localhost:8000/api/lost-items/");
      setLostItems(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to mark as found.");
    }
  };

  const getStatusClass = (status) => {
    switch(status){
      case "Lost": return "status-lost";
      case "Found": return "status-found";
      case "Returned": return "status-returned";
      default: return "";
    }
  };

  return (
    <div className="container">
      <Navbar />

      <div className="content">
        <h1>Lost Items</h1>

        <button className="add-btn" onClick={() => openEdit(null)}>Add Lost Item</button>

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
            {lostItems.filter(i => i.status === "Lost").map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.location}</td>
                <td>{item.date}</td>
                <td>{item.contact}</td>
                <td><span className={`status-badge ${getStatusClass(item.status)}`}>{item.status}</span></td>
                <td>
                  <button className="edit-btn" onClick={() => openEdit(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => openDelete(item)}>Delete</button>
                  <button className="return-btn" onClick={() => markAsFound(item)}>Mark as Returned</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT / ADD MODAL */}
      {showEdit && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{currentItem?.id ? "Edit Lost Item" : "Add Lost Item"}</h2>
            <input placeholder="Item Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
            <input placeholder="Description" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
            <input placeholder="Location" value={form.location} onChange={e=>setForm({...form,location:e.target.value})}/>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}/>
            <input placeholder="Contact" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})}/>
            <div style={{marginTop:"15px", display:"flex", gap:"10px", justifyContent:"flex-end"}}>
              <button onClick={()=>setShowEdit(false)}>Cancel</button>
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
            <div style={{marginTop:"15px", display:"flex", gap:"10px", justifyContent:"flex-end"}}>
              <button onClick={()=>setShowDelete(false)}>Cancel</button>
              <button onClick={confirmDelete}>Delete</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default LostItems;