import { useState, useEffect } from 'react';

export default function AdsSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

    // Fixed: Clean image URL function - only prepend if needed
    const getCleanImageUrl = (imageUrl) => {
        if (!imageUrl) return "";
        
        console.log("Original imageUrl:", imageUrl);
        
        // If URL is already doubled (has duplicate backend URL), fix it
        if (imageUrl.includes('http://localhost:5000http://localhost:5000')) {
            const cleanUrl = imageUrl.replace('http://localhost:5000http://localhost:5000', 'http://localhost:5000');
            console.log("Fixed doubled URL:", cleanUrl);
            return cleanUrl;
        }
        
        // If URL already has http://localhost:5000, return as is
        if (imageUrl.startsWith('http://localhost:5000')) {
            console.log("Already has full URL, returning:", imageUrl);
            return imageUrl;
        }
        
        // If it's a relative path starting with /uploads, prepend backend URL
        if (imageUrl.startsWith('/uploads')) {
            const fullUrl = `http://localhost:5000${imageUrl}`;
            console.log("Relative path, converted to:", fullUrl);
            return fullUrl;
        }
        
        // Default return
        console.log("Returning as is:", imageUrl);
        return imageUrl;
    };

    const fetchAds = async () => {
        try {
            setLoading(true);
            setError(null);
            
            console.log("Fetching ads from:", `${API_URL}/ads`);
            
            const response = await fetch(`${API_URL}/ads`);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("API Error Response:", errorText);
                throw new Error("فشل في تحميل الإعلانات");
            }
            
            const data = await response.json();
            console.log("Ads data received:", data);
            
            if (data.success) {
                // Clean image URLs to avoid duplication
                const cleanedAds = data.ads.map(ad => ({
                    ...ad,
                    imageUrl: getCleanImageUrl(ad.imageUrl)
                }));
                
                console.log("Cleaned ads:", cleanedAds);
                setAds(cleanedAds);
            } else {
                setError(data.message || "فشل في تحميل البيانات");
            }
        } catch (err) {
            console.error("❌ Error fetching ads:", err);
            setError(err.message || "حدث خطأ في الاتصال بالخادم");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAds();
    }, []);

    useEffect(() => {
        if (ads.length > 0) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % ads.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [ads.length]);

    const nextSlide = () => {
        if (ads.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % ads.length);
        }
    };

    const prevSlide = () => {
        if (ads.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + ads.length) % ads.length);
        }
    };

    // Debug: Check backend response
    useEffect(() => {
        const debugBackend = async () => {
            try {
                const response = await fetch(`${API_URL}/ads`);
                const data = await response.json();
                console.log("DEBUG - Backend response:", data);
                if (data.success && data.ads.length > 0) {
                    console.log("DEBUG - First ad imageUrl from backend:", data.ads[0].imageUrl);
                }
            } catch (error) {
                console.error("DEBUG - Error checking backend:", error);
            }
        };
        
        debugBackend();
    }, []);

    if (loading) {
        return (
            <section id="ads" className="relative py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
                {/* Animated background shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg">جاري تحميل الإعلانات...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section id="ads" className="relative py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
                {/* Animated background shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
                        <button 
                            onClick={fetchAds}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors"
                        >
                            حاول مرة أخرى
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    if (ads.length === 0) {
        return (
            <section id="ads" className="relative py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
                {/* Animated background shapes */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
                </div>
                
                <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 mb-4">
                            الإعلانات والمنشورات
                        </h2>
                        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
                            تعرف على أحدث الإعلانات التجارية والثقافية والتعليمية والمشاريع على منصتنا
                        </p>
                    </div>
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-xl">لا توجد إعلانات حالياً</p>
                        <p className="text-gray-400 mt-2">سيتم إضافة الإعلانات قريباً</p>
                    </div>
                </div>
            </section>
        );
    }
  
    return (
      <section id="ads" className="relative py-20 md:py-28 bg-gradient-to-br from-emerald-50 via-white to-green-50 overflow-hidden">
        {/* Animated background shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        </div>
  
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 mb-4">
              الإعلانات والمنشورات
            </h2>
            <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
              تعرف على أحدث الإعلانات التجارية والثقافية والتعليمية والمشاريع على منصتنا
            </p>
          </div>
  
          {/* Carousel */}
          <div className="relative max-w-5xl mx-auto">
            {/* Main Slide */}
            <div className="relative overflow-hidden rounded-3xl shadow-2xl group">
              <div className="relative h-96 md:h-[500px]">
                {ads.length > 0 && ads[currentSlide] && (
                  <>
                    <img 
                      src={ads[currentSlide].imageUrl} 
                      alt={ads[currentSlide].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        console.error("❌ Image failed to load:", ads[currentSlide].imageUrl);
                        console.error("Trying fallback image...");
                        
                        // Try to fix URL and reload
                        const originalUrl = ads[currentSlide].imageUrl;
                        let fixedUrl = originalUrl;
                        
                        // Fix doubled URL
                        if (originalUrl.includes('http://localhost:5000http://localhost:5000')) {
                            fixedUrl = originalUrl.replace('http://localhost:5000http://localhost:5000', 'http://localhost:5000');
                            console.log("Fixed URL:", fixedUrl);
                        }
                        // Fix if missing http://
                        else if (originalUrl.startsWith('localhost:5000')) {
                            fixedUrl = `http://${originalUrl}`;
                            console.log("Added http:// to URL:", fixedUrl);
                        }
                        // Fix if missing port
                        else if (originalUrl.startsWith('http://localhost/uploads')) {
                            fixedUrl = originalUrl.replace('http://localhost/uploads', 'http://localhost:5000/uploads');
                            console.log("Added port to URL:", fixedUrl);
                        }
                        
                        // Try fixed URL first
                        if (fixedUrl !== originalUrl) {
                            e.target.src = fixedUrl;
                        } else {
                            // Fallback to placeholder
                            e.target.src = "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=500&fit=crop";
                        }
                      }}
                      onLoad={() => {
                        console.log("✅ Image loaded successfully:", ads[currentSlide].imageUrl);
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    
                    {/* Content Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white">
                      <h3 className="text-3xl md:text-5xl font-black mb-4 animate-fade-in">
                        {ads[currentSlide].title}
                      </h3>
                      <p className="text-lg md:text-xl text-gray-200 max-w-3xl leading-relaxed animate-fade-in">
                        {ads[currentSlide].description}
                      </p>
                      <a
                        href={ads[currentSlide].buttonLink || "#"}
                        target={ads[currentSlide].buttonLink?.startsWith('http') ? "_blank" : undefined}
                        rel={ads[currentSlide].buttonLink?.startsWith('http') ? "noopener noreferrer" : undefined}
                        className="inline-block mt-6 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg"
                      >
                        {ads[currentSlide].buttonText || "اعرف المزيد"}
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group/btn"
              >
                <svg className="w-6 h-6 text-white group-hover/btn:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 group/btn"
              >
                <svg className="w-6 h-6 text-white group-hover/btn:scale-125 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-3 mt-8">
              {ads.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentSlide === index 
                      ? "w-12 h-3 bg-emerald-500" 
                      : "w-3 h-3 bg-gray-300 hover:bg-emerald-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
  
        <style jsx>{`
          @keyframes pulse {
            0%, 100% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
          }
          .animate-pulse {
            animation: pulse 3s ease-in-out infinite;
          }
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
          }
        `}</style>
      </section>
    );
}