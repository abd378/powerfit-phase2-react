import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { Star, Dumbbell, Award } from "lucide-react";
import { Link } from "react-router-dom";

import t1 from "../assets/t1.jpg";
import t2 from "../assets/t2.jpg";
import t3 from "../assets/t3.jpg";
import t4 from "../assets/t4.jpg";

export default function Trainers() {
  const trainers = [
    {
      img: t1,
      name: "Alex Carter",
      role: "Strength Coach",
      experience: "8 Years Experience",
      specialty: "Muscle Building",
    },
    {
      img: t2,
      name: "Maya Smith",
      role: "Cardio Trainer",
      experience: "6 Years Experience",
      specialty: "Fat Loss",
    },
    {
      img: t3,
      name: "John Miller",
      role: "Fitness Coach",
      experience: "10 Years Experience",
      specialty: "Full Body Training",
    },
    {
      img: t4,
      name: "Sara Wilson",
      role: "Yoga Coach",
      experience: "5 Years Experience",
      specialty: "Flexibility",
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
          <span className="badge">Our Trainers</span>
          <h1>Meet Professional Coaches</h1>
          <p>
            Our trainers help members build strength, burn fat, improve health,
            and stay motivated.
          </p>
        </motion.div>

        <div className="trainers-page-grid">
          {trainers.map((trainer, index) => (
            <motion.div
              className="trainer-card"
              key={trainer.name}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <img src={trainer.img} alt={trainer.name} />

              <div className="trainer-content">
                <h3>{trainer.name}</h3>
                <p className="trainer-role">{trainer.role}</p>

                <div className="trainer-info">
                  <span>
                    <Award size={17} /> {trainer.experience}
                  </span>
                  <span>
                    <Dumbbell size={17} /> {trainer.specialty}
                  </span>
                  <span>
                    <Star size={17} /> 4.9 Rating
                  </span>
                </div>

                <Link
  to={`/trainer/${index + 1}`}
  className="primary-btn"
>
  View Profile
</Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}