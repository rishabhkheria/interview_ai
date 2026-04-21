import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import "../auth.form.scss";
import { useAuth } from "../hooks/useAuth.js";

const AuthNav = () => (
  <nav className="auth-nav">
    <Link to="/" className="auth-nav__brand">
      <img src="/logo.png" alt="Interview AI" className="auth-nav__logo" />
      Interview <span className="highlight">AI</span>
    </Link>
  </nav>
);

const AuthFooter = () => (
  <footer className="auth-footer">
    <a href="#">Privacy Policy</a>
    <span>·</span>
    <a href="#">Terms of Service</a>
    <span>·</span>
    <a href="#">Help Centre</a>
  </footer>
);

const Login = () => {
  useEffect(() => {
    document.title = "Login | Interview AI";
  }, []);
  const { loading, handleLogin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  //two way binding
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await handleLogin({ email, password });

    if (result?.success) {
      navigate("/dashboard", { replace: true });
      return;
    }

    setError(result?.message || "Unable to login. Please try again.");
  };

  if (loading) {
    return (
      <main>
        <h1>Loading......</h1>
      </main>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <AuthNav />
      <main>
        <div className="form-container">
          <h1>Login</h1>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                type="email"
                id="email"
                name="email"
                placeholder="Enter email address"
              />
            </div>
            <div className="input-group">
              <label htmlFor="password">Password</label>
              <div className="password-wrapper">
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter password"
                />
                <button 
                  type="button" 
                  className="eye-icon" 
                  onClick={() => setShowPassword(!showPassword)}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>
            <button className="button primary-button">Login</button>
          </form>
          {error && <p className="form-error">{error}</p>}
          <p>
            Don't have an account? <Link to={"/register"}>Register</Link>
          </p>
        </div>
      </main>
      <AuthFooter />
    </div>
  );
};

export default Login;
