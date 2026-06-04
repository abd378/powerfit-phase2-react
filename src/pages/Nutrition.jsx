import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Apple, Beef, Flame, Salad, CheckCircle } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const plans = [
  {
    id: "weight-loss",
    title: "Weight Loss",
    icon: <Salad />,
    calories: 1800,
    protein: 120,
    goal: "Burn fat while keeping muscle.",
    meals: [
      "Breakfast: Oats + Greek yogurt + berries",
      "Lunch: Grilled chicken salad + rice",
      "Snack: Apple + peanut butter",
      "Dinner: Salmon + vegetables",
    ],
  },
  {
    id: "muscle-gain",
    title: "Muscle Gain",
    icon: <Beef />,
    calories: 2800,
    protein: 180,
    goal: "Build muscle and increase strength.",
    meals: [
      "Breakfast: Eggs + oats + banana",
      "Lunch: Chicken breast + rice + avocado",
      "Snack: Protein shake + nuts",
      "Dinner: Steak + potatoes + vegetables",
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance",
    icon: <Apple />,
    calories: 2300,
    protein: 150,
    goal: "Stay fit and maintain body composition.",
    meals: [
      "Breakfast: Eggs + whole wheat toast",
      "Lunch: Turkey wrap + salad",
      "Snack: Yogurt + almonds",
      "Dinner: Chicken + pasta + vegetables",
    ],
  },
];

export default function Nutrition() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingPlanId, setSavingPlanId] = useState("");

  async function fetchSelectedPlan() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("nutrition_plans")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (data) {
      setSelectedPlan({
        id: data.plan_id,
        title: data.title,
        calories: data.calories,
        protein: data.protein,
        goal: data.goal,
      });
    } else {
      setSelectedPlan(null);
    }

    setLoading(false);
  }

  async function choosePlan(plan) {
    setSavingPlanId(plan.id);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("You must be logged in.");
      setSavingPlanId("");
      return;
    }

    await supabase
      .from("nutrition_plans")
      .delete()
      .eq("user_id", user.id);

    const { error } = await supabase.from("nutrition_plans").insert({
      user_id: user.id,
      plan_id: plan.id,
      title: plan.title,
      calories: plan.calories,
      protein: plan.protein,
      goal: plan.goal,
    });

    if (error) {
      alert(error.message);
      setSavingPlanId("");
      return;
    }

    setSelectedPlan(plan);
    setSavingPlanId("");
    alert("Nutrition plan saved successfully!");
  }

  useEffect(() => {
    fetchSelectedPlan();
  }, []);

  function isSelected(planId) {
    return selectedPlan?.id === planId;
  }

  return (
    <>
      <Navbar />

      <main className="nutrition-page">
        <div className="page-header">
          <span className="badge">Nutrition System</span>
          <h1>Choose Your Smart Meal Plan</h1>
          <p>
            Select a nutrition plan based on your goal. Your selected plan is
            saved securely inside Supabase.
          </p>
        </div>

        {loading ? (
          <div className="booking-empty">
            <h3>Loading nutrition plan...</h3>
          </div>
        ) : (
          <>
            <section className="nutrition-grid">
              {plans.map((plan) => (
                <div
                  className={
                    isSelected(plan.id)
                      ? "nutrition-card selected-plan"
                      : "nutrition-card"
                  }
                  key={plan.id}
                >
                  <div className="nutrition-icon">{plan.icon}</div>

                  <h2>{plan.title}</h2>
                  <p>{plan.goal}</p>

                  <div className="nutrition-stats">
                    <span>
                      <Flame size={17} />
                      {plan.calories} kcal/day
                    </span>

                    <span>
                      <Beef size={17} />
                      {plan.protein}g protein/day
                    </span>
                  </div>

                  <ul>
                    {plan.meals.map((meal) => (
                      <li key={meal}>{meal}</li>
                    ))}
                  </ul>

                  <button
                    className="primary-btn"
                    onClick={() => choosePlan(plan)}
                    disabled={savingPlanId === plan.id}
                  >
                    {savingPlanId === plan.id ? (
                      "Saving..."
                    ) : isSelected(plan.id) ? (
                      <>
                        <CheckCircle size={18} />
                        Selected
                      </>
                    ) : (
                      "Choose Plan"
                    )}
                  </button>
                </div>
              ))}
            </section>

            <section className="selected-nutrition-panel">
              <h2>Current Selected Plan</h2>

              {selectedPlan ? (
                <div className="selected-plan-box">
                  <div>
                    <h3>{selectedPlan.title}</h3>
                    <p>{selectedPlan.goal}</p>
                  </div>

                  <div>
                    <strong>{selectedPlan.calories}</strong>
                    <span>Calories</span>
                  </div>

                  <div>
                    <strong>{selectedPlan.protein}g</strong>
                    <span>Protein</span>
                  </div>
                </div>
              ) : (
                <p className="empty-admin">
                  No nutrition plan selected yet.
                </p>
              )}
            </section>
          </>
        )}
      </main>

      <Footer />
    </>
  );
}