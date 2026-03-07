import Navbar from "../components/Navbar";

function FoundItems() {

  return (
    <div className="container">

      <Navbar />

      <div className="content">

        <h1>Found Items</h1>

        <button className="add-btn">Add Found Item</button>

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

            <tr>
              <td>Phone</td>
              <td>iPhone</td>
              <td>Cafeteria</td>
              <td>March 6</td>
              <td>John</td>
              <td>Found</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default FoundItems;