import { useEffect, useState } from "react";

export default function Splash({ onFinish }) {
  const [loaded, setLoaded] = useState(false);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Preload background image
  useEffect(() => {
    const img = new Image();
    img.src = "https://images.pexels.com/photos/7108465/pexels-photo-7108465.jpeg";
    img.onload = () => setBgLoaded(true);
  }, []);

  // Splash duration
  useEffect(() => {
    if (bgLoaded) {
      const timer = setTimeout(() => {
        setLoaded(true);
        onFinish && onFinish();
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [bgLoaded, onFinish]);

  if (!bgLoaded) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center transition-opacity duration-1000 ${
        loaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        backgroundImage: "url('https://images.pexels.com/photos/7108465/pexels-photo-7108465.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gradient overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80"></div>

      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 text-center px-6 max-w-2xl">
        {/* Money/Investment Icon */}
        <div className="mb-8 animate-scale-in">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:rotate-6 transition-transform">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>

        {/* Platform Name with gradient */}
        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-green-200 text-6xl md:text-7xl font-black mb-6 animate-slide-up tracking-tight">
          أشرك معنا
        </h1>

        {/* Subtitle with better spacing */}
        <div className="mb-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <p className="text-emerald-100 text-xl md:text-2xl font-semibold mb-2">
            منصة التمويل التساهمي
          </p>
        </div>

        {/* Description with enhanced styling */}
        <p className="text-gray-200 text-base md:text-lg leading-relaxed mb-10 animate-slide-up max-w-xl mx-auto" style={{ animationDelay: '0.4s' }}>
          اربط بين أصحاب المشاريع الواعدة والمستثمرين في بيئة آمنة وشفافة تضمن نجاح استثماراتك
        </p>

        {/* Modern loading indicator */}
        <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
          <div className="w-48 h-1.5 bg-white/20 rounded-full overflow-hidden mx-auto backdrop-blur-sm">
            <div className="h-full bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 animate-loading-bar shadow-lg"></div>
          </div>
        </div>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600"></div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes loading-bar {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
          opacity: 0;
        }

        .animate-scale-in {
          animation: scale-in 0.6s ease-out forwards;
        }

        .animate-loading-bar {
          animation: loading-bar 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}