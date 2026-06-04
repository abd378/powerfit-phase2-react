import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  User,
  Scale,
  Ruler,
  Target,
  Activity,
  Trophy,
  Save,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    age: "",
    height: "",
    weight: "",
    goal: "Build Muscle",
    membership: "Basic",
  });

  async function fetchProfile() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    setProfile({
      full_name: data.full_name || "",
      email: data.email || user.email,
      age: data.age || "",
      height: data.height || "",
      weight: data.weight || "",
      goal: data.goal || "Build Muscle",
      membership: data.membership || "Basic",
    });

    setLoading(false);
  }

  async function updateProfile(e) {
    e.preventDefault();
    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("You must be logged in.");
      setSaving(false);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        age: profile.age ? Number(profile.age) : null,
        height: profile.height ? Number(profile.height) : null,
        weight: profile.weight ? Number(profile.weight) : null,
        goal: profile.goal,
        membership: profile.membership,
      })
      .eq("id", user.id);

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    alert("Profile updated successfully!");
    setSaving(false);
    fetchProfile();
  }

  useEffect(() => {
    fetchProfile();
  }, []);

  const heightM = Number(profile.height) / 100;

  const bmi =
    profile.height && profile.weight
      ? (Number(profile.weight) / (heightM * heightM)).toFixed(1)
      : "0";

  function bmiStatus() {
    const bmiNumber = Number(bmi);

    if (!bmiNumber) return "Not calculated";
    if (bmiNumber < 18.5) return "Underweight";
    if (bmiNumber < 25) return "Healthy";
    if (bmiNumber < 30) return "Overweight";
    return "High";
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="profile-page">
          <div className="page-header">
            <span className="badge">Loading</span>
            <h1>Loading Profile...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="profile-page">
        <div className="page-header">
          <span className="badge">PowerFit Profile</span>
          <h1>Your Fitness Identity</h1>
          <p>
            Manage your real profile data directly from Supabase.
          </p>
        </div>

        <section className="profile-layout">
          <form className="profile-card" onSubmit={updateProfile}>
            <div className="profile-avatar">
              <User size={54} />
            </div>

            <h2>Member Profile</h2>

            <input
              placeholder="Full Name"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  full_name: e.target.value,
                })
              }
            />

            <input
              disabled
              placeholder="Email"
              value={profile.email}
            />

            <input
              type="number"
              placeholder="Age"
              value={profile.age}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  age: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Height in cm"
              value={profile.height}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  height: e.target.value,
                })
              }
            />

            <input
              type="number"
              placeholder="Weight in kg"
              value={profile.weight}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  weight: e.target.value,
                })
              }
            />

            <select
              value={profile.goal}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  goal: e.target.value,
                })
              }
            >
              <option>Build Muscle</option>
              <option>Lose Weight</option>
              <option>Improve Fitness</option>
              <option>Stay Healthy</option>
            </select>

            <select
              value={profile.membership}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  membership: e.target.value,
                })
              }
            >
              <option>Basic</option>
              <option>Premium</option>
              <option>Elite</option>
            </select>

            <button className="primary-btn" type="submit" disabled={saving}>
              <Save size={18} />
              {saving ? "Saving..." : "Save Profile"}
            </button>
          </form>

          <div className="profile-info">
            <div className="profile-stats-grid">
              <div className="profile-stat">
                <Scale />
                <h3>{profile.weight || 0} kg</h3>
                <p>Current Weight</p>
              </div>

              <div className="profile-stat">
                <Ruler />
                <h3>{profile.height || 0} cm</h3>
                <p>Height</p>
              </div>

              <div className="profile-stat">
                <Activity />
                <h3>{bmi}</h3>
                <p>BMI - {bmiStatus()}</p>
              </div>

              <div className="profile-stat">
                <Target />
                <h3>{profile.goal}</h3>
                <p>Main Goal</p>
              </div>

              <div className="profile-stat">
                <Trophy />
                <h3>{profile.membership}</h3>
                <p>Membership</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}