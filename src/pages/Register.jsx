import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    // You can later add API call to backend here
    alert("Account created successfully!");
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-box">

        <h1>Register</h1>

        <form onSubmit={handleRegister}>
          <input type="text" placeholder="Username" required />
          <input type="password" placeholder="Password" required />
          <input type="password" placeholder="Confirm Password" required />
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