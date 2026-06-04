import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { Star, Dumbbell, DollarSign } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Trainers() {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchTrainers() {
    setLoading(true);

    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) alert(error.message);
    else setTrainers(data || []);

    setLoading(false);
  }

  useEffect(() => {
    fetchTrainers();
  }, []);

  return (
    <>
      <Navbar />

      <main className="page-screen">
        <div className="page-header">
          <span className="badge">Expert Coaches</span>
          <h1>Meet Our Trainers</h1>
          <p>
            Browse real trainers loaded from Supabase and book sessions based on
            your fitness goals.
          </p>
        </div>

        {loading ? (
          <div className="booking-empty">
            <h3>Loading trainers...</h3>
          </div>
        ) : trainers.length === 0 ? (
          <div className="booking-empty">
            <h3>No trainers available yet</h3>
            <p>Admin can add trainers from Manage Trainers.</p>
          </div>
        ) : (
          <section className="trainers-grid">
            {trainers.map((trainer) => (
              <div className="trainer-card" key={trainer.id}>
                <img
                  src={
                    trainer.image_url ||
                    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
                  }
                  alt={trainer.name}
                />

                <div className="trainer-content">
                  <h2>{trainer.name}</h2>
                  <p>{trainer.specialty}</p>

                  <div className="trainer-info-row">
                    <span>
                      <Dumbbell size={16} />
                      {trainer.experience}
                    </span>

                    <span>
                      <Star size={16} />
                      {trainer.rating}
                    </span>

                    <span>
                      <DollarSign size={16} />
                      {trainer.price}/session
                    </span>
                  </div>

                  <p className="trainer-bio">
                    {trainer.bio ||
                      "Professional PowerFit trainer ready to help you reach your goals."}
                  </p>

                  <Link to="/booking" className="primary-btn">
                    Book Session
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}