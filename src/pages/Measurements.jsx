import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Scale, Ruler, Activity, Trash2 } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { supabase } from "../lib/supabaseClient";

export default function Measurements() {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    weight: "",
    body_fat: "",
    chest: "",
    waist: "",
    arms: "",
    shoulders: "",
    measurement_date: "",
  });

  async function fetchMeasurements() {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("body_measurements")
      .select("*")
      .eq("user_id", user.id)
      .order("measurement_date", { ascending: true });

    if (error) {
      alert(error.message);
    } else {
      setMeasurements(data || []);
    }

    setLoading(false);
  }

  async function addMeasurement(e) {
    e.preventDefault();

    if (!form.weight && !form.body_fat && !form.chest && !form.waist) {
      alert("Please enter at least one measurement.");
      return;
    }

    setSaving(true);

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      alert("You must be logged in.");
      setSaving(false);
      return;
    }

    const { error } = await supabase.from("body_measurements").insert({
      user_id: user.id,
      weight: form.weight ? Number(form.weight) : null,
      body_fat: form.body_fat ? Number(form.body_fat) : null,
      chest: form.chest ? Number(form.chest) : null,
      waist: form.waist ? Number(form.waist) : null,
      arms: form.arms ? Number(form.arms) : null,
      shoulders: form.shoulders ? Number(form.shoulders) : null,
      measurement_date:
        form.measurement_date || new Date().toISOString().slice(0, 10),
    });

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setForm({
      weight: "",
      body_fat: "",
      chest: "",
      waist: "",
      arms: "",
      shoulders: "",
      measurement_date: "",
    });

    setSaving(false);
    fetchMeasurements();
  }

  async function deleteMeasurement(id) {
    const ok = window.confirm("Delete this measurement?");
    if (!ok) return;

    const { error } = await supabase
      .from("body_measurements")
      .delete()
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchMeasurements();
  }

  useEffect(() => {
    fetchMeasurements();
  }, []);

  const latest = measurements[measurements.length - 1];

  return (
    <>
      <Navbar />

      <main className="measurements-page">
        <div className="page-header">
          <span className="badge">Body Progress</span>
          <h1>Body Measurements Tracker</h1>
          <p>
            Track weight, body fat, waist, chest, arms, and shoulders directly
            inside Supabase.
          </p>
        </div>

        <section className="measurements-stats">
          <div className="measurement-stat">
            <Scale />
            <h3>{latest?.weight || 0} kg</h3>
            <p>Latest Weight</p>
          </div>

          <div className="measurement-stat">
            <Activity />
            <h3>{latest?.body_fat || 0}%</h3>
            <p>Body Fat</p>
          </div>

          <div className="measurement-stat">
            <Ruler />
            <h3>{latest?.waist || 0} cm</h3>
            <p>Waist</p>
          </div>
        </section>

        <section className="measurements-layout">
          <form className="measurements-form" onSubmit={addMeasurement}>
            <Ruler size={46} />
            <h2>Add Measurement</h2>

            <input
              type="number"
              placeholder="Weight kg"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />

            <input
              type="number"
              placeholder="Body Fat %"
              value={form.body_fat}
              onChange={(e) => setForm({ ...form, body_fat: e.target.value })}
            />

            <input
              type="number"
              placeholder="Chest cm"
              value={form.chest}
              onChange={(e) => setForm({ ...form, chest: e.target.value })}
            />

            <input
              type="number"
              placeholder="Waist cm"
              value={form.waist}
              onChange={(e) => setForm({ ...form, waist: e.target.value })}
            />

            <input
              type="number"
              placeholder="Arms cm"
              value={form.arms}
              onChange={(e) => setForm({ ...form, arms: e.target.value })}
            />

            <input
              type="number"
              placeholder="Shoulders cm"
              value={form.shoulders}
              onChange={(e) =>
                setForm({ ...form, shoulders: e.target.value })
              }
            />

            <input
              type="date"
              value={form.measurement_date}
              onChange={(e) =>
                setForm({ ...form, measurement_date: e.target.value })
              }
            />

            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Measurement"}
            </button>
          </form>

          <div className="measurements-chart-card">
            <h2>Progress Chart</h2>
            <p>Weight and waist progress over time.</p>

            {measurements.length === 0 ? (
              <div className="booking-empty">
                <h3>No measurements yet</h3>
                <p>Add your first measurement to see the chart.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={330}>
                <LineChart data={measurements}>
                  <XAxis dataKey="measurement_date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#22d3ee"
                    strokeWidth={3}
                  />
                  <Line
                    type="monotone"
                    dataKey="waist"
                    stroke="#a855f7"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </section>

        <section className="measurements-history">
          <div className="section-title">
            <span className="badge">History</span>
            <h2>Measurement Records</h2>
          </div>

          {loading ? (
            <div className="booking-empty">
              <h3>Loading measurements...</h3>
            </div>
          ) : measurements.length === 0 ? (
            <div className="booking-empty">
              <h3>No records yet</h3>
              <p>Your body progress records will appear here.</p>
            </div>
          ) : (
            <div className="measurements-records">
              {measurements
                .slice()
                .reverse()
                .map((item) => (
                  <div className="measurement-record" key={item.id}>
                    <h3>{item.measurement_date}</h3>

                    <p>Weight: {item.weight || "-"} kg</p>
                    <p>Body Fat: {item.body_fat || "-"}%</p>
                    <p>Chest: {item.chest || "-"} cm</p>
                    <p>Waist: {item.waist || "-"} cm</p>
                    <p>Arms: {item.arms || "-"} cm</p>
                    <p>Shoulders: {item.shoulders || "-"} cm</p>

                    <button
                      className="danger-btn"
                      onClick={() => deleteMeasurement(item.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}