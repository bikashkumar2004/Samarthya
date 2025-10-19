import React from "react";
import { NavLink } from "react-router-dom";
import {
  House,
  SquarePen,
  Hash,
  Image,
  Eraser,
  Scissors,
} from "lucide-react";

const navItems = [
  { to: "/admin", label: "Dashboard", Icon: House },
  { to: "/admin/list", label: "List", Icon: SquarePen },
  { to: "/admin/contact", label: "Contact", Icon: Hash },
  { to: "/admin/markting", label: "Marketing", Icon: Image },
  { to: "/admin/conversation", label: "Conversation", Icon: Eraser },
  { to: "/admin/workflow", label: "Workflow", Icon: Scissors },
];

export default function Sidebar({ sidebar, setSidebar }) {
  return (
    <div
      className={`w-60 h-screen bg-[#dbe9db] border-r border-gray-200 flex flex-col justify-between transition-all duration-300 ease-in-out 
        max-sm:fixed max-sm:top-14 max-sm:bottom-0 max-sm:z-50
        ${sidebar ? "translate-x-0" : "max-sm:-translate-x-full"}`}
    >
      <div className="mt-4 px-3 space-y-1">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end
            onClick={() => setSidebar && setSidebar(false)}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-xl font-medium mb-3 transition-all duration-200 ${
                isActive
                  ? "bg-[#D8FDD2] text-[#043927] font-semibold"
                  : "hover:bg-[#D8FDD2] text-[#043927]"
              }`
            }
          >
            {/* ✅ Use function-as-children form to access isActive safely */}
            {({ isActive }) => (
              <>
                <Icon className="w-7 h-7 text-[#043927]" />
                <span className="text-[17px]">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
