import React, { useState, useEffect, useRef } from 'react'
import io from 'socket.io-client'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'

const ChatBox = ({ appointmentId, onClose }) => {
  const { user, session } = useAuth()
  const token = session?.token || localStorage.getItem('tabibi_admin_token')
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const socketRef = useRef(null)
  const messagesEndRef = useRef(null)

  const currentUserId = user?.id
  
  useEffect(() => {
    if (!token || !currentUserId) {
      setLoading(false)
      return
    }

    // Fetch history
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/chat/${appointmentId}`, {
          headers: { Authorization: `Bearer ${token}`, atoken: token }
        })
        if (response.data.success) {
          setMessages(response.data.data)
        }
      } catch (error) {
        console.error('Error fetching chat history', error)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()

    // Setup socket
    socketRef.current = io(backendUrl)
    socketRef.current.emit('join_appointment', appointmentId)

    socketRef.current.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
      }
    }
  }, [appointmentId, token, currentUserId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !socketRef.current) return

    const messageData = {
      id: Date.now().toString(), // temporary ID
      appointmentId,
      senderId: currentUserId,
      content: newMessage.trim(),
      createdAt: new Date().toISOString()
    }

    setMessages((prev) => [...prev, messageData])
    socketRef.current.emit('send_message', messageData)
    setNewMessage('')
  }

  return (
    <div className="fixed inset-0 bg-gray-900/50 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg flex flex-col h-[600px] max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary/5 rounded-t-2xl">
          <div>
            <h3 className="font-bold text-gray-900">Live Chat</h3>
            <p className="text-xs text-gray-500">Connecting with your patient</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-10 text-sm">
              No messages yet. Send a message to start the conversation!
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMine = msg.senderId === user?.id
              return (
                <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[75%] rounded-2xl px-4 py-2 shadow-sm ${
                      isMine 
                        ? 'bg-primary text-white rounded-br-sm' 
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isMine ? 'text-white/70' : 'text-gray-400'}`}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white border-t border-gray-200 rounded-b-2xl">
          <form onSubmit={handleSend} className="flex gap-2 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-primary text-white p-2.5 rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="w-5 h-5 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChatBox
