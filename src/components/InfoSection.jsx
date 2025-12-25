import { useState } from "react";

export default function InfoSection() {
  const [activeTab, setActiveTab] = useState("about");

  return (
    <section id="info" className="relative py-20 md:py-28 overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-green-50"></div>
      
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block mb-6">
            <div className="w-16 h-16 md:w-20 md:h-20 mx-auto bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-xl">
              <svg className="w-9 h-9 md:w-11 md:h-11 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 mb-4">
            معلومات المنصة
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            تعرف على منصة أشرك معنا وكيفية التواصل معنا
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100 p-2 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button
              onClick={() => setActiveTab("about")}
              className={`py-4 px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
                activeTab === "about"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-emerald-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>عن المؤسسة</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("contact")}
              className={`py-4 px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
                activeTab === "contact"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-emerald-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>معلومات الاتصال</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("terms")}
              className={`py-4 px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
                activeTab === "terms"
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105"
                  : "text-gray-600 hover:bg-emerald-50"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>شروط الاستخدام</span>
              </div>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden">
          {/* About Tab */}
          {activeTab === "about" && (
            <div className="p-8 md:p-12 animate-fade-in">
              <div className="space-y-8">
                {/* Company Info */}
                <div>
                  <h3 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-6 text-right">
                    عن منصة أشرك معنا
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed text-right mb-6">
                    منصة أشرك معنا هي منصة رائدة في مجال الاستثمار التساهمي في الجزائر، حيث نربط بين أصحاب المشاريع الواعدة والمستثمرين الذين يبحثون عن فرص استثمارية مجزية. نهدف إلى تعزيز ثقافة الاستثمار المشترك وبناء اقتصاد قوي يعتمد على التعاون والشفافية.
                  </p>
                </div>

                {/* Services Grid */}
                <div>
                  <h4 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-right">
                    الخدمات التي نقدمها
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Service 1 */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-right">
                          <h5 className="text-xl font-bold text-emerald-600 mb-2">فرص استثمارية متنوعة</h5>
                          <p className="text-gray-600">نوفر مجموعة واسعة من المشاريع في مختلف القطاعات للاستثمار فيها بكل ثقة وشفافية.</p>
                        </div>
                      </div>
                    </div>

                    {/* Service 2 */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-right">
                          <h5 className="text-xl font-bold text-emerald-600 mb-2">تمويل آمن وموثوق</h5>
                          <p className="text-gray-600">نضمن عمليات تمويل آمنة ومراقبة بدقة لحماية حقوق جميع الأطراف.</p>
                        </div>
                      </div>
                    </div>

                    {/* Service 3 */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                        <div className="text-right">
                          <h5 className="text-xl font-bold text-emerald-600 mb-2">تتبع دقيق للاستثمارات</h5>
                          <p className="text-gray-600">لوحة تحكم متطورة تتيح لك متابعة استثماراتك وعوائدها بشكل لحظي.</p>
                        </div>
                      </div>
                    </div>

                    {/* Service 4 */}
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        <div className="text-right">
                          <h5 className="text-xl font-bold text-emerald-600 mb-2">دعم فني متواصل</h5>
                          <p className="text-gray-600">فريق دعم محترف متاح على مدار الساعة لمساعدتك في أي استفسار.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                    <h5 className="text-xl font-bold text-emerald-600 mb-3 text-right flex items-center justify-end gap-2">
                      <span>رؤيتنا</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </h5>
                    <p className="text-gray-700 text-right leading-relaxed">
                      أن نكون المنصة الرائدة في الجزائر والمنطقة العربية للاستثمار التساهمي، ونساهم في بناء اقتصاد قوي يعتمد على التعاون والشراكة.
                    </p>
                  </div>

                  <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                    <h5 className="text-xl font-bold text-emerald-600 mb-3 text-right flex items-center justify-end gap-2">
                      <span>رسالتنا</span>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </h5>
                    <p className="text-gray-700 text-right leading-relaxed">
                      توفير منصة آمنة وشفافة تربط المستثمرين بأصحاب المشاريع، وتساعد على تحقيق النمو الاقتصادي من خلال الاستثمار المسؤول.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="p-8 md:p-12 animate-fade-in">
              <div className="space-y-8">
                <h3 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-8 text-right">
                  تواصل معنا
                </h3>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all hover:scale-105">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">العنوان</h4>
                      <p className="text-gray-600 leading-relaxed">
                        الجزائر العاصمة، حي الأعمال<br />
                        الطابق 5، برج النور<br />
                        الجزائر 16000
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all hover:scale-105">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">الهاتف</h4>
                      <p className="text-gray-600 leading-relaxed">
                        <a href="tel:+213555123456" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                          +213 555 123 456
                        </a>
                        <br />
                        <a href="tel:+213555789012" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                          +213 555 789 012
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all hover:scale-105">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">البريد الإلكتروني</h4>
                      <p className="text-gray-600 leading-relaxed">
                        <a href="mailto:info@ashrakmana.dz" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                          info@ashrakmana.dz
                        </a>
                        <br />
                        <a href="mailto:support@ashrakmana.dz" className="text-emerald-600 hover:text-emerald-700 font-semibold">
                          support@ashrakmana.dz
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all hover:scale-105">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-800 mb-3">ساعات العمل</h4>
                      <p className="text-gray-600 leading-relaxed">
                        الأحد - الخميس<br />
                        من 9:00 صباحاً - 6:00 مساءً<br />
                        <span className="text-sm text-emerald-600 font-semibold">الدعم الفني متاح 24/7</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100 mt-8">
                  <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">تابعنا على وسائل التواصل الاجتماعي</h4>
                  <div className="flex flex-wrap justify-center gap-4">
                    <a href="https://facebook.com/ashrakmana" target="_blank" rel="noopener noreferrer" 
                       className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-emerald-600 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-green-600 hover:text-white transition-all hover:scale-110 shadow-md">
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms Tab */}
          {activeTab === "terms" && (
            <div className="p-8 md:p-12 animate-fade-in">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-8 text-right">
                  شروط وأحكام الاستخدام
                </h3>

                <div className="space-y-6 text-right">
                  {/* Section 1 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>١. القبول والموافقة</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">١</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      باستخدامك لمنصة أشرك معنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة. نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطارك بأي تغييرات جوهرية.
                    </p>
                  </div>

                  {/* Section 2 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>٢. التسجيل والحساب</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">٢</span>
                    </h4>
                    <ul className="text-gray-700 leading-relaxed space-y-2">
                      <li>• يجب أن تكون بعمر 18 عاماً على الأقل للتسجيل في المنصة</li>
                      <li>• يجب تقديم معلومات دقيقة وصحيحة عند التسجيل</li>
                      <li>• أنت مسؤول عن الحفاظ على سرية بيانات حسابك</li>
                      <li>• يحق لنا تعليق أو إلغاء حسابك في حالة انتهاك الشروط</li>
                    </ul>
                  </div>

                  {/* Section 3 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>٣. الاستثمار والمخاطر</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">٣</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      جميع الاستثمارات تنطوي على مخاطر، وقد تخسر كل أو جزء من رأس المال المستثمر. نحن لا نقدم أي ضمانات بشأن عوائد الاستثمار.
                    </p>
                    <ul className="text-gray-700 leading-relaxed space-y-2">
                      <li>• المنصة لا تقدم استشارات مالية أو استثمارية</li>
                      <li>• يجب عليك إجراء بحثك الخاص قبل أي استثمار</li>
                      <li>• ننصح بالتشاور مع مستشار مالي مرخص</li>
                      <li>• المنصة ليست مسؤولة عن أي خسائر استثمارية</li>
                    </ul>
                  </div>

                  {/* Section 4 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>٤. الرسوم والعمولات</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">٤</span>
                    </h4>
                    <ul className="text-gray-700 leading-relaxed space-y-2">
                      <li>• تفرض المنصة رسوماً ونسب عمولة على بعض الخدمات</li>
                      <li>• سيتم إخطارك بجميع الرسوم قبل إتمام أي معاملة</li>
                      <li>• الرسوم قابلة للتغيير مع إخطار مسبق</li>
                      <li>• جميع الرسوم غير قابلة للاسترداد ما لم ينص على خلاف ذلك</li>
                    </ul>
                  </div>

                  {/* Section 5 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>٥. الخصوصية وحماية البيانات</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">٥</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed mb-3">
                      نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية وفقاً لسياسة الخصوصية الخاصة بنا.
                    </p>
                    <ul className="text-gray-700 leading-relaxed space-y-2">
                      <li>• نستخدم تقنيات تشفير متقدمة لحماية بياناتك</li>
                      <li>• لن نشارك بياناتك مع أطراف ثالثة دون موافقتك</li>
                      <li>• يحق لك طلب حذف أو تعديل بياناتك الشخصية</li>
                      <li>• نحتفظ ببياناتك للمدة اللازمة وفقاً للقانون</li>
                    </ul>
                  </div>

                  {/* Section 6 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>٦. الملكية الفكرية</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">٦</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      جميع المحتويات والعلامات التجارية والشعارات الموجودة على المنصة هي ملك لشركة أشرك معنا أو مرخصة لها. يحظر استخدامها دون إذن كتابي مسبق.
                    </p>
                  </div>

                  {/* Section 7 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>٧. السلوك المحظور</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">٧</span>
                    </h4>
                    <ul className="text-gray-700 leading-relaxed space-y-2">
                      <li>• استخدام المنصة لأغراض غير قانونية أو احتيالية</li>
                      <li>• نشر محتوى مسيء أو مضلل أو غير لائق</li>
                      <li>• محاولة اختراق أو التلاعب بأنظمة المنصة</li>
                      <li>• انتهاك حقوق المستخدمين الآخرين أو خصوصيتهم</li>
                      <li>• استخدام حسابات وهمية أو متعددة لنفس الشخص</li>
                    </ul>
                  </div>

                  {/* Section 8 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>٨. إخلاء المسؤولية</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">٨</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      المنصة مقدمة "كما هي" دون أي ضمانات صريحة أو ضمنية. لا نضمن أن الخدمة ستكون متاحة دائماً أو خالية من الأخطاء. لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام المنصة.
                    </p>
                  </div>

                  {/* Section 9 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>٩. القانون الحاكم</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">٩</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      تخضع هذه الشروط والأحكام لقوانين الجمهورية الجزائرية الديمقراطية الشعبية. أي نزاع ينشأ عن هذه الشروط سيتم حله في المحاكم المختصة في الجزائر.
                    </p>
                  </div>

                  {/* Section 10 */}
                  <div className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                    <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                      <span>١٠. التواصل والاستفسارات</span>
                      <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">١٠</span>
                    </h4>
                    <p className="text-gray-700 leading-relaxed">
                      إذا كان لديك أي استفسارات حول هذه الشروط والأحكام، يمكنك التواصل معنا عبر:
                    </p>
                    <div className="mt-3 space-y-2">
                      <p className="text-emerald-600 font-semibold">البريد الإلكتروني: legal@ashrakmana.dz</p>
                      <p className="text-emerald-600 font-semibold">الهاتف: +213 555 123 456</p>
                    </div>
                  </div>

                  {/* Last Updated */}
                  <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-6 text-center">
                    <p className="font-bold text-lg">آخر تحديث: ديسمبر 2024</p>
                    <p className="text-sm mt-2 opacity-90">
                      نوصي بمراجعة هذه الشروط بشكل دوري للاطلاع على أي تحديثات
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
                    