import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isAdmin, setIsAdmin] = useState(false);

  // 🔥 FIX: make it reactive
  useEffect(() => {
    const admin = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(admin);
  }, [location]); // updates on route change

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo} onClick={() => navigate("/dashboard")}>
        🏌️ Golfer
      </h2>

      <div style={styles.links}>
        <button
          style={location.pathname === "/dashboard" ? styles.active : styles.btn}
          onClick={() => navigate("/dashboard")}
        >
          Dashboard
        </button>

        <button
          style={location.pathname === "/subscription" ? styles.active : styles.btn}
          onClick={() => navigate("/subscription")}
        >
          Subscription
        </button>

        {/* ✅ Admin Button */}
        {isAdmin && (
          <button
            style={location.pathname === "/admin" ? styles.active : styles.btn}
            onClick={() => navigate("/admin")}
          >
            Admin ⚡
          </button>
        )}

        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
}

const styles = {
  navbar: {
    width: "100%",
    height: "60px",
    padding: "0 30px",
    background: "#020617",
    color: "#fff",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 9999,
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
  },

  logo: {
    cursor: "pointer"
  },

  links: {
    display: "flex",
    gap: "10px"
  },

  btn: {
    background: "transparent",
    color: "#cbd5f5",
    border: "none",
    padding: "8px 12px",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "0.2s"
  },

  active: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  logout: {
    background: "#ef4444",
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer"
  }
};