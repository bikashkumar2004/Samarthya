import {
  ChartNoAxesCombined,
  Hash,
  House,
  Image,
  Scissors,
  SquarePen,
  ChevronDown,
  PhoneCall,
  Clock,
} from "lucide-react";
import React, { Fragment, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

// 🧭 Sidebar Menu Configuration
const adminSidebarMenuItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/agent/dashboard",
    icon: <House className="w-5 h-5" />,
  },
  {
    id: "inbox",
    label: "Inbox",
    icon: <Image className="w-5 h-5" />,
    children: [
      { id: "composemessage", label: "Compose Message", path: "/agent/inbox/composemessage" },
      { id: "sms", label: "SMS", path: "/agent/inbox/sms" },
      { id: "email", label: "Email", path: "/agent/inbox/email" },
      { id: "whatsapp", label: "Whatsapp", path: "/agent/inbox/whatsapp" },
    ],
  },
  {
    id: "createtask",
    label: "Create Task",
    path: "/agent/createtask",
    icon: <Hash className="w-5 h-5" />,
  },
  {
    id: "lead",
    label: "Leads",
    path: "/agent/leads",
    icon: <SquarePen className="w-5 h-5" />,
  },
  {
    id: "callManager",
    label: "Call Manager",
    icon: <PhoneCall className="w-5 h-5" />,
    children: [
      {
        id: "aicallmanager",
        label: "AI Call Manager",
        path: "/agent/aicallmanager",
        icon: <PhoneCall className="w-4 h-4" />,
      },
      {
        id: "pendingfollowups",
        label: "Pending Followups",
        path: "/agent/pending-followups",
        icon: <Clock className="w-4 h-4" />,
      },
    ],
  },
  { id: "campaigns", label: "Campaigns", path: "/agent/campaigns", icon: <Scissors className="w-5 h-5" /> },
];

// 🔸 Menu Items Component
function MenuItems({ setOpen, isExpanded }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <nav className="mt-6 flex flex-col gap-1">
      {adminSidebarMenuItems.map((menuItem) => {
        const isActive = location.pathname === menuItem.path;
        const isDropdown = !!menuItem.children;

        return (
          <div key={menuItem.id}>
            {/* Parent Menu */}
            <div
              onClick={() => {
                if (isDropdown) {
                  setOpenDropdown(openDropdown === menuItem.id ? null : menuItem.id);
                } else {
                  navigate(menuItem.path);
                  if (setOpen) setOpen(false);
                }
              }}
              className={`flex items-center justify-between px-3 py-2 rounded-md font-semibold cursor-pointer transition-all duration-200 ${
                isActive
                  ? "bg-[#D8FDD2] text-[#043927]"
                  : "text-[#043927] hover:bg-[#EAF7E6] hover:text-[#043927]"
              }`}
            >
              <div className="flex items-center gap-3">
                {menuItem.icon}
                {isExpanded && <span className="text-[15px]">{menuItem.label}</span>}
              </div>
              {isDropdown && isExpanded && (
                <ChevronDown
                  size={18}
                  className={`transition-transform ${
                    openDropdown === menuItem.id ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </div>

            {/* Dropdown Children */}
            {isDropdown && openDropdown === menuItem.id && (
              <div className="ml-9 mt-1 flex flex-col gap-1 transition-all">
                {menuItem.children.map((child) => {
                  const isChildActive = location.pathname === child.path;
                  return (
                    <div
                      key={child.id}
                      onClick={() => {
                        navigate(child.path);
                        if (setOpen) setOpen(false);
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-md cursor-pointer transition-all ${
                        isChildActive
                          ? "bg-[#D8FDD2] text-[#043927]"
                          : "text-[#043927] hover:bg-[#EAF7E6]"
                      }`}
                    >
                      {child.icon}
                      {isExpanded && <span className="text-[14px]">{child.label}</span>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

// 🔸 Sidebar Component
export default function Sidebars({ open, setOpen }) {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Fragment>
      {/* ✅ Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="w-60 bg-white text-[#043927] border-r p-4">
          <SheetHeader className="border-b pb-3">
            <SheetTitle className="flex gap-2 items-center">
              <ChartNoAxesCombined size={28} className="text-[#043927]" />
              <span className="text-xl font-bold">Samarthya</span>
            </SheetTitle>
          </SheetHeader>
          <MenuItems setOpen={setOpen} isExpanded={true} />
        </SheetContent>
      </Sheet>

      {/* ✅ Desktop Sidebar */}
      <aside
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={`hidden lg:flex flex-col border-r bg-white text-[#043927] py-5 transition-all duration-300 ${
          isExpanded ? "w-60 pl-5" : "w-20 items-center"
        }`}
      >
        <div
          onClick={() => navigate("/agent/dashboard")}
          className="flex items-center gap-2 cursor-pointer mb-6"
        >
          <ChartNoAxesCombined size={28} className="text-[#043927]" />
          {isExpanded && <h1 className="text-xl font-extrabold">Samarthya</h1>}
        </div>

        <MenuItems isExpanded={isExpanded} />
      </aside>
    </Fragment>
  );
}
