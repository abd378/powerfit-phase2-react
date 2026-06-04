import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { LogIn, LogOut, CalendarDays, Clock } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchAttendance() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setAttendance(data || []);
      setActiveSession(
        data?.find((item) => item.status === "Checked In" && !item.check_out) ||
          null
      );
    }

    setLoading(false);
  }

  async function checkIn() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("attendance").insert({
      user_id: user.id,
      status: "Checked In",
    });

    if (error) {
      alert(error.message);
      return;
    }

    fetchAttendance();
  }

  async function checkOut() {
    if (!activeSession) return;

    const { error } = await supabase
      .from("attendance")
      .update({
        check_out: new Date().toISOString(),
        status: "Checked Out",
      })
      .eq("id", activeSession.id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchAttendance();
  }

  useEffect(() => {
    fetchAttendance();
  }, []);

  return (
    <>
      <Navbar />

      <main className="attendance-page">
        <div className="page-header">
          <span className="badge">Gym Attendance</span>
          <h1>Check In / Check Out</h1>
          <p>
            Track your real gym visits with Supabase attendance history.
          </p>
        </div>

        <section className="attendance-action-card">
          {activeSession ? (
            <>
              <LogIn size={52} />
              <h2>You are currently checked in</h2>
              <p>
                Started at:{" "}
                {new Date(activeSession.check_in).toLocaleString()}
              </p>

              <button className="danger-btn" onClick={checkOut}>
                <LogOut size={18} />
                Check Out
              </button>
            </>
          ) : (
            <>
              <LogIn size={52} />
              <h2>Ready for today’s workout?</h2>
              <p>Check in when you arrive at the gym.</p>

              <button className="primary-btn" onClick={checkIn}>
                <LogIn size={18} />
                Check In
              </button>
            </>
          )}
        </section>

        <section className="attendance-history">
          <div className="section-title">
            <span className="badge">History</span>
            <h2>Attendance Records</h2>
          </div>

          {loading ? (
            <div className="booking-empty">
              <h3>Loading attendance...</h3>
            </div>
          ) : attendance.length === 0 ? (
            <div className="booking-empty">
              <h3>No attendance records yet</h3>
              <p>Your gym check-ins will appear here.</p>
            </div>
          ) : (
            <div className="attendance-grid">
              {attendance.map((item) => (
                <div className="attendance-card" key={item.id}>
                  <div className="attendance-top">
                    <CalendarDays />
                    <div>
                      <h3>{item.status}</h3>
                      <p>{new Date(item.check_in).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <p>
                    <Clock size={16} />
                    Check In: {new Date(item.check_in).toLocaleTimeString()}
                  </p>

                  <p>
                    <Clock size={16} />
                    Check Out:{" "}
                    {item.check_out
                      ? new Date(item.check_out).toLocaleTimeString()
                      : "Still inside"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}