import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focused, setFocused] = useState(null)
  const { login } = useAuth()
  const navigate = useNavigate()

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    
    const success = await login(email, password);
    setIsLoading(false);
    
    if (success) {
      navigate('/');
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 1, 0.5, 1] // ease-out-quart
      }
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAFAFA]">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm px-6"
      >
        <motion.div variants={itemVariants} className="mb-10">
          <h1 className="text-3xl font-light tracking-tight text-gray-900">
            <span className="text-primary font-medium">Tabibi</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">Clinic admin portal</p>
        </motion.div>

        <form onSubmit={onSubmitHandler} className="space-y-6">
          <motion.div variants={itemVariants} className="space-y-1.5">
            <label 
              htmlFor="email" 
              className="block text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Email
            </label>
            <input 
              id="email"
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              onFocus={() => setFocused('email')}
              onBlur={() => setFocused(null)}
              className={`
                w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 
                border transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                ${focused === 'email' ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}
              `}
              type="email" 
              required 
              placeholder="admin@clinic.com"
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="space-y-1.5">
            <label 
              htmlFor="password" 
              className="block text-xs font-medium text-gray-700 uppercase tracking-wider"
            >
              Password
            </label>
            <input 
              id="password"
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              onFocus={() => setFocused('password')}
              onBlur={() => setFocused(null)}
              className={`
                w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-400 
                border transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                ${focused === 'password' ? 'border-gray-300 bg-white shadow-sm' : 'border-gray-200 bg-gray-50'}
              `}
              type="password" 
              required 
              placeholder="••••••••"
            />
          </motion.div>
          
          <motion.button 
            variants={itemVariants}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            className="group relative w-full py-3 px-4 rounded-lg font-medium text-white bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-out hover:shadow-lg hover:shadow-gray-900/10" 
            disabled={isLoading}
          >
            <span className={`inline-flex items-center transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
              Sign in
            </span>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </motion.button>
        </form>

        <motion.p variants={itemVariants} className="mt-8 text-center text-xs text-gray-400">
          Healthcare management system
        </motion.p>
      </motion.div>
    </div>
  )
}

export default Login
