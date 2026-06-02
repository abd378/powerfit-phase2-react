import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dumbbell,
  HeartPulse,
  Clock,
  Apple,
  CheckCircle,
} from "lucide-react";

import profile from "../assets/profile.png";
import gymgirl from "../assets/gymgirl.png";
import t1 from "../assets/t1.jpg";
import t2 from "../assets/t2.jpg";
import t3 from "../assets/t3.jpg";
import t4 from "../assets/t4.jpg";

export default function Home() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);

  function calculateBMI(e) {
    e.preventDefault();

    const h = Number(height) / 100;
    const w = Number(weight);

    if (!h || !w) return;

    const result = (w / (h * h)).toFixed(1);
    setBmi(result);
  }

  function bmiStatus() {
    if (!bmi) return "";
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Healthy Weight";
    if (bmi < 30) return "Overweight";
    return "Obese";
  }

  return (
    <>
      <Navbar />

      <section id="home" className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -70 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="badge">Premium Fitness Club</span>

          <h1>Transform Your Body With PowerFit</h1>

          <p>
            Join a modern fitness community with expert trainers, powerful
            workouts, nutrition plans, and memberships built for real results.
          </p>

          <div className="hero-actions">
            <Link to="/auth" className="primary-btn">
              Start Your Journey
            </Link>
            <a href="#pricing" className="secondary-btn">
              View Plans
            </a>
          </div>

          <motion.div
            className="stats"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="stat-card">
              <h2>500+</h2>
              <p>Active Members</p>
            </div>

            <div className="stat-card">
              <h2>25+</h2>
              <p>Professional Trainers</p>
            </div>

            <div className="stat-card">
              <h2>10+</h2>
              <p>Years Experience</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="hero-image"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9 }}
        >
          <img src={profile} alt="Fitness trainer" />
        </motion.div>
      </section>

      <section id="services" className="section">
        <h2>Our Services</h2>

        <div className="cards-grid">
          <div className="glass-card">
            <Dumbbell />
            <h3>Personal Training</h3>
            <p>Custom workout plans with professional certified trainers.</p>
          </div>

          <div className="glass-card">
            <HeartPulse />
            <h3>Group Classes</h3>
            <p>CrossFit, cardio, strength training, and fitness classes.</p>
          </div>

          <div className="glass-card">
            <Apple />
            <h3>Nutrition Plans</h3>
            <p>Healthy meal guidance to support your fitness goals.</p>
          </div>

          <div className="glass-card">
            <Clock />
            <h3>24/7 Access</h3>
            <p>Train anytime with flexible gym access for all members.</p>
          </div>
        </div>
      </section>

      <section className="bmi-section">
        <div className="bmi-left">
          <span className="badge">Fitness Tool</span>
          <h2>BMI Calculator</h2>
          <p>
            Calculate your Body Mass Index and understand your fitness level.
          </p>
        </div>

        <form className="bmi-card" onSubmit={calculateBMI}>
          <input
            type="number"
            placeholder="Height in cm"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />

          <input
            type="number"
            placeholder="Weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />

          <button className="primary-btn" type="submit">
            Calculate BMI
          </button>

          {bmi && (
            <div className="bmi-result">
              <h3>Your BMI: {bmi}</h3>
              <p>{bmiStatus()}</p>
            </div>
          )}
        </form>
      </section>

      <section id="pricing" className="section">
        <h2>Membership Plans</h2>

        <div className="pricing-grid">
          <div className="pricing-card">
            <h3>Basic</h3>
            <p className="price">
              $29<span>/month</span>
            </p>
            <ul>
              <li>
                <CheckCircle /> Gym Access
              </li>
              <li>
                <CheckCircle /> Free Wi-Fi
              </li>
              <li>
                <CheckCircle /> Basic Equipment
              </li>
            </ul>
            <Link to="/auth" className="primary-btn">
              Choose Plan
            </Link>
          </div>

          <div className="pricing-card featured">
            <h3>Premium</h3>
            <p className="price">
              $49<span>/month</span>
            </p>
            <ul>
              <li>
                <CheckCircle /> Gym Access
              </li>
              <li>
                <CheckCircle /> Personal Training
              </li>
              <li>
                <CheckCircle /> Nutrition Plans
              </li>
            </ul>
            <Link to="/auth" className="primary-btn">
              Choose Plan
            </Link>
          </div>

          <div className="pricing-card">
            <h3>Elite</h3>
            <p className="price">
              $79<span>/month</span>
            </p>
            <ul>
              <li>
                <CheckCircle /> Gym Access
              </li>
              <li>
                <CheckCircle /> Personal Training
              </li>
              <li>
                <CheckCircle /> Nutrition Plans
              </li>
              <li>
                <CheckCircle /> Group Classes
              </li>
            </ul>
            <Link to="/auth" className="primary-btn">
              Choose Plan
            </Link>
          </div>
        </div>
      </section>

      <section id="trainers" className="trainers-section">
        <div>
          <h2>Meet Our Trainers</h2>
          <p>Train with experienced and motivational fitness coaches.</p>

          <div className="trainer-grid">
            {[t1, t2, t3, t4].map((trainer, index) => (
              <img key={index} src={trainer} alt="Trainer" />
            ))}
          </div>
        </div>

        <img className="gymgirl" src={gymgirl} alt="Gym woman" />
      </section>

      <Footer />
    </>
  );
}