import { useState, useEffect, useCallback } from "react";
import { 
  FaSave, FaTimes, FaEdit, FaFacebookF, FaTwitter, FaLinkedinIn, 
  FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt, FaRocket,
  FaLink, FaTextHeight, FaGlobe, FaInfoCircle, FaCheckCircle,
  FaExclamationTriangle, FaSpinner, FaPlus, FaTrash, FaArrowUp, FaArrowDown
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function FooterEditor() {
  // Initial state matching your schema
  const [footerData, setFooterData] = useState({
    companyName: "منصتنا",
    companyDescription: "منصة رائدة للاستثمار والمشاريع الناشئة. نربط المستثمرين بالفرص الواعدة ونوفر بيئة آمنة وموثوقة للنمو والتطور.",
    email: "info@platform.com",
    phone: "+213 XXX XXX XXX",
    address: "الوادي، الجزائر",
    copyrightText: "© 2025 Ashrik Maana",
    
    // Social media links
    facebook: "#",
    twitter: "#",
    linkedin: "#",
    instagram: "#",
    
    // Toggle sections
    showQuickLinks: true,
    showContactInfo: true,
    showSocialMedia: true,
    showAdminAccess: true,
    
    // Quick links array
    quickLinks: [
      { name: "الرئيسية", url: "/" },
      { name: "من نحن", url: "/InfoSection" },
      { name: "المشاريع", url: "/projects" },
      { name: "اتصل بنا", url: "/contact" }
    ]
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [newQuickLink, setNewQuickLink] = useState({ name: "", url: "" });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

  // Fetch footer data
  const fetchFooterData = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");
      
      console.log("جاري جلب بيانات الفوتر من:", `${API_URL}/footer`);
      
      const response = await fetch(`${API_URL}/footer`, {
        headers: {
          'Accept': 'application/json',
          'Cache-Control': 'no-cache'
        }
      });
      
      console.log("استجابة الخادم:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`خطأ في السيرفر: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("بيانات الفوتر المستلمة:", data);
      
      if (data.success && data.footer) {
        setFooterData(data.footer);
        setSuccessMessage("✅ تم تحميل بيانات الفوتر بنجاح");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(data.message || "فشل في جلب البيانات");
      }
    } catch (err) {
      console.error("❌ خطأ في جلب بيانات الفوتر:", err);
      setErrorMessage(`⚠️ ${err.message} - يتم استخدام البيانات المحلية`);
      
      // Try to use localStorage backup
      const savedData = localStorage.getItem('footerDataBackup');
      if (savedData) {
        try {
          setFooterData(JSON.parse(savedData));
        } catch (e) {
          console.error("خطأ في تحليل البيانات المحفوظة:", e);
        }
      }
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchFooterData();
    
    // Check server connectivity
    const checkServer = async () => {
      try {
        const response = await fetch(`${API_URL}/health`);
        console.log("حالة الخادم:", response.ok ? "🟢 متصل" : "🔴 غير متصل");
      } catch (err) {
        console.error("الخادم غير متوفر:", err.message);
      }
    };
    
    checkServer();
  }, [fetchFooterData]);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setFooterData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle toggle changes
  const handleToggleChange = (field) => {
    setFooterData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle quick link changes
  const handleQuickLinkChange = (index, field, value) => {
    const updatedLinks = [...footerData.quickLinks];
    updatedLinks[index][field] = value;
    setFooterData(prev => ({
      ...prev,
      quickLinks: updatedLinks
    }));
  };

  // Add new quick link
  const addQuickLink = () => {
    if (!newQuickLink.name.trim() || !newQuickLink.url.trim()) {
      setErrorMessage("يرجى ملء اسم الرابط والمسار");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    setFooterData(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, { ...newQuickLink }]
    }));
    
    setNewQuickLink({ name: "", url: "" });
    setSuccessMessage("تم إضافة رابط جديد");
    setTimeout(() => setSuccessMessage(""), 2000);
  };

  // Remove quick link
  const removeQuickLink = (index) => {
    const updatedLinks = [...footerData.quickLinks];
    updatedLinks.splice(index, 1);
    setFooterData(prev => ({
      ...prev,
      quickLinks: updatedLinks
    }));
  };

  // Move quick link up
  const moveQuickLinkUp = (index) => {
    if (index === 0) return;
    const updatedLinks = [...footerData.quickLinks];
    const temp = updatedLinks[index];
    updatedLinks[index] = updatedLinks[index - 1];
    updatedLinks[index - 1] = temp;
    setFooterData(prev => ({
      ...prev,
      quickLinks: updatedLinks
    }));
  };

  // Move quick link down
  const moveQuickLinkDown = (index) => {
    if (index === footerData.quickLinks.length - 1) return;
    const updatedLinks = [...footerData.quickLinks];
    const temp = updatedLinks[index];
    updatedLinks[index] = updatedLinks[index + 1];
    updatedLinks[index + 1] = temp;
    setFooterData(prev => ({
      ...prev,
      quickLinks: updatedLinks
    }));
  };

  // Save footer data
  const handleSave = async () => {
    try {
      setSaving(true);
      setErrorMessage("");
      setSuccessMessage("");
      
      // Validate required fields
      if (!footerData.companyName?.trim()) {
        setErrorMessage("اسم الشركة مطلوب");
        setSaving(false);
        return;
      }

      // Get authentication token
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setErrorMessage("يرجى تسجيل الدخول أولاً");
        setSaving(false);
        return;
      }

      console.log("جاري حفظ البيانات:", footerData);

      // Save to backend
      const response = await fetch(`${API_URL}/footer/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        },
        body: JSON.stringify(footerData)
      });

      console.log("استجابة الحفظ:", response.status);

      // Handle response
      if (!response.ok) {
        const errorText = await response.text();
        console.error("تفاصيل الخطأ:", errorText);
        throw new Error(`خطأ في السيرفر (${response.status})`);
      }

      const data = await response.json();
      console.log("بيانات الاستجابة:", data);

      if (data.success) {
        setSuccessMessage("✅ تم حفظ التعديلات بنجاح!");
        // Backup to localStorage
        localStorage.setItem('footerDataBackup', JSON.stringify(footerData));
        
        // Refresh data
        setTimeout(() => {
          fetchFooterData();
          setSuccessMessage("");
        }, 2000);
      } else {
        throw new Error(data.message || "فشل في حفظ البيانات");
      }
    } catch (err) {
      console.error("❌ خطأ في الحفظ:", err);
      setErrorMessage(`⚠️ ${err.message}`);
      
      // Backup locally even if server fails
      localStorage.setItem('footerDataBackup', JSON.stringify(footerData));
      setSuccessMessage("⚠️ تم حفظ البيانات محلياً فقط");
      setTimeout(() => setSuccessMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  // Test connection button
  const testConnection = async () => {
    try {
      setErrorMessage("");
      setSuccessMessage("جاري اختبار الاتصال...");
      
      const response = await fetch(`${API_URL}/footer`);
      if (response.ok) {
        setSuccessMessage("✅ الاتصال بالخادم ناجح!");
      } else {
        setErrorMessage(`❌ خطأ في الاتصال: ${response.status}`);
      }
    } catch (err) {
      setErrorMessage(`❌ فشل الاتصال: ${err.message}`);
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل بيانات الفوتر...</p>
        <button 
          onClick={testConnection}
          className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg"
        >
          اختبار الاتصال بالخادم
        </button>
      </div>
    );
  }

  // Main content
  const content = (
    <div className="bg-gradient-to-br from-gray-50 to-emerald-50 min-h-screen">
      {/* Status Bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={testConnection}
                className="flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-sm hover:bg-emerald-200"
              >
                <FaSpinner className="text-xs" />
                اختبار الاتصال
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              {successMessage && (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  <FaCheckCircle />
                  <span>{successMessage}</span>
                </div>
              )}
              
              {errorMessage && (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg border border-red-200">
                  <FaExclamationTriangle />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
              محرر الفوتر
            </h1>
            <p className="text-gray-600">
              قم بتعديل محتوى تذييل الموقع والمعلومات المتعلقة بالشركة
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <FaSpinner className="animate-spin" />
                جاري الحفظ...
              </>
            ) : (
              <>
                <FaSave />
                حفظ التغييرات
              </>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        {/* Company Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FaInfoCircle className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">معلومات الشركة</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Company Name */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                اسم الشركة
              </label>
              <input
                type="text"
                value={footerData.companyName}
                onChange={(e) => handleInputChange('companyName', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="اسم الشركة"
              />
            </div>

            {/* Copyright Text */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                نص حقوق النشر
              </label>
              <input
                type="text"
                value={footerData.copyrightText}
                onChange={(e) => handleInputChange('copyrightText', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="نص حقوق النشر"
              />
            </div>

            {/* Company Description */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2 font-medium">
                وصف الشركة
              </label>
              <textarea
                value={footerData.companyDescription}
                onChange={(e) => handleInputChange('companyDescription', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 h-32"
                placeholder="وصف الشركة"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FaEnvelope className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">معلومات التواصل</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={footerData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="البريد الإلكتروني"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                رقم الهاتف
              </label>
              <input
                type="tel"
                value={footerData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="رقم الهاتف"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                العنوان
              </label>
              <input
                type="text"
                value={footerData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="العنوان"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FaGlobe className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">وسائل التواصل الاجتماعي</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Facebook */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                فيسبوك
              </label>
              <input
                type="url"
                value={footerData.facebook}
                onChange={(e) => handleInputChange('facebook', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="رابط فيسبوك"
              />
            </div>

            {/* Twitter */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                تويتر
              </label>
              <input
                type="url"
                value={footerData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="رابط تويتر"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                لينكدإن
              </label>
              <input
                type="url"
                value={footerData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="رابط لينكدإن"
              />
            </div>

            {/* Instagram */}
            <div>
              <label className="block text-gray-700 mb-2 font-medium">
                إنستغرام
              </label>
              <input
                type="url"
                value={footerData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                placeholder="رابط إنستغرام"
              />
            </div>
          </div>
        </div>

        {/* Quick Links Management */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FaLink className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">الروابط السريعة</h2>
          </div>

          {/* Add New Link Form */}
          <div className="bg-emerald-50 p-4 rounded-xl mb-6 border border-emerald-200">
            <h3 className="font-bold text-emerald-800 mb-3">إضافة رابط جديد</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 text-sm">اسم الرابط</label>
                <input
                  type="text"
                  value={newQuickLink.name}
                  onChange={(e) => setNewQuickLink(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                  placeholder="مثال: الرئيسية"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2 text-sm">مسار الرابط</label>
                <input
                  type="text"
                  value={newQuickLink.url}
                  onChange={(e) => setNewQuickLink(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                  placeholder="مثال: / أو /about"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addQuickLink}
                  className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                >
                  <FaPlus className="inline ml-1" /> إضافة
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links List */}
          <div className="space-y-4">
            {footerData.quickLinks.map((link, index) => (
              <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveQuickLinkUp(index)}
                    disabled={index === 0}
                    className="p-2 text-gray-500 hover:text-emerald-600 disabled:opacity-30"
                  >
                    <FaArrowUp />
                  </button>
                  <button
                    onClick={() => moveQuickLinkDown(index)}
                    disabled={index === footerData.quickLinks.length - 1}
                    className="p-2 text-gray-500 hover:text-emerald-600 disabled:opacity-30"
                  >
                    <FaArrowDown />
                  </button>
                </div>
                
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={link.name}
                      onChange={(e) => handleQuickLinkChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                      placeholder="اسم الرابط"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={link.url}
                      onChange={(e) => handleQuickLinkChange(index, 'url', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg"
                      placeholder="مسار الرابط"
                    />
                  </div>
                </div>
                
                <button
                  onClick={() => removeQuickLink(index)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Sections Toggle */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <FaTextHeight className="text-white text-lg" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">إظهار/إخفاء الأقسام</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Quick Links Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">روابط سريعة</p>
                <p className="text-sm text-gray-500">روابط التنقل الرئيسية</p>
              </div>
              <button
                onClick={() => handleToggleChange('showQuickLinks')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  footerData.showQuickLinks ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    footerData.showQuickLinks ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Contact Info Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">معلومات التواصل</p>
                <p className="text-sm text-gray-500">البريد، الهاتف، العنوان</p>
              </div>
              <button
                onClick={() => handleToggleChange('showContactInfo')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  footerData.showContactInfo ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    footerData.showContactInfo ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Social Media Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">وسائل التواصل</p>
                <p className="text-sm text-gray-500">روابط السوشيال ميديا</p>
              </div>
              <button
                onClick={() => handleToggleChange('showSocialMedia')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  footerData.showSocialMedia ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    footerData.showSocialMedia ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Admin Access Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div>
                <p className="font-medium text-gray-800">وصول المشرف</p>
                <p className="text-sm text-gray-500">أزرار الدخول/الخروج</p>
              </div>
              <button
                onClick={() => handleToggleChange('showAdminAccess')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  footerData.showAdminAccess ? 'bg-emerald-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    footerData.showAdminAccess ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-100 rounded-xl">
              <FaInfoCircle className="text-emerald-600 text-xl" />
            </div>
            <div>
              <h4 className="text-xl font-bold text-gray-800 mb-3">نصائح مهمة</h4>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  تأكد من تسجيل الدخول كمدير قبل الحفظ
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  إذا فشل الاتصال، سيتم حفظ البيانات محلياً
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  استخدم زر "اختبار الاتصال" للتحقق من الخادم
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return DashboardLayout ? (
    <DashboardLayout>
      {content}
    </DashboardLayout>
  ) : content;
}