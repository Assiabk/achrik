// ProjectsNeedingFunding.js
import { useState, useEffect } from "react";
import { 
  FiDollarSign, 
  FiPercent, 
  FiClock, 
  FiTrendingUp, 
  FiFilter, 
  FiSearch,
  FiHeart,
  FiMapPin,
  FiCalendar,
  FiBriefcase,
  FiCheck,
  FiUser,
  FiEye
} from "react-icons/fi";

export default function ProjectsNeedingFunding() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSector, setFilterSector] = useState("");
  const [votedProjects, setVotedProjects] = useState([]);
  const [showVoteSuccess, setShowVoteSuccess] = useState(false);
  const [voteMessage, setVoteMessage] = useState("");

  useEffect(() => {
    fetchProjectsNeedingFunding();
    // Load voted projects from localStorage
    const savedVotes = localStorage.getItem('votedProjects');
    if (savedVotes) {
      setVotedProjects(JSON.parse(savedVotes));
    }
  }, []);

  const fetchProjectsNeedingFunding = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/projects");
      const data = await res.json();
      if (data.success) {
        // Filter projects that need funding
        const projectsNeedingFunding = data.projects.filter(project => 
          (project.capitalPercentage || 0) < 100 && 
          (project.daysRemaining || 30) > 0
        );
        setProjects(projectsNeedingFunding);
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (projectId, projectName) => {
    // Check if user already voted for this project
    if (votedProjects.includes(projectId)) {
      setVoteMessage("لقد قمت بالتصويت لهذا المشروع مسبقاً!");
      setShowVoteSuccess(true);
      setTimeout(() => setShowVoteSuccess(false), 3000);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}/vote`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await res.json();
      
      if (data.success) {
        // Update local state
        const newVotedProjects = [...votedProjects, projectId];
        setVotedProjects(newVotedProjects);
        localStorage.setItem('votedProjects', JSON.stringify(newVotedProjects));
        
        // Update projects list
        setProjects(prevProjects => 
          prevProjects.map(project => 
            project._id === projectId 
              ? { ...project, totalVotes: (project.totalVotes || 0) + 1 } 
              : project
          )
        );
        
        setVoteMessage(`تم تسجيل تصويتك للمشروع "${projectName}" بنجاح!`);
        setShowVoteSuccess(true);
        
        // Hide success message after 3 seconds
        setTimeout(() => setShowVoteSuccess(false), 3000);
      } else {
        setVoteMessage("حدث خطأ أثناء التصويت: " + (data.message || ""));
        setShowVoteSuccess(true);
        setTimeout(() => setShowVoteSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Error voting:", err);
      setVoteMessage("حدث خطأ في الاتصال بالخادم");
      setShowVoteSuccess(true);
      setTimeout(() => setShowVoteSuccess(false), 3000);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ar-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  // Filter projects based on search and sector
  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.product?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.sector?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = !filterSector || project.sector === filterSector;
    
    return matchesSearch && matchesFilter;
  });

  // Extract unique sectors
  const sectors = [...new Set(projects.map(p => p.sector).filter(Boolean))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50">
      
      {/* Success Message */}
      {showVoteSuccess && (
        <div className="fixed top-6 right-6 left-6 md:left-auto md:w-96 z-50 animate-slide-in">
          <div className="rounded-xl shadow-xl p-5 border-l-4 bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-500">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                <FiCheck className="text-2xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">نجاح</h3>
                <p className="text-gray-600 text-sm mt-1">{voteMessage}</p>
              </div>
              <button
                onClick={() => setShowVoteSuccess(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            المشاريع المحتاجة للتمويل
          </h1>
          <p className="text-gray-600 text-lg">
            استثمر في مشاريع واعدة تحتاج لدعمك لتحقيق أهدافها
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-4 border border-emerald-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي المشاريع</p>
                  <p className="text-2xl font-bold text-gray-800">{projects.length}</p>
                </div>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <FiBriefcase className="text-xl text-emerald-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">إجمالي الأصوات</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {projects.reduce((sum, p) => sum + (p.totalVotes || 0), 0)}
                  </p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiTrendingUp className="text-xl text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl p-4 border border-purple-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">قيمة التمويل المطلوب</p>
                  <p className="text-lg font-bold text-gray-800">
                    {formatCurrency(projects.reduce((sum, p) => sum + (p.cost || 0) - (p.capitalRaised || 0), 0))}
                  </p>
                </div>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiDollarSign className="text-xl text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 border border-amber-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">مشاريع تم التصويت لها</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {votedProjects.length}
                  </p>
                </div>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <FiHeart className="text-xl text-amber-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="ابحث عن مشروع، شركة، منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all"
              />
              <FiSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                value={filterSector}
                onChange={(e) => setFilterSector(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none appearance-none"
              >
                <option value="">جميع القطاعات</option>
                {sectors.map(sector => (
                  <option key={sector} value={sector}>{sector}</option>
                ))}
              </select>
              <FiFilter className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <div>
              <p className="text-sm text-gray-500 mb-2">
                عرض {filteredProjects.length} من أصل {projects.length} مشروع
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(filteredProjects.length / Math.max(projects.length, 1)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">جاري تحميل المشاريع...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="w-20 h-20 mx-auto mb-4 bg-emerald-100 rounded-full flex items-center justify-center">
              <FiDollarSign className="text-3xl text-emerald-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد مشاريع حالياً</h3>
            <p className="text-gray-500">جميع المشاريع حصلت على تمويلها الكامل</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const hasVoted = votedProjects.includes(project._id);
              
              return (
                <div key={project._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
                  {/* Project Image */}
                  {project.projectImage?.url && (
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={`http://localhost:5000${project.projectImage.url}`} 
                        alt={project.projectName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        يحتاج تمويل
                      </div>
                    </div>
                  )}
                  
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-1">{project.projectName}</h3>
                        <p className="text-gray-500 text-sm flex items-center gap-1">
                          <FiBriefcase className="text-gray-400" />
                          {project.companyName || "بدون اسم شركة"}
                        </p>
                      </div>
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
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
                    
                    {/* Project Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">{project.product || "لا يوجد وصف"}</p>
                    
                    {/* Location */}
                    {project.location && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                        <FiMapPin className="text-gray-400" />
                        <span>{project.location}</span>
                      </div>
                    )}
                    
                    {/* Funding Progress */}
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-500">التقدم في التمويل</span>
                        <span className="font-bold text-emerald-600">{project.capitalPercentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${project.capitalPercentage || 0}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-gray-500">
                          {formatCurrency(project.capitalRaised || 0)} مجمع
                        </span>
                        <span className="text-gray-500">
                          {formatCurrency(project.cost || 0)} مطلوب
                        </span>
                      </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FiClock className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">الأيام المتبقية</p>
                          <p className="font-bold text-lg">{project.daysRemaining || 30}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FiTrendingUp className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">المستثمرون</p>
                          <p className="font-bold text-lg">{project.totalVotes || 0}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Date */}
                    {project.createdAt && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm mb-6">
                        <FiCalendar className="text-gray-400" />
                        <span>بدأ في {formatDate(project.createdAt)}</span>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <button 
                        className={`flex items-center justify-center gap-2 px-4 py-3 font-bold rounded-xl transition-all ${
                          hasVoted 
                            ? 'bg-emerald-100 text-emerald-600 cursor-default' 
                            : 'bg-emerald-500 text-white hover:bg-emerald-600 hover:scale-105'
                        }`}
                        onClick={() => !hasVoted && handleVote(project._id, project.projectName)}
                        disabled={hasVoted}
                      >
                        {hasVoted ? (
                          <>
                            <FiCheck />
                            تم التصويت
                          </>
                        ) : (
                          <>
                            <FiHeart />
                            صوت للمشروع
                          </>
                        )}
                      </button>
                      
                      <button 
                        className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-all hover:scale-105"
                        onClick={() => {
                          // Navigate to investment page or project details
                          window.location.href = `/dashboard/invest?project=${project._id}`;
                        }}
                      >
                        <FiDollarSign />
                        استثمر الآن
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
       
      </main>
      
      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}