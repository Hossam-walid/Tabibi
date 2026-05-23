import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { notificationsApi } from '../lib/api'

const formatTime = (value) => {
  if (!value) return ''
  const date = new Date(value)
  const diff = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return 'Now'
  if (diff < hour) return `${Math.floor(diff / minute)}m ago`
  if (diff < day) return `${Math.floor(diff / hour)}h ago`
  return date.toLocaleDateString()
}

const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  const loadNotifications = async () => {
    try {
      setLoading(true)
      const result = await notificationsApi.list()
      setNotifications(result?.data || [])
      setUnreadCount(result?.unreadCount || 0)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadNotifications()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleToggle = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const nextOpen = !open
    setOpen(nextOpen)
    if (nextOpen) {
      loadNotifications()
    }
  }

  const handleMarkAsRead = async (notification, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (notification.isRead) return

    try {
      await notificationsApi.markAsRead(notification.id)
      setNotifications((items) => items.map((item) => item.id === notification.id ? { ...item, isRead: true } : item))
      setUnreadCount((count) => Math.max(count - 1, 0))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    } finally {
      setOpen(false)
      if (notification.type && notification.type.startsWith('NEW_MESSAGE|')) {
        const appointmentId = notification.type.split('|')[1]
        navigate(`/doctor-appointments?chat=${appointmentId}`)
      } else {
        navigate('/doctor-appointments')
      }
    }
  }

  const handleMarkAllAsRead = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    try {
      await notificationsApi.markAllAsRead()
      setNotifications((items) => items.map((item) => ({ ...item, isRead: true })))
      setUnreadCount(0)
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        type="button"
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleToggle}
        className="relative flex items-center justify-center w-11 h-11 rounded-full bg-white border border-gray-100 text-gray-400 hover:text-primary hover:bg-gray-50 transition-all shadow-sm"
        aria-label="Notifications"
        title="Notifications"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a2.25 2.25 0 0 1-5.714 0M18 8.25a6 6 0 1 0-12 0c0 7-3 7-3 8.75h18c0-1.75-3-1.75-3-8.75Z" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] leading-5 font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </motion.button>

      {open && (
        <div className="absolute right-0 top-full mt-3 w-[min(24rem,calc(100vw-2rem))] z-[80]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <div>
                <p className="text-sm font-bold text-gray-900">Notifications</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{unreadCount} unread</p>
              </div>
              {unreadCount > 0 && (
                <button type="button" onClick={handleMarkAllAsRead} className="text-xs font-bold text-primary hover:opacity-80">
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto scrollbar-thin">
              {loading ? (
                <p className="px-4 py-6 text-sm text-gray-400 text-center">Loading...</p>
              ) : notifications.length === 0 ? (
                <p className="px-4 py-6 text-sm text-gray-400 text-center">No notifications yet</p>
              ) : (
                notifications.map((notification) => (
                  <button
                    type="button"
                    key={notification.id}
                    onClick={(e) => handleMarkAsRead(notification, e)}
                    className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors ${notification.isRead ? 'bg-white' : 'bg-primary/5'}`}
                  >
                    <div className="flex gap-3">
                      <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${notification.isRead ? 'bg-gray-200' : 'bg-primary'}`} />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold text-gray-900">{notification.title}</span>
                        <span className="block text-xs text-gray-500 mt-1 leading-relaxed">{notification.message}</span>
                        <span className="block text-[11px] text-gray-400 mt-2">{formatTime(notification.createdAt)}</span>
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell
