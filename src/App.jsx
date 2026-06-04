import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Programs from "./pages/Programs";
import Trainers from "./pages/Trainers";
import Membership from "./pages/Membership";
import Dashboard from "./pages/Dashboard";
import Contact from "./pages/Contact";
import TrainerProfile from "./pages/TrainerProfile";
import WorkoutGenerator from "./pages/WorkoutGenerator";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import Nutrition from "./pages/Nutrition";
import Challenges from "./pages/Challenges";
import WorkoutHistory from "./pages/WorkoutHistory";
import AdminDashboard from "./pages/AdminDashboard";
import ManageTrainers from "./pages/ManageTrainers";
import Attendance from "./pages/Attendance";
import ProtectedRoute from "./components/ProtectedRoute";
import Measurements from "./pages/Measurements";


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/programs" element={<ProtectedRoute><Programs /></ProtectedRoute>} />
      <Route path="/trainers" element={<ProtectedRoute><Trainers /></ProtectedRoute>} />
      <Route path="/trainer/:id" element={<ProtectedRoute><TrainerProfile /></ProtectedRoute>} />
      <Route path="/membership" element={<ProtectedRoute><Membership /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />
      <Route path="/nutrition" element={<ProtectedRoute><Nutrition /></ProtectedRoute>} />
      <Route path="/challenges" element={<ProtectedRoute><Challenges /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><WorkoutHistory /></ProtectedRoute>} />
      <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/manage-trainers" element={<ProtectedRoute><ManageTrainers /></ProtectedRoute>} />
      <Route path="/contact" element={<ProtectedRoute><Contact /></ProtectedRoute>} />
      <Route path="/workout" element={<ProtectedRoute><WorkoutGenerator /></ProtectedRoute>} />
      <Route path="/measurements" element={<ProtectedRoute><Measurements /></ProtectedRoute>}/>
    </Routes>
  );
}