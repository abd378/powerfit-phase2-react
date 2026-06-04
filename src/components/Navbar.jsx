import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Dumbbell,
  UserCircle,
  ChevronDown,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("");

  function closeMenu() {
    setOpen(false);
  }

  async function loadUserAndRole() {
    const { data } = await supabase.auth.getUser();
    const currentUser = data.user;

    setUser(currentUser);

    if (!currentUser) {
      setRole("");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", currentUser.id)
      .single();

    setRole(profile?.role || "");
  }

  useEffect(() => {
    loadUserAndRole();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      loadUserAndRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setRole("");
    closeMenu();
    navigate("/auth");
  }

  return (
    <header className="navbar">
      <Link to="/" className="logo" onClick={closeMenu}>
        <Dumbbell size={28} />
        <span>PowerFit</span>
      </Link>

      <nav className="nav-links">
        <NavLink to="/" onClick={closeMenu}>
          Home
        </NavLink>

        {user && (
          <>
            <NavLink to="/programs" onClick={closeMenu}>
              Programs
            </NavLink>

            <NavLink to="/trainers" onClick={closeMenu}>
              Trainers
            </NavLink>

            <div className="nav-dropdown">
              <button
                type="button"
                className="dropdown-btn"
                onClick={() => setOpen(!open)}
              >
                More
                <ChevronDown size={16} />
              </button>

              {open && (
                <div className="dropdown-menu">
                  <NavLink to="/membership" onClick={closeMenu}>
                    Membership
                  </NavLink>

                  <NavLink to="/dashboard" onClick={closeMenu}>
                    Dashboard
                  </NavLink>

                  <NavLink to="/profile" onClick={closeMenu}>
                    Profile
                  </NavLink>

                  <NavLink to="/measurements" onClick={closeMenu}>
                    Measurements
                  </NavLink>

                  <NavLink to="/booking" onClick={closeMenu}>
                    Booking
                  </NavLink>

                  <NavLink to="/attendance" onClick={closeMenu}>
                    Attendance
                  </NavLink>

                  <NavLink to="/nutrition" onClick={closeMenu}>
                    Nutrition
                  </NavLink>

                  <NavLink to="/challenges" onClick={closeMenu}>
                    Challenges
                  </NavLink>

                  <NavLink to="/history" onClick={closeMenu}>
                    Workout History
                  </NavLink>

                  <NavLink to="/workout" onClick={closeMenu}>
                    Workout Generator
                  </NavLink>

                  <NavLink to="/contact" onClick={closeMenu}>
                    Contact
                  </NavLink>

                  {role === "admin" && (
                    <>
                      <NavLink to="/admin" onClick={closeMenu}>
                        <ShieldCheck size={16} />
                        Admin Dashboard
                      </NavLink>

                      <NavLink to="/manage-trainers" onClick={closeMenu}>
                        Manage Trainers
                      </NavLink>
                    </>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        {!user ? (
          <Link to="/auth" className="nav-btn" onClick={closeMenu}>
            Join Now
          </Link>
        ) : (
          <>
            <Link to="/profile" className="profile-nav-btn" onClick={closeMenu}>
              <UserCircle size={22} />
            </Link>

            <button className="logout-nav-btn" onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}