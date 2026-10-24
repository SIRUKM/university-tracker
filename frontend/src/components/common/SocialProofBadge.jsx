import { ArrowRight } from "lucide-react";

const AVATARS = [
  {
    src: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces",
    alt: "Applicant",
    initial: "A",
    bg: "bg-emerald-500",
  },
  {
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces",
    alt: "Applicant",
    initial: "M",
    bg: "bg-blue-500",
  },
  {
    src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces",
    alt: "Applicant",
    initial: "S",
    bg: "bg-amber-500",
  },
  {
    src: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&crop=faces",
    alt: "Applicant",
    initial: "R",
    bg: "bg-purple-500",
  },
];

export default function SocialProofBadge({
  count = "2,500+",
  label = "German university applicants",
  className = "",
}) {
  return (
    <div
      className={`group inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white border border-gray-200/90 shadow-2xs hover:border-gray-300 hover:shadow-xs transition-all select-none ${className}`}
    >
      {/* Overlapping Avatars */}
      <div className="flex -space-x-2 overflow-hidden items-center">
        {AVATARS.map((avatar, index) => (
          <img
            key={index}
            src={avatar.src}
            alt={avatar.alt}
            onError={(e) => {
              // Hide broken image and fallback smoothly
              e.currentTarget.style.display = "none";
            }}
            className="inline-block h-5 w-5 rounded-full ring-2 ring-white object-cover"
          />
        ))}
      </div>

      {/* Live Pulsing Dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>

      {/* Social Proof Text */}
      <span className="text-xs font-medium text-gray-600">
        Loved by <strong className="font-bold text-gray-900">{count}</strong>{" "}
        {label}
      </span>

      {/* Arrow Indicator */}
      <ArrowRight className="h-3 w-3 text-gray-400 group-hover:text-black group-hover:translate-x-0.5 transition-all" />
    </div>
  );
}

