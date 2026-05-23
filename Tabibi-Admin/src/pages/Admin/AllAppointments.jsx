import React, { useEffect, useState } from 'react'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const VerifyPaymentModal = ({ appointment, onClose, onVerify }) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full overflow-hidden shadow-2xl">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h3 className="font-semibold text-gray-800">Verify Instapay Payment</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Patient: <span className="text-gray-800 font-medium">{appointment.userData.name}</span></p>
            <p className="text-sm text-gray-500 mb-1">Amount: <span className="text-gray-800 font-medium">{appointment.amount} EGP</span></p>
          </div>
          
          <div className="bg-gray-100 rounded-lg overflow-hidden border mb-6 flex items-center justify-center min-h-[300px]">
            {appointment.paymentProof ? (
              <img src={appointment.paymentProof} alt="Payment Proof" className="max-w-full max-h-[400px] object-contain" />
            ) : (
              <p className="text-gray-400 italic">No proof image available</p>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => onVerify(appointment._id, 'PAID')}
              className="flex-1 bg-green-600 text-white py-2.5 rounded-lg font-medium hover:bg-green-700 transition-colors"
            >
              Approve
            </button>
            <button 
              onClick={() => onVerify(appointment._id, 'FAILED')}
              className="flex-1 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AllAppointments = () => {
  const { appointments, cancelAppointment, completeAppointment, getAllAppointments, verifyPayment } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [selectedAppointment, setSelectedAppointment] = useState(null)

  const handleVerify = async (id, status) => {
    const success = await verifyPayment(id, status)
    if (success) {
      setSelectedAppointment(null)
    }
  }

  useEffect(() => {
    getAllAppointments()
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">All Appointments</h2>
        <p className="text-sm text-gray-500 mt-1">View and manage clinic appointments</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="hidden lg:grid grid-cols-[40px_1fr_60px_1.5fr_1.5fr_80px_100px_100px] gap-4 px-4 py-3 border-b bg-gray-50/50 text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0">
          <span>#</span>
          <span>Patient</span>
          <span>Age</span>
          <span>Date & Time</span>
          <span>Doctor</span>
          <span>Fees</span>
          <span>Payment</span>
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
            <div className="grid grid-cols-1 lg:grid-cols-[40px_1fr_60px_1.5fr_1.5fr_80px_100px_100px] gap-4 px-4 py-4 items-center hover:bg-gray-50/50 transition-colors duration-150" key={index}>
              <span className="hidden lg:block text-sm text-gray-400">{index + 1}</span>
              
              <div className="flex items-center gap-3">
                <img src={item.userData.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                <span className="font-medium text-gray-900 text-sm">{item.userData.name}</span>
              </div>
              
              <span className="hidden lg:block text-sm text-gray-500">{calculateAge(item.userData.dob)} yrs</span>
              
              <div className="text-sm">
                <p className="text-gray-900">{slotDateFormat(item.slotDate)}</p>
                <p className="text-xs text-gray-500">{item.slotTime}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <img src={item.docData.image} className="w-10 h-10 rounded-full object-cover bg-gray-100" alt="" />
                <span className="font-medium text-gray-900 text-sm">{item.docData.name}</span>
              </div>
              
              <span className="text-sm font-medium text-gray-900">{currency}{item.amount}</span>
              
              <div>
                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                  item.paymentStatus === 'PAID' ? 'bg-green-50 text-green-700' : 
                  item.paymentStatus === 'VERIFYING' ? 'bg-orange-50 text-orange-700' :
                  'bg-gray-50 text-gray-600'
                }`}>
                  {item.paymentStatus || 'PENDING'}
                </span>
                {item.paymentStatus === 'VERIFYING' && (
                  <button 
                    onClick={() => setSelectedAppointment(item)}
                    className="ml-2 text-xs text-primary hover:underline"
                  >
                    Verify
                  </button>
                )}
              </div>

              <div>
                {item.cancelled ? (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Completed</span>
                ) : (
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => cancelAppointment(item._id)} 
                      className="p-2 rounded-lg hover:bg-red-50 transition-colors duration-150" 
                      title="Cancel"
                    >
                      <img className="w-5 h-5" src={assets.cancel_icon} alt="Cancel" />
                    </button>
                    {completeAppointment && (
                      <button 
                        onClick={() => completeAppointment(item._id)} 
                        className="p-2 rounded-lg hover:bg-green-50 transition-colors duration-150" 
                        title="Mark Complete"
                      >
                        <img className="w-5 h-5" src={assets.tick_icon} alt="Complete" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedAppointment && (
        <VerifyPaymentModal 
          appointment={selectedAppointment} 
          onClose={() => setSelectedAppointment(null)}
          onVerify={handleVerify}
        />
      )}
    </div>
  )
}

export default AllAppointments