import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Icon */}
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            {/* Platform Name */}
            <div className="flex flex-col">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 leading-tight">
                أشرك معنا
              </h1>
              <span className="text-xs text-gray-500 hidden sm:block">منصة التمويل التساهمي</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            <a href="#register" className="px-5 py-2.5 text-gray-700 font-semibold hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 relative group">
              <span>التسجيل</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#info" className="px-5 py-2.5 text-gray-700 font-semibold hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 relative group">
              <span>معلومات</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            {/* NEW: Projects Needing Funding */}
            <a 
              href="/projects-needing-funding" 
              className="px-5 py-2.5 text-gray-700 font-semibold hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 relative group flex items-center gap-2"
            >
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>المشاريع المحتاجة للتمويل</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-full transition-all duration-300"></span>
              
             
            </a>
            
           
            <a href="#ads" className="px-5 py-2.5 text-gray-700 font-semibold hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all duration-200 relative group">
              <span>الإعلانات</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-emerald-500 to-green-500 group-hover:w-full transition-all duration-300"></span>
            </a>
            
            {/* CTA Button */}
            <a href="#start" className="mr-4 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-200">
              ابدأ الآن
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-emerald-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
            aria-label="Toggle menu"
          >
            {!mobileMenuOpen ? (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="px-4 pt-2 pb-4 space-y-1 bg-gradient-to-b from-white to-emerald-50/30 border-t border-emerald-100">
          <a
            href="#register"
            className="block px-4 py-3 text-gray-700 font-semibold hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>التسجيل</span>
            </div>
          </a>
          <a
            href="#info"
            className="block px-4 py-3 text-gray-700 font-semibold hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>معلومات</span>
            </div>
          </a>
          
          {/* NEW: Projects Needing Funding - Mobile */}
          <a
            href="/projects-needing-funding"
            className="block px-4 py-3 text-gray-700 font-semibold hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3 justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>المشاريع المحتاجة للتمويل</span>
              </div>
              
            </div>
          </a>
          
          
          <a
            href="#ads"
            className="block px-4 py-3 text-gray-700 font-semibold hover:bg-emerald-100 hover:text-emerald-700 rounded-lg transition-all duration-200"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
              <span>الإعلانات</span>
            </div>
          </a>
        </nav>
      </div>
    </header>
  );
}