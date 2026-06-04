import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { PlusCircle, Trash2, ShieldCheck, Star } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function ManageTrainers() {
  const [allowed, setAllowed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: "",
    specialty: "",
    experience: "",
    bio: "",
    image_url: "",
    price: "",
    rating: "4.8",
  });

  async function checkAdmin() {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) return false;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    return profile?.role === "admin";
  }

  async function fetchTrainers() {
    setLoading(true);

    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      setAllowed(false);
      setLoading(false);
      return;
    }

    setAllowed(true);

    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) alert(error.message);
    else setTrainers(data || []);

    setLoading(false);
  }

  async function addTrainer(e) {
    e.preventDefault();

    if (!form.name || !form.specialty || !form.experience) {
      alert("Please fill name, specialty, and experience.");
      return;
    }

    setSaving(true);

    const { error } = await supabase.from("trainers").insert({
      name: form.name,
      specialty: form.specialty,
      experience: form.experience,
      bio: form.bio,
      image_url: form.image_url,
      price: form.price ? Number(form.price) : 25,
      rating: form.rating ? Number(form.rating) : 4.8,
    });

    if (error) {
      alert(error.message);
      setSaving(false);
      return;
    }

    setForm({
      name: "",
      specialty: "",
      experience: "",
      bio: "",
      image_url: "",
      price: "",
      rating: "4.8",
    });

    setSaving(false);
    fetchTrainers();
  }

  async function deleteTrainer(id) {
    const ok = window.confirm("Delete this trainer?");
    if (!ok) return;

    const { error } = await supabase.from("trainers").delete().eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    fetchTrainers();
  }

  useEffect(() => {
    fetchTrainers();
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="admin-gym-page">
          <div className="page-header">
            <span className="badge">Loading</span>
            <h1>Loading Trainers...</h1>
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
            <p>You are not allowed to manage trainers.</p>
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
          <span className="badge">Trainer Management</span>
          <h1>Manage PowerFit Trainers</h1>
          <p>Add, view, and remove trainers directly from Supabase.</p>
        </div>

        <section className="trainer-admin-layout">
          <form className="trainer-admin-form" onSubmit={addTrainer}>
            <PlusCircle size={46} />
            <h2>Add New Trainer</h2>

            <input
              placeholder="Trainer Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Specialty"
              value={form.specialty}
              onChange={(e) =>
                setForm({ ...form, specialty: e.target.value })
              }
            />

            <input
              placeholder="Experience e.g. 6 years"
              value={form.experience}
              onChange={(e) =>
                setForm({ ...form, experience: e.target.value })
              }
            />

            <input
              placeholder="Image URL"
              value={form.image_url}
              onChange={(e) =>
                setForm({ ...form, image_url: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Session Price $"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />

            <input
              type="number"
              step="0.1"
              placeholder="Rating"
              value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })}
            />

            <textarea
              placeholder="Trainer Bio"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
            />

            <button className="primary-btn" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Add Trainer"}
            </button>
          </form>

          <div className="trainer-admin-list">
            {trainers.length === 0 ? (
              <div className="booking-empty">
                <h3>No trainers yet</h3>
                <p>Add your first trainer from the form.</p>
              </div>
            ) : (
              trainers.map((trainer) => (
                <div className="trainer-admin-card" key={trainer.id}>
                  <img
                    src={
                      trainer.image_url ||
                      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b"
                    }
                    alt={trainer.name}
                  />

                  <div>
                    <h3>{trainer.name}</h3>
                    <p>{trainer.specialty}</p>
                    <span>{trainer.experience}</span>

                    <div className="trainer-admin-meta">
                      <span>
                        <Star size={15} />
                        {trainer.rating}
                      </span>
                      <span>${trainer.price}/session</span>
                      <span>
                        <ShieldCheck size={15} />
                        Active
                      </span>
                    </div>

                    <p className="trainer-bio">{trainer.bio}</p>

                    <button
                      className="danger-btn"
                      onClick={() => deleteTrainer(trainer.id)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}