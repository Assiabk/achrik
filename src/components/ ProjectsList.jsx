import { useState, useEffect, useRef } from "react";
import { Users, Shield, Database, RefreshCw, AlertCircle, Loader2, Briefcase, Download, Trash2, User, Phone, Mail, UserCheck } from "lucide-react";

export default function ProjectsList() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalProjects, setTotalProjects] = useState(0);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteLoading, setDeleteLoading] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, userId: null, userName: "" });
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    fetchCounts();
    fetchUsers();
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchCounts = async () => {
    console.log("Starting fetchCounts...");
    setErrorMessage("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setErrorMessage("No token found. Please login.");
        return;
      }

      console.log("Using token:", token);

      // Fetch users
      const usersResponse = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const usersData = await usersResponse.json();
      console.log("Users API response:", usersData);

      if (!usersResponse.ok || !usersData.success) {
        throw new Error(usersData.message || "Failed to fetch users");
      }

      // Fetch admins
      const adminsResponse = await fetch("http://localhost:5000/api/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const adminsData = await adminsResponse.json();
      console.log("Admins API response:", adminsData);

      if (!adminsResponse.ok || !adminsData.success) {
        throw new Error(adminsData.message || "Failed to fetch admins");
      }

      // Fetch projects
      const projectsResponse = await fetch("http://localhost:5000/api/projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const projectsData = await projectsResponse.json();
      console.log("Projects API response:", projectsData);

      if (!projectsResponse.ok || !projectsData.success) {
        throw new Error(projectsData.message || "Failed to fetch projects");
      }

      if (isMounted.current) {
        setTotalUsers(usersData.users.length);
        setTotalAdmins(adminsData.admins.length);
        setTotalProjects(projectsData.projects.length);
        console.log(`Counts updated: users=${usersData.users.length}, admins=${adminsData.admins.length}, projects=${projectsData.projects.length}`);
      }
    } catch (err) {
      console.error("fetchCounts error:", err);
      if (isMounted.current) {
        setErrorMessage(err.message);
        setTotalUsers(0);
        setTotalAdmins(0);
        setTotalProjects(0);
      }
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setErrorMessage("No token found. Please login.");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch users list");
      }

      if (isMounted.current) {
        // Filter out password field for security
        const usersWithoutPassword = data.users.map(user => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        setUsersList(usersWithoutPassword);
      }
    } catch (err) {
      console.error("fetchUsers error:", err);
      if (isMounted.current) {
        setErrorMessage(err.message);
        setUsersList([]);
      }
    } finally {
      if (isMounted.current) setLoading(false);
    }
  };

  const showDeleteConfirm = (userId, userName) => {
    setDeleteConfirm({
      show: true,
      userId,
      userName
    });
  };

  const hideDeleteConfirm = () => {
    setDeleteConfirm({ show: false, userId: null, userName: "" });
  };

  const handleDeleteUser = async () => {
    const { userId, userName } = deleteConfirm;
    
    if (!userId) return;

    setDeleteLoading(prev => ({ ...prev, [userId]: true }));

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
      });
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete user");
      }

      // Update users list
      setUsersList(prev => prev.filter(user => user._id !== userId));
      setTotalUsers(prev => prev - 1);
      
      // Show success message
      setErrorMessage("");
      setDeleteConfirm({ show: false, userId: null, userName: "" });
    } catch (err) {
      console.error("Delete user error:", err);
      setErrorMessage(`فشل في حذف المستخدم: ${err.message}`);
    } finally {
      setDeleteLoading(prev => ({ ...prev, [userId]: false }));
      setDeleteConfirm({ show: false, userId: null, userName: "" });
    }
  };

  const downloadCSV = () => {
    if (usersList.length === 0) {
      setErrorMessage("لا توجد بيانات للتحميل");
      return;
    }

    // Prepare CSV content
    const headers = ["الاسم", "البريد الإلكتروني", "الهاتف", "الدور", "معرف المستخدم"];
    const rows = usersList.map(user => [
      `"${user.name || ""}"`,
      `"${user.email || ""}"`,
      `"${user.phone || ""}"`,
      `"${user.role || ""}"`,
      `"${user._id || ""}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create blob and download link
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `users_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (usersList.length === 0) {
      setErrorMessage("لا توجد بيانات للتحميل");
      return;
    }

    const dataStr = JSON.stringify(usersList, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `users_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const refreshAll = () => {
    fetchCounts();
    fetchUsers();
  };

  const getRoleIcon = (role) => {
    if (role === "investor") {
      return <UserCheck className="w-4 h-4 text-green-600" />;
    }
    return <User className="w-4 h-4 text-blue-600" />;
  };

  const getRoleText = (role) => {
    const roles = {
      "investor": "مستثمر",
      "admin": "مشرف",
      "user": "مستخدم"
    };
    return roles[role] || role;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            إحصائيات المستخدمين والمشرفين والمشاريع
          </h1>
          <div className="h-1 w-32 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteConfirm.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">تأكيد الحذف</h3>
              </div>
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من حذف المستخدم <span className="font-semibold text-red-600">"{deleteConfirm.userName}"</span>؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={hideDeleteConfirm}
                  className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition-colors duration-200"
                  disabled={deleteLoading[deleteConfirm.userId]}
                >
                  إلغاء
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={deleteLoading[deleteConfirm.userId]}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteLoading[deleteConfirm.userId] && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {deleteLoading[deleteConfirm.userId] ? "جاري الحذف..." : "نعم، احذف"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg p-4 shadow-md">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-800 mb-1">تنبيه</h3>
                <p className="text-red-700">{errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-16 h-16 text-green-500 animate-spin mx-auto mb-4" />
              <p className="text-lg text-gray-600 font-medium">جاري تحميل البيانات...</p>
            </div>
          </div>
        )}

        {/* Statistics Cards */}
        {!loading && !errorMessage && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {/* Users Card */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-100 hover:border-green-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-8 h-8 text-green-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-medium mb-1">إجمالي المستخدمين</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-800">{totalUsers}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Admins Card */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-100 hover:border-green-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-8 h-8 text-emerald-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-medium mb-1">إجمالي المشرفين</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-800">{totalAdmins}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Projects Card */}
              <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-100 hover:border-green-300">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Briefcase className="w-8 h-8 text-blue-600" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 font-medium mb-1">إجمالي المشاريع</p>
                      <p className="text-3xl md:text-4xl font-bold text-gray-800">{totalProjects}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Total Card */}
              <div className="group bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-green-400">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white bg-opacity-20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                      <Database className="w-8 h-8 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-green-50 font-medium mb-1">إجمالي الحسابات</p>
                      <p className="text-3xl md:text-4xl font-bold text-white">{totalUsers + totalAdmins + totalProjects}</p>
                    </div>
                  </div>
                  <div className="h-2 bg-white bg-opacity-20 rounded-full overflow-hidden">
                    <div className="h-full bg-white rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Users Table Section */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">قائمة المستخدمين</h2>
                  <p className="text-gray-600 text-sm mt-1">إجمالي: {usersList.length} مستخدم</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={downloadCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 hover:bg-green-100 font-medium rounded-lg transition-colors duration-200 border border-green-200"
                  >
                    <Download className="w-4 h-4" />
                    CSV
                  </button>
                  <button
                    onClick={downloadJSON}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 font-medium rounded-lg transition-colors duration-200 border border-blue-200"
                  >
                    <Download className="w-4 h-4" />
                    JSON
                  </button>
                </div>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">الاسم</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">البريد الإلكتروني</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">الهاتف</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">الدور</th>
                      <th className="py-3 px-4 text-right text-sm font-semibold text-gray-700">الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {usersList.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="py-8 text-center text-gray-500">
                          لا توجد بيانات للمستخدمين
                        </td>
                      </tr>
                    ) : (
                      usersList.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-green-600" />
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-xs text-gray-500 mt-1">ID: {user._id?.substring(0, 8)}...</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-gray-700">{user.email}</span>
                              <Mail className="w-4 h-4 text-gray-400" />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-gray-700">{user.phone}</span>
                              <Phone className="w-4 h-4 text-gray-400" />
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2 justify-end">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === "investor" 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {getRoleText(user.role)}
                              </span>
                              {getRoleIcon(user.role)}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => showDeleteConfirm(user._id, user.name)}
                                disabled={deleteLoading[user._id]}
                                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleteLoading[user._id] ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                                <span>حذف</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Refresh Button */}
            <div className="flex justify-center pt-4">
              <button
                onClick={refreshAll}
                disabled={loading}
                className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                <span>تحديث جميع البيانات</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}