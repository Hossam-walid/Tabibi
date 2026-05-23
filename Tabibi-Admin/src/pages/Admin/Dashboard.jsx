import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'

const Dashboard = () => {
  const { isAuthenticated } = useAuth()
  const { getDashData, cancelAppointment, dashData } = useContext(AdminContext)

  useEffect(() => {
    if (isAuthenticated) {
      getDashData()
    }
  }, [isAuthenticated])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] }
    }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-8 lg:p-12 max-w-[1600px] mx-auto"
    >
      <motion.div variants={cardVariants} className="mb-12">
        <h2 className="text-4xl font-light tracking-tight text-gray-900">Dashboard</h2>
        <p className="text-base text-gray-400 mt-2 font-medium">System overview and clinical performance</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-5xl font-light tracking-tighter text-gray-900">{dashData?.doctors ?? 0}</p>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-4">Total Doctors</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-5xl font-light tracking-tighter text-gray-900">{dashData?.appointments ?? 0}</p>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-4">Appointments</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm transition-all duration-300"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-5xl font-light tracking-tighter text-gray-900">{dashData?.patients ?? 0}</p>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mt-4">Active Patients</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600/40">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <motion.div 
          variants={cardVariants}
          className="lg:col-span-8 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >
          <div className="px-10 py-8 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold tracking-tight text-gray-900">Recent Activity</h3>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Latest 5</span>
          </div>

          <div className="divide-y divide-gray-50">
            {dashData?.latestAppointments?.length > 0 ? dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.05) }}
                className="flex items-center px-10 py-6 hover:bg-gray-50/50 transition-colors" 
                key={index}
              >
                <div className="relative group">
                  <img className="w-12 h-12 rounded-2xl object-cover shadow-sm group-hover:shadow-md transition-shadow" src={item.docData?.image} alt="" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div className="flex-1 min-w-0 ml-6">
                  <p className="text-[13px] font-bold text-gray-900 tracking-tight">{item.docData?.name}</p>
                  <p className="text-xs font-medium text-gray-400 mt-1 uppercase tracking-wider">{item.slotDate}</p>
                </div>
                <div className="flex items-center gap-4">
                  {item.cancelled ? (
                    <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-red-50 text-red-600 border border-red-100/50">Cancelled</span>
                  ) : item.isCompleted ? (
                    <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100/50">Completed</span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary border border-primary/10">Scheduled</span>
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className="p-2 rounded-xl text-gray-300 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
                        title="Dismiss"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )) : (
              <div className="px-10 py-24 text-center">
                <p className="text-sm font-medium text-gray-300 italic">No clinical records found for this period.</p>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div 
          variants={cardVariants}
          className="lg:col-span-4 space-y-8"
        >
          <div className="bg-gray-900 rounded-3xl p-10 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl -mr-16 -mt-16 group-hover:bg-primary/30 transition-colors" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">System Capacity</span>
            <p className="text-4xl font-light mt-6 tracking-tighter">84%</p>
            <div className="mt-8 h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '84%' }}
                transition={{ duration: 1, ease: 'circOut' }}
                className="h-full bg-primary"
              />
            </div>
            <p className="text-xs text-gray-500 mt-4 font-medium">Optimal performance levels detected across all clinical modules.</p>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 mb-6">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-4">
              <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-primary/5 hover:text-primary transition-all group active:scale-95">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2 group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Add MD</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 hover:bg-emerald-50 hover:text-emerald-600 transition-all group active:scale-95">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center mb-2 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest">Report</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Dashboard
