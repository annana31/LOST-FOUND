import Navbar from "../components/Navbar";

function Dashboard() {

  return (
    <div className="container">

      <Navbar />

      <div className="content">

        <h1>Dashboard</h1>

        <div className="cards">

          <div className="card">
            <h3>Total Lost Items</h3>
            <p>12</p>
          </div>

          <div className="card">
            <h3>Total Found Items</h3>
            <p>8</p>
          </div>

          <div className="card">
            <h3>Returned Items</h3>
            <p>5</p>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;