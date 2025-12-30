import { useState, useEffect } from "react";
import { 
  FiBriefcase, 
  FiFileText, 
  FiDollarSign,
  FiUsers,
  FiTarget,
  FiMapPin,
  FiDownload,
  FiEye,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiCalendar,
  FiTrendingUp,
  FiX,
  FiAlertCircle,
  FiUser,
  FiHome,
  FiGlobe,
  FiBarChart2,
  FiCheckCircle,
  FiFile,
  FiFolder,
  FiPhone,
  FiMail,
  FiClock,
  FiCheck,
  FiXCircle,
  FiActivity,
  FiCheckSquare,
  FiArchive,
  FiTrendingDown,
  FiPercent
} from "react-icons/fi";
import { 
  MdAttachMoney,
  MdOutlineDescription,
  MdBusiness,
  MdOutlineWork,
  MdLocationOn,
  MdCorporateFare
} from "react-icons/md";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Investments() {
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [selectedInvestment, setSelectedInvestment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [investmentToDelete, setInvestmentToDelete] = useState(null);
  const [investmentToUpdate, setInvestmentToUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [reviewNotes, setReviewNotes] = useState("");
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [stats, setStats] = useState({
    totalInvestments: 0,
    pendingInvestments: 0,
    approvedInvestments: 0,
    rejectedInvestments: 0,
    completedInvestments: 0,
    totalInvestmentAmount: 0,
    investmentByType: [],
    investmentByProject: [],
    recentInvestments: []
  });

  useEffect(() => {
    fetchInvestments();
    fetchStats();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const fetchInvestments = async () => {
    try {
      setLoading(true);
      
      const res = await fetch("http://localhost:5000/api/investments");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      
      if (data.success) {
        setInvestments(data.investments || []);
      } else {
        showAlert('error', data.message || 'فشل في تحميل الاستثمارات');
      }
    } catch (err) {
      console.error("Error fetching investments:", err);
      // Only show alert if it's not a network error
      if (err.message !== "Failed to fetch") {
        showAlert('error', 'حدث خطأ أثناء تحميل الاستثمارات');
      }
      setInvestments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/investments/stats");
      
      if (!res.ok) return;
      
      const data = await res.json();
      
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = 
      investment.investorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investment.commercialReg?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !filterStatus || investment.status === filterStatus;
    const matchesType = !filterType || investment.companyType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const companyTypes = [...new Set(investments.map(i => i.companyType).filter(Boolean))];
  const statuses = ['pending', 'approved', 'rejected', 'completed'];

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-800', icon: FiClock };
      case 'approved': return { bg: 'bg-emerald-100', text: 'text-emerald-800', icon: FiCheck };
      case 'rejected': return { bg: 'bg-red-100', text: 'text-red-800', icon: FiXCircle };
      case 'completed': return { bg: 'bg-blue-100', text: 'text-blue-800', icon: FiCheckSquare };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: FiActivity };
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'قيد المراجعة';
      case 'approved': return 'مقبول';
      case 'rejected': return 'مرفوض';
      case 'completed': return 'مكتمل';
      default: return 'غير معروف';
    }
  };

  const handleDeleteClick = (investment) => {
    setInvestmentToDelete(investment);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!investmentToDelete) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/investments/${investmentToDelete._id}`, {
        method: "DELETE"
      });
      
      const data = await res.json();
      
      if (data.success) {
        showAlert('success', `تم حذف الاستثمار "${investmentToDelete.projectName}" بنجاح`);
        fetchInvestments();
        fetchStats();
      } else {
        showAlert('error', 'خطأ في حذف الاستثمار: ' + (data.message || ""));
      }
    } catch (err) {
      console.error("Error deleting investment:", err);
      showAlert('error', 'حدث خطأ أثناء حذف الاستثمار');
    } finally {
      setShowDeleteModal(false);
      setInvestmentToDelete(null);
    }
  };

  const handleStatusUpdateClick = (investment) => {
    setInvestmentToUpdate(investment);
    setNewStatus(investment.status);
    setReviewNotes(investment.reviewNotes || '');
    setShowStatusModal(true);
  };

  const handleStatusUpdateConfirm = async () => {
    if (!investmentToUpdate || !newStatus) return;
    
    try {
      const res = await fetch(`http://localhost:5000/api/investments/${investmentToUpdate._id}/status`, {
        method: "PUT",
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          status: newStatus, 
          reviewNotes 
        })
      });
      
      const data = await res.json();
      
      if (data.success) {
        showAlert('success', `تم تحديث حالة الاستثمار إلى "${getStatusText(newStatus)}"`);
        fetchInvestments();
        fetchStats();
        setShowStatusModal(false);
        setInvestmentToUpdate(null);
      } else {
        showAlert('error', 'خطأ في تحديث الحالة: ' + (data.message || ""));
      }
    } catch (err) {
      console.error("Error updating investment status:", err);
      showAlert('error', 'حدث خطأ أثناء تحديث حالة الاستثمار');
    }
  };

  const handleViewDetails = (investment) => {
    setSelectedInvestment(investment);
    setShowModal(true);
  };

  const handleDownload = (fileUrl) => {
    if (fileUrl) {
      window.open(`http://localhost:5000${fileUrl}`, '_blank');
    }
  };

  const calculateSharePercentage = (investment) => {
    if (!investment.sharesPurchased || !investment.totalInvestment || investment.sharePrice === 0) return '0%';
    const totalShares = investment.totalInvestment / investment.sharePrice;
    const percentage = (investment.sharesPurchased / totalShares) * 100;
    return `${percentage.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل الاستثمارات...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 md:p-6">
        {/* Alert Notification */}
        {alert.show && (
          <div className={`fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-slide-in`}>
            <div className={`rounded-xl shadow-xl p-5 border-l-4 ${
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

        {/* Header */}
        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إدارة الاستثمارات</h1>
            <p className="text-gray-600">عرض وإدارة جميع طلبات الاستثمار</p>
          </div>

         

          

          {/* البحث والتصفية */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن مستثمر، مشروع، هاتف..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                />
                <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                >
                  <option value="">جميع الحالات</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>{getStatusText(status)}</option>
                  ))}
                </select>
                <FiFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none appearance-none"
                >
                  <option value="">جميع الأنواع</option>
                  {companyTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                <MdCorporateFare className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  عرض {filteredInvestments.length} من أصل {investments.length} استثمار
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(filteredInvestments.length / Math.max(investments.length, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* قائمة الاستثمارات */}
        {filteredInvestments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <FiBriefcase className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد استثمارات</h3>
            <p className="text-gray-500">لم يتم العثور على استثمارات تطابق معايير البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredInvestments.map((investment) => {
              const statusColor = getStatusColor(investment.status);
              const StatusIcon = statusColor.icon;
              
              return (
                <div key={investment._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  {/* رأس البطاقة */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                          {investment.projectName || "بدون اسم مشروع"}
                        </h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <FiUser className="text-gray-400" />
                          <span className="line-clamp-1">{investment.investorName || "بدون اسم مستثمر"}</span>
                        </p>
                      </div>
                      <span className={`px-3 py-1.5 text-sm font-medium rounded-full flex items-center gap-1 ${statusColor.bg} ${statusColor.text}`}>
                        <StatusIcon className="text-sm" />
                        {getStatusText(investment.status)}
                      </span>
                    </div>

                    {/* معلومات سريعة */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPhone className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{investment.phone || "لا يوجد"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMail className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{investment.email || "لا يوجد"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MdBusiness className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{investment.companyName || investment.companyType || "بدون اسم"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center gap-1">
                        <FiCalendar className="text-gray-400" />
                        {formatDate(investment.submissionDate || investment.createdAt)}
                      </span>
                      <span className="font-bold text-emerald-600 text-lg">
                        {formatCurrency(investment.totalInvestment)}
                      </span>
                    </div>
                  </div>

                  {/* معلومات إضافية */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="text-center bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-xl">
                        <p className="text-gray-500 text-xs">الأسهم</p>
                        <p className="font-bold text-gray-800">{investment.sharesPurchased?.toLocaleString()}</p>
                      </div>
                      <div className="text-center bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-xl">
                        <p className="text-gray-500 text-xs">سعر السهم</p>
                        <p className="font-bold text-gray-800">{formatCurrency(investment.sharePrice)}</p>
                      </div>
                      <div className="text-center bg-gradient-to-r from-gray-50 to-slate-50 p-3 rounded-xl col-span-2">
                        <p className="text-gray-500 text-xs">نسبة الملكية</p>
                        <p className="font-bold text-gray-800">{calculateSharePercentage(investment)}</p>
                      </div>
                    </div>
                  </div>

                  {/* أزرار التحكم */}
                  <div className="p-4 flex justify-between gap-2">
                    <button
                      onClick={() => handleViewDetails(investment)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all duration-300 group-hover:scale-105"
                    >
                      <FiEye className="text-lg" />
                      <span className="text-sm font-medium">عرض التفاصيل</span>
                    </button>
                    
                    <button
                      onClick={() => handleStatusUpdateClick(investment)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 hover:from-emerald-100 hover:to-teal-100 rounded-xl transition-all duration-300 group-hover:scale-105"
                    >
                      <FiCheck className="text-lg" />
                      <span className="text-sm font-medium">تحديث الحالة</span>
                    </button>
                    
                    <button
                      onClick={() => handleDeleteClick(investment)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 hover:from-red-100 hover:to-rose-100 rounded-xl transition-all duration-300 group-hover:scale-105"
                    >
                      <FiTrash2 className="text-lg" />
                      <span className="text-sm font-medium">حذف</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal لعرض تفاصيل الاستثمار */}
        {showModal && selectedInvestment && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedInvestment.projectName}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full flex items-center gap-1 ${getStatusColor(selectedInvestment.status).bg} ${getStatusColor(selectedInvestment.status).text}`}>
                      {getStatusText(selectedInvestment.status)}
                    </span>
                    <span className="text-sm text-gray-500">
                      <FiCalendar className="inline mr-1" />
                      {formatDate(selectedInvestment.submissionDate || selectedInvestment.createdAt)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="text-2xl text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* العمود الأيسر */}
                  <div className="space-y-6">
                    {/* معلومات المستثمر */}
                    <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiUser className="text-blue-600" />
                        معلومات المستثمر
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">الاسم الكامل</p>
                          <p className="font-medium">{selectedInvestment.investorName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">رقم الهاتف</p>
                          <p className="font-medium">{selectedInvestment.phone || "غير محدد"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                          <p className="font-medium">{selectedInvestment.email || "غير محدد"}</p>
                        </div>
                      </div>
                    </div>

                    {/* معلومات الشركة */}
                    <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-2xl border border-purple-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MdBusiness className="text-purple-600" />
                        معلومات الشركة
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">اسم الشركة</p>
                          <p className="font-medium">{selectedInvestment.companyName || "غير محدد"}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">نوع المؤسسة</p>
                          <p className="font-medium">{selectedInvestment.companyType}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">الصفة القانونية</p>
                          <p className="font-medium">{selectedInvestment.legalStatus || "غير محدد"}</p>
                        </div>
                        {selectedInvestment.commercialReg && (
                          <div>
                            <p className="text-sm text-gray-500">السجل التجاري</p>
                            <p className="font-medium">{selectedInvestment.commercialReg}</p>
                          </div>
                        )}
                        {selectedInvestment.location && (
                          <div>
                            <p className="text-sm text-gray-500">الموقع</p>
                            <p className="font-medium">{selectedInvestment.location}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* معلومات المشروع */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiBriefcase className="text-emerald-600" />
                        معلومات المشروع
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">اسم المشروع</p>
                          <p className="font-medium">{selectedInvestment.projectName}</p>
                        </div>
                        {selectedInvestment.projectDescription && (
                          <div>
                            <p className="text-sm text-gray-500">وصف المشروع</p>
                            <p className="font-medium">{selectedInvestment.projectDescription}</p>
                          </div>
                        )}
                        {selectedInvestment.projectSector && (
                          <div>
                            <p className="text-sm text-gray-500">قطاع المشروع</p>
                            <p className="font-medium">{selectedInvestment.projectSector}</p>
                          </div>
                        )}
                        {selectedInvestment.projectType && (
                          <div>
                            <p className="text-sm text-gray-500">نوع المشروع</p>
                            <p className="font-medium">{selectedInvestment.projectType}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* العمود الأيمن */}
                  <div className="space-y-6">
                    {/* المعلومات المالية */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiDollarSign className="text-amber-600" />
                        المعلومات المالية
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">عدد الأسهم المشتراة</p>
                          <p className="text-xl font-bold text-emerald-600">{selectedInvestment.sharesPurchased?.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">سعر السهم</p>
                          <p className="font-medium">{formatCurrency(selectedInvestment.sharePrice)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">إجمالي الاستثمار</p>
                          <p className="text-2xl font-bold text-emerald-600">{formatCurrency(selectedInvestment.totalInvestment)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">نسبة الملكية</p>
                          <p className="font-medium">{calculateSharePercentage(selectedInvestment)}</p>
                        </div>
                      </div>
                    </div>

                    {/* معلومات إضافية */}
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-2xl border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiFileText className="text-gray-600" />
                        معلومات إضافية
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-500">الحالة الحالية</p>
                          <p className="font-medium flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(selectedInvestment.status).bg} ${getStatusColor(selectedInvestment.status).text}`}>
                              {getStatusText(selectedInvestment.status)}
                            </span>
                          </p>
                        </div>
                        {selectedInvestment.notes && (
                          <div>
                            <p className="text-sm text-gray-500">ملاحظات</p>
                            <p className="font-medium whitespace-pre-line">{selectedInvestment.notes}</p>
                          </div>
                        )}
                        {selectedInvestment.reviewNotes && (
                          <div>
                            <p className="text-sm text-gray-500">ملاحظات المراجعة</p>
                            <p className="font-medium whitespace-pre-line">{selectedInvestment.reviewNotes}</p>
                          </div>
                        )}
                        {selectedInvestment.reviewDate && (
                          <div>
                            <p className="text-sm text-gray-500">تاريخ المراجعة</p>
                            <p className="font-medium">{formatDate(selectedInvestment.reviewDate)}</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* الملفات المرفقة */}
                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-5 rounded-2xl border border-indigo-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiFolder className="text-indigo-600" />
                        الملفات المرفقة
                      </h3>
                      <div className="space-y-3">
                        {selectedInvestment.identityFile && (
                          <div className="bg-white p-3 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <FiFile className="text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm">ملف الهوية</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {selectedInvestment.identityFile.originalname || 'ملف الهوية'}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDownload(selectedInvestment.identityFile.url)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                                title="تحميل الملف"
                              >
                                <FiDownload />
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedInvestment.docsFile && (
                          <div className="bg-white p-3 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-green-100 rounded-lg">
                                <FiFile className="text-green-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm">ملف المستندات</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {selectedInvestment.docsFile.originalname || 'ملف المستندات'}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDownload(selectedInvestment.docsFile.url)}
                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                                title="تحميل الملف"
                              >
                                <FiDownload />
                              </button>
                            </div>
                          </div>
                        )}

                        {selectedInvestment.paymentProof && (
                          <div className="bg-white p-3 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                            <div className="flex items-start gap-3">
                              <div className="p-2 bg-emerald-100 rounded-lg">
                                <FiFile className="text-emerald-600" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm">وصل الدفع</p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {selectedInvestment.paymentProof.originalname || 'وصل الدفع'}
                                </p>
                              </div>
                              <button
                                onClick={() => handleDownload(selectedInvestment.paymentProof.url)}
                                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"
                                title="تحميل الملف"
                              >
                                <FiDownload />
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal تحديث الحالة */}
        {showStatusModal && investmentToUpdate && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-full flex items-center justify-center">
                    <FiCheck className="text-3xl text-blue-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">تحديث حالة الاستثمار</h3>
                  <p className="text-gray-600">
                    تحديث حالة استثمار 
                    <span className="font-bold text-blue-600"> "{investmentToUpdate.projectName}"</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">المستثمر: {investmentToUpdate.investorName}</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">الحالة الجديدة</label>
                    <div className="grid grid-cols-2 gap-2">
                      {statuses.map(status => {
                        const statusColor = getStatusColor(status);
                        return (
                          <button
                            key={status}
                            onClick={() => setNewStatus(status)}
                            className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                              newStatus === status 
                                ? `${statusColor.bg} ${statusColor.text} border-current`
                                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-center gap-2">
                              <statusColor.icon />
                              <span>{getStatusText(status)}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ملاحظات المراجعة</label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all resize-none"
                      placeholder="أضف ملاحظات المراجعة هنا..."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setShowStatusModal(false);
                      setInvestmentToUpdate(null);
                      setReviewNotes('');
                    }}
                    className="py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleStatusUpdateConfirm}
                    disabled={!newStatus}
                    className={`py-3 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl ${!newStatus ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    تأكيد التحديث
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal تأكيد الحذف */}
        {showDeleteModal && investmentToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center">
                    <FiAlertCircle className="text-3xl text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
                  <p className="text-gray-600">
                    هل أنت متأكد من حذف استثمار 
                    <span className="font-bold text-red-600"> "{investmentToDelete.projectName}"</span>؟
                  </p>
                  <p className="text-sm text-gray-500 mt-2">هذا الإجراء لا يمكن التراجع عنه وسيتم حذف جميع الملفات المرتبطة.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setInvestmentToDelete(null);
                    }}
                    className="py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="py-3 px-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    نعم، احذف الاستثمار
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes slide-in {
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
          .animate-fade-in {
            animation: fade-in 0.2s ease-out;
          }
          .line-clamp-1 {
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </div>
    </DashboardLayout>
  );
}