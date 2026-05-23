import React, { useContext } from 'react'
import { useEffect } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'

const DoctorDashboard = () => {
  const { dashData, getDashData, cancelAppointment, completeAppointment, patients, getPatients } = useContext(DoctorContext)
  const { slotDateFormat, currency } = useContext(AppContext)

  useEffect(() => {
    getDashData()
  }, [])

  useEffect(() => {
    if (dashData && patients.length === 0) {
      getPatients()
    }
  }, [dashData])

  return dashData && (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-light text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Your practice overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-4xl font-light text-gray-900">{currency} {dashData.earnings}</p>
              <p className="text-sm font-medium text-gray-500 mt-2">My Earnings</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.337 2.82.9M12 8V4m0 2h2.67M6.18 6.32A4.983 4.983 0 0112 4c2.21 0 4.07 1.35 4.82 3.18M18.82 11.68A8.942 8.942 0 0112 12c-2.21 0-4.07-1.35-4.82-3.18" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-4xl font-light text-gray-900">{dashData.appointments}</p>
              <p className="text-sm font-medium text-gray-500 mt-2">Appointments</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-primary/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-4xl font-light text-gray-900">{dashData.patients}</p>
              <p className="text-sm font-medium text-gray-500 mt-2">Patients</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-gray-900/5 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="font-medium text-gray-900">Latest Appointments</h3>
        </div>

        <div className="divide-y divide-gray-50">
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className="flex items-center px-6 py-4" key={index}>
              {item.userData?.image ? (
                <img className="w-10 h-10 rounded-full object-cover" src={item.userData.image} alt="" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium text-sm">
                  {item.userData?.name?.charAt(0) || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0 ml-4">
                <p className="text-sm font-medium text-gray-900 truncate">{item.userData.name}</p>
                <p className="text-xs text-gray-500">Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.cancelled ? (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">Cancelled</span>
                ) : item.isCompleted ? (
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">Completed</span>
                ) : (
                  <div className="flex gap-1">
                    <button 
                      onClick={() => completeAppointment(item._id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 transition-colors group"
                      title="Mark as Completed"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider hidden lg:block">Complete</span>
                    </button>
                    <button 
                      onClick={() => cancelAppointment(item._id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors group"
                      title="Cancel Appointment"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-xs font-bold uppercase tracking-wider hidden lg:block">Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard