import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button";

export default function HeroSection() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(32px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 0.8s ease, transform 0.8s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <section className="relative blood-gradient noise-overlay min-h-[88vh] flex items-center overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-[-80px] right-[-80px] w-96 h-96 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full bg-red-900/40 blur-2xl" />

      {/* Floating icon */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block float z-10">
        <div className="w-56 h-56 rounded-full bg-white/10 flex items-center justify-center border border-white/20 backdrop-blur-sm">
          <span className="text-8xl">🩸</span>
        </div>
      </div>

      <div ref={heroRef} className="relative z-10 max-w-3xl mx-auto px-8 lg:px-16 py-24">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
          <span className="pulse-dot w-2 h-2 rounded-full bg-green-400 inline-block" />
          <span className="font-body text-white/80 text-sm">
            Connecting donors & hospitals in real time
          </span>
        </div>

        <h1 className="font-display text-5xl lg:text-7xl font-black text-white leading-tight mb-6">
          Every Drop <br />
          <span className="text-red-200">Saves a Life.</span>
        </h1>

        <p className="font-body text-white/70 text-lg lg:text-xl leading-relaxed mb-10 max-w-xl">
          HemoLink connects blood donors with hospitals across Kenya — instantly,
          intelligently, and when it matters most.
        </p>

        <div className="flex flex-wrap gap-4">
          <Button variant="white" size="lg" onClick={() => navigate("/register")}>
            Register as Donor
          </Button>
          <button
            onClick={() => navigate("/register")}
            className="font-body font-medium bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-full text-base transition-all hover:-translate-y-1"
          >
            Register Hospital
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-10 mt-14 pt-10 border-t border-white/20">
          {[
            { value: "8", label: "Blood Groups" },
            { value: "24/7", label: "Availability" },
            { value: "SMS", label: "Instant Alerts" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl font-black text-white">{stat.value}</div>
              <div className="font-body text-white/50 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}