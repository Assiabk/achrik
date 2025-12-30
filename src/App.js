import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddProject from "./pages/AddProject";
import Invest from "./pages/Invest";
import Splash from "./components/Splash";
import AdminSettings from "./pages/AdminSettings";
import AdminLogin from "./components/AdminLogin";
import Projects from "./pages/Projects";
import ProtectedRoute from "./components/ProtectedRoute";
import Investments from "./pages/Investments";
import ProjectsNeedingFunding from"./pages/ProjectsNeedingFunding";
import AnimatedBanners from "./pages/Animatedbanners";
import { useState, useEffect } from "react";
import { useAuth } from "./contexts/AuthContext"; 
import AdsManagement from "./pages/AdsManagement";
import FooterEditor from "./pages/FooterEditor";
import InfoManagment from "./pages/InfoManagment";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const { loading } = useAuth(); 

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Show splash screen
  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} />;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-emerald-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/projects-needing-funding" element={<ProjectsNeedingFunding />} /> {/* Add this route */}
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/projects" element={
  <ProtectedRoute>
    <Projects />
  </ProtectedRoute>
} />
          <Route path="/dashboard/add-project" element={
            <ProtectedRoute>
              <AddProject />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/ads-management" element={
  <ProtectedRoute>
    <AdsManagement/>
  </ProtectedRoute>
} />
          <Route path="/dashboard/invest" element={
            <ProtectedRoute>
              <Invest />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/banners" element={
            <ProtectedRoute>
              <AnimatedBanners/>
            </ProtectedRoute>
          } />
           <Route path="/dashboard/footer-editor" element={
            <ProtectedRoute>
              <FooterEditor/>
            </ProtectedRoute>
          } />
           <Route path="/dashboard/investments" element={
            <ProtectedRoute>
              <Investments/>
            </ProtectedRoute>
          } />
            <Route path="/dashboard/info-sections" element={
            <ProtectedRoute>
              <InfoManagment/>
            </ProtectedRoute>
          } />
          
          {/* Admin Settings with admin-only protection */}
          <Route path="/dashboard/admin-settings" element={
            <ProtectedRoute adminOnly={true}>
              <AdminSettings />
            </ProtectedRoute>
          } />
          
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
}