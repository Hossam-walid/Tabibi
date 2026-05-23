import React from 'react'
import { assets } from '../assets/assets'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import NotificationBell from './NotificationBell'

const Navbar = () => {
  const { user, role, logout, organizations, organizationId, setActiveOrganization } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  const getRoleLabel = () => {
    switch (role) {
      case 'OWNER': return 'Owner';
      case 'ADMIN': return 'Admin';
      case 'RECEPTIONIST': return 'Receptionist';
      case 'DOCTOR': return 'Doctor';
      case 'MEMBER': return 'Doctor';
      default: return 'Staff';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/50">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-between px-8 py-5"
      >
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <motion.span 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400"
            >
              Portal
            </motion.span>
            <div className="flex items-center gap-2 mt-0.5 group cursor-help">
              <span className="text-xs font-semibold text-gray-600">{getRoleLabel()}</span>
              <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors" title="Clinic management role. Access levels vary by role.">?</div>
            </div>
          </div>

          {organizations.length > 1 && (
            <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <select 
                value={organizationId || ''} 
                onChange={(e) => setActiveOrganization(e.target.value)}
                className="text-[11px] font-bold uppercase tracking-wider border-none bg-transparent text-gray-500 hover:text-gray-900 focus:ring-0 cursor-pointer transition-colors"
              >
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-8">
          <NotificationBell />

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-4"
          >
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-gray-900 tracking-tight">{user?.name}</span>
              <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">{role}</span>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 rounded-full bg-white border-2 border-gray-100 p-0.5 overflow-hidden transition-transform group-hover:scale-105 shadow-sm">
                {user?.image ? (
                  <img src={user.image} className="w-full h-full object-cover rounded-full" alt="" />
                ) : (
                  <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-sm rounded-full">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <div className="h-6 w-px bg-gray-100" />

          <motion.button 
            whileHover={{ scale: 1.1, color: '#EF4444' }}
            whileTap={{ scale: 0.9 }}
            onClick={handleLogout} 
            className="flex items-center justify-center p-2 text-gray-400 rounded-xl transition-all hover:bg-red-50 group will-change-transform"
            aria-label="Sign out"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </header>
  )
}

export default Navbar
