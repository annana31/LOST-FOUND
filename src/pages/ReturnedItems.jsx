import Navbar from "../components/Navbar";
import { useState } from "react";

function ReturnedItems({ returnedItems, setReturnedItems }) {
  const [showDelete, setShowDelete] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);

  const openDelete = (item) => {
    setCurrentItem(item);
    setShowDelete(true);
  };

  const confirmDelete = () => {
    setReturnedItems(returnedItems.filter(item => item.id !== currentItem.id));
    setShowDelete(false);
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
        <h1>Returned Items</h1>

        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Description</th>
              <th>Location</th>
              <th>Date</th>
              <th>Finder / Contact</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {returnedItems.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.description}</td>
                <td>{item.location}</td>
                <td>{item.date}</td>
                <td>{item.finder || item.contact}</td>
                <td>
                  <span className={`status-badge ${getStatusClass(item.status)}`}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => openDelete(item)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {showDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete <strong>{currentItem.name}</strong>?</p>
            <div style={{marginTop:"15px", display:"flex", gap:"10px", justifyContent:"flex-end"}}>
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