import { Link, useLocation, useNavigate } from "react-router-dom";
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
  FaUserShield,
  FaImages,
  FaMoneyCheckAlt,
  FaInfoCircle,
  FaAd,
  FaFileAlt,
  FaEdit,
  FaCogs
} from "react-icons/fa";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { logout, user } = useAuth();

  // Navigation items configuration
  const navItems = [
    {
      path: "/dashboard",
      label: "لوحة القيادة",
      icon: FaTachometerAlt
    },
    {
      path: "/dashboard/projects",
      label: "المشاريع",
      icon: FaProjectDiagram
    },
    {
      path: "/dashboard/investments",
      label: "الاستثمارات",
      icon: FaMoneyCheckAlt
    },
    {
      path: "/dashboard/banners",
      label: "البنرات المتحركة",
      icon: FaImages
    }
  ];

  // Website Content Management Sections
  const contentManagementItems = [
    {
      path: "/dashboard/info-sections",
      label: "معلومات الموقع",
      icon: FaInfoCircle,
      description: "تعديل أقسام المعلومات والنصوص"
    },
    {
      path: "/dashboard/ads-management",
      label: "إدارة الإعلانات",
      icon: FaAd,
      description: "إضافة وتعديل الإعلانات"
    },
    
  ];

  // Admin-only navigation items
  const adminNavItems = [
    {
      path: "/dashboard/admin-settings",
      label: "إعدادات المشرف",
      icon: FaUserShield,
      description: "إعدادات النظام المتقدمة"
    },
  
  ];

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

  const contentLinkClass = (path) =>
    `group relative flex items-start gap-4 px-4 py-3 rounded-lg transition-all duration-300 ${
      pathname === path
        ? "bg-gradient-to-r from-blue-900/40 to-cyan-900/30 text-white border-r-2 border-blue-400"
        : "text-gray-300 hover:text-blue-300 hover:bg-gradient-to-r hover:from-blue-900/20 hover:to-cyan-900/10"
    }`;

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      setIsLoggingOut(true);
      
      // Call logout from auth context
      const success = await logout();
      
      if (success) {
        navigate("/login");
      } else {
        // Fallback logout
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback logout
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      navigate("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Check if user is admin
  const isAdmin = user?.role === "Admin";

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
        text-white overflow-hidden transition-all duration-300 z-40
        ${isCollapsed ? 'translate-x-full lg:translate-x-0' : 'translate-x-0'}
        w-80 lg:w-72 xl:w-80
        shadow-2xl shadow-emerald-900/30
      `}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div 
            className="absolute -bottom-20 -left-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Sidebar Content */}
        <div className="relative h-full flex flex-col p-6 overflow-y-auto">
          {/* Header with Logo & User Info */}
          <div className="mb-6 pb-6 border-b border-emerald-800/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform duration-300">
                <FaRocket className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-black text-white bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent">
                  لوحة التحكم
                </h2>
                {/* <div className="mt-2">
                  <p className="text-sm text-gray-300 font-medium">
                    {user?.name || "المستخدم"}
                  </p>
                  <p className="text-xs text-emerald-400 font-semibold mt-1">
                    {user?.role === "Admin" ? "👑 مدير النظام" : "👤 مستخدم"}
                  </p>
                </div> */}
              </div>
            </div>
          </div>

          {/* Navigation Links Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4 px-2">
              {/* التنقل الرئيسي */}
            </h3>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={linkClass(item.path)}
                  >
                    <Icon className={iconClass(item.path)} />
                    <span className="font-semibold">{item.label}</span>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-emerald-400 rounded-full"></div>
                    )}
                    {isActive && (
                      <div className="absolute -right-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-emerald-400 rounded-full animate-ping"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Website Content Management Section */}
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-4 px-2">
              محتوى الموقع
            </h3>
            <nav className="space-y-2">
              {contentManagementItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                
                return (
                  <Link 
                    key={item.path}
                    to={item.path} 
                    className={contentLinkClass(item.path)}
                    title={item.description}
                  >
                    <div className="relative">
                      <Icon className={`text-lg mt-1 ${isActive ? 'text-blue-300' : 'text-gray-400 group-hover:text-blue-300'}`} />
                      {isActive && (
                        <div className="absolute -right-1 -top-1 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-sm block">{item.label}</span>
                      <span className="text-xs text-gray-400 mt-1 block">{item.description}</span>
                    </div>
                    {isActive && (
                      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-blue-400 rounded-full"></div>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Admin Section (Only for Admins) */}
          {isAdmin && adminNavItems.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-4 px-2">
                أدوات المشرف
              </h3>
              <nav className="space-y-2">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.path;
                  
                  return (
                    <Link 
                      key={item.path}
                      to={item.path} 
                      className={`${contentLinkClass(item.path)} border-r-2 border-amber-500/30`}
                      title={item.description}
                    >
                      <div className="relative">
                        <Icon className={`text-lg mt-1 ${isActive ? 'text-amber-300' : 'text-gray-400 group-hover:text-amber-300'}`} />
                        {isActive && (
                          <div className="absolute -right-1 -top-1 w-2 h-2 bg-amber-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-sm block">{item.label}</span>
                        <span className="text-xs text-gray-400 mt-1 block">{item.description}</span>
                      </div>
                      {isActive && (
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-amber-400 rounded-full"></div>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}


          {/* Spacer to push content up */}
          <div className="flex-1"></div>

          {/* Bottom Section - User & Logout */}
          <div className="mt-auto pt-6 border-t border-emerald-800/50">
            {/* User Info */}
            <div className="mb-4 p-4 bg-gradient-to-r from-emerald-900/30 to-green-900/20 rounded-xl">
              <div className="flex items-center gap-3">
                {/* <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 rounded-lg flex items-center justify-center">
                  <span className="font-bold text-white">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div> */}
                {/* <div className="flex-1">
                  <p className="text-sm font-semibold text-white truncate">
                    {user?.name || "المستخدم"}
                  </p>
                  <p className="text-xs text-emerald-300 truncate">
                    {user?.email || ""}
                  </p>
                </div> */}
              </div>
            </div>

          

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-semibold text-gray-300 hover:text-white hover:bg-gradient-to-r hover:from-red-900/40 hover:to-red-800/30 border border-red-900/30 hover:border-red-700/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-red-500"></div>
                  <span>جاري تسجيل الخروج...</span>
                </>
              ) : (
                <>
                  <FaSignOutAlt className="text-lg group-hover:animate-pulse" />
                  <span>تسجيل الخروج</span>
                </>
              )}
            </button>

            {/* Version Info */}
            <div className="text-center text-xs text-emerald-900 mt-4 pt-4 border-t border-emerald-900/30">
              <p className="text-gray-600 mt-1">© {new Date().getFullYear()} جميع الحقوق محفوظة</p>
            </div>
          </div>
        </div>

        {/* Collapse Indicator for Desktop */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -left-3 top-6 w-6 h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 rounded-r-lg items-center justify-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
        >
          <div className="w-2 h-4 bg-white/80 rounded-full"></div>
        </button>
      </aside>

      {/* Overlay for mobile */}
      {!isCollapsed && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30 animate-in fade-in duration-300"
          onClick={() => setIsCollapsed(true)}
        ></div>
      )}
    </>
  );
}