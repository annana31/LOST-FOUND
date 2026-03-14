import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Icon from "../assets/Icon.png"; // Adjust the path as needed

function Login() {

  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/login/", {
      username: username,
      password: password
    });

    if (res.data.success) {
      navigate("/dashboard");
    } else {
      alert("Invalid login");
    }

  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="login-container">
      <div className="login-box">

        <div style={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center", 
          marginBottom: "20px" 
        }}>
          <img 
            src={Icon} 
            alt="Logo" 
            style={{ 
              width: "200px", 
              height: "200px", 
              objectFit: "contain",
              marginBottom: "10px"
            }} 
          />
    
        </div>

        <form onSubmit={handleLogin}>
          <input
          type="text"          
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          />

          <div className="password-field">
           <input
           type={showPassword ? "text" : "password"}
           placeholder="Password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           required
           />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>

          <button type="submit">Login</button>
        </form>

        <p style={{marginTop:"15px", fontSize:"14px", color:"#555"}}>
          Don't have an account?{" "}
          <span
            style={{color:"#3a7bd5", cursor:"pointer"}}
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>

      </div>
    </div>
  );
}

export default Login;