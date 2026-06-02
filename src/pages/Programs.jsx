import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Dumbbell, Flame, HeartPulse, StretchHorizontal } from "lucide-react";

export default function Programs() {
  const programs = [
    {
      icon: <Dumbbell />,
      title: "Muscle Building",
      text: "Strength workouts focused on gaining muscle and power.",
    },
    {
      icon: <Flame />,
      title: "Fat Loss",
      text: "High-intensity workouts to burn calories and improve fitness.",
    },
    {
      icon: <HeartPulse />,
      title: "Cardio Fitness",
      text: "Improve stamina, heart health, and daily energy.",
    },
    {
      icon: <StretchHorizontal />,
      title: "Flexibility",
      text: "Stretching and mobility sessions for better movement.",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="page-screen">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="badge">Workout Programs</span>
          <h1>Choose Your Training Goal</h1>
          <p>
            Phase 2 includes dedicated React pages, reusable components,
            animations, and a cleaner user experience.
          </p>
        </motion.div>

        <div className="cards-grid">
          {programs.map((item, index) => (
            <motion.div
              className="glass-card"
              key={index}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              {item.icon}
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}