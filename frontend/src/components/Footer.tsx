export default function Footer() {
  return (
    <footer className="bg-gray-950 py-8 px-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <span className="text-xl">🩸</span>
        <span className="font-display text-lg font-bold text-white">HemoLink</span>
      </div>
      <p className="font-body text-gray-500 text-sm">
        © {new Date().getFullYear()} HemoLink. Built to save lives.
      </p>
    </footer>
  );
}