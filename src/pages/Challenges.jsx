import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Flame, Trophy, Dumbbell, Timer, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const challengesData = [
  {
    id: "30-day",
    title: "30-Day Transformation",
    icon: <Trophy />,
    days: 30,
    difficulty: "Medium",
    description: "Build consistency with daily workouts for 30 days.",
  },
  {
    id: "100-pushups",
    title: "100 Pushups Challenge",
    icon: <Dumbbell />,
    days: 14,
    difficulty: "Hard",
    description: "Increase upper-body strength and endurance.",
  },
  {
    id: "fat-burn",
    title: "Fat Burn Challenge",
    icon: <Flame />,
    days: 21,
    difficulty: "Medium",
    description: "Burn calories with cardio and HIIT workouts.",
  },
  {
    id: "morning-fit",
    title: "Morning Fit Routine",
    icon: <Timer />,
    days: 10,
    difficulty: "Easy",
    description: "Start your day with short energizing workouts.",
  },
];

export default function Challenges() {
  const [joined, setJoined] = useState([]);
  const [loading, setLoading] = useState(true);

  async function fetchChallenges() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("challenges")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      alert(error.message);
    } else {
      setJoined(data || []);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchChallenges();
  }, []);

  function isJoined(challengeId) {
    return joined.some((item) => item.challenge_id === challengeId);
  }

  async function joinChallenge(challenge) {
    if (isJoined(challenge.id)) return;

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    const { error } = await supabase.from("challenges").insert({
      user_id: user.id,
      challenge_id: challenge.id,
      title: challenge.title,
      days: challenge.days,
      completed_days: 0,
      difficulty: challenge.difficulty,
      status: "In Progress",
    });

    if (error) {
      alert(error.message);
      return;
    }

    fetchChallenges();
  }

  async function addProgress(item) {
    const nextDays = Math.min(item.days, item.completed_days + 1);

    const { error } = await supabase
      .from("challenges")
      .update({
        completed_days: nextDays,
        status: nextDays === item.days ? "Completed" : "In Progress",
      })
      .eq("id", item.id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchChallenges();
  }

  async function leaveChallenge(id) {
    const ok = window.confirm("Are you sure you want to leave this challenge?");
    if (!ok) return;

    const { error } = await supabase.from("challenges").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchChallenges();
  }

  return (
    <>
      <Navbar />

      <main className="challenges-page">
        <div className="page-header">
          <span className="badge">Fitness Challenges</span>
          <h1>Join Challenges & Build Discipline</h1>
          <p>
            Choose a challenge, track your progress, and save your fitness
            challenge activity directly inside Supabase.
          </p>
        </div>

        <section className="challenges-grid">
          {challengesData.map((challenge) => (
            <div className="challenge-card" key={challenge.id}>
              <div className="challenge-icon">{challenge.icon}</div>

              <h2>{challenge.title}</h2>
              <p>{challenge.description}</p>

              <div className="challenge-meta">
                <span>{challenge.days} days</span>
                <span>{challenge.difficulty}</span>
              </div>

              <button
                className="primary-btn"
                onClick={() => joinChallenge(challenge)}
                disabled={isJoined(challenge.id)}
              >
                {isJoined(challenge.id) ? (
                  <>
                    <CheckCircle size={18} />
                    Joined
                  </>
                ) : (
                  "Join Challenge"
                )}
              </button>
            </div>
          ))}
        </section>

        <section className="joined-challenges">
          <div className="section-title">
            <span className="badge">My Challenges</span>
            <h2>Challenge Progress</h2>
          </div>

          {loading ? (
            <div className="booking-empty">
              <h3>Loading challenges...</h3>
            </div>
          ) : joined.length === 0 ? (
            <div className="booking-empty">
              <h3>No challenges joined yet</h3>
              <p>Join a challenge above to start tracking progress.</p>
            </div>
          ) : (
            <div className="joined-grid">
              {joined.map((item) => {
                const progress = Math.round(
                  (item.completed_days / item.days) * 100
                );

                return (
                  <div className="joined-card" key={item.id}>
                    <div className="joined-top">
                      <h3>{item.title}</h3>
                      <span>{item.status}</span>
                    </div>

                    <p>
                      {item.completed_days} / {item.days} days completed
                    </p>

                    <div className="challenge-progress-bar">
                      <div
                        className="challenge-progress-fill"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <div className="challenge-actions">
                      <button
                        className="primary-btn"
                        onClick={() => addProgress(item)}
                        disabled={item.status === "Completed"}
                      >
                        {item.status === "Completed"
                          ? "Completed"
                          : "Complete Today"}
                      </button>

                      <button
                        className="danger-btn"
                        onClick={() => leaveChallenge(item.id)}
                      >
                        Leave
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}