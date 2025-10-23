import { ChartNoAxesCombined, Eraser, Hash, House, Image, Scissors, SquarePen } from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

const adminSidebarMenuItems = [
  { id: "dashboard", label: "Dashboard", path: "/admin/Dashboard", icon: <House className="w-5 h-5" /> },
  { id: "createtask", label: "Create Task", path: "/admin/createtask", icon: <Hash className="w-5 h-5" /> },
  { id: "lead", label: "Leads", path: "/admin/Leads", icon: <SquarePen className="w-5 h-5" /> },
  { id: "aicallmanager", label: "Ai Call Manager", path: "/admin/aicallmanager", icon: <Image className="w-5 h-5" /> },
  { id: "workflow", label: "Workflow", path: "/admin/workflow", icon: <Scissors className="w-5 h-5" /> },
];

function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex flex-col gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-md font-bold cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-[#D8FDD2] text-[#043927] font-semibold"
                : "text-[#043927] hover:bg-[#EAF7E6] hover:text-[#043927]"
            }`}
          >
            {menuItem.icon}
            <span className="text-[15px]">{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

export default function Sidebars({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-60 bg-white text-[#043927] border-r p-4">
          <SheetHeader className="border-b pb-3">
            <SheetTitle className="flex gap-2 items-center">
              <ChartNoAxesCombined size={28} className="text-[#043927]" />
              <span className="text-xl font-bold">Samarthya</span>
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r bg-white text-[#043927] py-5 pl-5">
        <div onClick={() => navigate("/admin/dashboard")} className="flex items-center gap-2 cursor-pointer">
          <ChartNoAxesCombined size={28} className="text-[#043927]" />
          <h1 className="text-xl font-extrabold">Samarthya</h1>
        </div>
        <MenuItems />
      </aside>
    </Fragment>
  );
}
