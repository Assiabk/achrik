import { useState, useEffect, useCallback } from "react";
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes, FaUpload, FaImage, FaAd, FaLink, FaEye } from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

export default function AdsManagement() {
  const [current, setCurrent] = useState(0);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For ad management
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAd, setEditingAd] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: null,
    imageUrl: "",
    buttonText: "اعرف المزيد",
    buttonLink: "#",
    isActive: true,
    order: 0
  });

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Function to get full image URL
  const getFullImageUrl = (imageUrl) => {
    if (!imageUrl) return "";
    
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://') || imageUrl.startsWith('blob:') || imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    if (imageUrl.startsWith('/uploads')) {
      return `${BACKEND_URL}${imageUrl}`;
    }
    
    return `${BACKEND_URL}/uploads/${imageUrl}`;
  };

  const fetchAds = useCallback(async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_URL}/ads`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error("فشل في تحميل الإعلانات");
      }
      
      const data = await response.json();
      console.log("Fetched ads:", data);
      
      if (data.success) {
        const adsWithFullUrls = data.ads.map(ad => ({
          ...ad,
          imageUrl: getFullImageUrl(ad.imageUrl)
        }));
        setAds(adsWithFullUrls);
      }
    } catch (err) {
      console.error("❌ Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  }, [API_URL]);

  useEffect(() => {
    fetchAds();
    
    const timer = setInterval(() => {
      if (ads.length > 0) {
        setCurrent((prev) => (prev + 1) % ads.length);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [fetchAds, ads.length]);

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

    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة فقط');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
      return;
    }

    setFormData(prev => ({
      ...prev,
      image: file
    }));

    const previewUrl = URL.createObjectURL(file);
    setFormData(prev => ({
      ...prev,
      imageUrl: previewUrl
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.image && !editingAd) {
      alert('يرجى اختيار صورة للإعلان');
      return;
    }

    if (!formData.title || !formData.description) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsSaving(true);
      
      const url = editingAd 
        ? `${API_URL}/ads/${editingAd._id}`
        : `${API_URL}/ads`;
      
      const method = editingAd ? 'PUT' : 'POST';
      
      const formDataObj = new FormData();
      
      if (formData.image) {
        formDataObj.append('image', formData.image);
      }
      
      formDataObj.append('title', formData.title);
      formDataObj.append('description', formData.description);
      formDataObj.append('buttonText', formData.buttonText);
      formDataObj.append('buttonLink', formData.buttonLink);
      formDataObj.append('isActive', formData.isActive);
      formDataObj.append('order', formData.order || ads.length);

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
        alert(editingAd ? 'تم تحديث الإعلان بنجاح' : 'تم إضافة الإعلان بنجاح');
        fetchAds();
        resetForm();
      } else {
        alert(data.message || 'فشل في حفظ الإعلان');
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('حدث خطأ أثناء حفظ الإعلان: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const response = await fetch(`${API_URL}/ads/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      
      if (data.success) {
        alert('تم حذف الإعلان بنجاح');
        fetchAds();
        if (current >= ads.length - 1) {
          setCurrent(0);
        }
      } else {
        alert(data.message || 'فشل في حذف الإعلان');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('حدث خطأ أثناء حذف الإعلان');
    }
  };

  const handleEdit = (ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title || "",
      description: ad.description || "",
      image: null,
      imageUrl: ad.imageUrl || "",
      buttonText: ad.buttonText || "اعرف المزيد",
      buttonLink: ad.buttonLink || "#",
      isActive: ad.isActive !== undefined ? ad.isActive : true,
      order: ad.order || ads.length
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(formData.imageUrl);
    }
    
    setFormData({
      title: "",
      description: "",
      image: null,
      imageUrl: "",
      buttonText: "اعرف المزيد",
      buttonLink: "#",
      isActive: true,
      order: ads.length
    });
    setEditingAd(null);
    setShowAddForm(false);
  };

  useEffect(() => {
    return () => {
      if (formData.imageUrl && formData.imageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(formData.imageUrl);
      }
    };
  }, [formData.imageUrl]);

  // Content for the page
  const content = (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
              إدارة الإعلانات
            </h1>
            <p className="text-gray-600">
              قم بإضافة وتعديل الإعلانات الظاهرة في صفحة الإعلانات والمنشورات
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-green-500/50"
          >
            <FaPlus /> إضافة إعلان جديد
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <p className="text-gray-600 mb-2">عدد الإعلانات</p>
            <p className="text-3xl font-bold text-green-700">{ads.length}</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <p className="text-gray-600 mb-2">الإعلانات النشطة</p>
            <p className="text-3xl font-bold text-green-700">
              {ads.filter(ad => ad.isActive).length}
            </p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
            <p className="text-gray-600 mb-2">الإعلانات المعروضة</p>
            <p className="text-3xl font-bold text-green-700">
              {ads.filter(ad => ad.isActive).length > 0 ? ads.filter(ad => ad.isActive).length : ads.length}
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
                {editingAd ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}
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
                    صورة الإعلان {!editingAd && <span className="text-red-500">*</span>}
                  </label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-green-200 rounded-xl p-8 hover:border-green-400 transition-colors bg-gray-50">
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
                            <span className="text-green-600">🔄 صورة جديدة جاهزة للرفع</span>
                          ) : editingAd ? (
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
                        <FaImage className="text-5xl text-green-400 mb-4" />
                        <p className="text-gray-600 mb-4">اسحب وأفلت صورة هنا أو انقر للاختيار</p>
                      </>
                    )}
                    
                    <label className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg cursor-pointer hover:from-green-600 hover:to-emerald-700 transition-all">
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
                      الحجم الموصى به: 1920x500 بكسل • الحد الأقصى: 5MB
                    </p>
                    {editingAd && !formData.image && (
                      <p className="text-sm text-amber-600 mt-2">
                        ملاحظة: إذا لم تختَر صورة جديدة، سيتم الاحتفاظ بالصورة الحالية
                      </p>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    عنوان الإعلان <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="أدخل عنوان الإعلان"
                    required
                  />
                </div>

                {/* Order */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    الترتيب
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="رقم الترتيب"
                  />
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 mb-2 font-medium">
                    وصف الإعلان <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 h-32"
                    placeholder="أدخل وصف الإعلان"
                    required
                  />
                </div>

                {/* Button Text */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">نص الزر</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                    placeholder="نص الزر"
                  />
                </div>

                {/* Button Link */}
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">رابط الزر</label>
                  <div className="flex items-center gap-2">
                    <FaLink className="text-gray-400" />
                    <input
                      type="url"
                      name="buttonLink"
                      value={formData.buttonLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                      placeholder="رابط الزر"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="md:col-span-2">
                  <label className="flex items-center gap-2 text-gray-700 mb-2 font-medium">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={formData.isActive}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500 focus:ring-offset-white"
                    />
                    الإعلان نشط
                  </label>
                  <p className="text-sm text-gray-500">الإعلان غير النشط لن يظهر في العرض</p>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <FaSave /> {editingAd ? 'تحديث الإعلان' : 'حفظ الإعلان'}
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

        {/* Ads List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">قائمة الإعلانات ({ads.length})</h2>
          
          {ads.length === 0 ? (
            <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-green-50 rounded-2xl border border-gray-200">
              <FaAd className="text-6xl text-green-400 mx-auto mb-4" />
              <p className="text-xl text-gray-600">لا توجد إعلانات مضافة بعد</p>
              <p className="text-gray-500 mt-2">انقر على "إضافة إعلان جديد" لبدء الإضافة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ads.map((ad, index) => (
                <div 
                  key={ad._id || index}
                  className={`bg-white rounded-2xl overflow-hidden border transition-all hover:scale-[1.02] hover:shadow-lg ${
                    ad.isActive ? 'border-green-200' : 'border-red-200'
                  } shadow-sm`}
                >
                  {/* Ad Image */}
                  <div 
                    className="h-48 w-full bg-cover bg-center relative"
                    style={{ 
                      backgroundImage: `url(${getFullImageUrl(ad.imageUrl)})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  >
                    {!ad.isActive && (
                      <div className="absolute inset-0 bg-red-900/20 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                          غير نشط
                        </span>
                      </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                      <h3 className="text-white font-bold text-lg truncate">{ad.title}</h3>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/60 rounded-full px-3 py-1 text-white text-sm">
                      #{ad.order || index + 1}
                    </div>
                  </div>

                  {/* Ad Info */}
                  <div className="p-4">
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {ad.description}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(ad)}
                          className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 hover:text-green-800 transition-colors border border-green-200"
                        >
                          <FaEdit /> تعديل
                        </button>
                        <button
                          onClick={() => handleDelete(ad._id)}
                          className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 hover:text-red-800 transition-colors border border-red-200"
                        >
                          <FaTrash /> حذف
                        </button>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        ad.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {ad.isActive ? 'نشط' : 'غير نشط'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Preview Section */}
        {ads.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">معاينة الإعلانات</h2>
              <button 
                onClick={() => setCurrent((prev) => (prev + 1) % ads.length)}
                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
              >
                <FaEye /> التالي
              </button>
            </div>
            
            <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-xl border border-gray-300">
              {/* Background Images */}
              {ads.map((ad, idx) => (
                <div
                  key={ad._id}
                  className={`absolute inset-0 transition-all duration-1000 ${
                    idx === current ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
                  style={{
                    backgroundImage: `url(${getFullImageUrl(ad.imageUrl)})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              ))}

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-transparent"></div>

              {/* Content */}
              <div className="relative h-full flex items-end p-8">
                {ads.map((ad, idx) => (
                  <div
                    key={ad._id}
                    className={`transition-all duration-1000 ${
                      idx === current
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-8 absolute"
                    }`}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
                      {ad.title}
                    </h3>
                    <p className="text-lg text-gray-100 mb-6 max-w-2xl">
                      {ad.description}
                    </p>
                    <a
                      href={ad.buttonLink || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-colors"
                    >
                      {ad.buttonText || "اعرف المزيد"}
                    </a>
                  </div>
                ))}
              </div>

              {/* Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {ads.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrent(idx)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      idx === current
                        ? "bg-green-500 w-8"
                        : "bg-white/60 hover:bg-white"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="mt-4 text-center text-gray-500 text-sm">
              الإعلانات تتغير تلقائياً كل 5 ثواني. انقر على النقاط للتنقل يدوياً.
            </div>
          </div>
        )}
      </div>

      {/* Help Text */}
      <div className="max-w-7xl mx-auto mt-8 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="flex items-start gap-3">
          <div className="text-green-500 mt-1">
            <FaAd />
          </div>
          <div>
            <h4 className="text-gray-800 font-bold mb-2">نصائح للإعلانات الفعالة:</h4>
            <ul className="text-gray-600 text-sm space-y-1">
              <li>• استخدم صور عالية الجودة بدقة 1920x500 بكسل على الأقل (نسبة الطول للعرض)</li>
              <li>• اجعل العناوين جذابة وقصيرة (لا تزيد عن 10 كلمات)</li>
              <li>• الوصف يجب أن يكون واضحاً ويوفر معلومات كافية</li>
              <li>• تأكد من أن روابط الأزرار تعمل بشكل صحيح</li>
              <li>• رتب الإعلانات حسب الأهمية باستخدام حقل الترتيب</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return DashboardLayout ? (
    <DashboardLayout>
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        content
      )}
    </DashboardLayout>
  ) : (
    <div className="bg-white min-h-screen">
      {loading ? (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : (
        content
      )}
    </div>
  );
}