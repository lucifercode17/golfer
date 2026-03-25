import { useState, useEffect } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Admin() {
  const [draw, setDraw] = useState(null);
  const [winners, setWinners] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const winRes = await API.get("/draw/winners", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWinners(winRes.data.winners);

      const userRes = await API.get("/user/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(userRes.data.users);

    } catch (err) {
      console.log(err);
    }
  };

  const runDraw = async () => {
    try {
      setLoading(true);

      const res = await API.post(
        "/draw/run",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDraw(res.data);
      fetchData(); // refresh winners

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Draw failed");
    } finally {
      setLoading(false);
    }
  };

  const markPaid = async (id) => {
    try {
      await API.put(`/draw/pay/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });

      fetchData();

    } catch (err) {
      alert("Failed to update payment");
    }
  };

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.wrapper}>

          <h1 style={styles.title}>⚡ Admin Panel</h1>

          {/* 🎲 Run Draw */}
          <div style={styles.card}>
            <h3>Run Lottery Draw</h3>
            <button style={styles.button} onClick={runDraw}>
              {loading ? "Running..." : "🎲 Run Draw"}
            </button>
          </div>

          {/* 🎯 Latest Draw Result */}
          {draw && (
            <div style={styles.card}>
              <h3>Latest Draw</h3>
              <div style={styles.drawBox}>
                {draw.drawNumbers.join(" • ")}
              </div>
            </div>
          )}

          {/* 🏆 Winners */}
          <div style={styles.card}>
            <h3>Winners</h3>

            {winners.length === 0 ? (
              <p>No winners yet</p>
            ) : (
              winners.map((w) => (
                <div key={w._id} style={styles.listItem}>
                  <span>{w.user?.email}</span>
                  <span>{w.result}</span>
                  <span>{w.paymentStatus}</span>

                  {w.paymentStatus === "pending" && (
                    <button
                      style={styles.payBtn}
                      onClick={() => markPaid(w._id)}
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* 👤 Users */}
          <div style={styles.card}>
            <h3>Users</h3>

            {users.map((u) => (
              <div key={u._id} style={styles.listItem}>
                <span>{u.email}</span>
                <span>{u.isAdmin ? "Admin" : "User"}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    paddingTop: "100px",
    minHeight: "100vh",
    background: "#0f172a",
    padding: "100px 20px"
  },

  wrapper: {
    maxWidth: "900px",
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  title: {
    color: "#fff",
    textAlign: "center"
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "16px",
    color: "#fff"
  },

  button: {
    width: "100%",
    padding: "12px",
    background: "#f59e0b",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    cursor: "pointer"
  },

  drawBox: {
    background: "#020617",
    padding: "15px",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold"
  },

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    background: "#334155",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px"
  },

  payBtn: {
    background: "#22c55e",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer"
  }
};