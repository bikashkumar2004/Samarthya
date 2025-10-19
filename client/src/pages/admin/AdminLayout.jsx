import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "@/components/admin/Sidebar";

const AdminLayout = () => {
  const [sidebar, setSidebar] = useState(false);

  return (
    <div className="flex h-screen w-full relative">
      {/* Sidebar */}
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />

      {/* Main Content Area */}
      <div
        className="
          flex-1 
          overflow-y-auto 
          relative 
          bg-[#F4F7FB] 
          max-sm:bg-[#dbe9db]
        "
      >
        {/* ✅ Hamburger / Close icon (visible only on mobile) */}
        <div className="absolute top-4 right-4 sm:hidden z-50">
          {sidebar ? (
            <X
              onClick={() => setSidebar(false)}
              className="w-7 h-7 text-gray-700 cursor-pointer"
            />
          ) : (
            <Menu
              onClick={() => setSidebar(true)}
              className="w-7 h-7 text-gray-700 cursor-pointer"
            />
          )}
        </div>

        {/* Page Content */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
