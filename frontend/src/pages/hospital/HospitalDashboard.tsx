import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";

interface HospitalProfile {
  id: string;
  name: string;
  county: string;
  town: string;
  phone: string;
  user: { email: string; phone: string };
}

interface DonationRequest {
  id: string;
  bloodGroup: string;
  unitsNeeded: number;
  status: "ACTIVE" | "FULFILLED" | "CANCELLED";
  county: string;
  town: string;
  createdAt: string;
}

const BLOOD_GROUPS = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];
const formatBloodGroup = (bg: string) => bg.replace("_POS", "+").replace("_NEG", "-");

const statusColors = {
  ACTIVE: "bg-green-100 text-green-700",
  FULFILLED: "bg-blue-100 text-blue-700",
  CANCELLED: "bg-gray-100 text-gray-500",
};

export default function HospitalDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<HospitalProfile | null>(null);
  const [requests, setRequests] = useState<DonationRequest[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "requests" | "new">("overview");
  const [loading, setLoading] = useState(true);
  const [broadcastLoading, setBroadcastLoading] = useState<string | null>(null);
  const [broadcastResult, setBroadcastResult] = useState<{ id: string; sent: number } | null>(null);

  const [newRequest, setNewRequest] = useState({
    bloodGroup: "A_POS",
    unitsNeeded: 1,
    county: "",
    town: "",
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, requestsRes] = await Promise.all([
        api.get("/hospitals/me"),
        api.get("/requests/mine"),
      ]);
      setProfile(profileRes.data);
      setRequests(requestsRes.data);
      setNewRequest((prev) => ({
        ...prev,
        county: profileRes.data.county,
        town: profileRes.data.town,
      }));
    } catch {
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setRequestLoading(true);
    try {
      const res = await api.post("/requests", {
        ...newRequest,
        unitsNeeded: Number(newRequest.unitsNeeded),
      });
      setRequests((prev) => [res.data, ...prev]);
      setRequestSuccess(true);
      setTimeout(() => { setRequestSuccess(false); setActiveTab("requests"); }, 2000);
    } catch {
      // handle error
    } finally {
      setRequestLoading(false);
    }
  };

  const handleStatusChange = async (requestId: string, status: string) => {
    try {
      const res = await api.patch(`/requests/${requestId}/status`, { status });
      setRequests((prev) => prev.map((r) => r.id === requestId ? { ...r, status: res.data.status } : r));
    } catch {
      // handle error
    }
  };

  const handleBroadcast = async (requestId: string) => {
    setBroadcastLoading(requestId);
    try {
      const res = await api.post(`/notifications/broadcast/${requestId}`);
      setBroadcastResult({ id: requestId, sent: res.data.sent });
      setTimeout(() => setBroadcastResult(null), 4000);
    } catch {
      // handle error
    } finally {
      setBroadcastLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <span className="text-4xl animate-pulse">🏥</span>
          <p className="font-body text-gray-500 mt-3">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const activeRequests = requests.filter((r) => r.status === "ACTIVE").length;
  const fulfilledRequests = requests.filter((r) => r.status === "FULFILLED").length;

  return (
    <div className="min-h-screen flex flex-col font-body bg-gray-50">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            {profile?.name} 🏥
          </h1>
          <p className="font-body text-gray-500 mt-1">
            {profile?.town}, {profile?.county}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Requests", value: requests.length, icon: "📋" },
            { label: "Active Requests", value: activeRequests, icon: "🔴" },
            { label: "Fulfilled", value: fulfilledRequests, icon: "✅" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="font-display text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="font-body text-gray-500 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-6 w-fit">
          {(["overview", "requests", "new"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-5 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === t
                  ? "bg-red-700 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t === "new" ? "+ New Request" : t === "requests" ? `Requests (${requests.length})` : t}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Hospital Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { label: "Hospital Name", value: profile?.name },
                { label: "Email", value: profile?.user.email },
                { label: "Account Phone", value: profile?.user.phone },
                { label: "Hospital Phone", value: profile?.phone },
                { label: "County", value: profile?.county },
                { label: "Town", value: profile?.town },
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

        {/* Requests tab */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <span className="text-4xl">📋</span>
                <p className="font-body text-gray-500 mt-3">No requests yet.</p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => setActiveTab("new")}
                  className="mt-4"
                >
                  Create First Request
                </Button>
              </div>
            ) : (
              requests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="bg-red-100 text-red-700 font-bold text-sm px-3 py-0.5 rounded-full">
                          {formatBloodGroup(req.bloodGroup)}
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[req.status]}`}>
                          {req.status}
                        </span>
                      </div>
                      <p className="font-body text-gray-700 text-sm">
                        <strong>{req.unitsNeeded} units</strong> needed in {req.town}, {req.county}
                      </p>
                      <p className="font-body text-gray-400 text-xs mt-1">
                        Created {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Broadcast button */}
                      {req.status === "ACTIVE" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBroadcast(req.id)}
                          disabled={broadcastLoading === req.id}
                        >
                          {broadcastLoading === req.id ? "Sending..." : "📲 Broadcast"}
                        </Button>
                      )}

                      {/* Status change */}
                      {req.status === "ACTIVE" && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleStatusChange(req.id, "FULFILLED")}
                          >
                            Mark Fulfilled
                          </Button>
                          <button
                            onClick={() => handleStatusChange(req.id, "CANCELLED")}
                            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                          >
                            Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Broadcast result */}
                  {broadcastResult?.id === req.id && (
                    <div className="mt-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-2">
                      ✅ SMS sent to {broadcastResult.sent} eligible donor{broadcastResult.sent !== 1 ? "s" : ""}!
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* New request tab */}
        {activeTab === "new" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">
              New Blood Request
            </h2>

            {requestSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6">
                ✅ Request created! Redirecting to requests...
              </div>
            )}

            <form onSubmit={handleCreateRequest} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group Needed</label>
                <select
                  value={newRequest.bloodGroup}
                  onChange={(e) => setNewRequest({ ...newRequest, bloodGroup: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition bg-white"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>{formatBloodGroup(bg)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Units Needed</label>
                <input
                  type="number"
                  min={1}
                  value={newRequest.unitsNeeded}
                  onChange={(e) => setNewRequest({ ...newRequest, unitsNeeded: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">County</label>
                <input
                  value={newRequest.county}
                  onChange={(e) => setNewRequest({ ...newRequest, county: e.target.value })}
                  placeholder="Nairobi"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Town</label>
                <input
                  value={newRequest.town}
                  onChange={(e) => setNewRequest({ ...newRequest, town: e.target.value })}
                  placeholder="Upper Hill"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                />
              </div>

              <Button type="submit" variant="primary" size="lg" disabled={requestLoading} className="w-full">
                {requestLoading ? "Creating..." : "Create Request"}
              </Button>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}