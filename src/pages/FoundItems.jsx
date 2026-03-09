import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

function FoundItems({ returnedItems, setReturnedItems }) {
  const [foundItems, setFoundItems] = useState([]);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [form, setForm] = useState({ name: "", description: "", location: "", date: "", finder: "", status: "Found" });

  // Fetch items on component mount
  useEffect(() => {
    fetchFoundItems();
  }, []);

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

    await axios.put(
      `http://localhost:8000/api/found-items/return/${item.id}/`
    );

    fetchFoundItems();

  } catch (error) {
    console.error("Return Error:", error.response?.data || error);
  }
};

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h1>Found Items</h1>
        <button className="add-btn" onClick={() => openEdit(null)}>Add Found Item</button>

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
            {foundItems.map((item) => (
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
            ))}
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
    </div>
  );
}

export default FoundItems;