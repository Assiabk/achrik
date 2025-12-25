import { useState } from "react";

export default function RegisterForm() {
  const [role, setRole] = useState("investor");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!terms) {
      alert("يرجى الموافقة على شروط المنصة");
      return;
    }
    console.log({ role, name, phone, email, password, terms });
    setSubmitted(true);
  };

  return (
    <section id="register" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-9 h-9 md:w-11 md:h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 mb-4">
            فتح حساب جديد
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            انضم إلى منصة أشرك معنا وابدأ رحلتك في عالم الاستثمار التساهمي
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-emerald-100 overflow-hidden">
          {submitted ? (
            <div className="text-center py-16 md:py-20 px-6">
              {/* Success Icon */}
              <div className="mb-6 inline-block">
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center shadow-xl animate-scale-in">
                  <svg className="w-11 h-11 md:w-14 md:h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-emerald-600 mb-4">
                تم التسجيل بنجاح!
              </h3>
              <p className="text-gray-600 text-lg md:text-xl mb-8">
                تحقق من بريدك الإلكتروني لتأكيد الحساب وبدء رحلتك الاستثمارية
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
              >
                تسجيل حساب آخر
              </button>
            </div>
          ) : (
            <div className="p-6 md:p-10 lg:p-12">
              {/* Role Selection - Premium Cards */}
              <div className="mb-8 md:mb-10">
                <label className="block text-gray-700 font-bold text-lg mb-4 text-center md:text-right">
                  اختر نوع الحساب
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Investor Card */}
                  <div onClick={() => setRole("investor")} className="cursor-pointer group">
                    <div className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 ${
                      role === "investor"
                        ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                    }`}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                          role === "investor"
                            ? "bg-gradient-to-br from-emerald-500 to-green-600"
                            : "bg-gray-100 group-hover:bg-emerald-100"
                        }`}>
                          <svg className={`w-7 h-7 md:w-8 md:h-8 ${role === "investor" ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className={`text-xl md:text-2xl font-bold mb-2 ${role === "investor" ? "text-emerald-600" : "text-gray-700"}`}>
                          مستثمر
                        </h3>
                        <p className="text-sm md:text-base text-gray-600">
                          استثمر في المشاريع الواعدة وحقق عوائد مجزية
                        </p>
                      </div>
                      {role === "investor" && (
                        <div className="absolute top-4 left-4 md:top-6 md:left-6">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Project Owner Card */}
                  <div onClick={() => setRole("projectOwner")} className="cursor-pointer group">
                    <div className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 ${
                      role === "projectOwner"
                        ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg scale-105"
                        : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"
                    }`}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                          role === "projectOwner"
                            ? "bg-gradient-to-br from-emerald-500 to-green-600"
                            : "bg-gray-100 group-hover:bg-emerald-100"
                        }`}>
                          <svg className={`w-7 h-7 md:w-8 md:h-8 ${role === "projectOwner" ? "text-white" : "text-gray-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h3 className={`text-xl md:text-2xl font-bold mb-2 ${role === "projectOwner" ? "text-emerald-600" : "text-gray-700"}`}>
                          صاحب مشروع
                        </h3>
                        <p className="text-sm md:text-base text-gray-600">
                          احصل على التمويل لمشروعك من المستثمرين
                        </p>
                      </div>
                      {role === "projectOwner" && (
                        <div className="absolute top-4 left-4 md:top-6 md:left-6">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-right">
                    الاسم واللقب
                  </label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => setFocusedField("name")}
                      onBlur={() => setFocusedField("")}
                      required
                      placeholder="أدخل الاسم الكامل"
                      className={`w-full border-2 rounded-xl px-12 py-4 text-right transition-all duration-300 ${
                        focusedField === "name"
                          ? "border-emerald-500 bg-emerald-50/30 shadow-lg"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-right">
                    رقم الهاتف
                  </label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField("")}
                      required
                      placeholder="05xxxxxxxx"
                      className={`w-full border-2 rounded-xl px-12 py-4 text-right transition-all duration-300 ${
                        focusedField === "phone"
                          ? "border-emerald-500 bg-emerald-50/30 shadow-lg"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-right">
                    البريد الإلكتروني
                  </label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField("")}
                      required
                      placeholder="example@email.com"
                      className={`w-full border-2 rounded-xl px-12 py-4 text-right transition-all duration-300 ${
                        focusedField === "email"
                          ? "border-emerald-500 bg-emerald-50/30 shadow-lg"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      } focus:outline-none`}
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-right">
                    كلمة المرور
                  </label>
                  <div className="relative">
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField("")}
                      required
                      placeholder="أدخل كلمة مرور قوية"
                      className={`w-full border-2 rounded-xl px-12 py-4 text-right transition-all duration-300 ${
                        focusedField === "password"
                          ? "border-emerald-500 bg-emerald-50/30 shadow-lg"
                          : "border-gray-200 bg-white hover:border-emerald-300"
                      } focus:outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-emerald-500 transition-colors"
                    >
                      {showPassword ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="bg-emerald-50/50 rounded-xl p-4 md:p-6 border border-emerald-100">
                  <div onClick={() => setTerms(!terms)} className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={terms}
                        onChange={() => {}}
                        className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      />
                    </div>
                    <span className="text-gray-700 text-sm md:text-base leading-relaxed text-right">
                      أوافق على{" "}
                      <a href="#terms" className="text-emerald-600 font-bold hover:text-emerald-700 underline">
                        شروط وأحكام المنصة
                      </a>
                      {" "}و{" "}
                      <a href="#privacy" className="text-emerald-600 font-bold hover:text-emerald-700 underline">
                        سياسة الخصوصية
                      </a>
                    </span>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-bold text-lg py-4 md:py-5 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 flex items-center justify-center gap-3"
                >
                  <span>إنشاء الحساب</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-600 text-sm md:text-base">
                  لديك حساب بالفعل؟{" "}
                  <a href="#login" className="text-emerald-600 font-bold hover:text-emerald-700 hover:underline">
                    تسجيل الدخول
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.5);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}