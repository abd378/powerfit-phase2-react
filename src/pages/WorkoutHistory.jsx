import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Dumbbell, Flame, Clock, CalendarDays, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function WorkoutHistory() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    type: "Strength Training",
    duration: "",
    calories: "",
    date: "",
  });

  async function fetchWorkouts() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("workout_history")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setWorkouts(data || []);
    }

    setLoading(false);
  }

  async function addWorkout(e) {
    e.preventDefault();

    if (!form.duration || !form.calories || !form.date) {
      alert("Please fill duration, calories, and date.");
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

    const { error } = await supabase.from("workout_history").insert({
      user_id: user.id,
      workout_type: form.type,
      duration: Number(form.duration),
      calories: Number(form.calories),
      workout_date: form.date,
    });

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setForm({
      type: "Strength Training",
      duration: "",
      calories: "",
      date: "",
    });

    setSaving(false);
    fetchWorkouts();
  }

  async function deleteWorkout(id) {
    const ok = window.confirm("Are you sure you want to delete this workout?");
    if (!ok) return;

    const { error } = await supabase
      .from("workout_history")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchWorkouts();
  }

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const totalCalories = workouts.reduce(
    (sum, workout) => sum + Number(workout.calories || 0),
    0
  );

  const totalDuration = workouts.reduce(
    (sum, workout) => sum + Number(workout.duration || 0),
    0
  );

  return (
    <>
      <Navbar />

      <main className="history-page">
        <div className="page-header">
          <span className="badge">Workout History</span>
          <h1>Track Completed Workouts</h1>
          <p>
            Log your workouts, calories burned, duration, and save everything
            securely inside Supabase.
          </p>
        </div>

        <section className="history-stats">
          <div className="history-stat">
            <Dumbbell />
            <h3>{workouts.length}</h3>
            <p>Total Workouts</p>
          </div>

          <div className="history-stat">
            <Flame />
            <h3>{totalCalories}</h3>
            <p>Calories Burned</p>
          </div>

          <div className="history-stat">
            <Clock />
            <h3>{totalDuration} min</h3>
            <p>Total Duration</p>
          </div>
        </section>

        <section className="history-layout">
          <form className="history-form" onSubmit={addWorkout}>
            <Dumbbell size={46} />

            <h2>Add Workout</h2>

            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option>Strength Training</option>
              <option>Cardio</option>
              <option>HIIT</option>
              <option>Yoga</option>
              <option>Full Body</option>
              <option>Leg Day</option>
              <option>Push Day</option>
              <option>Pull Day</option>
            </select>

            <input
              type="number"
              placeholder="Duration in minutes"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />

            <input
              type="number"
              placeholder="Calories burned"
              value={form.calories}
              onChange={(e) => setForm({ ...form, calories: e.target.value })}
            />

            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />

            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Workout"}
            </button>
          </form>

          <div className="history-list">
            {loading ? (
              <div className="booking-empty">
                <h3>Loading workouts...</h3>
              </div>
            ) : workouts.length === 0 ? (
              <div className="booking-empty">
                <h3>No workouts logged yet</h3>
                <p>Add your first completed workout.</p>
              </div>
            ) : (
              workouts.map((workout) => (
                <div className="history-card" key={workout.id}>
                  <div className="history-card-top">
                    <Dumbbell />
                    <div>
                      <h3>{workout.workout_type}</h3>
                      <p>{workout.workout_date}</p>
                    </div>
                  </div>

                  <div className="history-info">
                    <p>
                      <Clock size={16} />
                      {workout.duration} min
                    </p>

                    <p>
                      <Flame size={16} />
                      {workout.calories} kcal
                    </p>

                    <p>
                      <CalendarDays size={16} />
                      Completed
                    </p>
                  </div>

                  <button
                    className="danger-btn"
                    onClick={() => deleteWorkout(workout.id)}
                  >
                    <Trash2 size={16} />
                    Delete
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