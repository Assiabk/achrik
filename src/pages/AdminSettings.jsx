import { useState } from "react";
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
  FaChartLine,
  FaProjectDiagram,
  FaUserTie
} from "react-icons/fa";
import DashboardLayout from "../layouts/DashboardLayout";

// Role options
const ROLE_OPTIONS = {
  ADMIN: "المشرف الرئيسي",
  INVESTMENT_MANAGER: "مسؤول الاستثمار",
  PROJECT_MANAGER: "مسؤول المشاريع"
};

// Role badges configuration - all in green shades
const ROLE_BADGES = {
  [ROLE_OPTIONS.ADMIN]: {
    color: "bg-emerald-50 text-emerald-800 border border-emerald-200",
    icon: <FaUserShield className="text-sm" />
  },
  [ROLE_OPTIONS.INVESTMENT_MANAGER]: {
    color: "bg-green-50 text-green-800 border border-green-200",
    icon: <FaChartLine className="text-sm" />
  },
  [ROLE_OPTIONS.PROJECT_MANAGER]: {
    color: "bg-teal-50 text-teal-800 border border-teal-200",
    icon: <FaProjectDiagram className="text-sm" />
  }
};

const initialAdmins = [
    {
      id: 1,
      name: "Admin 1",
      email: "admin1@example.com",
      role: ROLE_OPTIONS.ADMIN,
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Admin 2",
      email: "admin2@example.com",
      role: ROLE_OPTIONS.INVESTMENT_MANAGER,
      createdAt: "2024-02-20",
    },
    {
      id: 3,
      name: "Admin 3",
      email: "admin3@example.com",
      role: ROLE_OPTIONS.PROJECT_MANAGER,
      createdAt: "2024-03-10",
    },
    {
      id: 4,
      name: "Admin 4",
      email: "admin4@example.com",
      role: ROLE_OPTIONS.INVESTMENT_MANAGER,
      createdAt: "2024-03-15",
    },
    {
      id: 5,
      name: "Admin 5",
      email: "admin5@example.com",
      role: ROLE_OPTIONS.PROJECT_MANAGER,
      createdAt: "2024-03-20",
    },
  ];
  
export default function AdminSettings() {
  const [admins, setAdmins] = useState(initialAdmins);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [newAdmin, setNewAdmin] = useState({ 
    name: "", 
    email: "", 
    role: "", 
    password: "", 
    confirmPassword: "" 
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter admins based on search
  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle input change for new admin
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!newAdmin.name.trim()) newErrors.name = "الاسم مطلوب";
    if (!newAdmin.email.trim()) newErrors.email = "البريد الإلكتروني مطلوب";
    else if (!/\S+@\S+\.\S+/.test(newAdmin.email)) newErrors.email = "بريد إلكتروني غير صالح";
    if (!newAdmin.role.trim()) newErrors.role = "الدور مطلوب";
    if (isAddModalOpen) {
      if (!newAdmin.password) newErrors.password = "كلمة المرور مطلوبة";
      else if (newAdmin.password.length < 6) newErrors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
      if (newAdmin.password !== newAdmin.confirmPassword) {
        newErrors.confirmPassword = "كلمات المرور غير متطابقة";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Add new admin
  const handleAddAdmin = () => {
    if (!validateForm()) return;

    const newAdminData = {
      id: admins.length + 1,
      name: newAdmin.name,
      email: newAdmin.email,
      role: newAdmin.role,
      createdAt: new Date().toISOString().split('T')[0]
    };

    setAdmins(prev => [...prev, newAdminData]);
    setSuccessMessage("تم إضافة المشرف بنجاح!");
    setIsAddModalOpen(false);
    resetForm();
    
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Open edit modal
  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setNewAdmin({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      password: "",
      confirmPassword: ""
    });
    setIsEditModalOpen(true);
  };

  // Update admin
  const handleUpdateAdmin = () => {
    if (!validateForm() || !selectedAdmin) return;

    setAdmins(prev => prev.map(admin =>
      admin.id === selectedAdmin.id
        ? { ...admin, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
        : admin
    ));

    setSuccessMessage("تم تحديث بيانات المشرف بنجاح!");
    setIsEditModalOpen(false);
    resetForm();
    
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Open delete confirmation
  const handleDeleteClick = (admin) => {
    setSelectedAdmin(admin);
    setIsDeleteModalOpen(true);
  };

  // Delete admin
  const handleDeleteAdmin = () => {
    setAdmins(prev => prev.filter(admin => admin.id !== selectedAdmin.id));
    setSuccessMessage("تم حذف المشرف بنجاح!");
    setIsDeleteModalOpen(false);
    
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  // Reset form
  const resetForm = () => {
    setNewAdmin({ name: "", email: "", role: "", password: "", confirmPassword: "" });
    setErrors({});
    setSelectedAdmin(null);
  };

  // Close modal
  const closeModal = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    resetForm();
  };

  // Admin statistics based on roles - all in green shades
  const stats = [
    { 
      title: "المشرفين الرئيسيين", 
      value: admins.filter(a => a.role === ROLE_OPTIONS.ADMIN).length, 
      color: "#10B981",
      icon: <FaUserShield className="text-2xl" />
    },
    { 
      title: "مسؤولي الاستثمار", 
      value: admins.filter(a => a.role === ROLE_OPTIONS.INVESTMENT_MANAGER).length, 
      color: "#059669",
      icon: <FaChartLine className="text-2xl" />
    },
    { 
      title: "مسؤولي المشاريع", 
      value: admins.filter(a => a.role === ROLE_OPTIONS.PROJECT_MANAGER).length, 
      color: "#047857",
      icon: <FaProjectDiagram className="text-2xl" />
    },
  ];

  // Main content wrapped in DashboardLayout
  return (
    <DashboardLayout>
      {/* Success Message */}
      {successMessage && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
            <FaCheckCircle className="text-xl" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800">إدارة المشرفين</h1>
          <p className="text-gray-600">إدارة حسابات المشرفين والصلاحيات</p>
        </div>
        
        {/* Add Admin Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 md:mt-0 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 hover:scale-105"
        >
          <FaUserPlus className="text-xl" />
          إضافة مشرف جديد
        </button>
      </div>

      {/* Stats Cards - all in green theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow duration-300 relative overflow-hidden group"
          >
            <div className="flex items-center justify-between">
              <div className="text-right">
                <span className="text-3xl font-bold text-gray-900 block">{stat.value}</span>
                <span className="text-gray-500 mt-2 block">{stat.title}</span>
              </div>
              <div 
                className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl flex items-center justify-center text-white opacity-20 group-hover:opacity-30 transition-opacity duration-300"
              >
                {stat.icon}
              </div>
            </div>
            <div 
              className="absolute bottom-0 right-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-green-500 transition-all duration-300 group-hover:h-2"
            ></div>
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="ابحث عن مشرف بالاسم، البريد الإلكتروني أو الدور..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-6 py-4 pr-12 bg-white rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-4 px-6 text-right font-semibold text-gray-700">المشرف</th>
                <th className="py-4 px-6 text-right font-semibold text-gray-700">البريد الإلكتروني</th>
                <th className="py-4 px-6 text-right font-semibold text-gray-700">الدور</th>
                <th className="py-4 px-6 text-right font-semibold text-gray-700">تاريخ الإنشاء</th>
                <th className="py-4 px-6 text-right font-semibold text-gray-700">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold">
                        {admin.name.charAt(0)}
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-gray-900">{admin.name}</div>
                        <div className="text-sm text-gray-500">{admin.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-700">{admin.email}</td>
                  <td className="py-4 px-6">
                    <div className="flex justify-end">
                      <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${ROLE_BADGES[admin.role]?.color}`}>
                        {ROLE_BADGES[admin.role]?.icon}
                        {admin.role}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-500">{admin.createdAt}</td>
                  <td className="py-4 px-6">
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditClick(admin)}
                        className="p-2 bg-emerald-100 text-emerald-600 hover:bg-emerald-200 rounded-lg transition-colors duration-200"
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(admin)}
                        className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors duration-200"
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Empty State */}
        {filteredAdmins.length === 0 && (
          <div className="py-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUserTie className="text-3xl text-emerald-400" />
            </div>
            <p className="text-gray-500 text-lg">لا توجد نتائج للبحث</p>
            <p className="text-gray-400 text-sm mt-2">حاول تغيير مصطلحات البحث أو أضف مشرفًا جديدًا</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <FaUserShield className="text-white text-xl" />
                </div>
                <div className="text-right">
                  <h2 className="text-xl font-bold text-white">
                    {isAddModalOpen ? "إضافة مشرف جديد" : "تعديل بيانات المشرف"}
                  </h2>
                  <p className="text-white/80 text-sm">
                    {isAddModalOpen ? "املأ البيانات لإضافة مشرف جديد" : "قم بتعديل بيانات المشرف"}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-right text-gray-700 mb-2 font-medium">الاسم الكامل</label>
                <input
                  type="text"
                  name="name"
                  value={newAdmin.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                  placeholder="أدخل الاسم الكامل"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1 text-right">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-right text-gray-700 mb-2 font-medium">البريد الإلكتروني</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={newAdmin.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right pl-12"
                    placeholder="email@example.com"
                  />
                  <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.email && <p className="text-red-500 text-sm mt-1 text-right">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-right text-gray-700 mb-2 font-medium">الدور</label>
                <select
                  name="role"
                  value={newAdmin.role}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right"
                >
                  <option value="">اختر الدور</option>
                  <option value={ROLE_OPTIONS.ADMIN}>المشرف الرئيسي</option>
                  <option value={ROLE_OPTIONS.INVESTMENT_MANAGER}>مسؤول الاستثمار</option>
                  <option value={ROLE_OPTIONS.PROJECT_MANAGER}>مسؤول المشاريع</option>
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1 text-right">{errors.role}</p>}
              </div>

              {isAddModalOpen && (
                <>
                  <div>
                    <label className="block text-right text-gray-700 mb-2 font-medium">كلمة المرور</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={newAdmin.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right pl-12"
                        placeholder="••••••••"
                      />
                      <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.password && <p className="text-red-500 text-sm mt-1 text-right">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-right text-gray-700 mb-2 font-medium">تأكيد كلمة المرور</label>
                    <div className="relative">
                      <input
                        type="password"
                        name="confirmPassword"
                        value={newAdmin.confirmPassword}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-right pl-12"
                        placeholder="••••••••"
                      />
                      <FaKey className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1 text-right">{errors.confirmPassword}</p>}
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 bg-gray-50">
              <button
                onClick={closeModal}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl font-semibold transition-colors duration-300"
              >
                <FaTimes className="inline ml-2" />
                إلغاء
              </button>
              <button
                onClick={isAddModalOpen ? handleAddAdmin : handleUpdateAdmin}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <FaSave />
                {isAddModalOpen ? "إضافة المشرف" : "حفظ التغييرات"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaExclamationTriangle className="text-2xl text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-center mb-4">تأكيد الحذف</h3>
              <p className="text-gray-600 text-center mb-6">
                هل أنت متأكد من حذف المشرف <span className="font-bold text-red-600">{selectedAdmin.name}</span>؟
                <br />
                <span className="text-sm text-gray-500">لا يمكن التراجع عن هذا الإجراء</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded-xl font-semibold transition-colors duration-300"
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteAdmin}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors duration-300"
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}