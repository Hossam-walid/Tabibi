import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import { assets } from '../assets/assets'

const Icon = ({ type, active }) => {
  const icons = {
    home: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    calendar: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    add: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    ),
    users: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    list: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  }
  
  return (
    <motion.div 
      animate={{ 
        scale: active ? 1.15 : 1,
        color: active ? '#5F6FFF' : '#9CA3AF'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="transition-colors"
    >
      {icons[type] || icons.list}
    </motion.div>
  )
}

const CustomNavLink = ({ to, icon, children }) => {
  return (
    <NavLink to={to} aria-label={children}>
      {({ isActive }) => (
        <div 
          className={`relative flex items-center gap-4 px-4 py-3.5 min-h-[48px] rounded-xl transition-all duration-300 group focus-visible:ring-2 focus-visible:ring-primary/20 ${
            isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          {isActive && (
            <motion.div 
              layoutId="active-nav"
              className="absolute inset-0 bg-primary/5 rounded-xl z-0"
              transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
            />
          )}
          {isActive && (
            <motion.div 
              layoutId="active-dot"
              className="absolute left-0 w-1 h-5 bg-primary rounded-r-full z-10"
              transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
            />
          )}
          <div className="relative z-10 flex items-center gap-4">
            <Icon type={icon} active={isActive} />
            <span className='hidden lg:block text-[13px] font-bold tracking-tight'>{children}</span>
          </div>
        </div>
      )}
    </NavLink>
  )
}

const Sidebar = () => {
  const { role, isDoctor, isAdmin } = useAuth()
  const navigate = useNavigate()
  const isReceptionist = role === 'RECEPTIONIST'

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { ease: [0.16, 1, 0.3, 1], duration: 0.6 }
    }
  }

  return (
    <aside className="w-20 lg:w-72 h-screen sticky top-0 bg-white border-r border-gray-100 flex flex-col shadow-[1px_0_10px_rgba(0,0,0,0.01)]">
      <div 
        className="px-6 py-8 hidden lg:flex items-center gap-3 cursor-pointer group focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-4px] rounded-r-xl" 
        onClick={() => navigate('/')}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        aria-label="Tabibi Home"
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="w-1.5 h-6 bg-primary rounded-full will-change-transform"
        />
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 group-hover:text-primary transition-colors">Tabibi Admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto px-4 py-4 lg:py-0 space-y-2 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent hover:scrollbar-thumb-gray-300">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1.5"
        >
          <div className="px-4 mb-6 hidden lg:block">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-300">Navigation</span>
          </div>
          {isAdmin && (
            <>
              <motion.div variants={itemVariants}><CustomNavLink to="/admin-dashboard" icon="home">Overview</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/all-appointments" icon="calendar">Appointments</CustomNavLink></motion.div>
              <div className="h-4" aria-hidden="true" />
              <div className="px-4 mb-4 hidden lg:block">
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-300">Management</span>
              </div>
              <motion.div variants={itemVariants}><CustomNavLink to="/add-doctor" icon="add">Add Doctor</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/doctor-list" icon="users">Doctors Directory</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/crm-board" icon="list">Patient CRM</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/referrals-board" icon="list">Referrals</CustomNavLink></motion.div>
            </>
          )}
          {isReceptionist && (
            <motion.div variants={itemVariants}>
              <CustomNavLink to="/reception-appointments" icon="calendar">Patient Queue</CustomNavLink>
            </motion.div>
          )}
          {isDoctor && (
            <>
              <motion.div variants={itemVariants}><CustomNavLink to="/doctor-dashboard" icon="home">Medical Hub</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/doctor-appointments" icon="calendar">My Schedule</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/doctor-profile" icon="user">MD Profile</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/doctor-records" icon="list">Clinical Records</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/doctor-prescriptions" icon="list">Prescriptions</CustomNavLink></motion.div>
              <motion.div variants={itemVariants}><CustomNavLink to="/doctor-referrals" icon="list">Referral Outbox</CustomNavLink></motion.div>
            </>
          )}
        </motion.div>
      </nav>
      
      <div className="p-6 border-t border-gray-50">
        <div 
          className="flex items-center gap-4 px-4 py-3 bg-gray-50/50 rounded-2xl border border-gray-100/50 group hover:bg-white transition-colors cursor-default"
          aria-label="System status: Stable"
        >
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
            <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping opacity-40" />
          </div>
          <div className="hidden lg:flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500 leading-none">Terminal</span>
            <span className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">v1.2.4-stable</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
