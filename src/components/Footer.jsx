import { useNavigate } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram, FaRocket, FaHome, FaProjectDiagram, FaChartLine, FaEnvelope, FaPhone, FaMapMarkerAlt, FaUserShield } from "react-icons/fa";

export default function Footer() {
  const navigate = useNavigate();

  // Navigation handlers
  const goToDashboard = () => navigate("/dashboard");
  const goToHome = () => navigate("/");
  const goToAddProject = () => navigate("/dashboard/add-project");
  const goToInvest = () => navigate("/dashboard/invest");
  const goToContact = () => navigate("/contact");

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

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-emerald-400">روابط سريعة</h4>
            <ul className="space-y-3">
              <li>
                <button onClick={goToHome} className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 hover:translate-x-2 transition-all duration-300 cursor-pointer bg-transparent border-none group">
                  <FaHome className="group-hover:scale-110 transition-transform" />
                  <span>الرئيسية</span>
                </button>
              </li>
              <li>
                <button onClick={goToAddProject} className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 hover:translate-x-2 transition-all duration-300 cursor-pointer bg-transparent border-none group">
                  <FaProjectDiagram className="group-hover:scale-110 transition-transform" />
                  <span>إضافة مشروع</span>
                </button>
              </li>
              <li>
                <button onClick={goToInvest} className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 hover:translate-x-2 transition-all duration-300 cursor-pointer bg-transparent border-none group">
                  <FaChartLine className="group-hover:scale-110 transition-transform" />
                  <span>الاستثمار</span>
                </button>
              </li>
              <li>
                <button onClick={goToContact} className="flex items-center gap-2 text-gray-300 hover:text-emerald-400 hover:translate-x-2 transition-all duration-300 cursor-pointer bg-transparent border-none group">
                  <FaEnvelope className="group-hover:scale-110 transition-transform" />
                  <span>اتصل بنا</span>
                </button>
              </li>
            </ul>
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

          {/* Social Media */}
          <div>
            <h4 className="text-xl font-bold mb-6 text-emerald-400">تابعنا</h4>
            <div className="flex gap-4">
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
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700/50 my-8"></div>

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center md:text-right">
            © 2025 منصتنا. جميع الحقوق محفوظة.
            <br />
            © 2025 Ashrik Maana
          </p>

          <button
            onClick={goToDashboard}
            className="group mt-2 md:mt-0 px-8 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105 flex items-center gap-3"
          >
            <FaUserShield className="text-xl group-hover:rotate-12 transition-transform duration-300" />
          </button>
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