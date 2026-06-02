import { useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import t1 from "../assets/t1.jpg";
import t2 from "../assets/t2.jpg";
import t3 from "../assets/t3.jpg";
import t4 from "../assets/t4.jpg";

export default function TrainerProfile() {
  const { id } = useParams();
  const [booked, setBooked] = useState(false);

  const trainers = {
    1: {
      img: t1,
      name: "Alex Carter",
      role: "Strength Coach",
      experience: "8 Years",
      specialty: "Muscle Building",
      bio: "Expert strength coach helping members gain muscle, improve form, and increase performance.",
    },
    2: {
      img: t2,
      name: "Maya Smith",
      role: "Cardio Trainer",
      experience: "6 Years",
      specialty: "Fat Loss",
      bio: "Specialized in fat loss, endurance, cardio training, and healthy lifestyle coaching.",
    },
    3: {
      img: t3,
      name: "John Miller",
      role: "Fitness Coach",
      experience: "10 Years",
      specialty: "Full Body Training",
      bio: "Professional trainer focused on full body transformation and long-term fitness results.",
    },
    4: {
      img: t4,
      name: "Sara Wilson",
      role: "Yoga Coach",
      experience: "5 Years",
      specialty: "Flexibility",
      bio: "Yoga and mobility specialist helping members improve balance, flexibility, and recovery.",
    },
  };

  const trainer = trainers[id];

  if (!trainer) {
    return (
      <>
        <Navbar />
        <main className="page-screen">
          <div className="page-header">
            <h1>Trainer Not Found</h1>
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
        <div className="trainer-profile">
          <img src={trainer.img} alt={trainer.name} />

          <div>
            <span className="badge">{trainer.role}</span>

            <h1>{trainer.name}</h1>

            <p>{trainer.bio}</p>

            <h3>Experience: {trainer.experience}</h3>
            <h3>Specialty: {trainer.specialty}</h3>

            <button className="primary-btn" onClick={() => setBooked(true)}>
              Book Training Session
            </button>

            {booked && (
              <div className="booking-success">
                <h3>✅ Session Booked Successfully</h3>
                <p>
                  Your training session request has been received. Our team will
                  contact you shortly.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}