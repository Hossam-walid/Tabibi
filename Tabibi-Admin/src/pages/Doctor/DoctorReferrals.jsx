import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorReferrals = () => {
  const { referrals, getMyReferrals, createReferral, profileData, pharmacies, labs, getPharmacies, getLabs, patients, getPatients } = useContext(DoctorContext);
  const [patientId, setPatientId] = useState("");
  const [refType, setRefType] = useState("LAB");
  const [refTargetId, setRefTargetId] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getMyReferrals();
    getPharmacies();
    getLabs();
    if (patients.length === 0) {
      getPatients();
    }
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!patientId || !refTargetId) return;
    if (!profileData?.id) {
      alert("Doctor profile not loaded. Please refresh.");
      return;
    }

    const payload = {
      patientId: patientId,
      type: refType,
      notes: notes.trim(),
    };
    if (refType === "PHARMACY") {
      payload.pharmacyId = refTargetId;
    } else if (refType === "LAB") {
      payload.labId = refTargetId;
    }

    const ok = await createReferral(payload);
    if (ok) {
      setRefTargetId("");
      setNotes("");
      getMyReferrals();
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'COMPLETED': return 'bg-green-50 text-green-700';
      case 'EXPIRED': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Referrals</h2>
        <p className="text-sm text-gray-500 mt-1">Create and track referrals</p>
      </div>

      <form onSubmit={onCreate} className="bg-white border border-gray-100 rounded-xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Select Patient</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
            required
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} - {p.phone}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Referral Type</label>
          <select 
            value={refType} 
            onChange={(e) => { setRefType(e.target.value); setRefTargetId(""); }} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="LAB">Lab</option>
            <option value="PHARMACY">Pharmacy</option>
            <option value="RADIOLOGY">Radiology</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">{refType === "PHARMACY" ? "Pharmacy" : "Lab"}</label>
          {refType === "RADIOLOGY" ? (
            <input 
              value={refTargetId} 
              onChange={(e) => setRefTargetId(e.target.value)} 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20" 
              placeholder="Enter target" 
            />
          ) : (
            <select 
              value={refTargetId} 
              onChange={(e) => setRefTargetId(e.target.value)} 
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
              required
            >
              <option value="">Select {refType === "PHARMACY" ? "Pharmacy" : "Lab"}</option>
              {(refType === "PHARMACY" ? pharmacies : labs).map(item => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          )}
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Notes</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
            rows={2} 
          />
        </div>
        <div className="md:col-span-2">
          <button className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Create Referral
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {referrals.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No referrals found.</p>
        ) : (
          referrals.map((ref) => (
            <div key={ref.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
              <p className="text-xs text-gray-400">{new Date(ref.createdAt).toLocaleString()}</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-medium text-gray-900">{ref.type}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(ref.status)}`}>
                  {ref.status}
                </span>
              </div>
              <p className="text-sm text-gray-600">Patient: {ref.patient?.firstName} {ref.patient?.lastName}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorReferrals;
