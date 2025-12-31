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
  FiEdit2,
  FiImage,
  FiPercent,
  FiClock
} from "react-icons/fi";
import { 
  MdAttachMoney,
  MdOutlineDescription,
  MdBusiness,
  MdOutlineWork,
  MdLocationOn
} from "react-icons/md";
import DashboardLayout from "../layouts/DashboardLayout";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [editForm, setEditForm] = useState({
    capitalRaised: "",
    capitalPercentage: "",
    daysRemaining: "",
    totalVotes: "",
    projectDetails: "",
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Extract unique sectors from projects
  const sectors = [...new Set(projects?.map(p => p.sector).filter(Boolean) || [])];

  useEffect(() => {
    fetchProjects();
  }, []);

  const showAlert = (type, message) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: '', message: '' });
    }, 5000);
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://achrikmaana.com/api/projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.projects || []);
      } else {
        showAlert('error', 'فشل في تحميل المشاريع');
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      showAlert('error', 'حدث خطأ أثناء تحميل المشاريع');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (project) => {
    setProjectToEdit(project);
    setEditForm({
      capitalRaised: project.capitalRaised || "",
      capitalPercentage: project.capitalPercentage || "",
      daysRemaining: project.daysRemaining || "",
      totalVotes: project.totalVotes || "0",
      projectDetails: project.projectDetails || "",
      image: null
    });
    setImagePreview(project.projectImage?.url ? `https://achrikmaana.com${project.projectImage.url}` : null);
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditForm(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // FIXED: Handle form submission with FormData for image upload
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!projectToEdit) return;
  
    try {
      setUploadingImage(true);
      
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add all fields to FormData
      formData.append('capitalRaised', parseFloat(editForm.capitalRaised) || 0);
      formData.append('capitalPercentage', parseFloat(editForm.capitalPercentage) || 0);
      formData.append('daysRemaining', parseInt(editForm.daysRemaining) || 30);
      formData.append('totalVotes', parseInt(editForm.totalVotes) || 0);
      formData.append('projectDetails', editForm.projectDetails || "");
      
      // Add image file if selected
      if (editForm.image) {
        formData.append('image', editForm.image);
      }

      console.log("📦 Sending FormData with image:", editForm.image ? "YES" : "NO");

      // Use FormData endpoint
      const res = await fetch(`https://achrikmaana.com/api/projects/${projectToEdit._id}/update-details`, {
        method: "PUT",
        body: formData  // No Content-Type header needed for FormData
      });

      const data = await res.json();
      console.log("📥 Server response:", data);
      
      if (data.success) {
        showAlert('success', 'تم تحديث المشروع بنجاح');
        fetchProjects();
        setShowEditModal(false);
        setProjectToEdit(null);
        setImagePreview(null);
      } else {
        showAlert('error', data.message || 'فشل في تحديث المشروع');
      }
    } catch (err) {
      console.error("❌ Error updating project:", err);
      showAlert('error', 'حدث خطأ أثناء تحديث المشروع');
    } finally {
      setUploadingImage(false);
    }
  };

  // Simple test function to verify the backend is working
  const testUpdate = async () => {
    if (!projectToEdit) return;
    
    try {
      const testData = {
        projectDetails: "Test update " + new Date().toISOString()
      };
      
      console.log("🧪 Testing update with:", testData);
      
      const res = await fetch(`https://achrikmaana.com/api/projects/${projectToEdit._id}/update`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });
      
      const data = await res.json();
      console.log("🧪 Test response:", data);
      
      if (data.success) {
        showAlert('success', '✅ Test successful! Backend is working.');
        fetchProjects();
      } else {
        showAlert('error', '❌ Test failed: ' + data.message);
      }
    } catch (err) {
      console.error("🧪 Test error:", err);
      showAlert('error', 'Test error: ' + err.message);
    }
  };

  // Alternative: Use JSON endpoint (for non-image updates)
  const handleEditSubmitJSON = async (e) => {
    e.preventDefault();
    if (!projectToEdit) return;

    try {
      setUploadingImage(true);
      
      const updateData = {
        capitalRaised: parseFloat(editForm.capitalRaised) || 0,
        capitalPercentage: parseFloat(editForm.capitalPercentage) || 0,
        daysRemaining: parseInt(editForm.daysRemaining) || 30,
        totalVotes: parseInt(editForm.totalVotes) || 0,
        projectDetails: editForm.projectDetails || ""
      };

      console.log("📦 Sending JSON update:", updateData);

      // Use the /update endpoint for JSON data
      const res = await fetch(`https://achrikmaana.com/api/projects/${projectToEdit._id}/update`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      const data = await res.json();
      console.log("📥 JSON update response:", data);
      
      if (data.success) {
        showAlert('success', 'تم تحديث المشروع بنجاح');
        fetchProjects();
        setShowEditModal(false);
        setProjectToEdit(null);
        setImagePreview(null);
      } else {
        showAlert('error', data.message || 'فشل في تحديث المشروع');
      }
    } catch (err) {
      console.error("Error updating project:", err);
      showAlert('error', 'حدث خطأ أثناء تحديث المشروع');
    } finally {
      setUploadingImage(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.sector?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = !filterSector || project.sector === filterSector;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
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

  const calculateDaysRemaining = (project) => {
    if (project.daysRemaining) return project.daysRemaining;
    
    if (project.createdAt) {
      const created = new Date(project.createdAt);
      const now = new Date();
      const diffTime = Math.abs(now - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const totalDays = 90;
      return Math.max(0, totalDays - diffDays);
    }
    return 30;
  };

  const getVoteCount = (project) => {
    return project.totalVotes || 0;
  };

  const handleDeleteClick = (project) => {
    setProjectToDelete(project);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectToDelete) return;
    
    try {
      const res = await fetch(`https://achrikmaana.com/api/projects/${projectToDelete._id}`, {
        method: "DELETE"
      });
      
      const data = await res.json();
      if (data.success) {
        showAlert('success', `تم حذف المشروع "${projectToDelete.projectName}" بنجاح`);
        fetchProjects();
      } else {
        showAlert('error', 'خطأ في حذف المشروع: ' + (data.message || ""));
      }
    } catch (err) {
      console.error("Error deleting project:", err);
      showAlert('error', 'حدث خطأ أثناء حذف المشروع');
    } finally {
      setShowDeleteModal(false);
      setProjectToDelete(null);
    }
  };

  const handleViewDetails = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const handleDownload = (fileUrl) => {
    if (fileUrl) {
      window.open(`https://achrikmaana.com${fileUrl}`, '_blank');
    }
  };

  const stats = {
    totalProjects: projects.length,
    totalCost: projects.reduce((sum, p) => sum + (p.cost || 0), 0),
    averageCost: projects.length > 0 ? 
      projects.reduce((sum, p) => sum + (p.cost || 0), 0) / projects.length : 0,
    totalCertificates: projects.reduce((sum, p) => sum + (p.certificates?.length || 0), 0),
    totalFiles: projects.reduce((sum, p) => sum + 
      (p.certificates?.length || 0) + 
      (p.complianceFiles?.length || 0) + 
      (p.economicStudy ? 1 : 0), 0),
    totalVotes: projects.reduce((sum, p) => sum + (parseInt(p.totalVotes) || 0), 0)
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 p-6">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">جاري تحميل المشاريع...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 p-4 md:p-6">
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

        <div className="mb-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">المشاريع المضافة</h1>
            <p className="text-gray-600">عرض وإدارة جميع المشاريع الاستثمارية</p>
            
            {projectToEdit && (
              <button
                onClick={testUpdate}
                className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg text-sm hover:bg-purple-600 transition-colors"
              >
                🧪 Test Backend Connection
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">إجمالي المشاريع</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalProjects}</p>
                </div>
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <FiBriefcase className="text-2xl text-emerald-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">إجمالي التكلفة</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{formatCurrency(stats.totalCost)}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-xl">
                  <FiDollarSign className="text-2xl text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">إجمالي الأصوات</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalVotes}</p>
                </div>
                <div className="p-3 bg-purple-100 rounded-xl">
                  <FiTrendingUp className="text-2xl text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-100 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600">إجمالي الملفات</p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">{stats.totalFiles}</p>
                </div>
                <div className="p-3 bg-amber-100 rounded-xl">
                  <FiFileText className="text-2xl text-amber-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="ابحث عن مشروع، شركة، اسم، هاتف، بريد..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-12 pl-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                />
                <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>

              <div className="relative">
                <select
                  value={filterSector}
                  onChange={(e) => setFilterSector(e.target.value)}
                  className="w-full px-4 py-3.5 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none appearance-none"
                >
                  <option value="">جميع القطاعات</option>
                  {sectors.map(sector => (
                    <option key={sector} value={sector}>{sector}</option>
                  ))}
                </select>
                <FiFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-2">
                  عرض {filteredProjects.length} من أصل {projects.length} مشروع
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${(filteredProjects.length / Math.max(projects.length, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <FiBriefcase className="text-3xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد مشاريع</h3>
            <p className="text-gray-500">لم يتم العثور على مشاريع تطابق معايير البحث</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div key={project._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {project.projectImage?.url && (
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={`https://achrikmaana.com${project.projectImage.url}`} 
                      alt={project.projectName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                )}

                <div className="p-6 border-b border-gray-100">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1 line-clamp-1">
                        {project.projectName || "بدون اسم"}
                      </h3>
                      <p className="text-gray-500 text-sm flex items-center gap-1">
                        <MdBusiness className="text-gray-400" />
                        <span className="line-clamp-1">{project.companyName || "بدون اسم شركة"}</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1.5 text-sm font-medium rounded-full ${
                      project.sector === 'صناعي' ? 'bg-blue-100 text-blue-800' :
                      project.sector === 'فلاحي' ? 'bg-green-100 text-green-800' :
                      project.sector === 'تجاري' ? 'bg-purple-100 text-purple-800' :
                      project.sector === 'خدماتي' ? 'bg-amber-100 text-amber-800' :
                      project.sector === 'صحي' ? 'bg-rose-100 text-rose-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {project.sector || "غير محدد"}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {project.product || "لا يوجد وصف للمنتج/الخدمة"}
                  </p>

                  <div className="space-y-2 mb-4">
                    {project.fullName && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiUser className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{project.fullName}</span>
                      </div>
                    )}
                    {project.phone && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiPhone className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{project.phone}</span>
                      </div>
                    )}
                    {project.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMail className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{project.email}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">رأس المال المجمع</span>
                        <span className="font-semibold text-emerald-600">
                          {project.capitalRaised ? formatCurrency(project.capitalRaised) : "0 دج"}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2.5 rounded-full transition-all duration-500"
                          style={{ width: `${project.capitalPercentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs mt-1">
                        <span className="text-gray-400">
                          {project.capitalPercentage || 0}%
                        </span>
                        <span className="text-gray-400">
                          {calculateDaysRemaining(project)} يوم متبقية
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <FiTrendingUp className="text-purple-500" />
                        <span className="text-sm text-gray-600">الأصوات:</span>
                        <span className="font-bold text-purple-600">{getVoteCount(project)}</span>
                      </div>
                      <span className="text-sm font-bold text-emerald-600">
                        {formatCurrency(project.cost)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center gap-1">
                      <FiCalendar className="text-gray-400" />
                      {project.createdAt ? formatDate(project.createdAt) : "غير محدد"}
                    </span>
                  </div>
                </div>

                <div className="p-4 border-b border-gray-100">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiUser className="text-gray-400" />
                      <span className="truncate">{project.companyType || "غير محدد"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin className="text-gray-400" />
                      <span className="truncate">{project.location || "غير محدد"}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 flex justify-between gap-2">
                  <button
                    onClick={() => handleViewDetails(project)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all duration-300 group-hover:scale-105 flex-1 justify-center"
                  >
                    <FiEye className="text-lg" />
                    <span className="text-sm font-medium">عرض</span>
                  </button>
                  <button
                    onClick={() => handleEditClick(project)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-600 hover:from-emerald-100 hover:to-teal-100 rounded-xl transition-all duration-300 group-hover:scale-105 flex-1 justify-center"
                  >
                    <FiEdit2 className="text-lg" />
                    <span className="text-sm font-medium">تعديل</span>
                  </button>
                  <button
                    onClick={() => handleDeleteClick(project)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 text-red-600 hover:from-red-100 hover:to-rose-100 rounded-xl transition-all duration-300 group-hover:scale-105 flex-1 justify-center"
                  >
                    <FiTrash2 className="text-lg" />
                    <span className="text-sm font-medium">حذف</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showModal && selectedProject && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedProject.projectName}</h2>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                      selectedProject.sector === 'صناعي' ? 'bg-blue-100 text-blue-800' :
                      selectedProject.sector === 'فلاحي' ? 'bg-green-100 text-green-800' :
                      selectedProject.sector === 'تجاري' ? 'bg-purple-100 text-purple-800' :
                      selectedProject.sector === 'خدماتي' ? 'bg-amber-100 text-amber-800' :
                      selectedProject.sector === 'صحي' ? 'bg-rose-100 text-rose-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedProject.sector}
                    </span>
                    <span className="text-sm text-gray-500">
                      <FiCalendar className="inline mr-1" />
                      {formatDate(selectedProject.createdAt)}
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

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {selectedProject.projectImage?.url && (
                  <div className="mb-6">
                    <img 
                      src={`https://achrikmaana.com${selectedProject.projectImage.url}`} 
                      alt={selectedProject.projectName}
                      className="w-full h-64 object-cover rounded-2xl shadow-lg"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-2xl border border-emerald-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <FiDollarSign className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">رأس المال المجمع</p>
                        <p className="text-xl font-bold text-emerald-600">
                          {selectedProject.capitalRaised ? formatCurrency(selectedProject.capitalRaised) : "0 دج"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FiPercent className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">نسبة الإنجاز</p>
                        <p className="text-xl font-bold text-blue-600">
                          {selectedProject.capitalPercentage || 0}%
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2.5 rounded-full"
                        style={{ width: `${selectedProject.capitalPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-5 rounded-2xl border border-purple-100">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <FiTrendingUp className="text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">إجمالي الأصوات</p>
                        <p className="text-xl font-bold text-purple-600">
                          {getVoteCount(selectedProject)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-2xl border border-amber-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <FiClock className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">المدة المتبقية لجمع رأس المال</p>
                          <p className="text-xl font-bold text-amber-600">
                            {calculateDaysRemaining(selectedProject)} يوم
                          </p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">
                        بدأ في {selectedProject.createdAt ? formatDate(selectedProject.createdAt) : "غير معروف"}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedProject.projectDetails && (
                  <div className="mb-6">
                    <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-5 rounded-2xl border border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <FiFileText className="text-gray-600" />
                        تفاصيل المشروع
                      </h3>
                      <p className="font-medium whitespace-pre-line">{selectedProject.projectDetails}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <MdOutlineDescription className="text-gray-600" />
                      تفاصيل المشروع
                    </h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FiHome className="text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">اسم الشركة</p>
                            <p className="font-medium">{selectedProject.companyName || "غير محدد"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 rounded-lg">
                            <MdOutlineWork className="text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">نوع الشركة</p>
                            <p className="font-medium">{selectedProject.companyType || "غير محدد"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 rounded-lg">
                            <FiTarget className="text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">المنتج / الخدمة</p>
                            <p className="font-medium">{selectedProject.product || "غير محدد"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-amber-100 rounded-lg">
                            <MdLocationOn className="text-amber-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">الموقع</p>
                            <p className="font-medium">{selectedProject.location || "غير محدد"}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-100 rounded-lg">
                          <MdAttachMoney className="text-emerald-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">التكلفة الإجمالية</p>
                          <p className="text-xl font-bold text-emerald-600">{formatCurrency(selectedProject.cost)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FiUser className="text-gray-600" />
                      معلومات جهة الاتصال
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FiUser className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">الاسم الكامل</p>
                          <p className="font-medium">{selectedProject.fullName || "غير محدد"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <FiPhone className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">رقم الهاتف</p>
                          <p className="font-medium">{selectedProject.phone || "غير محدد"}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FiMail className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                          <p className="font-medium">{selectedProject.email || "غير محدد"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <FiFileText className="text-gray-600" />
                      الملفات المرفقة
                    </h3>
                    <div className="space-y-3">
                      {selectedProject.economicStudy && (
                        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-emerald-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-100 rounded-lg">
                              <FiFile className="text-emerald-600" />
                            </div>
                            <div>
                              <p className="font-medium">الدراسة الاقتصادية</p>
                              <p className="text-sm text-gray-500">ملف الدراسة الاقتصادية للمشروع</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleDownload(selectedProject.economicStudy.url)}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          >
                            <FiDownload className="text-lg" />
                          </button>
                        </div>
                      )}

                      {selectedProject.certificates && selectedProject.certificates.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">الشهادات</h4>
                          <div className="space-y-2">
                            {selectedProject.certificates.map((cert, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200 hover:border-blue-300 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                                    <FiFile className="text-blue-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">شهادة {index + 1}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDownload(cert.url)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                >
                                  <FiDownload className="text-lg" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showEditModal && projectToEdit && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">تعديل مشروع: {projectToEdit.projectName}</h2>
                  <p className="text-gray-500 text-sm mt-1">أضف تفاصيل التمويل والصورة والمعلومات الإضافية</p>
                </div>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setProjectToEdit(null);
                    setImagePreview(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <FiX className="text-2xl text-gray-400 hover:text-gray-600" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      صورة المشروع
                    </label>
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-emerald-500 transition-colors">
                          <input
                            type="file"
                            id="image-upload"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="w-32 h-32 object-cover rounded-xl mx-auto mb-4"
                              />
                            ) : (
                              <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-xl flex items-center justify-center">
                                <FiImage className="text-3xl text-gray-400" />
                              </div>
                            )}
                            <div className="flex items-center justify-center gap-2 text-emerald-600 hover:text-emerald-700">
                              <FiImage />
                              <span>{imagePreview ? 'تغيير الصورة' : 'إضافة صورة'}</span>
                            </div>
                            <p className="text-gray-500 text-sm mt-2">
                              PNG, JPG, GIF حتى 5MB
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        قيمة رأس المال المجمع (دج)
                      </label>
                      <input
                        type="number"
                        name="capitalRaised"
                        value={editForm.capitalRaised}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="أدخل المبلغ"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        نسبة الإنجاز (%)
                      </label>
                      <input
                        type="number"
                        name="capitalPercentage"
                        value={editForm.capitalPercentage}
                        onChange={handleEditFormChange}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="مثال: 40.5"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        المدة المتبقية (أيام)
                      </label>
                      <input
                        type="number"
                        name="daysRemaining"
                        value={editForm.daysRemaining}
                        onChange={handleEditFormChange}
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="عدد الأيام المتبقية"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        إجمالي الأصوات
                      </label>
                      <input
                        type="number"
                        name="totalVotes"
                        value={editForm.totalVotes}
                        onChange={handleEditFormChange}
                        min="0"
                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
                        placeholder="عدد الأصوات"
                      />
                    </div>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      تفاصيل المشروع الإضافية
                    </label>
                    <textarea
                      name="projectDetails"
                      value={editForm.projectDetails}
                      onChange={handleEditFormChange}
                      rows="4"
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none"
                      placeholder="أضف تفاصيل إضافية عن المشروع..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        setProjectToEdit(null);
                        setImagePreview(null);
                      }}
                      className="py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={uploadingImage}
                      className={`py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 ${
                        uploadingImage ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      {uploadingImage ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          جاري الرفع...
                        </>
                      ) : (
                        <>
                          <FiCheckCircle />
                          حفظ التعديلات
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-500 mb-2">اختبار الاتصال:</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={testUpdate}
                        className="px-3 py-2 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                      >
                        🧪 Test Connection
                      </button>
                      <button
                        type="button"
                        onClick={handleEditSubmitJSON}
                        className="px-3 py-2 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        🔄 Use JSON Endpoint
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {showDeleteModal && projectToDelete && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-red-100 to-rose-100 rounded-full flex items-center justify-center">
                    <FiAlertCircle className="text-3xl text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">تأكيد الحذف</h3>
                  <p className="text-gray-600">
                    هل أنت متأكد من حذف المشروع 
                    <span className="font-bold text-red-600"> "{projectToDelete.projectName}"</span>؟
                  </p>
                  <p className="text-sm text-gray-500 mt-2">هذا الإجراء لا يمكن التراجع عنه.</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setShowDeleteModal(false);
                      setProjectToDelete(null);
                    }}
                    className="py-3 px-4 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 font-medium rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-300"
                  >
                    إلغاء
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    className="py-3 px-4 bg-gradient-to-r from-red-500 to-rose-500 text-white font-medium rounded-xl hover:from-red-600 hover:to-rose-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    نعم، احذف المشروع
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