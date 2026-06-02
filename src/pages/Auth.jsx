import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export default function Auth() {
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();

    if (isSignup) {
      localStorage.setItem("hasAccount", "true");
      localStorage.setItem("isLoggedIn", "true");
      alert("Account Created Successfully!");
      navigate("/dashboard");
    } else {
      const hasAccount = localStorage.getItem("hasAccount") === "true";

      if (!hasAccount) {
        alert("You must create an account first.");
        setIsSignup(true);
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      alert("Login Successful!");
      navigate("/dashboard");
    }
  }

  return (
    <div className="auth-page">
      <Link to="/" className="auth-logo">
        <Dumbbell />
        PowerFit
      </Link>

      <div className="auth-card">
        <h2>{isSignup ? "Create Account" : "Welcome Back"}</h2>

        <p>
          {isSignup
            ? "Create your account to access all PowerFit features."
            : "Login to continue to your fitness dashboard."}
        </p>

        <div className="auth-tabs">
          <button
            type="button"
            className={!isSignup ? "active" : ""}
            onClick={() => setIsSignup(false)}
          >
            Login
          </button>

          <button
            type="button"
            className={isSignup ? "active" : ""}
            onClick={() => setIsSignup(true)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {isSignup && <input type="text" placeholder="Full Name" required />}

          <input type="email" placeholder="Email Address" required />
          <input type="password" placeholder="Password" required />

          <button className="primary-btn" type="submit">
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}