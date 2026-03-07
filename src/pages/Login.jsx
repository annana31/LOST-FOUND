import { useNavigate } from "react-router-dom";

function Login() {

  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/dashboard");
  };

return (
  <div className="login-container">
    <div className="login-box">

      <h1>Lost & Found</h1>

      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Username" required />
        <input type="password" placeholder="Password" required />
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