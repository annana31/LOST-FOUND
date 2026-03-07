import Navbar from "../components/Navbar";

function LostItems() {

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

            <tr>
              <td>Wallet</td>
              <td>Black leather wallet</td>
              <td>Library</td>
              <td>March 5</td>
              <td>Anna</td>
              <td>Lost</td>
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

export default LostItems;