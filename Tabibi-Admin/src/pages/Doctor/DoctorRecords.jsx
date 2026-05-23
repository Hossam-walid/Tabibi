import React, { useContext, useState, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorRecords = () => {
  const { records, getPatientRecords, createPatientRecord, profileData, patients, getPatients } = useContext(DoctorContext);
  const [patientId, setPatientId] = useState("");
  const [chiefComplaint, setChiefComplaint] = useState("");
  const [notes, setNotes] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    if (profileData?.id) {
      getPatients();
    }
  }, [profileData?.id]);

  const onSearch = async (e) => {
    e.preventDefault();
    if (!patientId) return;
    await getPatientRecords(patientId);
  };

  const onCreate = async (e) => {
    e.preventDefault();
    if (!patientId || !chiefComplaint.trim()) return;
    if (!profileData?.id) {
      alert("Doctor profile not loaded. Please refresh.");
      return;
    }

    const ok = await createPatientRecord({
      patientId: patientId.trim(),
      chiefComplaint: chiefComplaint.trim(),
      notes: notes.trim(),
    }, profileData.id);

    if (ok) {
      setChiefComplaint("");
      setNotes("");
      setMedicine("");
      setDosage("");
      setFrequency("");
      setDuration("");
      await getPatientRecords(patientId.trim());
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Patient Records</h2>
        <p className="text-sm text-gray-500 mt-1">View and create medical records</p>
      </div>

      <form onSubmit={onSearch} className="bg-white p-4 rounded-xl border border-gray-100 mb-5 flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Select Patient</label>
          <select
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
          >
            <option value="">-- Select Patient --</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName} - {p.phone}
              </option>
            ))}
          </select>
        </div>
        <button className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
          Load
        </button>
      </form>

      <form onSubmit={onCreate} className="bg-white p-5 rounded-xl border border-gray-100 mb-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Patient</label>
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
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Chief Complaint</label>
          <input 
            value={chiefComplaint} 
            onChange={(e) => setChiefComplaint(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20" 
            placeholder="Main complaint..." 
            required 
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Notes</label>
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none" 
            rows={2} 
            placeholder="Additional notes..." 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Medicine</label>
          <input 
            value={medicine} 
            onChange={(e) => setMedicine(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Dosage</label>
          <input 
            value={dosage} 
            onChange={(e) => setDosage(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Frequency</label>
          <input 
            value={frequency} 
            onChange={(e) => setFrequency(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20" 
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Duration</label>
          <input 
            value={duration} 
            onChange={(e) => setDuration(e.target.value)} 
            className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20" 
          />
        </div>
        <div className="md:col-span-2">
          <button className="px-5 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
            Create Record
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {records.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No records loaded.</p>
        ) : (
          records.map((record) => (
            <div key={record.id} className="bg-white rounded-xl border border-gray-100 p-4 hover:border-gray-200 transition-colors">
              <p className="text-xs text-gray-400">{new Date(record.visitDate).toLocaleString()}</p>
              <p className="font-medium text-gray-900 mt-1">{record.chiefComplaint}</p>
              {record.diagnosis && <p className="text-sm text-gray-600 mt-1">Diagnosis: {record.diagnosis}</p>}
              <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorRecords;
