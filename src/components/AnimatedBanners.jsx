import { useState, useEffect } from "react";

export default function AnimatedBanners() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "https://achrikmaana.com/api";
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "https://achrikmaana.com";
  

  // Function to get full image URL
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // If it's a relative path starting with /uploads, prepend backend URL
    if (imageUrl.startsWith('/uploads')) {
      return `${BACKEND_URL}${imageUrl}`;
    }
    
    // If it's just a filename, construct the full URL
    return `${BACKEND_URL}/uploads/${imageUrl}`;
  };

  useEffect(() => {
    fetchBanners();
    
    const timer = setInterval(() => {
      if (banners.length > 0) {
        setCurrent((prev) => (prev + 1) % banners.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const fetchBanners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching banners from:", `${API_URL}/banners`);
      
      const response = await fetch(`${API_URL}/banners`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error("فشل في تحميل البانرات");
      }
      
      const data = await response.json();
      console.log("Banners data received:", data);
      
      if (data.success) {
        // Ensure all banners have full image URLs
        const bannersWithFullUrls = data.banners.map(banner => ({
          ...banner,
          imageUrl: getFullImageUrl(banner.imageUrl)
        }));
        setBanners(bannersWithFullUrls);
      } else {
        setError(data.message || "فشل في تحميل البيانات");
      }
    } catch (err) {
      console.error("❌ Error fetching banners:", err);
      setError(err.message || "حدث خطأ في الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 to-emerald-900">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          {/* <div className="text-white text-xl">جاري تحميل البانرات...</div> */}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 to-emerald-900">
        <div className="text-center p-6">
          <div className="text-red-400 text-xl mb-4">⚠️ {error}</div>
          <button 
            onClick={fetchBanners}
            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
          >
            حاول مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-900 to-emerald-900">
        <div className="text-center p-6">
          <div className="text-gray-400 text-xl mb-4">لا توجد بانرات مضافة</div>
          <p className="text-gray-500">قم بإضافة بانرات من لوحة التحكم</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      {/* Background Images */}
      {banners.map((banner, idx) => (
        <div
          key={banner._id}
          className={`absolute inset-0 transition-all duration-1000 ${
            idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          style={{
            backgroundImage: `url(${banner.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat"
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
          {banners.map((banner, idx) => (
            <div
              key={banner._id}
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
                {banner.title}
              </h2>

              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed">
                {banner.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href={banner.buttonLink || "#register"}
                  target={banner.buttonLink?.startsWith('http') ? "_blank" : undefined}
                  rel={banner.buttonLink?.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-200"
                >
                  {banner.buttonText || "ابدأ الاستثمار الآن"}
                </a>
                <a
                  href={banner.secondaryButtonLink || "#info"}
                  target={banner.secondaryButtonLink?.startsWith('http') ? "_blank" : undefined}
                  rel={banner.secondaryButtonLink?.startsWith('http') ? "noopener noreferrer" : undefined}
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-bold text-lg rounded-xl border-2 border-white/30 hover:bg-white/20 hover:border-white/50 transition-all duration-200"
                >
                  {banner.secondaryButtonText || "اعرف المزيد"}
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
        {banners.map((_, idx) => (
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