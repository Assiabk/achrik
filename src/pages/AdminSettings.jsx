import { useState, useEffect, useRef } from "react";
import { 
  FaUserPlus, 
  FaEdit, 
  FaTrash, 
  FaUserShield, 
  FaEnvelope, 
  FaKey, 
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserTie,
  FaSpinner,
  FaSync,
  FaEye,
  FaEyeSlash,
  FaPhone,
  FaDatabase,
  FaSearch,
  FaFilter
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

// Enhanced API Service
const AdminApiService = {
  baseUrl: 'https://achrikmaana.com/api',
  
  // Get all admins with better response handling
  async getAdmins() {
    try {
      const token = localStorage.getItem("adminToken");
      
      // Debug log
      console.log('🔍 [API] Fetching admins...');
      console.log('📡 URL:', `${this.baseUrl}/admins`);
      console.log('🔑 Token:', token ? 'Present' : 'Missing');
      
      if (!token) {
        console.warn('⚠️ No authentication token');
        throw new Error('Authentication required. Please login.');
      }
      
      const response = await fetch(`${this.baseUrl}/admins`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        cache: 'no-cache'
      });
      
      console.log('📊 Response Status:', response.status, response.statusText);
      
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Server Error:', errorText);
        throw new Error(`Server error: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      console.log('✅ [API] Raw response received:', data);
      
      // Return the data as-is - let component handle parsing
      return data;
      
    } catch (error) {
      console.error('❌ [API] getAdmins failed:', error);
      throw error;
    }
  },

  // Add new admin
  async addAdmin(adminData) {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${this.baseUrl}/admins`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add admin');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Add admin error:', error);
      throw error;
    }
  },

  // Update admin
  async updateAdmin(id, adminData) {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${this.baseUrl}/admins/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(adminData)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update admin');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update admin error:', error);
      throw error;
    }
  },

  // Delete admin
  async deleteAdmin(id) {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error('Authentication required');
      
      const response = await fetch(`${this.baseUrl}/admins/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete admin');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Delete admin error:', error);
      throw error;
    }
  }
};

export default function AdminSettings() {
  // State declarations
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [apiStatus, setApiStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Refs for preventing multiple calls
  const isMounted = useRef(true);
  const isFetching = useRef(false);

  // Fetch admins on component mount
  useEffect(() => {
    console.log('🎬 Component mounted');
    isMounted.current = true;
    
    const loadAdmins = async () => {
      await fetchAdmins();
      setInitialLoad(false);
    };
    
    loadAdmins();
    
    return () => {
      console.log('🧹 Component unmounting');
      isMounted.current = false;
    };
  }, []);

  // Enhanced fetch function with better error handling
  const fetchAdmins = async () => {
    // Prevent multiple simultaneous fetches
    if (isFetching.current) {
      console.log('⏳ Fetch already in progress, skipping...');
      return;
    }
    
    isFetching.current = true;
    setLoading(true);
    setErrorMessage("");
    setApiStatus("جاري تحميل البيانات...");
    
    console.log('🔄 Starting data fetch...');
    
    try {
      const response = await AdminApiService.getAdmins();
      console.log('📦 API Response:', response);
      
      if (!isMounted.current) return;
      
      // Parse the response data
      let adminsData = [];
      
      // Check if response is an array
      if (Array.isArray(response)) {
        adminsData = response;
        console.log('✅ Direct array received:', response.length, 'items');
      } 
      // Check if response has nested data array
      else if (response && typeof response === 'object') {
        if (Array.isArray(response.data)) {
          adminsData = response.data;
          console.log('✅ Nested data array:', response.data.length, 'items');
        } 
        else if (Array.isArray(response.admins)) {
          adminsData = response.admins;
          console.log('✅ Nested admins array:', response.admins.length, 'items');
        }
        else if (response.success && Array.isArray(response.data)) {
          adminsData = response.data;
          console.log('✅ Success.data array:', response.data.length, 'items');
        }
        // Fallback: convert object values to array
        else {
          adminsData = Object.values(response).filter(item => 
            item && typeof item === 'object' && (item.email || item.name)
          );
          console.log('⚠️ Converted object to array:', adminsData.length, 'items');
        }
      }
      
      console.log('🎯 Final admins data to set:', adminsData);
      
      // Always ensure we have an array
      if (!Array.isArray(adminsData)) {
        console.error('❌ Failed to parse admins data, using empty array');
        adminsData = [];
      }
      
      // Update state
      setAdmins(adminsData);
      
      // Update status message
      if (adminsData.length > 0) {
        setApiStatus(`تم تحميل ${adminsData.length} مشرف`);
      } else {
        setApiStatus("لا توجد بيانات متاحة");
      }
      
      console.log('✅ State updated successfully');
      
    } catch (error) {
      console.error('❌ Fetch error:', error);
      
      if (!isMounted.current) return;
      
      // Handle specific errors
      if (error.message.includes('Session expired') || error.message.includes('Authentication')) {
        setErrorMessage('انتهت الجلسة. جاري إعادة التوجيه...');
        setTimeout(() => {
          window.location.href = '/admin/login';
        }, 2000);
      } else if (error.message.includes('Failed to fetch')) {
        setErrorMessage('تعذر الاتصال بالخادم. تأكد من تشغيل السيرفر.');
        setApiStatus('خطأ في الاتصال');
      } else {
        setErrorMessage(`خطأ: ${error.message}`);
        setApiStatus('حدث خطأ أثناء التحميل');
      }
      
      // Set empty array on error
      setAdmins([]);
      
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
      isFetching.current = false;
      console.log('🏁 Fetch completed');
    }
  };

  // Force refresh with debug
  const forceRefresh = () => {
    console.log('🔨 Force refreshing data...');
    setAdmins([]);
    setLoading(true);
    setTimeout(() => {
      fetchAdmins();
    }, 100);
  };

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin => {
    if (!admin) return false;
    const searchLower = searchTerm.toLowerCase();
    return (
      (admin.name && admin.name.toLowerCase().includes(searchLower)) ||
      (admin.email && admin.email.toLowerCase().includes(searchLower)) ||
      (admin.phone && admin.phone.includes(searchTerm)) ||
      (admin._id && admin._id.toLowerCase().includes(searchLower))
    );
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!newAdmin.name?.trim()) newErrors.name = "الاسم مطلوب";
    else if (newAdmin.name.trim().length < 2) newErrors.name = "الاسم يجب أن يكون حرفين على الأقل";
    
    if (!newAdmin.email?.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) newErrors.email = "بريد إلكتروني غير صالح";
    
    if (!newAdmin.phone?.trim()) newErrors.phone = "رقم الهاتف مطلوب";
    else if (!/^\d+$/.test(newAdmin.phone.replace(/\s/g, ''))) newErrors.phone = "يجب أن يحتوي على أرقام فقط";
    
    if (isAddModalOpen) {
      if (!newAdmin.password) newErrors.password = "كلمة المرور مطلوبة";
      else if (newAdmin.password.length < 6) newErrors.password = "6 أحرف على الأقل";
      
      if (newAdmin.password !== newAdmin.confirmPassword) {
        newErrors.confirmPassword = "كلمات المرور غير متطابقة";
      }
    } else if (isEditModalOpen && newAdmin.password && newAdmin.password.length < 6) {
      newErrors.password = "6 أحرف على الأقل";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new admin
  const handleAddAdmin = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const adminData = {
        name: newAdmin.name.trim(),
        email: newAdmin.email.trim(),
        phone: newAdmin.phone.trim(),
        password: newAdmin.password
      };
      
      const result = await AdminApiService.addAdmin(adminData);
      
      // Add to local state
      setAdmins(prev => [...prev, {
        _id: result._id,
        name: result.name,
        email: result.email,
        phone: result.phone,
        role: result.role || "Admin",
        isVerified: result.isVerified !== false,
        createdAt: result.createdAt || new Date().toISOString()
      }]);
      
      setSuccessMessage("تم إضافة المشرف بنجاح!");
      setIsAddModalOpen(false);
      resetForm();
      
    } catch (error) {
      setErrorMessage(`فشل الإضافة: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  // Edit admin
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setNewAdmin({
      name: admin.name || "",
      email: admin.email || "",
      phone: admin.phone || "",
      password: "",
      confirmPassword: ""
    });
    setIsEditModalOpen(true);
  };

  // Update admin
  const handleUpdateAdmin = async () => {
    if (!validateForm() || !selectedAdmin) return;
    
    setIsSubmitting(true);
    try {
      const adminData = {
        name: newAdmin.name.trim(),
        email: newAdmin.email.trim(),
        phone: newAdmin.phone.trim()
      };
      
      if (newAdmin.password) {
        adminData.password = newAdmin.password;
      }
      
      const result = await AdminApiService.updateAdmin(selectedAdmin._id, adminData);
      
      // Update in local state
      setAdmins(prev => prev.map(admin => 
        admin._id === selectedAdmin._id 
          ? { ...admin, ...result, updatedAt: new Date().toISOString() }
          : admin
      ));
      
      setSuccessMessage("تم تحديث المشرف بنجاح!");
      setIsEditModalOpen(false);
      resetForm();
      
    } catch (error) {
      setErrorMessage(`فشل التحديث: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  // Delete admin
  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return;
    
    setIsSubmitting(true);
    try {
      await AdminApiService.deleteAdmin(selectedAdmin._id);
      
      setAdmins(prev => prev.filter(admin => admin._id !== selectedAdmin._id));
      setSuccessMessage("تم حذف المشرف بنجاح!");
      
    } catch (error) {
      setErrorMessage(`فشل الحذف: ${error.message}`);
    } finally {
      setIsSubmitting(false);
      setIsDeleteModalOpen(false);
      setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewAdmin({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
    setErrors({});
    setSelectedAdmin(null);
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  // Close modal
  const closeModal = () => {
    if (isSubmitting) return;
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    resetForm();
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "غير محدد";
    }
  };

  // Loading state
  if (initialLoad) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaSpinner className="text-3xl text-white animate-spin" />
            </div>
            <p className="text-gray-600">جاري تحميل بيانات المشرفين...</p>
            <p className="text-gray-400 text-sm mt-2">يرجى الانتظار</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Notifications */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <FaCheckCircle />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-fade-in">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <FaExclamationTriangle />
            <span>{errorMessage}</span>
          </div>
        </div>
      )}

      <div className="p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">إدارة المشرفين</h1>
            <p className="text-gray-600 mt-2">إدارة حسابات المشرفين والصلاحيات</p>
            <div className="mt-3 flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${admins.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`} />
              <span className="text-sm text-gray-600">{apiStatus}</span>
              <span className="text-sm bg-gray-100 px-3 py-1 rounded-full">
                {admins.length} مشرف
              </span>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={forceRefresh}
              disabled={loading}
              className="px-4 py-3 bg-white border border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl flex items-center gap-3 transition-all disabled:opacity-50"
            >
              {loading ? <FaSpinner className="animate-spin" /> : <FaSync />}
              <span>تحديث</span>
            </button>
            
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl flex items-center gap-3 transition-all shadow-lg hover:shadow-emerald-500/30"
            >
              <FaUserPlus />
              <span>إضافة مشرف جديد</span>
            </button>
          </div>
        </div>

        

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="ابحث عن مشرف..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 pr-12 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <FaSearch />
            </div>
          </div>
        </div>

        {/* Admins Table - GUARANTEED TO RENDER */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <FaSpinner className="text-4xl text-emerald-500 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">جاري تحميل البيانات...</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700">المشرف</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700">البريد الإلكتروني</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700">الهاتف</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700">الدور</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700">الحالة</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700">تاريخ الإنشاء</th>
                      <th className="py-4 px-6 text-right font-semibold text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredAdmins.length > 0 ? (
                      filteredAdmins.map((admin) => (
                        <tr key={admin._id || admin.id} className="hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                                {admin.name?.charAt(0)?.toUpperCase() || '?'}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold text-gray-900">
                                  {admin.name || 'بدون اسم'}
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                  {admin._id?.substring(0, 8) || 'unknown'}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-700">{admin.email || '—'}</td>
                          <td className="py-4 px-6 text-gray-700">{admin.phone || '—'}</td>
                          <td className="py-4 px-6">
                            <div className="flex justify-end">
                              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium flex items-center gap-2">
                                <FaUserShield className="text-xs" />
                                {admin.role || 'Admin'}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex justify-end">
                              {admin.isVerified !== false ? (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-medium flex items-center gap-1">
                                  <FaCheckCircle className="text-xs" />
                                  مفعل
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                                  غير مفعل
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-500">
                            {formatDate(admin.createdAt)}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={() => handleEditClick(admin)}
                                className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors"
                                title="تعديل"
                              >
                                <FaEdit />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(admin)}
                                className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                                title="حذف"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="py-12 text-center">
                          <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            {admins.length === 0 ? (
                              <FaUserTie className="text-3xl text-emerald-400" />
                            ) : (
                              <FaFilter className="text-3xl text-emerald-400" />
                            )}
                          </div>
                          <p className="text-gray-500 text-lg">
                            {admins.length === 0 ? "لا يوجد مشرفين حتى الآن" : "لا توجد نتائج للبحث"}
                          </p>
                          <p className="text-gray-400 text-sm mt-2">
                            {admins.length === 0 
                              ? "ابدأ بإضافة مشرف جديد" 
                              : "حاول تغيير مصطلحات البحث"}
                          </p>
                          {admins.length === 0 && (
                            <button
                              onClick={() => setIsAddModalOpen(true)}
                              className="mt-4 px-6 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-lg hover:from-emerald-500 hover:to-green-500 transition-all duration-300 flex items-center gap-2 mx-auto"
                            >
                              <FaUserPlus />
                              إضافة أول مشرف
                            </button>
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Table Footer */}
              {filteredAdmins.length > 0 && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    عرض <span className="font-bold">{filteredAdmins.length}</span> من <span className="font-bold">{admins.length}</span> مشرف
                  </div>
                  <div className="text-sm text-gray-500">
                    آخر تحديث: {new Date().toLocaleTimeString('ar-SA')}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Add/Edit Modal */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 rounded-t-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaUserShield className="text-white text-xl" />
                  </div>
                  <div className="text-right text-white">
                    <h2 className="text-xl font-bold">
                      {isAddModalOpen ? "إضافة مشرف جديد" : "تعديل المشرف"}
                    </h2>
                    <p className="text-white/80 text-sm mt-1">
                      {isAddModalOpen ? "املأ البيانات أدناه" : "قم بتعديل البيانات"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-right text-gray-700 mb-2 font-medium">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newAdmin.name}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right disabled:opacity-50"
                    placeholder="أدخل الاسم الكامل"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1 text-right">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-right text-gray-700 mb-2 font-medium">
                    البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={newAdmin.email}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right pl-12 disabled:opacity-50"
                      placeholder="email@example.com"
                    />
                    <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm mt-1 text-right">{errors.email}</p>}
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-right text-gray-700 mb-2 font-medium">
                    رقم الهاتف *
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={newAdmin.phone}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right pl-12 disabled:opacity-50"
                      placeholder="1234567890"
                    />
                    <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.phone && <p className="text-red-500 text-sm mt-1 text-right">{errors.phone}</p>}
                </div>

                {/* Password Fields */}
                {(isAddModalOpen || (isEditModalOpen && newAdmin.password)) && (
                  <>
                    <div>
                      <label className="block text-right text-gray-700 mb-2 font-medium">
                        {isAddModalOpen ? "كلمة المرور *" : "كلمة المرور الجديدة"}
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={newAdmin.password}
                          onChange={handleInputChange}
                          disabled={isSubmitting}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right pl-12 disabled:opacity-50"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-sm mt-1 text-right">{errors.password}</p>}
                    </div>

                    {isAddModalOpen && (
                      <div>
                        <label className="block text-right text-gray-700 mb-2 font-medium">
                          تأكيد كلمة المرور *
                        </label>
                        <div className="relative">
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={newAdmin.confirmPassword}
                            onChange={handleInputChange}
                            disabled={isSubmitting}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right pl-12 disabled:opacity-50"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 text-right">{errors.confirmPassword}</p>}
                      </div>
                    )}
                  </>
                )}

                {/* Admin Info */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500">الدور:</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      Admin
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">الحالة:</span>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      مفعل
                    </span>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 p-6 border-t border-gray-200">
                <button
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={isAddModalOpen ? handleAddAdmin : handleUpdateAdmin}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaSave />
                  )}
                  {isAddModalOpen ? "إضافة" : "حفظ"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && selectedAdmin && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">تأكيد الحذف</h3>
              <p className="text-gray-600 text-center mb-6">
                هل أنت متأكد من حذف المشرف{" "}
                <span className="font-bold text-red-600">{selectedAdmin.name}</span>؟
                <br />
                <span className="text-sm text-gray-500 mt-2 block">
                  لا يمكن التراجع عن هذا الإجراء
                </span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-xl font-medium transition-colors"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {isSubmitting ? <FaSpinner className="animate-spin" /> : "حذف"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translate(-50%, -10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </DashboardLayout>
  );
}