import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  ShieldCheck,
  Users,
  CalendarCheck,
  Dumbbell,
  Trophy,
  Apple,
  Flame,
  Clock,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);

  const [profiles, setProfiles] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [nutritionPlans, setNutritionPlans] = useState([]);
  const [dailyProgress, setDailyProgress] = useState([]);

  async function checkAdminAndLoadData() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "admin") {
      setAllowed(false);
      setLoading(false);
      return;
    }

    setAllowed(true);

    const { data: profilesData } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: workoutsData } = await supabase
      .from("workout_history")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: challengesData } = await supabase
      .from("challenges")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: nutritionData } = await supabase
      .from("nutrition_plans")
      .select("*")
      .order("created_at", { ascending: false });

    const { data: progressData } = await supabase
      .from("daily_progress")
      .select("*")
      .order("created_at", { ascending: false });

    setProfiles(profilesData || []);
    setBookings(bookingsData || []);
    setWorkouts(workoutsData || []);
    setChallenges(challengesData || []);
    setNutritionPlans(nutritionData || []);
    setDailyProgress(progressData || []);

    setLoading(false);
  }

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const stats = useMemo(() => {
    const totalCalories = workouts.reduce(
      (sum, item) => sum + Number(item.calories || 0),
      0
    );

    const totalDuration = workouts.reduce(
      (sum, item) => sum + Number(item.duration || 0),
      0
    );

    const completedChallenges = challenges.filter(
      (item) => item.status === "Completed"
    ).length;

    const activeMembers = profiles.filter(
      (item) => item.role === "member"
    ).length;

    return {
      members: activeMembers,
      bookings: bookings.length,
      workouts: workouts.length,
      calories: totalCalories,
      duration: totalDuration,
      challenges: challenges.length,
      completedChallenges,
      nutrition: nutritionPlans.length,
    };
  }, [profiles, bookings, workouts, challenges, nutritionPlans]);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="admin-gym-page">
          <div className="page-header">
            <span className="badge">Loading</span>
            <h1>Loading Admin Dashboard...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!allowed) {
    return (
      <>
        <Navbar />
        <main className="admin-gym-page">
          <div className="page-header">
            <span className="badge">Access Denied</span>
            <h1>Admin Only</h1>
            <p>You are not allowed to access this page.</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="admin-gym-page">
        <div className="page-header">
          <span className="badge">Gym Admin</span>
          <h1>PowerFit Supabase Control Center</h1>
          <p>
            Monitor members, bookings, workouts, nutrition plans, challenges,
            and progress directly from Supabase.
          </p>
        </div>

        <section className="admin-gym-grid">
          <div className="admin-gym-card">
            <Users />
            <h3>{stats.members}</h3>
            <p>Members</p>
          </div>

          <div className="admin-gym-card">
            <CalendarCheck />
            <h3>{stats.bookings}</h3>
            <p>Total Bookings</p>
          </div>

          <div className="admin-gym-card">
            <Dumbbell />
            <h3>{stats.workouts}</h3>
            <p>Logged Workouts</p>
          </div>

          <div className="admin-gym-card">
            <Flame />
            <h3>{stats.calories}</h3>
            <p>Total Calories</p>
          </div>

          <div className="admin-gym-card">
            <Clock />
            <h3>{stats.duration} min</h3>
            <p>Total Training Time</p>
          </div>

          <div className="admin-gym-card">
            <Trophy />
            <h3>
              {stats.completedChallenges}/{stats.challenges}
            </h3>
            <p>Completed Challenges</p>
          </div>

          <div className="admin-gym-card">
            <Apple />
            <h3>{stats.nutrition}</h3>
            <p>Nutrition Plans</p>
          </div>

          <div className="admin-gym-card">
            <ShieldCheck />
            <h3>Secure</h3>
            <p>Admin Role Active</p>
          </div>
        </section>

        <section className="admin-panels">
          <div className="admin-panel">
            <h2>Members</h2>

            {profiles.length === 0 ? (
              <p className="empty-admin">No members found.</p>
            ) : (
              <div className="admin-table-lite">
                {profiles.map((profile) => (
                  <div className="admin-lite-row" key={profile.id}>
                    <span>{profile.full_name || "No name"}</span>
                    <span>{profile.email}</span>
                    <span>{profile.role}</span>
                    <span>{profile.membership || "Basic"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Bookings</h2>

            {bookings.length === 0 ? (
              <p className="empty-admin">No bookings found.</p>
            ) : (
              <div className="admin-table-lite">
                {bookings.map((booking) => (
                  <div className="admin-lite-row" key={booking.id}>
                    <span>{booking.trainer}</span>
                    <span>{booking.session_date}</span>
                    <span>{booking.session_time}</span>
                    <span>{booking.goal}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Workout History</h2>

            {workouts.length === 0 ? (
              <p className="empty-admin">No workouts logged yet.</p>
            ) : (
              <div className="admin-table-lite">
                {workouts.map((workout) => (
                  <div className="admin-lite-row" key={workout.id}>
                    <span>{workout.workout_type}</span>
                    <span>{workout.duration} min</span>
                    <span>{workout.calories} kcal</span>
                    <span>{workout.workout_date}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Challenges</h2>

            {challenges.length === 0 ? (
              <p className="empty-admin">No challenges found.</p>
            ) : (
              <div className="admin-table-lite">
                {challenges.map((challenge) => (
                  <div className="admin-lite-row" key={challenge.id}>
                    <span>{challenge.title}</span>
                    <span>
                      {challenge.completed_days}/{challenge.days} days
                    </span>
                    <span>{challenge.status}</span>
                    <span>{challenge.difficulty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Nutrition Plans</h2>

            {nutritionPlans.length === 0 ? (
              <p className="empty-admin">No nutrition plans found.</p>
            ) : (
              <div className="admin-table-lite">
                {nutritionPlans.map((plan) => (
                  <div className="admin-lite-row" key={plan.id}>
                    <span>{plan.title}</span>
                    <span>{plan.calories} kcal</span>
                    <span>{plan.protein}g protein</span>
                    <span>{plan.goal}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="admin-panel">
            <h2>Daily Progress</h2>

            {dailyProgress.length === 0 ? (
              <p className="empty-admin">No daily progress found.</p>
            ) : (
              <div className="admin-table-lite">
                {dailyProgress.map((item) => (
                  <div className="admin-lite-row" key={item.id}>
                    <span>{item.progress_date}</span>
                    <span>{item.water} water</span>
                    <span>{item.calories} kcal</span>
                    <span>{item.workouts} workouts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}