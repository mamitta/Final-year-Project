import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Button from "../../components/Button";
import ProfileDrawer from "../../components/ProfileDrawer";

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

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  hospital: { name: string; county: string; town: string };
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"requests" | "new" | "posts" | "newpost">("requests");
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [broadcastLoading, setBroadcastLoading] = useState<string | null>(null);
  const [broadcastResult, setBroadcastResult] = useState<{ id: string; sent: number } | null>(null);

  const [newRequest, setNewRequest] = useState({
    bloodGroup: "A_POS", unitsNeeded: 1, county: "", town: "",
  });
  const [requestLoading, setRequestLoading] = useState(false);
  const [requestSuccess, setRequestSuccess] = useState(false);

  const [newPost, setNewPost] = useState({ title: "", content: "" });
  const [postLoading, setPostLoading] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [profileRes, requestsRes, postsRes] = await Promise.all([
        api.get("/hospitals/me"),
        api.get("/requests/mine"),
        api.get("/posts/mine"),
      ]);
      setProfile(profileRes.data);
      setRequests(requestsRes.data);
      setPosts(postsRes.data);
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
    } finally {
      setRequestLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPostLoading(true);
    try {
      const res = await api.post("/posts", newPost);
      setPosts((prev) => [res.data, ...prev]);
      setNewPost({ title: "", content: "" });
      setPostSuccess(true);
      setTimeout(() => { setPostSuccess(false); setActiveTab("posts"); }, 2000);
    } catch {
    } finally {
      setPostLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch {
    }
  };

  const handleStatusChange = async (requestId: string, status: string) => {
    try {
      const res = await api.patch(`/requests/${requestId}/status`, { status });
      setRequests((prev) =>
        prev.map((r) => r.id === requestId ? { ...r, status: res.data.status } : r)
      );
    } catch {
    }
  };

  const handleBroadcast = async (requestId: string) => {
    setBroadcastLoading(requestId);
    try {
      const res = await api.post(`/notifications/broadcast/${requestId}`);
      setBroadcastResult({ id: requestId, sent: res.data.sent });
      setTimeout(() => setBroadcastResult(null), 4000);
    } catch {
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
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-gray-900">
              {profile?.name} 🏥
            </h1>
            <p className="font-body text-gray-500 mt-1">
              {profile?.town}, {profile?.county}
            </p>
          </div>

          {/* Profile button */}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex items-center gap-2 bg-white border border-gray-200 hover:border-red-300 hover:shadow-md px-4 py-2.5 rounded-2xl transition-all text-sm font-medium text-gray-700"
          >
            <span className="w-7 h-7 rounded-full blood-gradient flex items-center justify-center text-white text-xs font-bold">
              🏥
            </span>
            Hospital Profile
          </button>
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
        <div className="flex flex-wrap bg-white rounded-2xl border border-gray-100 shadow-sm p-1 mb-6 w-fit gap-1">
          {([
            { key: "requests", label: `Requests (${requests.length})` },
            { key: "new", label: "+ New Request" },
            { key: "posts", label: `📰 Posts (${posts.length})` },
            { key: "newpost", label: "+ New Post" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === t.key
                  ? "bg-red-700 text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Requests tab */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <span className="text-4xl">📋</span>
                <p className="font-body text-gray-500 mt-3">No requests yet.</p>
                <Button variant="primary" size="md" onClick={() => setActiveTab("new")} className="mt-4">
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
                      {req.status === "ACTIVE" && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBroadcast(req.id)}
                            disabled={broadcastLoading === req.id}
                          >
                            {broadcastLoading === req.id ? "Sending..." : "📲 Broadcast"}
                          </Button>
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

        {/* New Request tab */}
        {activeTab === "new" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">New Blood Request</h2>
            {requestSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6">
                ✅ Request created! Redirecting...
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

        {/* Posts tab */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <span className="text-4xl">📝</span>
                <p className="font-body text-gray-500 mt-3">No posts yet.</p>
                <Button variant="primary" size="md" onClick={() => setActiveTab("newpost")} className="mt-4">
                  Create First Post
                </Button>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-bold text-gray-900 mb-2">
                        {post.title}
                      </h3>
                      <p className="font-body text-gray-600 text-sm leading-relaxed">
                        {post.content}
                      </p>
                      <p className="font-body text-gray-400 text-xs mt-3">
                        Posted {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-xs text-gray-400 hover:text-red-500 transition-colors whitespace-nowrap"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* New Post tab */}
        {activeTab === "newpost" && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-lg">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">New Post</h2>
            {postSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 mb-6">
                ✅ Post published! Redirecting...
              </div>
            )}
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
                <input
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="e.g. Urgent: O- Blood Needed"
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Content</label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  placeholder="Share updates, news, or blood donation information..."
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 transition resize-none"
                />
              </div>
              <Button type="submit" variant="primary" size="lg" disabled={postLoading} className="w-full">
                {postLoading ? "Publishing..." : "Publish Post"}
              </Button>
            </form>
          </div>
        )}
      </main>

      <Footer />

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={profile?.name || "Hospital Profile"}
        fields={[
          { label: "Hospital Name", value: profile?.name },
          { label: "Email", value: profile?.user.email },
          { label: "Account Phone", value: profile?.user.phone },
          { label: "Hospital Phone", value: profile?.phone },
          { label: "County", value: profile?.county },
          { label: "Town", value: profile?.town },
        ]}
      />
    </div>
  );
}