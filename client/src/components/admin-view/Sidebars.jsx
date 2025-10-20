import { 
  ChartNoAxesCombined, 
  Eraser, 
  Hash, 
  House, 
  Image, 
  Scissors, 
  SquarePen 
} from "lucide-react";
import React, { Fragment } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

// Sidebar menu items
const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin/Dashboard",
    icon: <House className="w-6 h-6" />,
  },
  {
    id: "lead",
    label: "Lead",
    path: "/admin/Leads",
    icon: <SquarePen className="w-6 h-6" />,
  },
  {
    id: "contact",
    label: "Contact",
    path: "/admin/Contacts",
    icon: <Hash className="w-6 h-6" />,
  },
  {
    id: "marketing",
    label: "Marketing",
    path: "/admin/Marketing",
    icon: <Image className="w-6 h-6" />,
  },
  {
    id: "conversation",
    label: "Conversation",
    path: "/admin/Conversations",
    icon: <Eraser className="w-6 h-6" />,
  },
  {
    id: "workflow",
    label: "Workflow",
    path: "/admin/workflow",
    icon: <Scissors className="w-6 h-6" />,
  },
];

// Sidebar Menu Items Component
function MenuItems({ setOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="mt-8 flex flex-col gap-2">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;

        return (
          <div
            key={menuItem.id}
            onClick={() => {
              navigate(menuItem.path);
              if (setOpen) setOpen(false);
            }}
            className={`flex items-center gap-4 px-5 py-3 rounded-xl font-medium mb-2 cursor-pointer transition-all duration-200 ${
              isActive
                ? "bg-[#D8FDD2] text-[#043927] font-semibold"
                : "hover: text-[#043927]"
            }`}
          >
            {menuItem.icon}
            <span className="text-[17px]">{menuItem.label}</span>
          </div>
        );
      })}
    </nav>
  );
}

// Main Sidebar Component
export default function Sidebars({ open, setOpen }) {
  const navigate = useNavigate();

  return (
    <Fragment>
      {/* Sidebar for Mobile (Sheet Drawer) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="left"
          className="w-64 bg-white text-[#043927] border-r p-6"
        >
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b pb-3">
              <SheetTitle className="flex gap-2 mt-4 mb-3 items-center">
                <ChartNoAxesCombined size={30} className="text-[#043927]" />
                <span className="text-xl font-bold text-[#043927]">Brevo</span>
              </SheetTitle>
            </SheetHeader>

            <MenuItems setOpen={setOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar for Large Screens */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-white  text-[#043927] py-6 pl-6">
        <div
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-2 cursor-pointer"
        >
          <ChartNoAxesCombined size={30} className="text-[#043927]" />
          <h1 className="text-2xl font-extrabold text-[#043927]">Brevo</h1>
        </div>

        <MenuItems />
      </aside>
    </Fragment>
  );
}
