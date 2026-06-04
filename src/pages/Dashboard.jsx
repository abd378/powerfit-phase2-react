import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  Droplets,
  Flame,
  Dumbbell,
  Trophy,
  CalendarCheck,
  Clock,
  User,
  Apple,
  Beef,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  const [progressId, setProgressId] = useState(null);

  const [progress, setProgress] = useState({
    water: 0,
    calories: 0,
    workouts: 0,
  });

  const [bookings, setBookings] = useState([]);
  const [nutrition, setNutrition] = useState({
    title: "No Plan Selected",
    calories: 0,
    protein: 0,
    goal: "Choose a nutrition plan first.",
  });
  const [challenges, setChallenges] = useState([]);
  const [workoutHistory, setWorkoutHistory] = useState([]);

  async function fetchDashboardData() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const { data: progressData } = await supabase
      .from("daily_progress")
      .select("*")
      .eq("user_id", user.id)
      .eq("progress_date", today)
      .maybeSingle();

    if (progressData) {
      setProgressId(progressData.id);
      setProgress({
        water: progressData.water || 0,
        calories: progressData.calories || 0,
        workouts: progressData.workouts || 0,
      });
    } else {
      const { data: newProgress, error } = await supabase
        .from("daily_progress")
        .insert({
          user_id: user.id,
          water: 0,
          calories: 0,
          workouts: 0,
          progress_date: today,
        })
        .select()
        .single();

      if (!error && newProgress) {
        setProgressId(newProgress.id);
        setProgress({
          water: newProgress.water || 0,
          calories: newProgress.calories || 0,
          workouts: newProgress.workouts || 0,
        });
      }
    }

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .eq("user_id", user.id)
      .order("session_date", { ascending: true });

    const { data: nutritionData } = await supabase
      .from("nutrition_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const { data: challengesData } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const { data: workoutData } = await supabase
      .from("workout_history")
      .select("*")
      .eq("user_id", user.id)
      .order("workout_date", { ascending: false });

    setBookings(bookingsData || []);
    setChallenges(challengesData || []);
    setWorkoutHistory(workoutData || []);

    if (nutritionData) {
      setNutrition({
        title: nutritionData.title,
        calories: nutritionData.calories,
        protein: nutritionData.protein,
        goal: nutritionData.goal,
      });
    }

    setLoading(false);
  }

  async function updateDailyProgress(type, value) {
    if (!progressId) return;

    const updated = {
      ...progress,
      [type]: progress[type] + value,
    };

    setProgress(updated);

    const { error } = await supabase
      .from("daily_progress")
      .update(updated)
      .eq("id", progressId);

    if (error) {
      alert(error.message);
      fetchDashboardData();
    }
  }

  async function resetProgress() {
    if (!progressId) return;

    const reset = {
      water: 0,
      calories: 0,
      workouts: 0,
    };

    setProgress(reset);

    const { error } = await supabase
      .from("daily_progress")
      .update(reset)
      .eq("id", progressId);

    if (error) {
      alert(error.message);
      fetchDashboardData();
    }
  }

  async function cancelBooking(id) {
    const ok = window.confirm("Are you sure you want to cancel this session?");
    if (!ok) return;

    const { error } = await supabase.from("bookings").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchDashboardData();
  }

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const totalWorkoutCalories = workoutHistory.reduce(
    (sum, item) => sum + Number(item.calories || 0),
    0
  );

  const totalWorkoutMinutes = workoutHistory.reduce(
    (sum, item) => sum + Number(item.duration || 0),
    0
  );

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page-screen">
          <div className="page-header">
            <span className="badge">Loading</span>
            <h1>Loading Dashboard...</h1>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page-screen">
        <div className="page-header">
          <span className="badge">Member Dashboard</span>
          <h1>Your Fitness Progress</h1>
          <p>
            Track your daily activity, nutrition, challenges, workout history,
            and sessions from Supabase.
          </p>
        </div>

        <div className="dashboard-grid">
          <div className="dash-card">
            <Droplets />
            <h3>Water Tracker</h3>
            <h2>{progress.water} / 8</h2>
            <p>Glasses today</p>

            <button
              className="primary-btn"
              onClick={() => updateDailyProgress("water", 1)}
            >
              Add Water
            </button>
          </div>

          <div className="dash-card">
            <Flame />
            <h3>Daily Calories</h3>
            <h2>{progress.calories}</h2>
            <p>Calories burned today</p>

            <button
              className="primary-btn"
              onClick={() => updateDailyProgress("calories", 100)}
            >
              Add 100
            </button>
          </div>

          <div className="dash-card">
            <Dumbbell />
            <h3>Daily Workouts</h3>
            <h2>{progress.workouts}</h2>
            <p>Completed sessions today</p>

            <button
              className="primary-btn"
              onClick={() => updateDailyProgress("workouts", 1)}
            >
              Complete Workout
            </button>
          </div>

          <div className="dash-card">
            <Trophy />
            <h3>Activity Score</h3>
            <h2>{progress.workouts + progress.water}</h2>
            <p>Daily activity points</p>

            <button className="secondary-btn" onClick={resetProgress}>
              Reset
            </button>
          </div>
        </div>

        <section className="nutrition-widget">
          <div className="section-title">
            <span className="badge">Workout Analytics</span>
            <h2>Workout History Summary</h2>
          </div>

          <div className="nutrition-widget-grid">
            <div className="nutrition-widget-card">
              <Dumbbell />
              <h3>{workoutHistory.length}</h3>
              <p>Total Logged Workouts</p>
            </div>

            <div className="nutrition-widget-card">
              <Flame />
              <h3>{totalWorkoutCalories}</h3>
              <p>Total Calories Burned</p>
            </div>

            <div className="nutrition-widget-card">
              <Clock />
              <h3>{totalWorkoutMinutes} min</h3>
              <p>Total Training Time</p>
            </div>
          </div>
        </section>

        <section className="nutrition-widget">
          <div className="section-title">
            <span className="badge">Nutrition</span>
            <h2>Current Meal Plan</h2>
          </div>

          <div className="nutrition-widget-grid">
            <div className="nutrition-widget-card">
              <Apple />
              <h3>{nutrition.title}</h3>
              <p>{nutrition.goal}</p>
            </div>

            <div className="nutrition-widget-card">
              <Flame />
              <h3>{nutrition.calories}</h3>
              <p>Daily Calories</p>
            </div>

            <div className="nutrition-widget-card">
              <Beef />
              <h3>{nutrition.protein}g</h3>
              <p>Daily Protein</p>
            </div>
          </div>
        </section>

        <section className="nutrition-widget">
          <div className="section-title">
            <span className="badge">Challenges</span>
            <h2>My Active Challenges</h2>
          </div>

          {challenges.length === 0 ? (
            <div className="booking-empty">
              <h3>No active challenges</h3>
              <p>Join a challenge to track your consistency.</p>
            </div>
          ) : (
            <div className="dashboard-booking-grid">
              {challenges.map((item) => {
                const challengeProgress = Math.round(
                  (item.completed_days / item.days) * 100
                );

                return (
                  <div className="booking-card" key={item.id}>
                    <div className="booking-card-top">
                      <Trophy />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.status}</p>
                      </div>
                    </div>

                    <p>
                      {item.completed_days} / {item.days} days completed
                    </p>

                    <div className="challenge-progress-bar">
                      <div
                        className="challenge-progress-fill"
                        style={{ width: `${challengeProgress}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="dashboard-bookings">
          <div className="section-title">
            <span className="badge">Bookings</span>
            <h2>Upcoming Training Sessions</h2>
          </div>

          {bookings.length === 0 ? (
            <div className="booking-empty">
              <h3>No sessions booked</h3>
              <p>Go to Booking page and schedule your first session.</p>
            </div>
          ) : (
            <div className="dashboard-booking-grid">
              {bookings.map((booking) => (
                <div className="booking-card" key={booking.id}>
                  <div className="booking-card-top">
                    <User />
                    <div>
                      <h3>{booking.trainer}</h3>
                      <p>{booking.goal}</p>
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
                  </div>

                  <button
                    className="danger-btn"
                    onClick={() => cancelBooking(booking.id)}
                  >
                    Cancel Session
                  </button>
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