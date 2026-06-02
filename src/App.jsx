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
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />

      <Route
        path="/programs"
        element={
          <ProtectedRoute>
            <Programs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainers"
        element={
          <ProtectedRoute>
            <Trainers />
          </ProtectedRoute>
        }
      />

      <Route
        path="/trainer/:id"
        element={
          <ProtectedRoute>
            <TrainerProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/membership"
        element={
          <ProtectedRoute>
            <Membership />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/contact"
        element={
          <ProtectedRoute>
            <Contact />
          </ProtectedRoute>
        }
      />

      <Route
        path="/workout"
        element={
          <ProtectedRoute>
            <WorkoutGenerator />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}