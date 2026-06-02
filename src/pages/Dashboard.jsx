import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Droplets, Flame, Dumbbell, Trophy } from "lucide-react";

export default function Dashboard() {
  const [water, setWater] = useState(() => Number(localStorage.getItem("water")) || 0);
  const [calories, setCalories] = useState(() => Number(localStorage.getItem("calories")) || 0);
  const [workouts, setWorkouts] = useState(() => Number(localStorage.getItem("workouts")) || 0);

  useEffect(() => {
    localStorage.setItem("water", water);
    localStorage.setItem("calories", calories);
    localStorage.setItem("workouts", workouts);
  }, [water, calories, workouts]);

  function resetProgress() {
    setWater(0);
    setCalories(0);
    setWorkouts(0);
  }

  return (
    <>
      <Navbar />

      <main className="page-screen">
        <div className="page-header">
          <span className="badge">Member Dashboard</span>
          <h1>Your Fitness Progress</h1>
          <p>Track your daily fitness activity using React state and local storage.</p>
        </div>

        <div className="dashboard-grid">
          <div className="dash-card">
            <Droplets />
            <h3>Water Tracker</h3>
            <h2>{water} / 8</h2>
            <p>Glasses today</p>
            <button className="primary-btn" onClick={() => setWater(water + 1)}>
              Add Glass
            </button>
          </div>

          <div className="dash-card">
            <Flame />
            <h3>Calories Burned</h3>
            <h2>{calories}</h2>
            <p>Calories today</p>
            <button className="primary-btn" onClick={() => setCalories(calories + 100)}>
              Add 100 Cal
            </button>
          </div>

          <div className="dash-card">
            <Dumbbell />
            <h3>Workouts</h3>
            <h2>{workouts}</h2>
            <p>Completed sessions</p>
            <button className="primary-btn" onClick={() => setWorkouts(workouts + 1)}>
              Complete Workout
            </button>
          </div>

          <div className="dash-card">
            <Trophy />
            <h3>Weekly Goal</h3>
            <h2>{Math.min(workouts * 20, 100)}%</h2>
            <p>Goal progress</p>
            <button className="secondary-btn" onClick={resetProgress}>
              Reset Progress
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}