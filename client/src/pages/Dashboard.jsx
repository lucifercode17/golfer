import { useEffect, useState } from "react";
import API from "../api";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [scores, setScores] = useState([]);
  const [score, setScore] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 👤 Profile (charity + winnings)
      const res = await API.get("/auth/me", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setProfile(res.data);

      // 🎯 Scores
      const scoreRes = await API.get("/score", {
        headers: { Authorization: `Bearer ${token}` }
      });

      setScores(scoreRes.data.scores || []);

    } catch (err) {
      console.log(err);
    }
  };

 const addScore = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    return;
  }

  if (!score || isNaN(score)) {
    alert("Enter a valid score");
    return;
  }

  if (score < 1 || score > 45) {
    alert("Score must be between 1 and 45");
    return;
  }

  try {
    const res = await API.post(
      "/score/add",
      { value: Number(score) },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    setScores(res.data?.scores || []);
    setScore("");

  } catch (err) {
    console.log("ADD SCORE ERROR:", err.response?.data);
    alert(err.response?.data?.message || "Failed to add score");
  }
};

  return (
    <>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.grid}>

          {/* 👤 PROFILE CARD */}
          {profile && (
            <div style={styles.card}>
              <h3>👤 Profile</h3>
              <p><strong>Email:</strong> {profile.user.email}</p>
              <p>
                <strong>Charity:</strong>{" "}
                {profile.user.charity?.name || "None"}
              </p>
            </div>
          )}

          {/* 💰 WINNINGS */}
          {profile && (
            <div style={styles.card}>
              <h3>💰 Winnings</h3>
              <p>Total Wins: {profile.totalWins}</p>
              <p>Total Amount: ₹{profile.totalAmount}</p>
            </div>
          )}

          {/* 🎯 ADD SCORE */}
          <div style={styles.card}>
            <h3>Add Score</h3>

            <div style={styles.row}>
              <input
                type="number"
                placeholder="Enter score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                style={styles.input}
              />
              <button style={styles.btn} onClick={addScore}>
                Add
              </button>
            </div>
          </div>

          {/* 📊 SCORES */}
          <div style={styles.card}>
            <h3>Your Scores</h3>

            {scores.length === 0 ? (
              <p>No scores yet</p>
            ) : (
              scores.map((s, i) => (
                <div key={i} style={styles.item}>
                  <span>{s.value}</span>
                  <span>
                    {new Date(s.date).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* 🏆 WINNING HISTORY */}
          {profile?.winnings?.length > 0 && (
            <div style={styles.cardFull}>
              <h3>🏆 Winning History</h3>

              {profile.winnings.map((w) => (
                <div key={w._id} style={styles.item}>
                  <span>{w.result}</span>
                  <span>{w.paymentStatus}</span>
                </div>
              ))}
            </div>
          )}

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

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "auto"
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    color: "#fff"
  },

  cardFull: {
    gridColumn: "1 / -1",
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    color: "#fff"
  },

  row: {
    display: "flex",
    gap: "10px"
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "none"
  },

  btn: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    background: "#334155",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "6px"
  }
};