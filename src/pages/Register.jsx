import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Register() {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e) => {
  e.preventDefault();

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    const res = await axios.post("http://127.0.0.1:8000/api/register/", {
      username: username,
      password: password
    });

    if (res.data.success) {
      alert("Account created successfully!");
      navigate("/");
    } else {
      alert(res.data.message);
    }

  } catch (error) {
    console.error(error);
    alert("Registration failed");
  }
};

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>Register</h1>

        <form onSubmit={handleRegister}>
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
            require
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
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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