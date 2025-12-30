import { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaUpload, FaImage, FaTextHeight } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AnimatedBanners() {
  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For banner management
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image: null, // Store the File object
    imageUrl: "", // For preview
    buttonText: "ابدأ الآن",
    buttonLink: "#",
    secondaryButtonText: "تعرف أكثر",
    secondaryButtonLink: "#",
    isActive: true
  });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Function to get full image URL
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    
    // If it's already a full URL (starts with http), return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // If it's a relative path starting with /uploads, prepend backend URL
    if (imageUrl.startsWith('/uploads')) {
      return `${BACKEND_URL}${imageUrl}`;
    }
    
    // If it's just a filename, construct the full URL
    return `${BACKEND_URL}/uploads/${imageUrl}`;
  };

  // Wrap fetchBanners in useCallback to prevent infinite re-renders
  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log("Fetching banners from:", `${API_URL}/banners`);
      
      const response = await fetch(`${API_URL}/banners`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error("فشل في تحميل البانرات");
      }
      
      const data = await response.json();
      console.log("Fetched banners:", data);
      
      if (data.success) {
        // Ensure all banners have full image URLs
        const bannersWithFullUrls = data.banners.map(banner => ({
          ...banner,
          imageUrl: getFullImageUrl(banner.imageUrl)
        }));
        setBanners(bannersWithFullUrls);
      } else {
        console.error("API returned error:", data.message);
      }
    } catch (err) {
      console.error("❌ Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchBanners();
    
    const timer = setInterval(() => {
      if (banners.length > 0) {
        setCurrent((prev) => (prev + 1) % banners.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [fetchBanners, banners.length]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة فقط');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    // Store file object for upload
    setFormData(prev => ({
      ...prev,
      image: file
    }));

    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      imageUrl: previewUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image && !editingBanner) {
      alert('يرجى اختيار صورة للبانر');
      return;
    }

    if (!formData.title || !formData.subtitle) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsSaving(true);
      
      const url = editingBanner 
        ? `${API_URL}/banners/${editingBanner._id}`
        : `${API_URL}/banners`;
      
      const method = editingBanner ? 'PUT' : 'POST';
      
      // Create FormData object
      const formDataObj = new FormData();
      
      // Add image file if exists (for new banners or when editing with new image)
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      // Add other form fields
      formDataObj.append('title', formData.title);
      formDataObj.append('subtitle', formData.subtitle);
      formDataObj.append('buttonText', formData.buttonText);
      formDataObj.append('buttonLink', formData.buttonLink);
      formDataObj.append('secondaryButtonText', formData.secondaryButtonText);
      formDataObj.append('secondaryButtonLink', formData.secondaryButtonLink);
      formDataObj.append('isActive', formData.isActive);
      
      console.log("Sending FormData to:", url);
      console.log("Method:", method);
      console.log("Form data:", {
        title: formData.title,
        subtitle: formData.subtitle,
        hasImage: !!formData.image,
        buttonText: formData.buttonText,
        isActive: formData.isActive
      });

      const response = await fetch(url, {
        method,
        body: formDataObj
      });

      const text = await response.text();
      console.log("Save response status:", response.status);
      console.log("Save response text:", text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error("Failed to parse response as JSON:", text);
        alert("استجابة غير صالحة من الخادم");
        return;
      }
      
      if (data.success) {
        alert(editingBanner ? 'تم تحديث البانر بنجاح' : 'تم إضافة البانر بنجاح');
        fetchBanners();
        resetForm();
      } else {
        alert(data.message || 'فشل في حفظ البانر');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء حفظ البانر: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا البانر؟')) return;

    try {
      const response = await fetch(`${API_URL}/banners/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم حذف البانر بنجاح');
        fetchBanners();
        if (current >= banners.length - 1) {
          setCurrent(0);
        }
      } else {
        alert(data.message || 'فشل في حذف البانر');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('حدث خطأ أثناء حذف البانر');
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      image: null, // Reset file object
      imageUrl: banner.imageUrl || "", // Use the full URL for preview
      buttonText: banner.buttonText || "ابدأ الآن",
      buttonLink: banner.buttonLink || "#",
      secondaryButtonText: banner.secondaryButtonText || "تعرف أكثر",
      secondaryButtonLink: banner.secondaryButtonLink || "#",
      isActive: banner.isActive !== undefined ? banner.isActive : true
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    // Clean up any blob URLs
    if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imageUrl);
    }
    
    setFormData({
      title: "",
      subtitle: "",
      image: null,
      imageUrl: "",
      buttonText: "ابدأ الآن",
      buttonLink: "#",
      secondaryButtonText: "تعرف أكثر",
      secondaryButtonLink: "#",
      isActive: true
    });
    setEditingBanner(null);
    setShowAddForm(false);
  };

  // Clean up blob URLs on unmount
  useEffect(() => {
    return () => {
      if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imageUrl);
      }
    };
  }, [formData.imageUrl]);

  // Wrap the content with DashboardLayout
  const content = (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
              إدارة البانرات المتحركة
            </h1>
            <p className="text-gray-600">
              قم بإضافة وتعديل البانرات الظاهرة في الصفحة الرئيسية
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-emerald-500/50"
          >
            <FaPlus /> إضافة بانر جديد
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
            <p className="text-gray-600 mb-2">عدد البانرات</p>
            <p className="text-3xl font-bold text-emerald-700">{banners.length}</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
            <p className="text-gray-600 mb-2">البانرات النشطة</p>
            <p className="text-3xl font-bold text-emerald-700">
              {banners.filter(b => b.isActive).length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-6 border border-emerald-100">
            <p className="text-gray-600 mb-2">البانرات المعروضة</p>
            <p className="text-3xl font-bold text-emerald-700">
              {banners.filter(b => b.isActive).length > 0 ? banners.filter(b => b.isActive).length : banners.length}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="mb-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingBanner ? 'تعديل البانر' : 'إضافة بانر جديد'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image Upload */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-3 font-medium">
                    صورة البانر {!editingBanner && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-emerald-200 rounded-xl p-8 hover:border-emerald-400 transition-colors bg-gray-50">
                    {formData.imageUrl ? (
                      <div className="relative w-full">
                        <img 
                          src={formData.imageUrl} 
                          alt="Preview" 
                          className="w-full h-64 object-cover rounded-lg"
                          onError={(e) => {
                            console.error("Image failed to load:", formData.imageUrl);
                            e.target.src = "https://via.placeholder.com/800x450?text=فشل+تحميل+الصورة";
                          }}
                        />
                        <div className="mt-2 text-sm text-gray-600">
                          {formData.image ? (
                            <span className="text-blue-600">🔄 صورة جديدة جاهزة للرفع</span>
                          ) : editingBanner ? (
                            <span className="text-green-600">✅ صورة حالية</span>
                          ) : (
                            <span className="text-amber-600">⚠️ يرجى اختيار صورة</span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if (formData.imageUrl.startsWith('blob:')) {
                              URL.revokeObjectURL(formData.imageUrl);
                            }
                            setFormData(prev => ({ 
                              ...prev, 
                              image: null,
                              imageUrl: "" 
                            }));
                          }}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ) : (
                      <>
                        <FaImage className="text-5xl text-emerald-400 mb-4" />
                        <p className="text-gray-600 mb-4">اسحب وأفلت صورة هنا أو انقر للاختيار</p>
                      </>
                    )}
                    
                    <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-lg cursor-pointer hover:from-emerald-600 hover:to-green-700 transition-all">
                      <FaUpload />
                      اختر صورة
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      الحجم الموصى به: 1920x1080 بكسل • الحد الأقصى: 5MB
                    </p>
                    {editingBanner && !formData.image && (
                      <p className="text-sm text-amber-600 mt-2">
                        ملاحظة: إذا لم تختَر صورة جديدة، سيتم الاحتفاظ بالصورة الحالية
                      </p>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    العنوان الرئيسي <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    placeholder="أدخل العنوان الرئيسي"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    العنوان الفرعي <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 h-32"
                    placeholder="أدخل العنوان الفرعي"
                    required
                  />
                </div>

                {/* Primary Button */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">زر الدعوة الأساسي</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="buttonText"
                      value={formData.buttonText}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      placeholder="نص الزر"
                    />
                    <input
                      type="url"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      placeholder="رابط الزر"
                    />
                  </div>
                </div>

                {/* Secondary Button */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">زر الدعوة الثانوي</label>
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="secondaryButtonText"
                      value={formData.secondaryButtonText}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      placeholder="نص الزر الثانوي"
                    />
                    <input
                      type="url"
                      name="secondaryButtonLink"
                      value={formData.secondaryButtonLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      placeholder="رابط الزر الثانوي"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 focus:ring-offset-white"
                    />
                    البانر نشط
                  </label>
                  <p className="text-sm text-gray-500">البانر غير النشط لن يظهر في العرض</p>
                </div>
              </div>

              {/* Required Fields Note */}
              <div className="text-sm text-amber-700 p-3 bg-amber-50 rounded-lg border border-amber-200">
                <span className="text-red-500">*</span> الحقول المطلوبة
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-green-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FaSave /> {editingBanner ? 'تحديث البانر' : 'حفظ البانر'}
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200 border border-gray-300"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Banners List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">قائمة البانرات ({banners.length})</h2>
          
          {banners.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-emerald-50 rounded-2xl border border-gray-200">
              <FaImage className="text-6xl text-emerald-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">لا توجد بانرات مضافة بعد</p>
              <p className="text-gray-500 mt-2">انقر على "إضافة بانر جديد" لبدء الإضافة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {banners.map((banner, index) => (
                <div 
                  key={banner._id || index}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-lg ${
                    banner.isActive ? 'border-emerald-200' : 'border-red-200'
                  } shadow-sm`}
                >
                  {/* Banner Image */}
                  <div 
                    className="h-48 w-full bg-cover bg-center relative"
                    style={{ 
                      backgroundImage: `url(${getFullImageUrl(banner.imageUrl)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!banner.isActive && (
                      <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                          غير نشط
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-bold text-lg truncate">{banner.title}</h3>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 rounded-full px-3 py-1 text-white text-sm">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Banner Info */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {banner.subtitle}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(banner)}
                          className="flex items-center gap-1 px-3 py-2 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 hover:text-emerald-800 transition-colors border border-emerald-200"
                        >
                          <FaEdit /> تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 hover:text-red-800 transition-colors border border-red-200"
                        >
                          <FaTrash /> حذف
                        </button>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        banner.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {banner.isActive ? 'نشط' : 'غير نشط'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Section */}
        {banners.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">معاينة البانرات</h2>
            
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl border border-gray-300">
              {/* Background Images */}
              {banners.map((banner, idx) => (
                <div
                  key={banner._id}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                  style={{
                    backgroundImage: `url(${getFullImageUrl(banner.imageUrl)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ))}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="relative h-full flex items-center justify-center p-8">
                {banners.map((banner, idx) => (
                  <div
                    key={banner._id}
                    className={`text-center transition-all duration-1000 ${
                      idx === current
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8 absolute"
                    }`}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {banner.title}
                    </h3>
                    <p className="text-lg text-gray-100 mb-6 max-w-2xl">
                      {banner.subtitle}
                    </p>
                  </div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === current
                        ? "bg-emerald-500 w-8"
                        : "bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 text-center text-gray-500 text-sm">
              البانرات تتغير تلقائياً كل 5 ثواني. انقر على النقاط للتنقل يدوياً.
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="max-w-7xl mx-auto mt-8 p-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100">
        <div className="flex items-start gap-3">
          <div className="text-emerald-500 mt-1">
            <FaTextHeight />
          </div>
          <div>
            <h4 className="text-gray-800 font-bold mb-2">نصائح للبانرات الفعالة:</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• استخدم صور عالية الجودة بدقة 1920x1080 بكسل على الأقل</li>
              <li>• اختر ألواناً تتناسب مع هوية الموقع</li>
              <li>• اجعل النصوص واضحة وقصيرة وجذابة</li>
              <li>• تأكد من أن روابط الأزرار تعمل بشكل صحيح</li>
              <li>• لا تزيد عدد البانرات عن 5 للحفاظ على سرعة التحميل</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  // If DashboardLayout component exists, wrap the content with it
  // Otherwise return the content directly
  return DashboardLayout ? (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        content
      )}
    </DashboardLayout>
  ) : (
    <div className="bg-white min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : (
        content
      )}
    </div>
  );
}