import { useState, useEffect } from "react";
import { 
  FiUpload, 
  FiUser, 
  FiFileText,
  FiMapPin, 
  FiBriefcase,
  FiDollarSign,
  FiCheckCircle,
  FiAlertCircle,
  FiX,
  FiPlusCircle,
  FiSave,
  FiEdit2,
  FiPhone,
  FiMail
} from "react-icons/fi";
import { 
  MdAttachMoney,
  MdAccountBalance,
  MdBusiness
} from "react-icons/md";
import { IoIosBusiness } from "react-icons/io";

export default function AddInvestment() {
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    companyName: "",
    companyType: "",
    legalStatus: "",
    commercialReg: "",
    location: "",
    project: "",
    projectDescription: "",
    projectSector: "",
    projectType: "",
    shares: "",
    sharePrice: "100",
    identityFile: null,
    docsFile: null,
    paymentProof: null,
    notes: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    identityFile: null,
    docsFile: null,
    paymentProof: null
  });

  // Calculate total value when shares or share price changes
  useEffect(() => {
    if (form.shares && form.sharePrice) {
      const shares = parseInt(form.shares) || 0;
      const sharePrice = parseInt(form.sharePrice) || 0;
      const totalValue = shares * sharePrice;
      setForm(prev => ({ ...prev, totalValue }));
    }
  }, [form.shares, form.sharePrice]);

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

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        showAlert('error', 'حجم الملف كبير جداً. الحد الأقصى 10MB');
        e.target.value = '';
        return;
      }
      
      // Check file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        showAlert('error', 'نوع الملف غير مدعوم. يرجى رفع ملف PDF, JPG, أو PNG فقط');
        e.target.value = '';
        return;
      }
      
      setForm({ ...form, [name]: file });
      
      // Preview uploaded file name
      setUploadedFiles(prev => ({
        ...prev,
        [name]: {
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          type: file.type
        }
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

  // Upload file with progress tracking
  const uploadFile = async (file, fieldName) => {
    if (!file) return null;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('https://achrikmaana.com/api/upload/investment', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        return {
          filePath: data.filePath,
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileType: file.type
        };
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      throw new Error(`فشل في رفع الملف: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const validations = [
      { field: 'fullName', message: 'يرجى إدخال الاسم واللقب' },
      { field: 'phone', message: 'يرجى إدخال رقم الهاتف' },
      { field: 'email', message: 'يرجى إدخال البريد الإلكتروني' },
      { field: 'companyType', message: 'يرجى اختيار نوع المؤسسة' },
      { field: 'legalStatus', message: 'يرجى اختيار الصفة القانونية' },
      { field: 'project', message: 'يرجى إدخال اسم المشروع' },
      { field: 'shares', message: 'يرجى إدخال عدد صحيح من الأسهم' },
      { field: 'sharePrice', message: 'يرجى إدخال قيمة صحيحة للسهم' },
      { field: 'identityFile', message: 'يرجى رفع نسخة من بطاقة التعريف' },
      { field: 'docsFile', message: 'يرجى رفع ملفات وشروط الملائمة المطلوبة' },
      { field: 'paymentProof', message: 'يرجى رفع وصل تحويل الأموال' },
    ];
    
    for (const validation of validations) {
      if (!form[validation.field]) {
        showAlert('error', validation.message);
        return;
      }
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
    
    if (parseInt(form.shares) < 1 || parseInt(form.sharePrice) < 1) {
      showAlert('error', 'يرجى إدخال قيم صحيحة للأسهم وقيمة السهم');
      return;
    }
    
    setLoading(true);
    setUploadProgress(0);

    try {
      const uploadedFiles = {};
      
      // Upload identity file
      if (form.identityFile) {
        setUploadProgress(25);
        const identityResult = await uploadFile(form.identityFile, 'identity');
        uploadedFiles.identityFile = identityResult;
      }
      
      // Upload documents file
      if (form.docsFile) {
        setUploadProgress(50);
        const docsResult = await uploadFile(form.docsFile, 'documents');
        uploadedFiles.docsFile = docsResult;
      }
      
      // Upload payment proof
      if (form.paymentProof) {
        setUploadProgress(75);
        const paymentResult = await uploadFile(form.paymentProof, 'payment');
        uploadedFiles.paymentProof = paymentResult;
      }
      
      setUploadProgress(100);

      // Prepare investment data
      const investmentData = {
        investorName: form.fullName,
        phone: form.phone,
        email: form.email,
        companyName: form.companyName || null,
        companyType: form.companyType,
        legalStatus: form.legalStatus,
        commercialReg: form.commercialReg || null,
        location: form.location || null,
        projectName: form.project,
        projectDescription: form.projectDescription || null,
        projectSector: form.projectSector || null,
        projectType: form.projectType || null,
        sharesPurchased: parseInt(form.shares),
        sharePrice: parseInt(form.sharePrice),
        totalInvestment: parseInt(form.shares) * parseInt(form.sharePrice),
        status: "pending",
        notes: form.notes || null,
        ...uploadedFiles
      };

      console.log("📤 Sending investment data:", investmentData);
      
      // Submit to backend
      const res = await fetch("https://achrikmaana.com/api/investments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(investmentData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        showAlert('success', data.message || 'تم إرسال طلب الاستثمار بنجاح وجاري المراجعة');
        
        // Reset form
        setForm({
          fullName: "",
          phone: "",
          email: "",
          companyName: "",
          companyType: "",
          legalStatus: "",
          commercialReg: "",
          location: "",
          project: "",
          projectDescription: "",
          projectSector: "",
          projectType: "",
          shares: "",
          sharePrice: "100",
          identityFile: null,
          docsFile: null,
          paymentProof: null,
          notes: ""
        });
        
        setUploadedFiles({
          identityFile: null,
          docsFile: null,
          paymentProof: null
        });
        
        setShowProjectDetails(false);
        
        // Reset file inputs
        document.querySelectorAll('input[type="file"]').forEach(input => {
          input.value = '';
        });
      } else {
        showAlert('error', data.message || "حدث خطأ في حفظ البيانات");
      }
    } catch (err) {
      console.error("Submission error:", err);
      showAlert('error', err.message || 'حدث خطأ في الاتصال بالخادم');
    }

    setLoading(false);
    setUploadProgress(0);
  };

  // Calculate total investment
  const calculateTotal = () => {
    if (form.shares && form.sharePrice) {
      const shares = parseInt(form.shares) || 0;
      const sharePrice = parseInt(form.sharePrice) || 0;
      return (shares * sharePrice).toLocaleString();
    }
    return '0';
  };

  // Remove uploaded file
  const removeFile = (fieldName) => {
    setForm(prev => ({ ...prev, [fieldName]: null }));
    setUploadedFiles(prev => ({ ...prev, [fieldName]: null }));
    const fileInput = document.querySelector(`input[name="${fieldName}"]`);
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-4 md:p-8">
      {/* Alert Notification */}
      {alert.show && (
        <div className={`fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-slide-in`}>
          <div className={`rounded-xl shadow-2xl p-5 border-l-4 ${
            alert.type === 'success' 
              ? 'bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500' 
              : alert.type === 'warning'
              ? 'bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-500'
              : 'bg-gradient-to-r from-red-50 to-rose-50 border-red-500'
          }`}>
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${
                alert.type === 'success' 
                  ? 'bg-emerald-100 text-emerald-600' 
                  : alert.type === 'warning'
                  ? 'bg-amber-100 text-amber-600'
                  : 'bg-red-100 text-red-600'
              }`}>
                {alert.type === 'success' ? (
                  <FiCheckCircle className="text-2xl" />
                ) : alert.type === 'warning' ? (
                  <FiAlertCircle className="text-2xl" />
                ) : (
                  <FiAlertCircle className="text-2xl" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">
                  {alert.type === 'success' ? 'نجاح' : alert.type === 'warning' ? 'تحذير' : 'خطأ'}
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
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <FiPlusCircle className="text-3xl text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">إضافة مساهمة / استثمار جديد</h1>
          <p className="text-gray-600 text-lg">املأ النموذج لإتمام عملية الاستثمار في المشروع</p>
          <div className="w-24 h-1.5 bg-gradient-to-r from-green-500 to-emerald-400 mx-auto mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
          {/* Form Grid */}
          <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column - Personal & Company Info */}
            <div className="space-y-7">
              {/* Personal Information Section */}
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FiUser className="text-2xl text-blue-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">المعلومات الشخصية</h2>
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

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      نسخة من بطاقة التعريف *
                    </label>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          type="file"
                          name="identityFile"
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          required
                        />
                      </div>
                      {uploadedFiles.identityFile && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-3">
                            <FiFileText className="text-blue-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {uploadedFiles.identityFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {uploadedFiles.identityFile.size}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile('identityFile')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX className="text-lg" />
                          </button>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs">يجب أن يكون الملف بصيغة PDF, JPG, أو PNG (الحد الأقصى 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Information Section */}
              <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-6 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <IoIosBusiness className="text-2xl text-purple-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">معلومات الشركة أو المؤسسة</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      اسم الشركة أو المؤسسة
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="اسم الشركة أو المؤسسة الاقتصادية"
                        className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
                      />
                      <MdBusiness className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
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
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none appearance-none"
                        required
                      >
                        <option value="">اختر نوع المؤسسة</option>
                        <option value="شخص طبيعي">شخص طبيعي</option>
                        <option value="شخص معنوي">شخص معنوي</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        الصفة القانونية *
                      </label>
                      <select
                        name="legalStatus"
                        value={form.legalStatus}
                        onChange={handleChange}
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none appearance-none"
                        required
                      >
                        <option value="">اختر الصفة القانونية</option>
                        <option value="شركة مساهمة (SPA)">شركة مساهمة (SPA)</option>
                        <option value="شركة محدودة المسؤولية (SARL)">شركة محدودة المسؤولية (SARL)</option>
                        <option value="مؤسسة فردية">مؤسسة فردية</option>
                        <option value="شركة تضامن">شركة تضامن</option>
                        <option value="شركة توصية بسيطة">شركة توصية بسيطة</option>
                        <option value="شخص طبيعي">شخص طبيعي</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        السجل التجاري
                      </label>
                      <input
                        type="text"
                        name="commercialReg"
                        value={form.commercialReg}
                        onChange={handleChange}
                        placeholder="رقم السجل التجاري"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        محل المؤسسة
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="location"
                          value={form.location}
                          onChange={handleChange}
                          placeholder="محل المؤسسة"
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300 outline-none"
                        />
                        <FiMapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <FiFileText className="text-2xl text-amber-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">الملفات والمستندات</h2>
                </div>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ملفات وشروط الملائمة المطلوبة (PDF) *
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        name="docsFile"
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        required
                      />
                      {uploadedFiles.docsFile && (
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-center gap-3">
                            <FiFileText className="text-amber-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {uploadedFiles.docsFile.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {uploadedFiles.docsFile.size}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile('docsFile')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX className="text-lg" />
                          </button>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs">يرجى تحميل نسخة من الملفات المطلوبة بصيغة PDF فقط (الحد الأقصى 10MB)</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      وصل تحويل الأموال إلى الحساب البنكي *
                    </label>
                    <div className="space-y-3">
                      <input
                        type="file"
                        name="paymentProof"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-2 focus:ring-amber-200 transition-all duration-300 outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                        required
                      />
                      {uploadedFiles.paymentProof && (
                        <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex items-center gap-3">
                            <FiFileText className="text-amber-600" />
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {uploadedFiles.paymentProof.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {uploadedFiles.paymentProof.size}
                              </p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFile('paymentProof')}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiX className="text-lg" />
                          </button>
                        </div>
                      )}
                      <p className="text-gray-500 text-xs">يرجى تحميل صورة أو ملف PDF للتحويل البنكي (الحد الأقصى 10MB)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Project & Investment Info */}
            <div className="space-y-7">
              {/* Project Information Section */}
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
                      اسم المشروع المراد الاستثمار فيه *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="project"
                        value={form.project}
                        onChange={handleChange}
                        placeholder="أدخل اسم المشروع الذي ترغب في الاستثمار فيه"
                        className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none"
                        required
                      />
                      <FiEdit2 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    <p className="text-gray-500 text-xs mt-2">يرجى كتابة اسم المشروع بدقة كما هو مسجل</p>
                  </div>

                  {/* Optional Project Details */}
                  <button
                    type="button"
                    onClick={() => setShowProjectDetails(!showProjectDetails)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {showProjectDetails ? 'إخفاء تفاصيل المشروع' : 'إضافة تفاصيل إضافية عن المشروع (اختياري)'}
                    <svg 
                      className={`w-4 h-4 transition-transform ${showProjectDetails ? 'rotate-180' : ''}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>

                  {showProjectDetails && (
                    <div className="space-y-4 p-4 bg-white/50 rounded-xl border border-emerald-200">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          وصف المشروع
                        </label>
                        <textarea
                          name="projectDescription"
                          value={form.projectDescription}
                          onChange={handleChange}
                          placeholder="وصف مختصر للمشروع"
                          rows="3"
                          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none"
                        ></textarea>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            قطاع المشروع
                          </label>
                          <select
                            name="projectSector"
                            value={form.projectSector}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none appearance-none"
                          >
                            <option value="">اختر قطاع المشروع</option>
                            <option value="صناعي">صناعي</option>
                            <option value="زراعي">زراعي</option>
                            <option value="سياحي">سياحي</option>
                            <option value="عقاري">عقاري</option>
                            <option value="تكنولوجي">تكنولوجي</option>
                            <option value="تجاري">تجاري</option>
                            <option value="خدمات">خدمات</option>
                            <option value="صحي">صحي</option>
                            <option value="تعليمي">تعليمي</option>
                            <option value="آخر">آخر</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            نوع المشروع
                          </label>
                          <select
                            name="projectType"
                            value={form.projectType}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-300 outline-none appearance-none"
                          >
                            <option value="">اختر نوع المشروع</option>
                            <option value="مشروع جديد">مشروع جديد</option>
                            <option value="توسعة مشروع قائم">توسعة مشروع قائم</option>
                            <option value="تمويل مشروع تحت الإنشاء">تمويل مشروع تحت الإنشاء</option>
                            <option value="شراكة في مشروع">شراكة في مشروع</option>
                            <option value="استثمار مالي">استثمار مالي</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Investment Details Section */}
              <div className="bg-gradient-to-r from-cyan-50 to-sky-50 p-6 rounded-2xl border border-cyan-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-cyan-100 rounded-xl">
                    <MdAccountBalance className="text-2xl text-cyan-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">تفاصيل الاستثمار</h2>
                </div>
                
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        عدد الأسهم المطلوبة *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="shares"
                          value={form.shares}
                          onChange={handleChange}
                          placeholder="عدد الأسهم"
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 outline-none"
                          min="1"
                          required
                        />
                        <FiBriefcase className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        قيمة السهم (دج) *
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          name="sharePrice"
                          value={form.sharePrice}
                          onChange={handleChange}
                          placeholder="قيمة السهم"
                          className="w-full pr-12 pl-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 outline-none"
                          min="1"
                          required
                        />
                        <FiDollarSign className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      قيمة المساهمة الإجمالية
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={`${calculateTotal()} دج`}
                        className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl outline-none cursor-not-allowed"
                        disabled
                      />
                      <MdAttachMoney className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {form.shares && form.sharePrice && (
                      <p className="text-xs text-gray-500 mt-2">
                        {form.shares} سهم × {parseInt(form.sharePrice).toLocaleString()} دج = {calculateTotal()} دج
                      </p>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      ملاحظات إضافية (اختياري)
                    </label>
                    <textarea
                      name="notes"
                      value={form.notes}
                      onChange={handleChange}
                      placeholder="أي ملاحظات أو معلومات إضافية ترغب في إضافتها"
                      rows="3"
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all duration-300 outline-none"
                    ></textarea>
                  </div>

                  {/* Upload Progress */}
                  {uploadProgress > 0 && (
                    <div className="mt-6">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>جاري رفع الملفات...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Example Calculation */}
                  {form.shares && form.sharePrice && (
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 mt-4">
                      <h4 className="font-semibold text-blue-800 mb-2 text-sm">مثال توضيحي:</h4>
                      <p className="text-sm text-blue-700">
                        عند شراء <span className="font-bold">{form.shares}</span> سهم بسعر <span className="font-bold">{parseInt(form.sharePrice).toLocaleString()}</span> دج للسهم، 
                        فإن قيمة الاستثمار الإجمالية هي <span className="font-bold">{calculateTotal()}</span> دج.
                        هذه الأسهم ستضاف إلى رأس مال المشروع وتزيد من قيمته الإجمالية.
                      </p>
                    </div>
                  )}

                  {/* Contact Information Note */}
                  <div className="bg-gradient-to-r from-green-50/50 to-emerald-50/50 p-4 rounded-xl border border-green-200 mt-4">
                    <h4 className="font-semibold text-green-800 mb-2 text-sm">معلومات الاتصال:</h4>
                    <p className="text-sm text-green-700">
                      سيتم استخدام رقم الهاتف والبريد الإلكتروني للتواصل معك بخصوص طلب الاستثمار. 
                      يرجى التأكد من صحة المعلومات المدخلة.
                    </p>
                  </div>

                  {/* Important Notes */}
                  <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 p-5 rounded-xl border border-blue-200 mt-8">
                    <h3 className="font-semibold text-gray-800 mb-3 text-lg">ملاحظات هامة:</h3>
                    <ul className="text-sm text-gray-600 space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>سيتم إرسال الطلب للمراجعة من قبل إدارة المنصة</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>سيتم التواصل معك على الهاتف والبريد الإلكتروني لتأكيد المعلومات</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>الحساب البنكي مغلق حتى تتم الموافقة على الطلب</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>عملية شراء الأسهم تزيد في رأس مال المشروع</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>سيظهر اسمك أو اسم مؤسستك كمستثمر في المشروع بعد الموافقة</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>يرجى كتابة اسم المشروع بدقة كما هو مسجل في النظام</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Section */}
          <div className="px-8 md:px-10 py-8 bg-gradient-to-r from-gray-50 to-slate-50 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading || uploadProgress > 0}
              className="w-full md:w-auto md:min-w-[300px] mx-auto block px-10 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-lg rounded-xl hover:from-green-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {uploadProgress > 0 ? 'جاري رفع الملفات...' : 'جاري حفظ البيانات...'}
                </>
              ) : (
                <>
                  <FiSave className="text-xl group-hover:scale-110 transition-transform" />
                  حفظ وإرسال طلب الاستثمار
                </>
              )}
            </button>
            
            <p className="text-center text-gray-500 text-sm mt-4">
              بعد إرسال الطلب، سيتم مراجعته من قبل إدارة المنصة والرد عليك عبر الهاتف والبريد الإلكتروني
            </p>
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
        
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }
      `}</style>
    </div>
  );
}