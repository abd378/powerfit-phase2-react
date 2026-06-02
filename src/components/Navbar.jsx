import { Link, NavLink } from "react-router-dom";
import { Dumbbell } from "lucide-react";

export default function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <Dumbbell size={28} />
        <span>PowerFit</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/programs">Programs</NavLink>
        <NavLink to="/trainers">Trainers</NavLink>
        <NavLink to="/membership">Membership</NavLink>
        <Link to="/auth" className="nav-btn">Join Now</Link>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/contact">Contact</NavLink>
        <NavLink to="/workout">Workout</NavLink>
      </nav>
    </header>
  );
}