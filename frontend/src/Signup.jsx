import { useState } from "react";
import {
  ArrowRight,
  LockKeyhole,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const AUTH_API = "http://localhost:5000/api/auth";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create your account."
        );
      }

      // Registration succeeded.
      // Login separately so the authentication flow stays explicit.
      navigate("/login", {
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      console.error("❌ Signup error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">

        <div className="login-logo">
          <Sparkles size={20} />
        </div>

        <div className="login-heading">
          <span>RECEPTION WORKSPACE</span>

          <h1>
            Create
            <br />
            <em>your account.</em>
          </h1>

          <p>
            Set up your owner account to manage
            appointment inquiries.
          </p>
        </div>

        <form onSubmit={handleSignup}>

          <label>
            Name
          </label>

          <div className="password-field">
            <UserRound size={16} />

            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Your name"
              autoComplete="name"
            />
          </div>

          <label>
            Email
          </label>

          <div className="password-field">
            <Mail size={16} />

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="admin@example.com"
              autoComplete="email"
            />
          </div>

          <label>
            Password
          </label>

          <div className="password-field">
            <LockKeyhole size={16} />

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="At least 8 characters"
              autoComplete="new-password"
            />
          </div>

          {error && (
            <p className="login-error">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Create account"}

            {!loading && (
              <ArrowRight size={17} />
            )}
          </button>

        </form>

        <div className="auth-switch">
          <span>Already have an account?</span>

          <Link to="/login">
            Sign in
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Signup;