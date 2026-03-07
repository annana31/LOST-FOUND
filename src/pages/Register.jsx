import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    alert("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>Register</h1>

        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Username" required />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>

          <div className="password-field">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm Password"
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              👁
            </span>
          </div>

          <button type="submit">Register</button>
        </form>

        <p style={{marginTop:"15px", fontSize:"14px", color:"#555"}}>
          Already have an account?{" "}
          <span 
            style={{color:"#3a7bd5", cursor:"pointer"}} 
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

export default Register;