import Navbar from "../components/Navbar";
import { useState } from "react";

function LostItems() {

  // Example dummy data
  const [lostItems, setLostItems] = useState([
    {
      id: 1,
      name: "Wallet",
      description: "Black leather wallet",
      location: "Library",
      date: "March 5",
      contact: "Anna",
      status: "Lost"
    },
    {
      id: 2,
      name: "Umbrella",
      description: "Blue folding umbrella",
      location: "Cafeteria",
      date: "March 6",
      contact: "Ben",
      status: "Found"
    },
    {
      id: 3,
      name: "Keys",
      description: "House keys with keychain",
      location: "Gym",
      date: "March 4",
      contact: "Clara",
      status: "Returned"
    }
  ]);

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

        <h1>Lost Items</h1>

        <button className="add-btn">Add Lost Item</button>

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
            {lostItems.map(item => (
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
                  <button>Edit</button>
                  <button>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}

export default LostItems;