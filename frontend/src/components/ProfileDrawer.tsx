import { useEffect } from "react";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  fields: { label: string; value: string | undefined }[];
}

export default function ProfileDrawer({ isOpen, onClose, title, fields }: ProfileDrawerProps) {
  // Close on escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Top accent */}
        <div className="blood-gradient h-1.5 w-full" />

        <div className="p-8 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="text-3xl mb-1">👤</div>
              <h2 className="font-display text-2xl font-bold text-gray-900">{title}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-5">
            {fields.map((field) => (
              <div key={field.label} className="border-b border-gray-100 pb-4">
                <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">
                  {field.label}
                </div>
                <div className="font-body text-gray-900 font-medium">
                  {field.value || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}