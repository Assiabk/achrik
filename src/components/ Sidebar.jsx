import { Link, useLocation } from "react-router-dom";
import { 
  FaRocket, 
  FaProjectDiagram, 
  FaPlusCircle, 
  FaChartLine, 
  FaTachometerAlt, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt,
  FaCog,
  FaUserShield
} from "react-icons/fa";
import { useState } from "react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const linkClass = (path) =>
    `group relative flex items-center gap-4 px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
      pathname === path
        ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-lg shadow-emerald-500/50 scale-105"
        : "text-gray-300 hover:text-emerald-400 hover:bg-gradient-to-r hover:from-emerald-900/50 hover:to-green-900/50 hover:translate-x-2"
    }`;

  const iconClass = (path) =>
    `text-xl transition-all duration-300 ${
      pathname === path
        ? "scale-110 rotate-12"
        : "group-hover:scale-125 group-hover:rotate-12"
    }`;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="lg:hidden fixed top-4 right-4 z-50 w-12 h-12 bg-gradient-to-br from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
      >
        {isCollapsed ? (
          <FaBars className="text-white text-lg" />
        ) : (
          <FaTimes className="text-white text-lg" />
        )}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 right-0 h-full bg-gradient-to-br from-gray-900 via-emerald-900 to-gray-900 
        text-white overflow-hidden transition-transform duration-300 z-40
        ${isCollapsed ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'}
        w-80 lg:w-72 xl:w-80
      `}>
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-10 right-5 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-20 left-5 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Sidebar Content */}
        <div className="relative h-full flex flex-col p-6">
          {/* Header */}
          <div className="mb-8 pb-6 border-b border-gray-700/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <FaRocket className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">لوحة التحكم</h2>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 space-y-3">
            <Link to="/dashboard" className={linkClass("/dashboard")}>
              <FaTachometerAlt className={iconClass("/dashboard")} />
              <span className="font-semibold">لوحة القيادة</span>
              {pathname === "/dashboard" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full"></div>
              )}
            </Link>

            <Link to="/dashboard/projects" className={linkClass("/dashboard/projects")}>
              <FaProjectDiagram className={iconClass("/dashboard/projects")} />
              <span className="font-semibold">المشاريع</span>
              {pathname === "/dashboard/projects" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full"></div>
              )}
            </Link>

            <Link to="/dashboard/add-project" className={linkClass("/dashboard/add-project")}>
              <FaPlusCircle className={iconClass("/dashboard/add-project")} />
              <span className="font-semibold">إضافة مشروع</span>
              {pathname === "/dashboard/add-project" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full"></div>
              )}
            </Link>

            <Link to="/dashboard/invest" className={linkClass("/dashboard/invest")}>
              <FaChartLine className={iconClass("/dashboard/invest")} />
              <span className="font-semibold">استثمار</span>
              {pathname === "/dashboard/invest" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full"></div>
              )}
            </Link>

            {/* Admin Settings Link */}
            <Link to="/dashboard/admin-settings" className={linkClass("/dashboard/admin-settings")}>
              <FaUserShield className={iconClass("/dashboard/admin-settings")} />
              <span className="font-semibold">إعدادات المشرف</span>
              {pathname === "/dashboard/admin-settings" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full"></div>
              )}
            </Link>

            {/* Alternative: Using FaCog icon instead of FaUserShield */}
            {/* <Link to="/dashboard/settings" className={linkClass("/dashboard/settings")}>
              <FaCog className={iconClass("/dashboard/settings")} />
              <span className="font-semibold">الإعدادات</span>
              {pathname === "/dashboard/settings" && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full"></div>
              )}
            </Link> */}
          </nav>

          {/* Bottom Section - Settings & Logout */}
          <div className="mt-auto space-y-3 pt-6 border-t border-gray-700/50">
           

            {/* Logout Button */}
            <Link
              to="/logout"
              className="flex items-center gap-3 px-6 py-4 rounded-xl font-semibold text-gray-300 hover:text-red-500 hover:bg-gray-800 transition-all duration-300"
            >
              <FaSignOutAlt className="text-xl" />
              <span>تسجيل الخروج</span>
            </Link>
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
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}
    </>
  );
}