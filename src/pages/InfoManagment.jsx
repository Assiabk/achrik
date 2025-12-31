import { useState, useEffect, useCallback } from "react";
import { 
  FaSave, FaTimes, FaEdit, FaTrash, FaPlus, FaCheck,
  FaMoneyBill, FaShieldAlt, FaChartLine, FaHeadset, FaEye, FaRocket,
  FaPhone, FaBuilding, FaFileContract, FaGlobe, FaWhatsapp, FaFacebook,
  FaTwitter, FaLinkedin, FaInstagram, FaYoutube, FaTelegram
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function InfoManagement() {
  const API_URL = process.env.REACT_APP_API_URL || "https://achrikmaana.com/api";
  // Main state for info data
  const [infoData, setInfoData] = useState({
    about: {
      title: "",
      description: "",
      services: [],
      vision: "",
      mission: ""
    },
    contact: {
      title: "",
      address: "",
      phone: [],
      email: [],
      workingHours: "",
      socialMedia: []
    },
    terms: {
      title: "",
      lastUpdated: "",
      sections: []
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("about");
  const [editingService, setEditingService] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showSocialForm, setShowSocialForm] = useState(false);
  
  // Form states
  const [serviceForm, setServiceForm] = useState({
    title: "",
    description: "",
    icon: "money"
  });
  
  const [sectionForm, setSectionForm] = useState({
    title: "",
    content: "",
    items: [""]
  });
  
  const [socialForm, setSocialForm] = useState({
    platform: "whatsapp",
    name: "",
    url: "",
    icon: ""
  });
  
  const icons = [
    { value: "money", label: "فرص استثمارية", component: FaMoneyBill },
    { value: "secure", label: "تمويل آمن", component: FaShieldAlt },
    { value: "tracking", label: "تتبع الاستثمارات", component: FaChartLine },
    { value: "support", label: "دعم فني", component: FaHeadset },
    { value: "vision", label: "رؤية", component: FaEye },
    { value: "mission", label: "رسالة", component: FaRocket }
  ];
  
  const platforms = [
    { value: "whatsapp", label: "واتساب", color: "text-emerald-600", icon: FaWhatsapp },
    { value: "facebook", label: "فيسبوك", color: "text-blue-600", icon: FaFacebook },
    { value: "twitter", label: "تويتر", color: "text-sky-500", icon: FaTwitter },
    { value: "linkedin", label: "لينكدإن", color: "text-blue-700", icon: FaLinkedin },
    { value: "instagram", label: "انستجرام", color: "text-pink-600", icon: FaInstagram },
    { value: "youtube", label: "يوتيوب", color: "text-red-600", icon: FaYoutube },
    { value: "telegram", label: "تلجرام", color: "text-blue-500", icon: FaTelegram }
  ];

  // Fetch data on load
  useEffect(() => {
    fetchInfoData();
  }, []);

  const fetchInfoData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/info`);
      
      if (!response.ok) {
        // If no data exists, start with empty data
        console.log("Starting with empty data");
        setLoading(false);
        return;
      }
      
      const data = await response.json();
      if (data.success && data.data) {
        setInfoData(data.data);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const saveData = async (section) => {
    try {
      setSaving(true);
      
      const response = await fetch(`${API_URL}/info/${section}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(infoData[section])
      });
  
      const data = await response.json();
      
      if (data.success) {
        alert(`تم حفظ ${getSectionName(section)} بنجاح`);
      } else {
        alert('فشل في الحفظ');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const saveAllData = async () => {
    try {
      setSaving(true);
      const response = await fetch(`${API_URL}/info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(infoData)
      });

      const data = await response.json();
      if (data.success) {
        alert('تم حفظ جميع البيانات بنجاح');
      } else {
        alert('فشل في الحفظ');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء الحفظ');
    } finally {
      setSaving(false);
    }
  };

  const getSectionName = (section) => {
    switch(section) {
      case 'about': return 'عن المنصة';
      case 'contact': return 'معلومات الاتصال';
      case 'terms': return 'الشروط والأحكام';
      default: return section;
    }
  };

  // About tab handlers
  const handleAboutChange = (field, value) => {
    setInfoData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        [field]: value
      }
    }));
  };

  // Service handlers
  const handleAddService = () => {
    if (!serviceForm.title || !serviceForm.description) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newService = {
      id: editingService ? editingService.id : Date.now(),
      title: serviceForm.title,
      description: serviceForm.description,
      icon: serviceForm.icon
    };

    setInfoData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        services: editingService
          ? prev.about.services.map(s => s.id === editingService.id ? newService : s)
          : [...prev.about.services, newService]
      }
    }));

    resetServiceForm();
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      title: service.title,
      description: service.description,
      icon: service.icon
    });
    setShowServiceForm(true);
  };

  const handleDeleteService = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه الخدمة؟')) return;
    
    setInfoData(prev => ({
      ...prev,
      about: {
        ...prev.about,
        services: prev.about.services.filter(s => s.id !== id)
      }
    }));
  };

  const resetServiceForm = () => {
    setServiceForm({ title: "", description: "", icon: "money" });
    setEditingService(null);
    setShowServiceForm(false);
  };

  // Contact tab handlers
  const handleContactChange = (field, value) => {
    setInfoData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        [field]: value
      }
    }));
  };

  const handlePhoneChange = (index, value) => {
    const newPhones = [...infoData.contact.phone];
    newPhones[index] = value;
    handleContactChange('phone', newPhones);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...infoData.contact.email];
    newEmails[index] = value;
    handleContactChange('email', newEmails);
  };

  const addPhone = () => {
    handleContactChange('phone', [...infoData.contact.phone, '']);
  };

  const removePhone = (index) => {
    const newPhones = infoData.contact.phone.filter((_, i) => i !== index);
    handleContactChange('phone', newPhones);
  };

  const addEmail = () => {
    handleContactChange('email', [...infoData.contact.email, '']);
  };

  const removeEmail = (index) => {
    const newEmails = infoData.contact.email.filter((_, i) => i !== index);
    handleContactChange('email', newEmails);
  };

  // Social media handlers
  const handleAddSocial = () => {
    if (!socialForm.name || !socialForm.url) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    const newSocial = {
      id: Date.now(),
      platform: socialForm.platform,
      name: socialForm.name,
      url: socialForm.url,
      icon: socialForm.platform
    };

    setInfoData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        socialMedia: [...prev.contact.socialMedia, newSocial]
      }
    }));

    resetSocialForm();
  };

  const handleDeleteSocial = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف وسيلة التواصل هذه؟')) return;
    
    setInfoData(prev => ({
      ...prev,
      contact: {
        ...prev.contact,
        socialMedia: prev.contact.socialMedia.filter(s => s.id !== id)
      }
    }));
  };

  const resetSocialForm = () => {
    setSocialForm({ platform: "whatsapp", name: "", url: "", icon: "" });
    setShowSocialForm(false);
  };

  // Terms tab handlers
  const handleTermsChange = (field, value) => {
    setInfoData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        [field]: value
      }
    }));
  };

  // Section handlers
  const handleAddSection = () => {
    if (!sectionForm.title) {
      alert('يرجى إدخال عنوان القسم');
      return;
    }

    const newSection = {
      id: editingSection ? editingSection.id : Date.now(),
      title: sectionForm.title,
      content: sectionForm.content || "",
      items: sectionForm.items.filter(item => item.trim() !== "")
    };

    setInfoData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        sections: editingSection
          ? prev.terms.sections.map(s => s.id === editingSection.id ? newSection : s)
          : [...prev.terms.sections, newSection]
      }
    }));

    resetSectionForm();
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setSectionForm({
      title: section.title,
      content: section.content || "",
      items: section.items?.length > 0 ? section.items : [""]
    });
    setShowSectionForm(true);
  };

  const handleDeleteSection = (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا القسم؟')) return;
    
    setInfoData(prev => ({
      ...prev,
      terms: {
        ...prev.terms,
        sections: prev.terms.sections.filter(s => s.id !== id)
      }
    }));
  };

  const resetSectionForm = () => {
    setSectionForm({ title: "", content: "", items: [""] });
    setEditingSection(null);
    setShowSectionForm(false);
  };

  const handleSectionItemChange = (index, value) => {
    const newItems = [...sectionForm.items];
    newItems[index] = value;
    setSectionForm(prev => ({ ...prev, items: newItems }));
  };

  const addSectionItem = () => {
    setSectionForm(prev => ({ ...prev, items: [...prev.items, ""] }));
  };

  const removeSectionItem = (index) => {
    const newItems = sectionForm.items.filter((_, i) => i !== index);
    setSectionForm(prev => ({ ...prev, items: newItems }));
  };

  const getIconComponent = (iconName) => {
    const icon = icons.find(i => i.value === iconName);
    return icon ? icon.component : FaBuilding;
  };

  const getPlatformIcon = (platform) => {
    const platformData = platforms.find(p => p.value === platform);
    return platformData ? platformData.icon : FaGlobe;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="bg-white min-h-screen p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
              إدارة معلومات المنصة
            </h1>
            <p className="text-gray-600">
              قم بإدارة المحتوى الخاص بصفحة معلومات المنصة (عن المنصة، الاتصال، الشروط)
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-2 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {[
                { id: "about", label: "عن المنصة", icon: FaBuilding },
                { id: "contact", label: "معلومات الاتصال", icon: FaPhone },
                { id: "terms", label: "الشروط والأحكام", icon: FaFileContract }
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

          {/* Save All Button */}
          <div className="mb-8">
            <button
              onClick={saveAllData}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <FaSave /> حفظ جميع البيانات
                </>
              )}
            </button>
          </div>

          {/* About Tab Content */}
          {activeTab === "about" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-emerald-600 mb-6">عن المنصة</h2>
                
                {/* Main About Section */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">عنوان القسم</label>
                    <input
                      type="text"
                      value={infoData.about.title || ""}
                      onChange={(e) => handleAboutChange("title", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      placeholder="عنوان قسم عن المنصة"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">وصف المنصة</label>
                    <textarea
                      value={infoData.about.description || ""}
                      onChange={(e) => handleAboutChange("description", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 h-32"
                      placeholder="وصف مفصل عن المنصة"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">رؤيتنا</label>
                      <textarea
                        value={infoData.about.vision || ""}
                        onChange={(e) => handleAboutChange("vision", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 h-32"
                        placeholder="رؤية المنصة"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">رسالتنا</label>
                      <textarea
                        value={infoData.about.mission || ""}
                        onChange={(e) => handleAboutChange("mission", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 h-32"
                        placeholder="رسالة المنصة"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => saveData("about")}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200"
                    >
                      <FaSave /> حفظ بيانات عن المنصة
                    </button>
                  </div>
                </div>
              </div>

              {/* Services Management */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-emerald-600">الخدمات</h2>
                  <button
                    onClick={() => setShowServiceForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                  >
                    <FaPlus /> إضافة خدمة
                  </button>
                </div>

                {/* Service Form */}
                {showServiceForm && (
                  <div className="mb-8 bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-emerald-600">
                        {editingService ? 'تعديل الخدمة' : 'إضافة خدمة جديدة'}
                      </h3>
                      <button
                        onClick={resetServiceForm}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <FaTimes />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">عنوان الخدمة</label>
                        <input
                          type="text"
                          value={serviceForm.title}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                          placeholder="عنوان الخدمة"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2 font-medium">الأيقونة</label>
                        <select
                          value={serviceForm.icon}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, icon: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                        >
                          {icons.map(icon => (
                            <option key={icon.value} value={icon.value}>
                              {icon.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-700 mb-2 font-medium">وصف الخدمة</label>
                        <textarea
                          value={serviceForm.description}
                          onChange={(e) => setServiceForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl h-24"
                          placeholder="وصف الخدمة"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        onClick={handleAddService}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl"
                      >
                        <FaCheck /> {editingService ? 'تحديث الخدمة' : 'إضافة الخدمة'}
                      </button>
                      <button
                        onClick={resetServiceForm}
                        className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl"
                      >
                        إلغاء
                      </button>
                    </div>
                  </div>
                )}

                {/* Services List */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {infoData.about.services?.map(service => {
                    const Icon = getIconComponent(service.icon);
                    return (
                      <div key={service.id} className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h4 className="text-xl font-bold text-emerald-600">{service.title}</h4>
                              <p className="text-gray-600 mt-2">{service.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEditService(service)}
                              className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service.id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Contact Tab Content */}
          {activeTab === "contact" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-emerald-600 mb-6">معلومات الاتصال</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">عنوان القسم</label>
                    <input
                      type="text"
                      value={infoData.contact.title || ""}
                      onChange={(e) => handleContactChange("title", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                      placeholder="عنوان قسم الاتصال"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">العنوان</label>
                    <textarea
                      value={infoData.contact.address || ""}
                      onChange={(e) => handleContactChange("address", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl h-24"
                      placeholder="عنوان المؤسسة"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">أرقام الهاتف</label>
                    {infoData.contact.phone?.map((phone, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => handlePhoneChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                          placeholder="رقم الهاتف"
                        />
                        <button
                          onClick={() => removePhone(index)}
                          className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addPhone}
                      className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg"
                    >
                      <FaPlus /> إضافة رقم هاتف
                    </button>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">البريد الإلكتروني</label>
                    {infoData.contact.email?.map((email, index) => (
                      <div key={index} className="flex gap-2 mb-2">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleEmailChange(index, e.target.value)}
                          className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                          placeholder="البريد الإلكتروني"
                        />
                        <button
                          onClick={() => removeEmail(index)}
                          className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={addEmail}
                      className="mt-2 flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg"
                    >
                      <FaPlus /> إضافة بريد إلكتروني
                    </button>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2 font-medium">ساعات العمل</label>
                    <textarea
                      value={infoData.contact.workingHours || ""}
                      onChange={(e) => handleContactChange("workingHours", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl h-24"
                      placeholder="ساعات العمل"
                    />
                  </div>

                  {/* Social Media Management */}
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-emerald-600">وسائل التواصل الاجتماعي</h3>
                      <button
                        onClick={() => setShowSocialForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                      >
                        <FaPlus /> إضافة وسيلة تواصل
                      </button>
                    </div>

                    {showSocialForm && (
                      <div className="mb-6 bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-lg font-bold text-emerald-600">إضافة وسيلة تواصل</h4>
                          <button
                            onClick={resetSocialForm}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">المنصة</label>
                            <select
                              value={socialForm.platform}
                              onChange={(e) => setSocialForm(prev => ({ ...prev, platform: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                            >
                              {platforms.map(platform => (
                                <option key={platform.value} value={platform.value}>
                                  {platform.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">الاسم المعروض</label>
                            <input
                              type="text"
                              value={socialForm.name}
                              onChange={(e) => setSocialForm(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                              placeholder="اسم المنصة"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-gray-700 mb-2 font-medium">الرابط</label>
                            <input
                              type="url"
                              value={socialForm.url}
                              onChange={(e) => setSocialForm(prev => ({ ...prev, url: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                              placeholder="https://example.com/username"
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={handleAddSocial}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl"
                          >
                            <FaCheck /> إضافة
                          </button>
                          <button
                            onClick={resetSocialForm}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-4">
                      {infoData.contact.socialMedia?.map(social => {
                        const PlatformIcon = getPlatformIcon(social.platform);
                        const platformData = platforms.find(p => p.value === social.platform);
                        return (
                          <div key={social.id} className="relative bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className={`p-3 rounded-lg ${platformData?.color.replace('text-', 'bg-')} bg-opacity-10`}>
                                <PlatformIcon className={`w-6 h-6 ${platformData?.color}`} />
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-800">{social.name}</h5>
                                <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-sm text-emerald-600 hover:underline">
                                  {social.url}
                                </a>
                              </div>
                              <button
                                onClick={() => handleDeleteSocial(social.id)}
                                className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => saveData("contact")}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200"
                    >
                      <FaSave /> حفظ بيانات الاتصال
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Terms Tab Content */}
          {activeTab === "terms" && (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-emerald-600 mb-6">الشروط والأحكام</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">عنوان القسم</label>
                      <input
                        type="text"
                        value={infoData.terms.title || ""}
                        onChange={(e) => handleTermsChange("title", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                        placeholder="عنوان قسم الشروط"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2 font-medium">آخر تحديث</label>
                      <input
                        type="text"
                        value={infoData.terms.lastUpdated || ""}
                        onChange={(e) => handleTermsChange("lastUpdated", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl"
                        placeholder="ديسمبر 2024"
                      />
                    </div>
                  </div>

                  {/* Sections Management */}
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-emerald-600">أقسام الشروط</h3>
                      <button
                        onClick={() => setShowSectionForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
                      >
                        <FaPlus /> إضافة قسم
                      </button>
                    </div>

                    {/* Section Form */}
                    {showSectionForm && (
                      <div className="mb-8 bg-emerald-50 rounded-xl p-6 border border-emerald-200">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="text-xl font-bold text-emerald-600">
                            {editingSection ? 'تعديل القسم' : 'إضافة قسم جديد'}
                          </h4>
                          <button
                            onClick={resetSectionForm}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <FaTimes />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">عنوان القسم</label>
                            <input
                              type="text"
                              value={sectionForm.title}
                              onChange={(e) => setSectionForm(prev => ({ ...prev, title: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl"
                              placeholder="عنوان القسم"
                            />
                          </div>

                          <div>
                            <label className="block text-gray-700 mb-2 font-medium">المحتوى (اختياري)</label>
                            <textarea
                              value={sectionForm.content}
                              onChange={(e) => setSectionForm(prev => ({ ...prev, content: e.target.value }))}
                              className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl h-24"
                              placeholder="وصف القسم"
                            />
                          </div>

                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <label className="block text-gray-700 font-medium">النقاط (اختياري)</label>
                              <button
                                type="button"
                                onClick={addSectionItem}
                                className="text-sm flex items-center gap-1 text-emerald-600"
                              >
                                <FaPlus /> إضافة نقطة
                              </button>
                            </div>
                            {sectionForm.items.map((item, index) => (
                              <div key={index} className="flex gap-2 mb-2">
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => handleSectionItemChange(index, e.target.value)}
                                  className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl"
                                  placeholder="نقطة"
                                />
                                <button
                                  onClick={() => removeSectionItem(index)}
                                  className="px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200"
                                  disabled={sectionForm.items.length <= 1}
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex gap-4 mt-6">
                          <button
                            onClick={handleAddSection}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl"
                          >
                            <FaCheck /> {editingSection ? 'تحديث القسم' : 'إضافة القسم'}
                          </button>
                          <button
                            onClick={resetSectionForm}
                            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl"
                          >
                            إلغاء
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Sections List */}
                    <div className="space-y-4">
                      {infoData.terms.sections?.map(section => (
                        <div key={section.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-emerald-600 text-white rounded-lg flex items-center justify-center font-bold">
                                {section.id}
                              </div>
                              <div>
                                <h4 className="text-xl font-bold text-gray-800">{section.title}</h4>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditSection(section)}
                                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteSection(section.id)}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </div>

                          {section.content && (
                            <p className="text-gray-700 mb-4">{section.content}</p>
                          )}

                          {section.items && section.items.length > 0 && (
                            <ul className="space-y-2 text-gray-700">
                              {section.items.map((item, index) => (
                                <li key={index} className="flex items-start gap-2">
                                  <span className="text-emerald-600 mt-1">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => saveData("terms")}
                      disabled={saving}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200"
                    >
                      <FaSave /> حفظ الشروط والأحكام
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}