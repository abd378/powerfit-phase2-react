import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function Membership() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      name: "Basic",
      price: "$29",
      desc: "Perfect for beginners.",
      features: ["Gym Access", "Free Wi-Fi", "Basic Equipment"],
    },
    {
      name: "Premium",
      price: "$49",
      desc: "Best value for serious members.",
      features: ["Gym Access", "Personal Training", "Nutrition Plans"],
      featured: true,
    },
    {
      name: "Elite",
      price: "$79",
      desc: "Full premium experience.",
      features: ["Gym Access", "Personal Training", "Nutrition Plans", "Group Classes"],
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
          <span className="badge">Membership</span>
          <h1>Choose Your Perfect Plan</h1>
          <p>
            Select a membership plan that matches your fitness goals and lifestyle.
          </p>
        </motion.div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              className={`pricing-card ${plan.featured ? "featured" : ""}`}
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
            >
              <h3>{plan.name}</h3>
              <p className="plan-desc">{plan.desc}</p>

              <p className="price">
                {plan.price}
                <span>/month</span>
              </p>

              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <CheckCircle /> {feature}
                  </li>
                ))}
              </ul>

              <button
                className="primary-btn"
                onClick={() => setSelectedPlan(plan)}
              >
                Choose Plan
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {selectedPlan && (
        <div className="modal-overlay">
          <motion.div
            className="plan-modal"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button className="modal-close" onClick={() => setSelectedPlan(null)}>
              <X />
            </button>

            <span className="badge">Selected Plan</span>
            <h2>{selectedPlan.name} Plan</h2>
            <p>
              You selected the <b>{selectedPlan.name}</b> membership plan.
            </p>

            <div className="modal-price">
              {selectedPlan.price}
              <span>/month</span>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                alert("Plan selected successfully!");
                setSelectedPlan(null);
              }}
            >
              Confirm Membership
            </button>
          </motion.div>
        </div>
      )}

      <Footer />
    </>
  );
}