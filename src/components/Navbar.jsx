import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally, clear login state here
    navigate("/");
  };

  return (
    <div className="sidebar">

      <div className="nav-top">
        <h2>Lost & Found</h2>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/lost-items">Lost Items</Link>
        <Link to="/found-items">Found Items</Link>
      </div>

      <div className="nav-bottom">
        <button onClick={handleLogout}>Logout</button>
      </div>

    </div>
  );
}

export default Navbar;