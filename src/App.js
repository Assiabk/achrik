import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AddProject from "./pages/AddProject";
import Invest from "./pages/Invest";
import Splash from "./components/Splash";
import AdminSettings from "./pages/AdminSettings";
import { useState } from "react";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return showSplash ? (
    <Splash onFinish={() => setShowSplash(false)} />
  ) : (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/add-project" element={<AddProject />} />
          <Route path="/dashboard/invest" element={<Invest />} />
          <Route path="/dashboard/admin-settings" element={<AdminSettings/>}/>
        </Routes>
      </div>
    </div>
  );
}
