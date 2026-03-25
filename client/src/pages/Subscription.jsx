import { useState, useEffect } from "react";
import API from "../api";

export default function Subscription() {
  const [subscription, setSubscription] = useState(null);

  // 🔥 Fetch current subscription
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await API.get("/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setSubscription(res.data.subscription);

      } catch (err) {
        console.log(err);
      }
    };

    fetchSub();
  }, []);

  // ✅ Activate
  const activateSubscription = async (plan) => {
    try {
      const token = localStorage.getItem("token");

      const res = await API.post(
        "/subscription/activate",
        { plan },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setSubscription(res.data.subscription);

    } catch (err) {
      alert(err.response?.data?.message || "Failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Subscription 💳</h2>

        {subscription ? (
          <p>
            Current Plan: <b>{subscription.plan}</b> <br />
            Status: <b>{subscription.status}</b>
          </p>
        ) : (
          <p>No subscription</p>
        )}

        <div style={styles.buttons}>
          <button onClick={() => activateSubscription("monthly")}>
            Monthly Plan
          </button>

          <button onClick={() => activateSubscription("yearly")}>
            Yearly Plan
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#020617",
    color: "#fff"
  },
  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    width: "350px",
    textAlign: "center"
  },
  buttons: {
    marginTop: "20px",
    display: "flex",
    gap: "10px",
    justifyContent: "center"
  }
};