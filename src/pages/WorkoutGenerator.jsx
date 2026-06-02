import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Dumbbell, Flame, RefreshCcw } from "lucide-react";

export default function WorkoutGenerator() {
  const workouts = [
    {
      title: "Chest Day",
      icon: "💪",
      level: "Intermediate",
      exercises: ["Bench Press", "Incline Dumbbell Press", "Push Ups", "Cable Fly"],
    },
    {
      title: "Back Day",
      icon: "🏋️",
      level: "Advanced",
      exercises: ["Pull Ups", "Lat Pulldown", "Barbell Row", "Deadlift"],
    },
    {
      title: "Leg Day",
      icon: "🦵",
      level: "Hard",
      exercises: ["Squats", "Leg Press", "Lunges", "Calf Raises"],
    },
    {
      title: "Cardio Burn",
      icon: "🔥",
      level: "Beginner",
      exercises: ["Treadmill Run", "Jump Rope", "Burpees", "Mountain Climbers"],
    },
    {
      title: "Full Body",
      icon: "⚡",
      level: "All Levels",
      exercises: ["Push Ups", "Squats", "Plank", "Dumbbell Rows"],
    },
  ];

  const [selectedWorkout, setSelectedWorkout] = useState(workouts[0]);

  function generateWorkout() {
    const randomIndex = Math.floor(Math.random() * workouts.length);
    setSelectedWorkout(workouts[randomIndex]);
  }

  return (
    <>
      <Navbar />

      <main className="page-screen">
        <div className="page-header">
          <span className="badge">Workout Generator</span>
          <h1>Generate Your Workout</h1>
          <p>
            Click the button to generate a random workout plan using React state.
          </p>
        </div>

        <div className="workout-layout">
          <motion.div
            className="workout-card"
            key={selectedWorkout.title}
            initial={{ opacity: 0, y: 35, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="workout-icon">{selectedWorkout.icon}</div>

            <h2>{selectedWorkout.title}</h2>
            <p className="workout-level">Level: {selectedWorkout.level}</p>

            <ul>
              {selectedWorkout.exercises.map((exercise) => (
                <li key={exercise}>
                  <Dumbbell size={18} /> {exercise}
                </li>
              ))}
            </ul>

            <button className="primary-btn" onClick={generateWorkout}>
              <RefreshCcw size={18} /> Generate New Workout
            </button>
          </motion.div>

          <div className="workout-side">
            <Flame />
            <h3>Why this feature?</h3>
            <p>
              This page shows real React logic: state, arrays, mapping,
              conditional rendering, and random generation.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}