import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const ReceptionAppointments = () => {
  const {
    receptionAppointments,
    getReceptionAppointments,
    confirmReceptionAppointment,
    cancelReceptionAppointment,
  } = useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    getReceptionAppointments();
  }, []);

  const onConfirm = async (id) => {
    const ok = await confirmReceptionAppointment(id);
    if (ok) getReceptionAppointments();
  };

  const onCancel = async (id) => {
    const ok = await cancelReceptionAppointment(id);
    if (ok) getReceptionAppointments();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'CONFIRMED': return 'bg-green-50 text-green-700';
      case 'CANCELLED': return 'bg-red-50 text-red-700';
      case 'COMPLETED': return 'bg-blue-50 text-blue-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Reception Queue</h2>
        <p className="text-sm text-gray-500 mt-1">Manage appointment confirmations</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {receptionAppointments.length === 0 ? (
          <p className="text-sm text-gray-400 py-12 text-center">No appointments found.</p>
        ) : (
          receptionAppointments.map((item) => (
            <div key={item._id} className="p-4 border-b border-gray-100 last:border-b-0 flex flex-wrap justify-between gap-4 items-center hover:bg-gray-50/50 transition-colors">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{item.userData?.name || "Patient"}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.docData?.name || "Doctor"} - {item.docData?.specialization || "General"}</p>
                <p className="text-sm text-gray-500 mt-1">{slotDateFormat(item.slotDate)} | {item.slotTime}</p>
              </div>
              <div className="flex items-center gap-2">
                {item.status === "PENDING" && (
                  <button 
                    onClick={() => onConfirm(item.id || item._id)} 
                    className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                  >
                    Confirm
                  </button>
                )}
                {item.status !== "CANCELLED" && item.status !== "COMPLETED" && (
                  <button 
                    onClick={() => onCancel(item.id || item._id)} 
                    className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-red-600 text-sm font-medium hover:bg-red-50 transition-colors"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReceptionAppointments;
