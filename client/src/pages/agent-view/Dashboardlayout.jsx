import React from 'react'
import Dashboard from './dashboard/Dashboard'
// import RecentData from './dashboard/RecentData'
import LiveMonitor from './LiveMonitor'
import PendingDash from '@/components/agent-view/PendingDash'

export default function Dashboardlayout() {
  return (
    <>
    <Dashboard/>
    {/* <RecentData/> */}
    <div className='mt-5'>
      <LiveMonitor/>
    </div>
      <PendingDash/>
    </>
  )
}
