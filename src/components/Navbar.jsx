import { Link, useNavigate } from "react-router-dom";
import Icon from "../assets/Icon.png"; 

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Optionally, clear login state here
    navigate("/");
  };

  return (
    <div className="sidebar">

      <div className="nav-top">
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginBottom: "50px"
        }}>
          <img 
            src={Icon} 
            alt="Logo" 
            style={{ 
              width: "220px", 
              height: "220px", 
              objectFit: "contain"
            }} 
          />
        </div>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/lost-items">Lost Items</Link>
        <Link to="/found-items">Found Items</Link>
        <Link to="/returned-items">Returned Items</Link>
      </div>

      <div className="nav-bottom">
        <button onClick={handleLogout}>Logout</button>
      </div>

    </div>
  );
}

export default Navbar;