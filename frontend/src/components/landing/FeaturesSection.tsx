const features = [
  {
    icon: "🩸",
    title: "Smart Donor Matching",
    desc: "Hospitals instantly find compatible donors by blood group and location — no phone trees, no delays.",
  },
  {
    icon: "📲",
    title: "Instant SMS Alerts",
    desc: "Eligible donors receive real-time SMS notifications the moment a matching request is created.",
  },
  {
    icon: "🏥",
    title: "Hospital Dashboard",
    desc: "Manage blood requests, track fulfillment status, and broadcast to hundreds of donors in one click.",
  },
  {
    icon: "❤️",
    title: "Donor Profiles",
    desc: "Donors control their availability, track their donation history, and receive only relevant requests.",
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-24 px-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <span className="font-body text-red-600 text-sm font-medium tracking-widest uppercase">
            Why HemoLink
          </span>
          <h2 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mt-3">
            Built for urgency.
            <br />
            <span className="text-red-700">Designed for impact.</span>
          </h2>
          <p className="font-body text-gray-500 mt-4 max-w-xl mx-auto text-lg">
            A purpose-built platform that removes friction between the need for
            blood and the people who can give it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="card-hover bg-white rounded-2xl p-8 border border-gray-100 shadow-sm"
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-2xl mb-5">
                {f.icon}
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-3">
                {f.title}
              </h3>
              <p className="font-body text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}