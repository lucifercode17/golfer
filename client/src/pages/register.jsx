import { useState, useEffect } from "react"; // ✅ FIXED (added useEffect)
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    charity: "" // ✅ FIXED (added charity)
  });

  const [loading, setLoading] = useState(false);
  const [charities, setCharities] = useState([]);
  const navigate = useNavigate();

  // ✅ Fetch charities safely
  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const res = await API.get("/charity");
        setCharities(res.data?.charities || []);
      } catch (err) {
        console.log("Charity fetch error:", err);
      }
    };

    fetchCharities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("Please fill all fields");
    }

    try {
      setLoading(true);

      await API.post("/auth/register", form);

      alert("Registered successfully ✅");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 🔥 Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🏌️ Golfer</h2>
        <button style={styles.navBtn} onClick={() => navigate("/")}>
          Login
        </button>
      </div>

      {/* 🔐 Register Card */}
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Create Account ✨</h1>
          <p style={styles.subtitle}>Join the platform</p>

          <form onSubmit={handleSubmit} style={styles.form}>
            <input
              placeholder="Name"
              style={styles.input}
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />

            <input
              placeholder="Email"
              style={styles.input}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              style={styles.input}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {/* ✅ Charity Dropdown */}
            <select
              style={styles.input}
              value={form.charity}
              onChange={(e) =>
                setForm({ ...form, charity: e.target.value })
              }
            >
              <option value="">Select Charity</option>

              {charities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <button style={styles.primaryBtn}>
              {loading ? "Creating..." : "Register"}
            </button>
          </form>

          {/* Footer */}
          <p style={styles.footer}>
            Already have an account?{" "}
            <span
              style={styles.link}
              onClick={() => navigate("/")}
            >
              Login
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
    right: 0,
    height: "60px",
    background: "#020617",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 16px",
    color: "#fff",
    zIndex: 999,
    boxSizing: "border-box"
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
    cursor: "pointer"
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
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer"
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