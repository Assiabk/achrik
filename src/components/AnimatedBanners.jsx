import { useState, useEffect } from "react";

const images = [
  "https://images.pexels.com/photos/3184302/pexels-photo-3184302.jpeg",
  "https://images.pexels.com/photos/7108465/pexels-photo-7108465.jpeg",
  "https://images.pexels.com/photos/3184305/pexels-photo-3184305.jpeg",
];

const bannerContent = [
  {
    title: "استثمر في المستقبل",
    subtitle: "اكتشف المشاريع الواعدة وابدأ رحلتك الاستثمارية اليوم",
  },
  {
    title: "مشاريع متنوعة",
    subtitle: "مئات الفرص الاستثمارية في مختلف القطاعات",
  },
  {
    title: "بيئة آمنة وشفافة",
    subtitle: "نضمن حماية استثماراتك بأعلى معايير الأمان",
  },
];

export default function AnimatedBanners() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Images */}
      {images.map((img, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-all duration-1000 ${
            idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{
            backgroundImage: `url(${img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70"></div>

      {/* Animated Background Shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content Container */}
      <div className="relative h-full flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Animated Content */}
          {bannerContent.map((content, idx) => (
            <div
              key={idx}
              className={`transition-all duration-1000 ${
                idx === current
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8 absolute"
              }`}
            >
              {/* Icon */}
              <div className="mb-6 inline-block animate-float">
                <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-2xl">
                  <svg className="w-9 h-9 md:w-11 md:h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-white to-green-200 mb-4 md:mb-6 leading-tight">
                {content.title}
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed">
                {content.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#register"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  ابدأ الاستثمار الآن
                </a>
                <a
                  href="#info"
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                >
                  اعرف المزيد
                </a>
              </div>
            </div>
          ))}

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current
                ? "w-10 h-2 bg-gradient-to-r from-emerald-400 to-green-500"
                : "w-2 h-2 bg-white/40 hover:bg-white/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          ></button>
        ))}
      </div>

      {/* Bottom Gradient Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600"></div>

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}