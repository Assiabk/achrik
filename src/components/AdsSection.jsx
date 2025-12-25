import { useState, useEffect } from 'react';

export default function AdsSection() {
    const [currentSlide, setCurrentSlide] = useState(0);
    
    const ads = [
      {
        title: "استثمر الآن في مشروعنا الجديد",
        description: "فرصة استثمارية مميزة لتحقيق أرباح مضمونة ومستدامة مع ضمانات قوية.",
        image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800&h=500&fit=crop"
      },
      {
        title: "ورشة العمل الثقافية القادمة",
        description: "انضم إلينا في فعالية ثقافية مميزة لدعم المبادرات المجتمعية والإبداعية.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop"
      },
      {
        title: "دورات تدريبية متقدمة",
        description: "طور مهاراتك المالية مع خبراء متخصصين في مجال الاستثمار والتخطيط المالي.",
        image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=500&fit=crop"
      },
      {
        title: "انضم لمشاريعنا الناشئة",
        description: "فرص رائعة للمستثمرين الراغبين في المشاركة في مشاريع مبتكرة وواعدة.",
        image: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=500&fit=crop"
      },
    ];

    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % ads.length);
    };

    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + ads.length) % ads.length);
    };

    useEffect(() => {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }, []);
  
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
                <img 
                  src={ads[currentSlide].image} 
                  alt={ads[currentSlide].title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
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
                  <button className="mt-6 px-8 py-3 bg-emerald-500 hover:bg-emerald-600 rounded-full font-bold text-white transition-all duration-300 hover:scale-105 shadow-lg">
                    اعرف المزيد
                  </button>
                </div>
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