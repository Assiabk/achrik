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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!terms) {
      alert("يرجى الموافقة على شروط المنصة");
      return;
    }

    try {
      const response = await fetch("https://achrikmaana.com/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, name, phone, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        setSubmitted(true);
        console.log("تم التسجيل:", data);
      } else {
        alert(data.message || "حدث خطأ أثناء التسجيل");
      }
    } catch (err) {
      console.error(err);
      alert("حدث خطأ أثناء الاتصال بالخادم");
    }
  };

  return (
    <section id="register" className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50"></div>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
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

        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl border border-emerald-100 overflow-hidden">
          {submitted ? (
            <div className="text-center py-16 md:py-20 px-6">
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
              {/* Role Selection */}
              <div className="mb-8 md:mb-10">
                <label className="block text-gray-700 font-bold text-lg mb-4 text-center md:text-right">
                  اختر نوع الحساب
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div onClick={() => setRole("investor")} className="cursor-pointer group">
                    <div className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 ${role === "investor" ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg scale-105" : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"}`}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${role === "investor" ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gray-100 group-hover:bg-emerald-100"}`}>
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
                    </div>
                  </div>

                  <div onClick={() => setRole("projectOwner")} className="cursor-pointer group">
                    <div className={`relative p-6 md:p-8 rounded-2xl border-2 transition-all duration-300 ${role === "projectOwner" ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-50 shadow-lg scale-105" : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-md"}`}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${role === "projectOwner" ? "bg-gradient-to-br from-emerald-500 to-green-600" : "bg-gray-100 group-hover:bg-emerald-100"}`}>
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
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-right">الاسم واللقب</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="أدخل الاسم الكامل"
                    className="w-full border-2 rounded-xl px-4 py-3 text-right border-gray-200 focus:border-emerald-500 focus:bg-emerald-50"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-right">رقم الهاتف</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="w-full border-2 rounded-xl px-4 py-3 text-right border-gray-200 focus:border-emerald-500 focus:bg-emerald-50"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-right">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="w-full border-2 rounded-xl px-4 py-3 text-right border-gray-200 focus:border-emerald-500 focus:bg-emerald-50"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-700 font-semibold mb-3 text-right">كلمة المرور</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="أدخل كلمة مرور قوية"
                    className="w-full border-2 rounded-xl px-4 py-3 text-right border-gray-200 focus:border-emerald-500 focus:bg-emerald-50"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-sm text-emerald-600 mt-1">
                    {showPassword ? "إخفاء" : "إظهار"} كلمة المرور
                  </button>
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={terms} onChange={() => setTerms(!terms)} className="w-5 h-5" />
                    أوافق على شروط وأحكام المنصة وسياسة الخصوصية
                  </label>
                </div>

                {/* Submit */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold py-3 rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all"
                >
                  إنشاء الحساب
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.5); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in { animation: scale-in 0.5s ease-out forwards; }
      `}</style>
    </section>
  );
}
