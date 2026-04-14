import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Button from "../components/Button";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const BLOOD_GROUPS = ["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"];

const formatBloodGroup = (bg: string) => bg.replace("_POS", "+").replace("_NEG", "-");

interface DonorForm {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  bloodGroup: string;
  county: string;
  town: string;
}

interface HospitalForm {
  email: string;
  phone: string;
  password: string;
  name: string;
  county: string;
  town: string;
  hospitalPhone: string;
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [tab, setTab] = useState<"DONOR" | "HOSPITAL">("DONOR");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [donorForm, setDonorForm] = useState<DonorForm>({
    email: "", phone: "", password: "", firstName: "",
    lastName: "", bloodGroup: "A_POS", county: "", town: "",
  });

  const [hospitalForm, setHospitalForm] = useState<HospitalForm>({
    email: "", phone: "", password: "", name: "",
    county: "", town: "", hospitalPhone: "",
  });

  const handleDonorChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setDonorForm({ ...donorForm, [e.target.name]: e.target.value });
    setError("");
  };

  const handleHospitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHospitalForm({ ...hospitalForm, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = tab === "DONOR" ? "/auth/register/donor" : "/auth/register/hospital";
      const payload = tab === "DONOR" ? donorForm : hospitalForm;
      const res = await api.post(endpoint, payload);
      const { token, user } = res.data;
      login(token, user);

      if (user.role === "DONOR") navigate("/donor/dashboard");
      else navigate("/hospital/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-gray-50">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="blood-gradient h-2 w-full" />

            <div className="px-8 py-10">
              {/* Header */}
              <div className="text-center mb-8">
                <h1 className="font-display text-3xl font-bold text-gray-900 mt-3">
                  Join HemoLink
                </h1>
                <p className="font-body text-gray-500 text-sm mt-2">
                  Create your account to get started
                </p>
              </div>

              {/* Tab toggle */}
              <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
                {(["DONOR", "HOSPITAL"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => { setTab(t); setError(""); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      tab === t
                        ? "bg-white text-red-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t === "DONOR" ? " I'm a Donor" : "I'm a Hospital"}
                  </button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">
                  {error}
                </div>
              )}

              {/* Donor Form */}
              {tab === "DONOR" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <input
                        name="firstName"
                        value={donorForm.firstName}
                        onChange={handleDonorChange}
                        placeholder="Jane"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <input
                        name="lastName"
                        value={donorForm.lastName}
                        onChange={handleDonorChange}
                        placeholder="Doe"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={donorForm.email}
                      onChange={handleDonorChange}
                      placeholder="you@example.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                    <input
                      name="phone"
                      value={donorForm.phone}
                      onChange={handleDonorChange}
                      placeholder="0712345678"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={donorForm.password}
                      onChange={handleDonorChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Blood Group</label>
                    <select
                      name="bloodGroup"
                      value={donorForm.bloodGroup}
                      onChange={handleDonorChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition bg-white"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>{formatBloodGroup(bg)}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">County</label>
                      <input
                        name="county"
                        value={donorForm.county}
                        onChange={handleDonorChange}
                        placeholder="Nairobi"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Town</label>
                      <input
                        name="town"
                        value={donorForm.town}
                        onChange={handleDonorChange}
                        placeholder="Westlands"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full mt-2">
                    {loading ? "Creating account..." : "Register as Donor"}
                  </Button>
                </form>
              )}

              {/* Hospital Form */}
              {tab === "HOSPITAL" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Name</label>
                    <input
                      name="name"
                      value={hospitalForm.name}
                      onChange={handleHospitalChange}
                      placeholder="Kenyatta National Hospital"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={hospitalForm.email}
                      onChange={handleHospitalChange}
                      placeholder="admin@hospital.com"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Account Phone</label>
                      <input
                        name="phone"
                        value={hospitalForm.phone}
                        onChange={handleHospitalChange}
                        placeholder="0712345678"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Hospital Phone</label>
                      <input
                        name="hospitalPhone"
                        value={hospitalForm.hospitalPhone}
                        onChange={handleHospitalChange}
                        placeholder="0200000000"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                    <input
                      type="password"
                      name="password"
                      value={hospitalForm.password}
                      onChange={handleHospitalChange}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">County</label>
                      <input
                        name="county"
                        value={hospitalForm.county}
                        onChange={handleHospitalChange}
                        placeholder="Nairobi"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Town</label>
                      <input
                        name="town"
                        value={hospitalForm.town}
                        onChange={handleHospitalChange}
                        placeholder="Upper Hill"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full mt-2">
                    {loading ? "Creating account..." : "Register Hospital"}
                  </Button>
                </form>
              )}

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-red-700 font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}