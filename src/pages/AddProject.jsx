import { useState, useRef } from "react";
import { 
  FiUpload, 
  FiBriefcase, 
  FiHome,
  FiMapPin, 
  FiDollarSign, 
  FiTarget,
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiUsers,
  FiFileText,
  FiUser,
  FiPhone,
  FiMail
} from "react-icons/fi";
import { 
  MdOutlineDescription, 
  MdAttachMoney,
  MdOutlineFileUpload
} from "react-icons/md";

export default function AddProject() {
  const [form, setForm] = useState({
    // Contact Information
    fullName: "",
    phone: "",
    email: "",
    
    // Project Information
    projectName: "",
    sector: "",
    type: "",
    companyName: "",
    companyType: "",
    location: "",
    product: "",
    cost: "",
    personalAmount: "",
    workers: "",
    clients: "",
    expectedClients: "",
    competitors: "",
    requirements: "",
    branches: "",
  });
  
  const [files, setFiles] = useState({
    certificates: [],
    economicStudy: null,
    complianceFiles: []
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  
  // Refs for file inputs
  const certificatesRef = useRef(null);
  const economicStudyRef = useRef(null);
  const complianceFilesRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '');
      const formatted = digitsOnly.replace(/(\d{2})(?=\d)/g, '$1 ');
      setForm({ ...form, [name]: formatted });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFileChange = (e, fileType) => {
    const selectedFiles = Array.from(e.target.files);
    
    if (fileType === 'certificates') {
      setFiles(prev => ({
        ...prev,
        certificates: [...prev.certificates, ...selectedFiles]
      }));
    } else if (fileType === 'economicStudy') {
      if (selectedFiles.length > 0) {
        setFiles(prev => ({
          ...prev,
          economicStudy: selectedFiles[0]
        }));
      }
    } else if (fileType === 'complianceFiles') {
      setFiles(prev => ({
        ...prev,
        complianceFiles: [...prev.complianceFiles, ...selectedFiles]
      }));
    }
  };

  const removeFile = (fileType, index) => {
    if (fileType === 'certificates') {
      setFiles(prev => ({
        ...prev,
        certificates: prev.certificates.filter((_, i) => i !== index)
      }));
    } else if (fileType === 'economicStudy') {
      setFiles(prev => ({
        ...prev,
        economicStudy: null
      }));
    } else if (fileType === 'complianceFiles') {
      setFiles(prev => ({
        ...prev,
        complianceFiles: prev.complianceFiles.filter((_, i) => i !== index)
      }));
    }
  };

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  // Validate email format
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Validate phone number format (Algerian format: 05 xx xx xx xx or 06 xx xx xx xx or 07 xx xx xx xx)
  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, '');
    return digitsOnly.length >= 9 && /^[0-9]{9,}$/.test(digitsOnly);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation for contact information
    if (!form.fullName) {
      showAlert('error', 'يرجى إدخال الاسم واللقب');
      return;
    }
    
    if (!form.phone) {
      showAlert('error', 'يرجى إدخال رقم الهاتف');
      return;
    }
    
    if (!form.email) {
      showAlert('error', 'يرجى إدخال البريد الإلكتروني');
      return;
    }
    
    // Validate email format
    if (!validateEmail(form.email)) {
      showAlert('error', 'يرجى إدخال بريد إلكتروني صحيح');
      return;
    }
    
    // Validate phone format
    if (!validatePhone(form.phone)) {
      showAlert('error', 'يرجى إدخال رقم هاتف صحيح (مثال: 05 12 34 56 78)');
      return;
    }
    
    setLoading(true);

    try {
      // تحقق من تكلفة المشروع (لا تتجاوز 20 مليون دج)
      const cost = parseFloat(form.cost) || 0;
      if (cost > 20000000) {
        showAlert('error', 'تكلفة المشروع يجب ألا تتجاوز 20,000,000 دج');
        setLoading(false);
        return;
      }

      // إنشاء FormData لإرسال النموذج والملفات
      const formData = new FormData();
      
      // إضافة بيانات النموذج (بما فيها معلومات الاتصال)
      Object.keys(form).forEach(key => {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      });
      
      // إضافة ملفات الشهادات
      files.certificates.forEach((file) => {
        formData.append('certificates', file);
      });
      
      // إضافة دراسة الجدوى الاقتصادية
      if (files.economicStudy) {
        formData.append('economicStudy', files.economicStudy);
      }
      
      // إضافة ملفات المطابقة
      files.complianceFiles.forEach((file) => {
        formData.append('complianceFiles', file);
      });

      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();

      if (res.ok) {
        showAlert('success', 'تم حفظ المشروع بنجاح');
        // إعادة تعيين النموذج والملفات
        setForm({
          // Contact Information
          fullName: "",
          phone: "",
          email: "",
          
          // Project Information
          projectName: "",
          sector: "",
          type: "",
          companyName: "",
          companyType: "",
          location: "",
          product: "",
          cost: "",
          personalAmount: "",
          workers: "",
          clients: "",
          expectedClients: "",
          competitors: "",
          requirements: "",
          branches: "",
        });
        setFiles({
          certificates: [],
          economicStudy: null,
          complianceFiles: []
        });
        
        // إعادة تعيين حقول الملفات
        if (certificatesRef.current) certificatesRef.current.value = '';
        if (economicStudyRef.current) economicStudyRef.current.value = '';
        if (complianceFilesRef.current) complianceFilesRef.current.value = '';
      } else {
        showAlert('error', 'حدث خطأ: ' + (data.message || "خطأ غير معروف"));
      }
    } catch (err) {
      console.error("Fetch error:", err);
      showAlert('error', 'حدث خطأ أثناء الاتصال بالخادم');
    }

    setLoading(false);
  };

  // مكون عرض الملفات
  const FileDisplay = ({ files, fileType, onRemove }) => {
    if (files.length === 0) return null;
    
    return (
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-semibold text-gray-600">الملفات المرفوعة:</h4>
        <div className="space-y-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center gap-3">
                <FiFileText className="text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRemove(fileType, index)}
                className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
              >
                <FiX className="text-lg" />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 p-4 md:p-8">
      {/* Alert Notification */}
      {alert.show && (
        <div className={`fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-slide-in`}>
          <div className={`rounded-xl shadow-2xl p-5 border-l-4 ${
            alert.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500' 
              : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                alert.type === 'success' 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {alert.type === 'success' ? (
                  <FiCheckCircle className="text-2xl" />
                ) : (
                  <FiAlertCircle className="text-2xl" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">
                  {alert.type === 'success' ? 'نجاح' : 'خطأ'}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{alert.message}</p>
              </div>
              <button
                onClick={() => setAlert({ show: false, type: '', message: '' })}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <FiX className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">إضافة مشروع جديد</h1>
          <p className="text-gray-600 text-lg">املأ النموذج أدناه لإضافة مشروعك الاستثماري</p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Form Grid */}
          <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-7">
              {/* Contact Information Card */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FiUser className="text-2xl text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">معلومات الاتصال</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الاسم واللقب الكامل *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        placeholder="أدخل الاسم واللقب الكامل"
                        className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                        required
                      />
                      <FiUser className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        رقم الهاتف *
                      </label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="مثال: 05 12 34 56 78"
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                          required
                          pattern="[0-9\s]{9,}"
                          title="يرجى إدخال رقم هاتف صحيح (9 أرقام على الأقل)"
                        />
                        <FiPhone className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">رقم هاتف للتواصل والمراسلات</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        البريد الإلكتروني *
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="example@domain.com"
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none"
                          required
                        />
                        <FiMail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-xs mt-1">لإرسال التحديثات والتواصل</p>
                    </div>
                  </div>

                  <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 mt-4">
                    <h4 className="font-semibold text-blue-800 mb-2 text-sm">ملاحظة:</h4>
                    <p className="text-sm text-blue-700">
                      سيتم استخدام هذه المعلومات للتواصل معك بخصوص المشروع. 
                      يرجى التأكد من صحة البيانات المدخلة.
                    </p>
                  </div>
                </div>
              </div>

              {/* Project Info Card */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-emerald-100 rounded-xl">
                    <FiBriefcase className="text-2xl text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">معلومات المشروع</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اسم المشروع / الشعار المقترح *
                    </label>
                    <div className="relative">
                      <input
                        name="projectName"
                        value={form.projectName}
                        onChange={handleChange}
                        placeholder="أدخل اسم المشروع أو الشعار المقترح"
                        className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none"
                        required
                      />
                      <FiBriefcase className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        القطاع *
                      </label>
                      <div className="relative">
                        <select
                          name="sector"
                          value={form.sector}
                          onChange={handleChange}
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none appearance-none"
                          required
                        >
                          <option value="">اختر قطاع المشروع</option>
                          <option value="فلاحي">فلاحي</option>
                          <option value="صناعي">صناعي</option>
                          <option value="تجاري">تجاري</option>
                          <option value="خدماتي">خدماتي</option>
                          <option value="تقني">تقني</option>
                          <option value="سياحي">سياحي</option>
                          <option value="تعليمي">تعليمي</option>
                          <option value="صحي">صحي</option>
                        </select>
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                          ▼
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        نوع المشروع *
                      </label>
                      <input
                        name="type"
                        value={form.type}
                        onChange={handleChange}
                        placeholder="مثال: صناعة الحليب"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Info Card */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-indigo-100 rounded-xl">
                    <FiHome className="text-2xl text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">معلومات الشركة</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اسم الشركة / المؤسسة *
                    </label>
                    <input
                      name="companyName"
                      value={form.companyName}
                      onChange={handleChange}
                      placeholder="اسم الشركة أو المؤسسة"
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        نوع المؤسسة *
                      </label>
                      <select
                        name="companyType"
                        value={form.companyType}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none appearance-none"
                        required
                      >
                        <option value="">نوع المؤسسة</option>
                        <option value="شخص طبيعي">شخص طبيعي</option>
                        <option value="شخص معنوي">شخص معنوي</option>
                        <option value="SPA">SPA</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        محل المؤسسة *
                      </label>
                      <div className="relative">
                        <input
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="محل المؤسسة"
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-300 outline-none"
                          required
                        />
                        <FiMapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-7">
              {/* Financial Info Card */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <FiDollarSign className="text-2xl text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">المعلومات المالية</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        تكلفة المشروع (دج) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="cost"
                          value={form.cost}
                          onChange={handleChange}
                          placeholder="0.00"
                          min="0"
                          max="20000000"
                          step="1000"
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
                          required
                        />
                        <MdAttachMoney className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">الحد الأقصى: 20,000,000 دج</p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        المبلغ الشخصي (دج)
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="personalAmount"
                          value={form.personalAmount}
                          onChange={handleChange}
                          placeholder="0.00"
                          min="0"
                          step="1000"
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
                        />
                        <MdAttachMoney className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      المنتج/الخدمة *
                    </label>
                    <input
                      name="product"
                      value={form.product}
                      onChange={handleChange}
                      placeholder="اسم المنتج أو الخدمة المقدمة"
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Market Info Card */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <FiTarget className="text-2xl text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">معلومات السوق</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      الزبائن المستهدفون *
                    </label>
                    <input
                      name="clients"
                      value={form.clients}
                      onChange={handleChange}
                      placeholder="وصف الزبائن المستهدفين"
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الزبائن المتوقعون
                      </label>
                      <input
                        type="number"
                        name="expectedClients"
                        value={form.expectedClients}
                        onChange={handleChange}
                        placeholder="العدد"
                        min="0"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        عدد المنافسين
                      </label>
                      <input
                        type="number"
                        name="competitors"
                        value={form.competitors}
                        onChange={handleChange}
                        placeholder="العدد"
                        min="0"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Files Upload Card */}
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-2xl border border-rose-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-rose-100 rounded-xl">
                    <MdOutlineFileUpload className="text-2xl text-rose-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">الملفات المرفقة</h2>
                </div>
                
                <div className="space-y-6">
                  {/* Certificates */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      الشهادات (PDF أو صورة)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-rose-400 transition-colors bg-white">
                      <input
                        type="file"
                        ref={certificatesRef}
                        onChange={(e) => handleFileChange(e, 'certificates')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => certificatesRef.current.click()}
                        className="w-full flex flex-col items-center justify-center gap-3"
                      >
                        <div className="p-3 bg-rose-100 rounded-full">
                          <FiUpload className="text-xl text-rose-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">اضغط لرفع الشهادات</p>
                          <p className="text-sm text-gray-500 mt-1">
                            شهادة البل مشروع مبتكر، شهادة مؤسسة ناشئة، براءة اختراع
                          </p>
                        </div>
                      </button>
                    </div>
                    <FileDisplay 
                      files={files.certificates} 
                      fileType="certificates" 
                      onRemove={removeFile} 
                    />
                  </div>

                  {/* Economic Study */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      دراسة الجدوى الاقتصادية (PDF) *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-rose-400 transition-colors bg-white">
                      <input
                        type="file"
                        ref={economicStudyRef}
                        onChange={(e) => handleFileChange(e, 'economicStudy')}
                        accept=".pdf"
                        className="hidden"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => economicStudyRef.current.click()}
                        className="w-full flex flex-col items-center justify-center gap-3"
                      >
                        <div className="p-3 bg-rose-100 rounded-full">
                          <FiFileText className="text-xl text-rose-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">اضغط لرفع دراسة الجدوى</p>
                          <p className="text-sm text-gray-500 mt-1">PDF فقط</p>
                        </div>
                      </button>
                    </div>
                    {files.economicStudy && (
                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-600 mb-2">الملف المرفوع:</h4>
                        <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <div className="flex items-center gap-3">
                            <FiFileText className="text-blue-500" />
                            <div>
                              <p className="text-sm font-medium text-gray-800 truncate max-w-xs">{files.economicStudy.name}</p>
                              <p className="text-xs text-gray-500">{(files.economicStudy.size / 1024).toFixed(2)} KB</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile('economicStudy')}
                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                          >
                            <FiX className="text-lg" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Compliance Files */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      ملفات وشروط الملايمة (PDF أو صور)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-rose-400 transition-colors bg-white">
                      <input
                        type="file"
                        ref={complianceFilesRef}
                        onChange={(e) => handleFileChange(e, 'complianceFiles')}
                        accept=".pdf,.jpg,.jpeg,.png"
                        multiple
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => complianceFilesRef.current.click()}
                        className="w-full flex flex-col items-center justify-center gap-3"
                      >
                        <div className="p-3 bg-rose-100 rounded-full">
                          <FiFileText className="text-xl text-rose-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-700">اضغط لرفع ملفات المطابقة</p>
                          <p className="text-sm text-gray-500 mt-1">PDF أو صور</p>
                        </div>
                      </button>
                    </div>
                    <FileDisplay 
                      files={files.complianceFiles} 
                      fileType="complianceFiles" 
                      onRemove={removeFile} 
                    />
                  </div>
                </div>
              </div>

              {/* Additional Requirements Card */}
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gray-100 rounded-xl">
                    <MdOutlineDescription className="text-2xl text-gray-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">متطلبات إضافية</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      العمال والمهام
                    </label>
                    <textarea
                      name="workers"
                      value={form.workers}
                      onChange={handleChange}
                      placeholder="عدد العمال ومهام كل عامل (مثال: 3 عمال - مدير، محاسب، مسؤول مبيعات)"
                      rows="3"
                      className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-300 outline-none resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        عدد الفروع
                      </label>
                      <input
                        type="number"
                        name="branches"
                        value={form.branches}
                        onChange={handleChange}
                        placeholder="عدد الفروع الموجودة"
                        min="0"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        متطلبات أخرى
                      </label>
                      <input
                        name="requirements"
                        value={form.requirements}
                        onChange={handleChange}
                        placeholder="أي متطلبات إضافية للمشروع"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-gray-500 focus:ring-2 focus:ring-gray-200 transition-all duration-300 outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="px-8 md:px-10 py-8 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200">
            <div className="max-w-2xl mx-auto">
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-amber-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-amber-800 font-medium">ملاحظات مهمة:</p>
                    <ul className="text-xs text-amber-700 mt-1 space-y-1">
                      <li>• جميع الحقول التي تحمل علامة (*) إلزامية</li>
                      <li>• تكلفة المشروع لا يجب أن تتجاوز 20,000,000 دج</li>
                      <li>• حجم الملفات يجب ألا يتجاوز 10 ميجابايت لكل ملف</li>
                      <li>• يجب تحميل دراسة الجدوى الاقتصادية بصيغة PDF</li>
                      <li>• سيتم استخدام معلومات الاتصال للتواصل معك بخصوص المشروع</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto md:min-w-[300px] mx-auto block px-10 py-4 bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold text-lg rounded-xl hover:from-emerald-700 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    جاري حفظ المشروع...
                  </>
                ) : (
                  <>
                    <FiUpload className="text-xl group-hover:translate-y-[-2px] transition-transform" />
                    إرسال المشروع
                  </>
                )}
              </button>
              
              <p className="text-center text-gray-500 text-sm mt-4">
                سيتم حفظ جميع البيانات والملفات في قاعدة البيانات بشكل آمن
              </p>
            </div>
          </div>
        </form>
      </div>

      {/* Add CSS for animation */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}