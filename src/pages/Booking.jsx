import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CalendarCheck, Clock, Target, User, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Booking() {
  const trainers = ["Alex Carter", "Maya Smith", "John Miller", "Sara Wilson"];

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    trainer: "Alex Carter",
    date: "",
    time: "",
    goal: "Muscle Building",
    notes: "",
  });

  async function fetchBookings() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setBookings(data || []);
    }

    setLoading(false);
  }

  async function addBooking(e) {
    e.preventDefault();

    if (!form.date || !form.time) {
      alert("Please choose date and time.");
      return;
    }

    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("You must be logged in.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      trainer: form.trainer,
      session_date: form.date,
      session_time: form.time,
      goal: form.goal,
      notes: form.notes,
      status: "Confirmed",
    });

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setForm({
      trainer: "Alex Carter",
      date: "",
      time: "",
      goal: "Muscle Building",
      notes: "",
    });

    setSaving(false);
    fetchBookings();
    alert("Training session booked successfully!");
  }

  async function cancelBooking(id) {
    const ok = window.confirm("Are you sure you want to cancel this session?");
    if (!ok) return;

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchBookings();
  }

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <>
      <Navbar />

      <main className="booking-page">
        <div className="page-header">
          <span className="badge">Training Booking</span>
          <h1>Book Your Personal Training Session</h1>
          <p>
            Choose your trainer, date, time, and fitness goal. Your bookings are
            now saved inside Supabase.
          </p>
        </div>

        <section className="booking-layout">
          <form className="booking-form-card" onSubmit={addBooking}>
            <CalendarCheck size={48} />

            <h2>New Session</h2>

            <select
              value={form.trainer}
              onChange={(e) => setForm({ ...form, trainer: e.target.value })}
            >
              {trainers.map((trainer) => (
                <option key={trainer}>{trainer}</option>
              ))}
            </select>

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <input
              type="time"
              value={form.time}
              onChange={(e) => setForm({ ...form, time: e.target.value })}
            />

            <select
              value={form.goal}
              onChange={(e) => setForm({ ...form, goal: e.target.value })}
            >
              <option>Muscle Building</option>
              <option>Fat Loss</option>
              <option>Cardio Fitness</option>
              <option>Flexibility</option>
              <option>Full Body Transformation</option>
            </select>

            <textarea
              placeholder="Extra notes for your trainer..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? "Booking..." : "Book Session"}
            </button>
          </form>

          <div className="booking-list">
            {loading ? (
              <div className="booking-empty">
                <h3>Loading bookings...</h3>
              </div>
            ) : bookings.length === 0 ? (
              <div className="booking-empty">
                <h3>No bookings yet</h3>
                <p>Your upcoming training sessions will appear here.</p>
              </div>
            ) : (
              bookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                  <div className="booking-card-top">
                    <User />
                    <div>
                      <h3>{booking.trainer}</h3>
                      <p>{booking.status}</p>
                    </div>
                  </div>

                  <div className="booking-info">
                    <p>
                      <CalendarCheck size={16} />
                      {booking.session_date}
                    </p>

                    <p>
                      <Clock size={16} />
                      {booking.session_time}
                    </p>

                    <p>
                      <Target size={16} />
                      {booking.goal}
                    </p>
                  </div>

                  {booking.notes && (
                    <p className="booking-notes">{booking.notes}</p>
                  )}

                  <button
                    className="danger-btn"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    <Trash2 size={16} />
                    Cancel
                  </button>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}