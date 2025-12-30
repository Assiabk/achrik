import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLock, FaUser, FaArrowLeft } from "react-icons/fa";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => null);

      if (!data) {
        setError("الخادم لم يرجع بيانات صالحة.");
        return;
      }

      console.log("Backend response:", response.status, data);

      if (response.ok && data.success) {
        // Save token and admin info
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        navigate("/dashboard"); // redirect to dashboard
      } else {
        setError(data.message || "بيانات الدخول غير صحيحة. يرجى المحاولة مرة أخرى.");
      }
    } catch (err) {
      console.error("Login request error:", err);
      setError("خطأ في الاتصال بالخادم. يرجى التحقق من اتصال الشبكة.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-emerald-50 to-white relative">
      <div className="absolute top-6 left-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 bg-white text-emerald-600 rounded-lg shadow-sm hover:text-emerald-700"
        >
          <FaArrowLeft /> العودة للرئيسية
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-emerald-100 relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaLock className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">لوحة التحكم الإدارية</h2>
          <p className="text-gray-600 mt-2">الرجاء إدخال بيانات الدخول للمتابعة</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6" dir="rtl">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm text-right">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium flex items-center gap-2 justify-end">
              <span>البريد الإلكتروني</span>
              <FaUser className="text-emerald-500" />
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@admin.com"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 text-sm font-medium flex items-center gap-2 justify-end">
              <span>كلمة المرور</span>
              <FaLock className="text-emerald-500" />
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right"
              dir="rtl"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                جاري تسجيل الدخول...
              </>
            ) : (
              <span>تسجيل الدخول</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-500 text-xs">© 2025 منصتنا. جميع الحقوق محفوظة</p>
        </div>
      </div>
    </div>
  );
}
