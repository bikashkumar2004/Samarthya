import React, { useState } from "react";
import Sidebar from "./Sidebars";
import { Outlet } from "react-router-dom";
import Headers from "./Headers";
import SidebarDemo from "../SidebarDemo";

export default function AgentLayouts() {
  const [openSidebar, setopenSidebar] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden">
   
      {/* <Sidebar open={openSidebar} setOpen={setopenSidebar} /> */}
      <SidebarDemo/>
      <div className="flex flex-1 flex-col h-screen overflow-hidden">
        <div className="sticky top-0 z-50">
          <Headers setOpen={setopenSidebar} />
        </div>
        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#f9fbfa] p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
