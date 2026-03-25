import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔐 Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", res.data.user.isAdmin);

      if (res.data.user.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ⚡ Admin Login
  const handleAdminLogin = async () => {
    if (!form.email || !form.password) {
      return alert("Enter admin credentials");
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/login", form);

      if (!res.data.user.isAdmin) {
        return alert("Not an admin account ❌");
      }

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("isAdmin", true);

      navigate("/admin");

    } catch (err) {
      alert("Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🏌️ Golfer</h2>
        <button style={styles.navBtn} onClick={() => navigate("/register")}>
          Register
        </button>
      </div>

      {/* 🔐 Login Card */}
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Welcome Back 👋</h1>
          <p style={styles.subtitle}>Login to continue</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="Email"
              style={styles.input}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <button style={styles.primaryBtn}>
              {loading ? "Please wait..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div style={styles.divider}>OR</div>

          {/* Admin Login */}
          <button style={styles.adminBtn} onClick={handleAdminLogin}>
            ⚡ Admin Login
          </button>

          {/* Register Link */}
          <p style={styles.footer}>
            Don’t have an account?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  navbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0, // 
    height: "60px",
    background: "#020617",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    color: "#fff",
    zIndex: 999,
    boxSizing: "border-box", //
  },

  logo: {
    margin: 0,
    fontSize: "18px",
    whiteSpace: "nowrap" 
  },

  navBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "14px",
    whiteSpace: "nowrap" // 🔥 prevent overflow
  },

  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(to right, #020617, #0f172a)",
    paddingTop: "60px"
  },

  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "16px",
    width: "350px",
    color: "#fff",
    boxShadow: "0 15px 30px rgba(0,0,0,0.4)",
    textAlign: "center"
  },

  title: {
    marginBottom: "5px"
  },

  subtitle: {
    marginBottom: "20px",
    color: "#94a3b8"
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    outline: "none"
  },

  primaryBtn: {
    padding: "12px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
  },

  adminBtn: {
    marginTop: "10px",
    padding: "12px",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%"
  },

  divider: {
    margin: "15px 0",
    color: "#64748b",
    fontSize: "12px"
  },

  footer: {
    marginTop: "15px",
    fontSize: "14px"
  },

  link: {
    color: "#3b82f6",
    cursor: "pointer",
    fontWeight: "bold"
  }
};