import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";

interface DonorProfile {
  id: string;
  firstName: string;
  lastName: string;
  bloodGroup: string;
  county: string;
  town: string;
  lastDonationDate: string | null;
  user: { email: string; phone: string };
}

interface Notification {
  id: string;
  message: string;
  sentAt: string;
  request: {
    bloodGroup: string;
    unitsNeeded: number;
    hospital: { name: string; county: string; town: string };
  };
}

const formatBloodGroup = (bg: string) => bg.replace("_POS", "+").replace("_NEG", "-");

export default function DonorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<DonorProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "notifications" | "edit">("overview");
  const [loading, setLoading] = useState(true);
  const [editForm, setEditForm] = useState({ county: "", town: "" });
  const [editLoading, setEditLoading] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, notifRes] = await Promise.all([
        api.get("/donors/me"),
        api.get("/notifications/mine"),
      ]);
      setProfile(profileRes.data);
      setNotifications(notifRes.data);
      setEditForm({
        county: profileRes.data.county,
        town: profileRes.data.town,
      });
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const res = await api.patch("/donors/me", editForm);
      setProfile((prev) => prev ? { ...prev, ...res.data } : prev);
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 3000);
    } catch {
      // handle error
    } finally {
      setEditLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-4xl animate-pulse">🩸</span>
          <p className="font-body text-gray-500 mt-3">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-body bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {/* Welcome header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Welcome back, {profile?.firstName}! 👋
          </h1>
          <p className="font-body text-gray-500 mt-1">
            Your blood group:{" "}
            <span className="inline-block bg-red-100 text-red-700 font-bold px-3 py-0.5 rounded-full text-sm">
              {formatBloodGroup(profile?.bloodGroup || "")}
            </span>
          </p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Blood Group", value: formatBloodGroup(profile?.bloodGroup || ""), icon: "🩸" },
            { label: "Location", value: `${profile?.town}, ${profile?.county}`, icon: "📍" },
            {
              label: "Last Donation",
              value: profile?.lastDonationDate
                ? new Date(profile.lastDonationDate).toLocaleDateString()
                : "Not recorded",
              icon: "📅",
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display text-lg font-bold text-gray-900">{stat.value}</div>
              <div className="font-body text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-6 w-fit">
          {(["overview", "notifications", "edit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === t
                  ? "bg-red-700 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "notifications" ? `Notifications (${notifications.length})` : t}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Profile Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "First Name", value: profile?.firstName },
                { label: "Last Name", value: profile?.lastName },
                { label: "Email", value: profile?.user.email },
                { label: "Phone", value: profile?.user.phone },
                { label: "Blood Group", value: formatBloodGroup(profile?.bloodGroup || "") },
                { label: "County", value: profile?.county },
                { label: "Town", value: profile?.town },
                {
                  label: "Last Donation",
                  value: profile?.lastDonationDate
                    ? new Date(profile.lastDonationDate).toLocaleDateString()
                    : "Not recorded",
                },
              ].map((item) => (
                <div key={item.label}>
                  <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                    {item.label}
                  </div>
                  <div className="font-body text-gray-900 font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === "notifications" && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <span className="text-4xl">📭</span>
                <p className="font-body text-gray-500 mt-3">No notifications yet.</p>
                <p className="font-body text-gray-400 text-sm mt-1">
                  You'll be notified when a hospital needs your blood type.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div key={n.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full">
                          {formatBloodGroup(n.request.bloodGroup)}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {n.request.hospital.name} — {n.request.hospital.town},{" "}
                          {n.request.hospital.county}
                        </span>
                      </div>
                      <p className="font-body text-gray-700 text-sm">{n.message}</p>
                    </div>
                    <div className="text-xs text-gray-400 whitespace-nowrap">
                      {new Date(n.sentAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Edit tab */}
        {activeTab === "edit" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Update Location</h2>

            {editSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6">
                Profile updated successfully!
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">County</label>
                <input
                  value={editForm.county}
                  onChange={(e) => setEditForm({ ...editForm, county: e.target.value })}
                  placeholder="Nairobi"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Town</label>
                <input
                  value={editForm.town}
                  onChange={(e) => setEditForm({ ...editForm, town: e.target.value })}
                  placeholder="Westlands"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                />
              </div>
              <Button type="submit" variant="primary" size="md" disabled={editLoading}>
                {editLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}