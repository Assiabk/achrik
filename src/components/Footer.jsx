import { useNavigate } from "react-router-dom";
import { 
  FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, 
  FaRocket, FaHome, FaProjectDiagram, FaChartLine, 
  FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserShield,
  FaSignInAlt, FaSignOutAlt, FaInfoCircle, FaUsers, FaBriefcase
} from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Footer() {
  const navigate = useNavigate();
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check authentication status on component mount and when it changes
  useEffect(() => {
    checkAuthStatus();
    
    // Listen for storage changes (for logout/login from other tabs)
    const handleStorageChange = () => {
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Function to check if user is authenticated
  const checkAuthStatus = () => {
    const token = localStorage.getItem("adminToken");
    const adminUser = JSON.parse(localStorage.getItem("adminUser") || "{}");
    setIsAdminLoggedIn(!!(token && adminUser.role === "admin"));
  };

  // Navigation handlers
  const goToHome = () => navigate("/");
  const goToAbout = () => navigate("/InfoSection");
  const goToProjects = () => navigate("/projects");
  const goToContact = () => navigate("/contact");

  // Admin navigation - redirects to login if not authenticated
  const goToDashboard = () => {
    if (isAdminLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/admin/login");
    }
  };

  // Direct login navigation
  const goToAdminLogin = () => {
    navigate("/admin/login");
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    setIsAdminLoggedIn(false);
    navigate("/");
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 text-white overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <FaRocket className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black">منصتنا</h3>
            </div>
            <p className="text-gray-300 leading-relaxed">
              منصة رائدة للاستثمار والمشاريع الناشئة. نربط المستثمرين بالفرص
              الواعدة ونوفر بيئة آمنة وموثوقة للنمو والتطور.
            </p>
          </div>

      

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-emerald-400">تواصل معنا</h4>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center gap-3 hover:text-emerald-400 transition-colors duration-300">
                <FaEnvelope className="text-emerald-400" />
                <span>info@platform.com</span>
              </li>
              <li className="flex items-center gap-3 hover:text-emerald-400 transition-colors duration-300">
                <FaPhone className="text-emerald-400" />
                <span>+213 XXX XXX XXX</span>
              </li>
              <li className="flex items-center gap-3 hover:text-emerald-400 transition-colors duration-300">
                <FaMapMarkerAlt className="text-emerald-400" />
                <span>الوادي، الجزائر</span>
              </li>
            </ul>
          </div>

          {/* Social Media & Admin Access */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-emerald-400">تابعنا</h4>
            <div className="flex gap-4 mb-8">
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:-translate-y-1 group">
                <FaFacebookF className="text-white text-lg group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:-translate-y-1 group">
                <FaTwitter className="text-white text-lg group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:-translate-y-1 group">
                <FaLinkedinIn className="text-white text-lg group-hover:scale-110 transition-transform" />
              </a>
              <a href="#" className="w-12 h-12 bg-gradient-to-br from-emerald-600 to-emerald-800 hover:from-emerald-500 hover:to-emerald-700 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:-translate-y-1 group">
                <FaInstagram className="text-white text-lg group-hover:scale-110 transition-transform" />
              </a>
            </div>

            {/* Admin Access Section - Icon only */}
            <div className="mt-6">
              {isAdminLoggedIn ? (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={goToDashboard}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105 group"
                    title="لوحة التحكم"
                  >
                    <FaUserShield className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transition-all duration-300 shadow-lg hover:scale-105"
                    title="تسجيل الخروج"
                  >
                    <FaSignOutAlt className="text-lg" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={goToAdminLogin}
                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105 group"
                    title="تسجيل دخول المشرف"
                  >
                    <FaSignInAlt className="text-xl group-hover:rotate-12 transition-transform duration-300" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-right">
            <p className="text-gray-400 text-sm">
            
              © 2025 Ashrik Maana
            </p>
          </div>

          {/* Admin Access Button - Icon only */}
          <div className="flex items-center gap-4">
            {isAdminLoggedIn && (
              <button
                onClick={handleLogout}
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white transition-all duration-300 shadow-lg hover:scale-105"
                title="تسجيل الخروج"
              >
                <FaSignOutAlt />
              </button>
            )}
            {/* <button
              onClick={isAdminLoggedIn ? goToDashboard : goToAdminLogin}
              className={`group w-10 h-10 flex items-center justify-center rounded-lg text-white transition-all duration-300 shadow-lg hover:scale-105 ${
                isAdminLoggedIn 
                  ? 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 hover:shadow-emerald-500/50'
                  : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 hover:shadow-emerald-500/50'
              }`}
              title={isAdminLoggedIn ? "لوحة التحكم" : "دخول المشرف"}
            >
              {isAdminLoggedIn ? (
                <FaUserShield className="text-lg group-hover:rotate-12 transition-transform duration-300" />
              ) : (
                <FaSignInAlt className="text-lg group-hover:rotate-12 transition-transform duration-300" />
              )}
            </button> */}
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        .animate-pulse { animation: pulse 4s ease-in-out infinite; }
      `}</style>
    </footer>
  );
}