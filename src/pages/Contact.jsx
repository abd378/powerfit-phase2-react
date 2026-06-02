import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [sent, setSent] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSent(true);
    e.target.reset();
  }

  return (
    <>
      <Navbar />

      <main className="page-screen">
        <div className="page-header">
          <span className="badge">Contact Us</span>
          <h1>Get In Touch</h1>
          <p>Have a question about memberships, trainers, or programs?</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-box">
              <Mail />
              <div>
                <h3>Email</h3>
                <p>info@powerfit.com</p>
              </div>
            </div>

            <div className="info-box">
              <Phone />
              <div>
                <h3>Phone</h3>
                <p>+961 12 345 678</p>
              </div>
            </div>

            <div className="info-box">
              <MapPin />
              <div>
                <h3>Location</h3>
                <p>Beirut, Lebanon</p>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <textarea placeholder="Your Message" rows="6" required />

            <button className="primary-btn" type="submit">
              <Send size={18} /> Send Message
            </button>

            {sent && <p className="success-msg">Message sent successfully!</p>}
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}