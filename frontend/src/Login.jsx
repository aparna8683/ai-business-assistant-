import { useState } from "react";
import { ArrowRight, LockKeyhole, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AUTH_API = `${
  import.meta.env.VITE_API_URL || "http://localhost:5000"
}/api/auth`;
function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("authToken", data.token);
      localStorage.setItem(
        "admin",
        JSON.stringify(data.admin)
      );

navigate("/dashboard");
    } catch (error) {
      console.error("❌ Login error:", error);
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
            Welcome
            <br />
            <em>back.</em>
          </h1>

          <p>
            Sign in to manage your appointment
            inquiries.
          </p>
        </div>

        <form onSubmit={handleLogin}>

          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="admin@example.com"
            autoComplete="email"
          />

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
              placeholder="Enter your password"
              autoComplete="current-password"
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
            {loading ? "Signing in..." : "Sign in"}

            {!loading && (
              <ArrowRight size={17} />
            )}
          </button>

        </form>

      </div>
    </div>
  );
}

export default Login;