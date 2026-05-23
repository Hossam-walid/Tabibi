import React from 'react'
import { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'
import ChatBox from '../../components/ChatBox'
import { useLocation, useNavigate } from 'react-router-dom'

const DoctorAppointments = () => {
  const { appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [activeChat, setActiveChat] = useState(null)

  useEffect(() => {
    getAppointments()
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatId = params.get('chat');
    if (chatId) {
      setActiveChat(chatId);
      // Clean up the URL to prevent reopening on reload
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Appointments</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your appointments</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[40px_1fr_100px_60px_1.5fr_80px_100px] gap-4 px-4 py-3 border-b bg-gray-50/50 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0">
          <span>#</span>
          <span>Patient</span>
          <span>Payment</span>
          <span>Age</span>
          <span>Date & Time</span>
          <span>Fees</span>
          <span>Status</span>
        </div>

        <div className="divide-y divide-gray-50">
          {appointments.sort((a, b) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            const parseDate = (dateStr, timeStr) => {
              const [d, m, y] = dateStr.split('_').map(Number);
              return new Date(`${d} ${months[m - 1]} ${y} ${timeStr}`).getTime();
            }
            return parseDate(b.slotDate, b.slotTime) - parseDate(a.slotDate, a.slotTime);
          }).map((item, index) => (
            <div className="grid grid-cols-1 lg:grid-cols-[40px_1fr_100px_60px_1.5fr_80px_100px] gap-4 px-4 py-4 items-center hover:bg-gray-50/50 transition-colors duration-150" key={index}>
              <span className="hidden lg:block text-sm text-gray-400">{index + 1}</span>
              
              <div className="flex items-center gap-3">
                {item.userData?.image ? (
                  <img src={item.userData.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                    {item.userData?.name?.charAt(0) || '?'}
                  </div>
                )}
                <p className="font-medium text-gray-900">{item.userData.name}</p>
              </div>
              
              <div>
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                  item.paymentMethod === 'Stripe' || item.paymentMethod === 'Instapay' || item.payment 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-gray-50 text-gray-600'
                }`}>
                  {item.paymentMethod || (item.payment ? 'Online' : 'CASH')}
                </span>
                {item.paymentMethod === 'Instapay' && item.paymentProof && (
                  <a 
                    href={item.paymentProof} 
                    target='_blank' 
                    rel="noopener noreferrer" 
                    className='ml-2 text-xs text-primary hover:underline'
                  >
                    View
                  </a>
                )}
              </div>
              
              <span className="hidden lg:block text-sm text-gray-500">{calculateAge(item.patient?.dateOfBirth)} yrs</span>
              
              <div className="text-sm">
                <p className="text-gray-900">{slotDateFormat(item.slotDate)}</p>
                <p className="text-xs text-gray-500">{item.slotTime}</p>
              </div>
              
              <span className="text-sm font-medium text-gray-900">{currency}{item.paymentAmount || item.amount || 0}</span>

              <div>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    {item.cancelled ? (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">Cancelled</span>
                    ) : item.isCompleted ? (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Completed</span>
                    ) : (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => completeAppointment(item.id || item._id)} 
                          className="p-2 rounded-lg hover:bg-green-50 transition-colors duration-150" 
                          title="Mark Complete"
                        >
                          <img className="w-5 h-5" src={assets.tick_icon} alt="Complete" />
                        </button>
                        <button 
                          onClick={() => cancelAppointment(item.id || item._id)} 
                          className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-150" 
                          title="Cancel"
                        >
                          <img className="w-5 h-5" src={assets.cancel_icon} alt="Cancel" />
                        </button>
                      </div>
                    )}
                  </div>
                  {!item.cancelled && (
                    <button 
                      onClick={() => setActiveChat(item.id || item._id)} 
                      className="w-full px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 text-center"
                    >
                      Chat with Patient
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Chat Box Modal */}
      {activeChat && (
        <ChatBox appointmentId={activeChat} onClose={() => setActiveChat(null)} />
      )}
    </div>
  )
}

export default DoctorAppointments