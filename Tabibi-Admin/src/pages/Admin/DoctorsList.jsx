import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const DoctorsList = () => {
  const { doctors, changeAvailability, getAllDoctors, deleteDoctor } = useContext(AdminContext)
  const navigate = useNavigate()

  useEffect(() => {
    getAllDoctors()
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
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
    <div className="p-8 lg:p-12 max-w-[1600px] mx-auto">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <h2 className="text-4xl font-light tracking-tight text-gray-900">Medical Directory</h2>
          <p className="text-base text-gray-400 mt-2 font-medium">Registry of active clinic physicians and specialists</p>
        </div>
        <div className="hidden sm:block">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-300">Total: {doctors.length}</span>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {doctors.map((item, index) => (
          <motion.div 
            variants={cardVariants}
            whileHover={{ y: -8 }}
            className="group bg-white border border-gray-100 rounded-[2rem] overflow-hidden hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500" 
            key={item.id || item._id || index}
          >
            <div className="overflow-hidden bg-gray-50 aspect-[4/5] relative">
              <motion.img 
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full object-cover object-top filter grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700" 
                src={item.image} 
                alt="" 
              />
              {!item.isAvailable && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center">
                  <span className="px-4 py-2 rounded-full bg-white/90 text-[10px] font-black uppercase tracking-widest text-gray-900">Offline</span>
                </div>
              )}
            </div>
            <div className="p-8">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight leading-tight">{item.firstName} {item.lastName}</h3>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mt-2">{item.specialization}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-8">
                <div 
                  onClick={() => changeAvailability(item.id || item._id)}
                  className="flex items-center gap-3 cursor-pointer group/toggle"
                >
                  <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${item.isAvailable ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                    <motion.div 
                      animate={{ x: item.isAvailable ? 16 : 0 }}
                      className="absolute top-1 left-1 w-2 h-2 rounded-full bg-white shadow-sm"
                    />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover/toggle:text-gray-900 transition-colors">Availability</span>
                </div>
              </div>

              <div className="flex gap-3 mt-8 pt-8 border-t border-gray-50">
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/edit-doctor/${item.id || item._id}`)} 
                  className="flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 bg-gray-50 rounded-2xl hover:bg-gray-900 hover:text-white transition-all duration-300"
                >
                  Configure
                </motion.button>
                <motion.button 
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    if (window.confirm('Permanent deletion? This action cannot be undone.')) {
                      deleteDoctor(item.id || item._id)
                    }
                  }} 
                  className="px-4 py-3 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default DoctorsList
