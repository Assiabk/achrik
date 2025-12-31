import { useState, useEffect } from "react";
import { 
  FaBuilding, FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, 
  FaWhatsapp, FaFacebook, FaTwitter, FaLinkedin, FaInstagram,
  FaYoutube, FaTelegram, FaMoneyBill, FaShieldAlt, FaChartLine,
  FaHeadset, FaEye, FaRocket, FaFileContract
} from "react-icons/fa";

export default function InfoSection() {
  const [activeTab, setActiveTab] = useState("about");
  const [infoData, setInfoData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "https://achrikmaana.com/api";

  // Fetch info data from backend
  useEffect(() => {
    const fetchInfoData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/info`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const result = await response.json();
        if (result.success && result.data) {
          // Process the data to handle items correctly
          const processedData = processInfoData(result.data);
          setInfoData(processedData);
        }
      } catch (err) {
        console.error("Error fetching info data:", err);
        setError("فشل في تحميل البيانات");
      } finally {
        setLoading(false);
      }
    };

    fetchInfoData();
  }, [API_URL]);

  // Process info data to handle items correctly
  const processInfoData = (data) => {
    if (!data) return null;
    
    const processed = { ...data };
    
    // Process terms sections items
    if (processed.terms && processed.terms.sections) {
      processed.terms.sections = processed.terms.sections.map(section => {
        if (!section) return section;
        
        const processedSection = { ...section };
        
        // Process items to ensure they are strings
        if (processedSection.items && Array.isArray(processedSection.items)) {
          processedSection.items = processedSection.items.map(item => {
            if (typeof item === 'object' && item !== null) {
              // If item is an object with text property, use text
              return item.text || '';
            }
            // If it's already a string, keep it
            return String(item || '');
          }).filter(item => item.trim() !== '');
        } else {
          processedSection.items = [];
        }
        
        return processedSection;
      });
    }
    
    return processed;
  };

  // Get icon component based on icon name
  const getIconComponent = (iconName) => {
    const icons = {
      money: FaMoneyBill,
      secure: FaShieldAlt,
      tracking: FaChartLine,
      support: FaHeadset,
      vision: FaEye,
      mission: FaRocket,
      building: FaBuilding
    };
    return icons[iconName] || FaBuilding;
  };

  // Get platform icon
  const getPlatformIcon = (platform) => {
    const platforms = {
      whatsapp: FaWhatsapp,
      facebook: FaFacebook,
      twitter: FaTwitter,
      linkedin: FaLinkedin,
      instagram: FaInstagram,
      youtube: FaYoutube,
      telegram: FaTelegram
    };
    return platforms[platform] || FaWhatsapp;
  };

  // Get platform color
  const getPlatformColor = (platform) => {
    const colors = {
      whatsapp: "text-emerald-600",
      facebook: "text-blue-600",
      twitter: "text-sky-500",
      linkedin: "text-blue-700",
      instagram: "text-pink-600",
      youtube: "text-red-600",
      telegram: "text-blue-500"
    };
    return colors[platform] || "text-emerald-600";
  };

  if (loading) {
    return (
      <section id="info" className="relative py-20 md:py-28 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="info" className="relative py-20 md:py-28 overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  // Use processed data or default data if no data from backend
  const data = infoData || {
    about: {
      title: "عن منصة أشرك معنا",
      description: "منصة أشرك معنا هي منصة رائدة في مجال الاستثمار التساهمي في الجزائر، حيث نربط بين أصحاب المشاريع الواعدة والمستثمرين الذين يبحثون عن فرص استثمارية مجزية. نهدف إلى تعزيز ثقافة الاستثمار المشترك وبناء اقتصاد قوي يعتمد على التعاون والشفافية.",
      services: [
        {
          title: "فرص استثمارية متنوعة",
          description: "نوفر مجموعة واسعة من المشاريع في مختلف القطاعات للاستثمار فيها بكل ثقة وشفافية.",
          icon: "money"
        },
        {
          title: "تمويل آمن وموثوق",
          description: "نضمن عمليات تمويل آمنة ومراقبة بدقة لحماية حقوق جميع الأطراف.",
          icon: "secure"
        },
        {
          title: "تتبع دقيق للاستثمارات",
          description: "لوحة تحكم متطورة تتيح لك متابعة استثماراتك وعوائدها بشكل لحظي.",
          icon: "tracking"
        },
        {
          title: "دعم فني متواصل",
          description: "فريق دعم محترف متاح على مدار الساعة لمساعدتك في أي استفسار.",
          icon: "support"
        }
      ],
      vision: "أن نكون المنصة الرائدة في الجزائر والمنطقة العربية للاستثمار التساهمي، ونساهم في بناء اقتصاد قوي يعتمد على التعاون والشراكة.",
      mission: "توفير منصة آمنة وشفافة تربط المستثمرين بأصحاب المشاريع، وتساعد على تحقيق النمو الاقتصادي من خلال الاستثمار المسؤول."
    },
    contact: {
      title: "تواصل معنا",
      address: "الجزائر العاصمة، حي الأعمال\nالطابق 5، برج النور\nالجزائر 16000",
      phone: ["+213 555 123 456", "+213 555 789 012"],
      email: ["info@ashrakmana.dz", "support@ashrakmana.dz"],
      workingHours: "الأحد - الخميس\nمن 9:00 صباحاً - 6:00 مساءً\nالدعم الفني متاح 24/7",
      socialMedia: [
        {
          platform: "whatsapp",
          name: "واتساب",
          url: "https://whatsapp.com/ashrakmana",
          icon: "whatsapp"
        },
        {
          platform: "facebook",
          name: "فيسبوك",
          url: "https://facebook.com/ashrakmana",
          icon: "facebook"
        },
        {
          platform: "twitter",
          name: "تويتر",
          url: "https://twitter.com/ashrakmana",
          icon: "twitter"
        }
      ]
    },
    terms: {
      title: "شروط وأحكام الاستخدام",
      lastUpdated: "ديسمبر 2024",
      sections: [
        {
          title: "القبول والموافقة",
          content: "باستخدامك لمنصة أشرك معنا، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة. نحتفظ بالحق في تعديل هذه الشروط في أي وقت، وسيتم إخطارك بأي تغييرات جوهرية.",
          items: []
        },
        {
          title: "التسجيل والحساب",
          content: "متطلبات التسجيل واستخدام الحساب:",
          items: [
            "يجب أن تكون بعمر 18 عاماً على الأقل للتسجيل في المنصة",
            "يجب تقديم معلومات دقيقة وصحيحة عند التسجيل",
            "أنت مسؤول عن الحفاظ على سرية بيانات حسابك",
            "يحق لنا تعليق أو إلغاء حسابك في حالة انتهاك الشروط"
          ]
        }
      ]
    }
  };

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
              <FaBuilding className="w-9 h-9 md:w-11 md:h-11 text-white" />
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
            {[
              { id: "about", label: "عن المؤسسة", icon: FaBuilding },
              { id: "contact", label: "معلومات الاتصال", icon: FaPhone },
              { id: "terms", label: "شروط الاستخدام", icon: FaFileContract }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 rounded-xl font-bold text-base md:text-lg transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg scale-105"
                      : "text-gray-600 hover:bg-emerald-50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              );
            })}
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
                    {data.about.title || "عن منصة أشرك معنا"}
                  </h3>
                  <p className="text-gray-700 text-lg leading-relaxed text-right mb-6 whitespace-pre-line">
                    {data.about.description || ""}
                  </p>
                </div>

                {/* Services Grid */}
                {data.about.services && data.about.services.length > 0 && (
                  <div>
                    <h4 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-right">
                      الخدمات التي نقدمها
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {data.about.services.map((service, index) => {
                        const Icon = getIconComponent(service.icon);
                        return (
                          <div key={index} className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-lg transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Icon className="w-6 h-6 text-white" />
                              </div>
                              <div className="text-right">
                                <h5 className="text-xl font-bold text-emerald-600 mb-2">{service.title}</h5>
                                <p className="text-gray-600">{service.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Mission & Vision */}
                {(data.about.vision || data.about.mission) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    {data.about.vision && (
                      <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                        <h5 className="text-xl font-bold text-emerald-600 mb-3 text-right flex items-center justify-end gap-2">
                          <span>رؤيتنا</span>
                          <FaEye className="w-6 h-6" />
                        </h5>
                        <p className="text-gray-700 text-right leading-relaxed whitespace-pre-line">
                          {data.about.vision}
                        </p>
                      </div>
                    )}
                    
                    {data.about.mission && (
                      <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                        <h5 className="text-xl font-bold text-emerald-600 mb-3 text-right flex items-center justify-end gap-2">
                          <span>رسالتنا</span>
                          <FaRocket className="w-6 h-6" />
                        </h5>
                        <p className="text-gray-700 text-right leading-relaxed whitespace-pre-line">
                          {data.about.mission}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact Tab */}
          {activeTab === "contact" && (
            <div className="p-8 md:p-12 animate-fade-in">
              <div className="space-y-8">
                <h3 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-8 text-right">
                  {data.contact.title || "تواصل معنا"}
                </h3>

                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Address */}
                  {data.contact.address && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all hover:scale-105">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                          <FaMapMarkerAlt className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">العنوان</h4>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {data.contact.address}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Phone */}
                  {data.contact.phone && data.contact.phone.length > 0 && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all hover:scale-105">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                          <FaPhone className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">الهاتف</h4>
                        <div className="text-gray-600 leading-relaxed">
                          {data.contact.phone.map((phone, index) => (
                            <div key={index}>
                              <a href={`tel:${phone}`} className="text-emerald-600 hover:text-emerald-700 font-semibold block">
                                {phone}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Email */}
                  {data.contact.email && data.contact.email.length > 0 && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all hover:scale-105">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                          <FaEnvelope className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">البريد الإلكتروني</h4>
                        <div className="text-gray-600 leading-relaxed">
                          {data.contact.email.map((email, index) => (
                            <div key={index}>
                              <a href={`mailto:${email}`} className="text-emerald-600 hover:text-emerald-700 font-semibold block">
                                {email}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Working Hours */}
                  {data.contact.workingHours && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6 border border-emerald-100 hover:shadow-xl transition-all hover:scale-105">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4">
                          <FaClock className="w-8 h-8 text-white" />
                        </div>
                        <h4 className="text-xl font-bold text-gray-800 mb-3">ساعات العمل</h4>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                          {data.contact.workingHours}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Social Media */}
                {data.contact.socialMedia && data.contact.socialMedia.length > 0 && (
                  <div className="bg-emerald-50/50 rounded-2xl p-8 border border-emerald-100 mt-8">
                    <h4 className="text-2xl font-bold text-gray-800 mb-6 text-center">تابعنا على وسائل التواصل الاجتماعي</h4>
                    <div className="flex flex-wrap justify-center gap-4">
                      {data.contact.socialMedia.map((social, index) => {
                        const PlatformIcon = getPlatformIcon(social.platform);
                        const platformColor = getPlatformColor(social.platform);
                        return (
                          <a 
                            key={index}
                            href={social.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="w-14 h-14 bg-white rounded-xl flex items-center justify-center hover:bg-gradient-to-br hover:from-emerald-500 hover:to-green-600 hover:text-white transition-all hover:scale-110 shadow-md"
                          >
                            <PlatformIcon className={`w-7 h-7 ${platformColor}`} />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Terms Tab */}
          {activeTab === "terms" && (
            <div className="p-8 md:p-12 animate-fade-in">
              <div className="space-y-6">
                <h3 className="text-3xl md:text-4xl font-bold text-emerald-600 mb-8 text-right">
                  {data.terms.title || "شروط وأحكام الاستخدام"}
                </h3>

                <div className="space-y-6 text-right">
                  {/* Sections List */}
                  {data.terms.sections && data.terms.sections.map((section, index) => (
                    <div key={index} className="bg-emerald-50/30 rounded-xl p-6 border border-emerald-100">
                      <h4 className="text-xl font-bold text-gray-800 mb-3 flex items-center justify-end gap-2">
                        <span>{section.title}</span>
                        <span className="w-8 h-8 bg-emerald-600 text-white rounded-lg flex items-center justify-center text-sm">
                          {index + 1}
                        </span>
                      </h4>
                      {section.content && (
                        <p className="text-gray-700 leading-relaxed mb-3 whitespace-pre-line">
                          {section.content}
                        </p>
                      )}
                      {section.items && section.items.length > 0 && (
                        <ul className="text-gray-700 leading-relaxed space-y-2">
                          {section.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start gap-2">
                              <span className="text-emerald-600 mt-1">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}

                  {/* Last Updated */}
                  {data.terms.lastUpdated && (
                    <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl p-6 text-center">
                      <p className="font-bold text-lg">آخر تحديث: {data.terms.lastUpdated}</p>
                      <p className="text-sm mt-2 opacity-90">
                        نوصي بمراجعة هذه الشروط بشكل دوري للاطلاع على أي تحديثات
                      </p>
                    </div>
                  )}
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