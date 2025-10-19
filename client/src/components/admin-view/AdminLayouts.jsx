import React, { useState } from 'react'
import Sidebar from './Sidebars'
import { Outlet } from 'react-router-dom'
import Headers from './Headers'

export default function AdminLayouts() {
  const [openSidebar,setopenSidebar]=useState(false)
  return (
    <div className='flex min-h-screen w-screen'>
      <Sidebar open={openSidebar} setOpen={setopenSidebar}/>
      <div className='className="flex flex-1 flex-col'>
        <Headers setOpen={setopenSidebar}/>
        <main className='flex-1 flex-col flex bg-muted/40 '>
          <Outlet/>
        </main>
      </div>
    </div>
  )
}
