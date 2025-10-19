import React from "react";
import { NavLink } from "react-router-dom";
import { House, SquarePen, Hash, Image, Eraser, Scissors } from "lucide-react";

const navItems = [
  {to: '/admin', label: 'Dashboard', Icon: House},
  {to: '/admin/lead', label: 'Lead', Icon: SquarePen},
  {to: '/admin/contact', label: 'Contact', Icon: Hash},
  {to: '/admin/markting', label: 'Markting', Icon: Image},
  {to: '/admin/conversation', label: 'Conversation', Icon: Eraser},
  {to: '/admin/workflow', label: 'Workflow', Icon: Scissors}
]

export default function Sidebar({ sidebar, setSidebar }) {
  return (
    <div className={` w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
      <div className='my-7 w-full'>
        <div className='px-6 mt-5 text-sm text-gray-600 font-medium'>
          {navItems.map(({to, label, Icon})=>(
            <NavLink key={to} to={to} end={to === '/admin'} onClick={()=>
              setSidebar(false)} className={({isActive})=> `px-3.5 py-2.5 flex items-center gap-3 rounded ${isActive ? 'bg-gradient-to-r from-[#3C81F6] to-[#9234EA] text-white' : ''}`}
            >
              {({isActive})=>(
                <>
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : ''}`}/>
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </div>

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
