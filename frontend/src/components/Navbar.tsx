import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDashboard = () => {
    if (user?.role === "DONOR") navigate("/donor/dashboard");
    if (user?.role === "HOSPITAL") navigate("/hospital/dashboard");
  };

  return (
    <nav className="font-body flex items-center justify-between px-8 py-5 border-b border-red-50 sticky top-0 bg-white/90 backdrop-blur-sm z-50">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <span className="text-2xl">🩸</span>
        <span className="font-display text-xl font-bold text-red-800">HemoLink</span>
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <button
              onClick={handleDashboard}
              className="font-body text-sm text-gray-600 hover:text-red-700 transition-colors"
            >
              Dashboard
            </button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Sign Out
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button variant="primary" size="sm" onClick={() => navigate("/register")}>
              Get Started
            </Button>
          </>
        )}
      </div>
    </nav>
  );
}