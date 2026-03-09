import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

function ReturnedItems() {
  const [returnedItems, setReturnedItems] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch returned items on mount
  useEffect(() => {
    fetchReturnedItems();
  }, []);

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

  return (
    <div className="container">
      <Navbar />
      <div className="content">
        <h1>Returned Items</h1>

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
            {returnedItems.map((item) => (
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
                  <button onClick={() => openDelete(item)}>Delete</button>
                </td>
              </tr>
            ))}
            {returnedItems.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center" }}>
                  No returned items found.
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