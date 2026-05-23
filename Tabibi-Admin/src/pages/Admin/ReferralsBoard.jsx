import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";

const ReferralsBoard = () => {
  const { referrals, getReferrals, updateReferralStatus } = useContext(AdminContext);

  useEffect(() => {
    getReferrals();
  }, []);

  const onChangeStatus = async (id, status) => {
    const ok = await updateReferralStatus(id, status);
    if (ok) getReferrals();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-50 text-green-700';
      case 'EXPIRED': return 'bg-red-50 text-red-700';
      case 'SENT': return 'bg-blue-50 text-blue-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Referrals Board</h2>
        <p className="text-sm text-gray-500 mt-1">Track patient referrals</p>
      </div>

      <div className="space-y-4">
        {referrals.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-base font-medium text-gray-900">No referrals found</p>
            <p className="text-sm text-gray-500 mt-1">Patient referrals will appear here once issued by doctors.</p>
          </div>
        ) : (
          referrals.map((ref) => (
            <div key={ref.id} className="bg-white border border-gray-100 rounded-2xl p-5 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all group">
              <div className="flex flex-wrap justify-between gap-6 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] px-2 py-1 bg-gray-900 text-white rounded-md">{ref.type}</span>
                    <h4 className="text-base font-bold text-gray-900">{ref.pharmacy?.name || ref.lab?.name || ref.radiologyCenter?.name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{ref.patient?.firstName} {ref.patient?.lastName}</p>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-200" />
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">{new Date(ref.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3 min-w-[160px]">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${getStatusBadge(ref.status)}`}>
                    {ref.status}
                  </span>
                  <div className="relative w-full">
                    <select 
                      value={ref.status} 
                      onChange={(e) => onChangeStatus(ref.id, e.target.value)} 
                      className="w-full bg-gray-50 border-none rounded-xl px-4 py-2.5 text-xs font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 cursor-pointer appearance-none transition-all hover:bg-gray-100"
                    >
                      <option value="SENT">Sent</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="EXPIRED">Expired</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReferralsBoard;
