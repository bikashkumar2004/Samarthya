import { Eraser, FileText, Hash, House, Image, LogOut, Scissors, SquarePen, Users } from 'lucide-react';
import React, { useEffect } from 'react'
import { NavLink } from 'react-router-dom';

const navItems = [
  {to: '/admin', label: 'Dashboard', Icon: House},
  {to: '/admin/list', label: 'List', Icon: SquarePen},
  {to: '/admin/contact', label: 'Contact', Icon: Hash},
  {to: '/admin/markting', label: 'Markting', Icon: Image},
  {to: '/admin/conversation', label: 'Conversation', Icon: Eraser},
  {to: '/admin/workflow', label: 'Workflow', Icon: Scissors}
]


const Sidebar = ({ sidebar, setSidebar}) => {
    
    
    
  return (
    <div className={`w-60 bg-white border-r border-gray-200 flex flex-col justify-between items-center max-sm:absolute top-14 bottom-0 ${sidebar ? 'translate-x-0' : 'max-sm:-translate-x-full'} transition-all duration-300 ease-in-out`}>
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
      </div>
      
    </div>
  )
}

export default Sidebar
