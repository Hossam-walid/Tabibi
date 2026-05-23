import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";

const DoctorPrescriptions = () => {
  const { prescriptions, getMyPrescriptions, createPrescription, profileData, patients, getPatients } = useContext(DoctorContext);
  const [patientId, setPatientId] = useState("");
  const [notes, setNotes] = useState("");
  const [medicine, setMedicine] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [duration, setDuration] = useState("");

  useEffect(() => {
    getMyPrescriptions();
    if (patients.length === 0) {
      getPatients();
    }
  }, []);

  const onCreate = async (e) => {
    e.preventDefault();
    if (!patientId || !medicine.trim()) return;
    if (!profileData?.id) {
      alert("Doctor profile not loaded. Please refresh.");
      return;
    }

    const medicines = JSON.stringify([{
      medicine: medicine.trim(),
      dosage: dosage.trim(),
      frequency: frequency.trim(),
      duration: duration.trim(),
    }]);

    const ok = await createPrescription({
      patientId: patientId,
      notes: notes.trim(),
      medicines,
      status: "FINALIZED",
    });
    if (ok) {
      setNotes("");
      setMedicine("");
      setDosage("");
      setFrequency("");
      setDuration("");
      getMyPrescriptions();
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-light text-gray-900">Prescriptions</h2>
        <p className="text-sm text-gray-500 mt-1">Create and manage prescriptions</p>
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
            required 
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
            Create Prescription
          </button>
        </div>
      </form>

      <div className="space-y-3">
        {prescriptions.length === 0 ? (
          <p className="text-sm text-gray-400 py-8 text-center">No prescriptions created yet.</p>
        ) : (
          prescriptions.map((p) => (
            <div key={p.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
              <p className="text-xs text-gray-400">{new Date(p.createdAt).toLocaleString()}</p>
              <p className="font-medium text-gray-900 mt-1">Patient: {p.patientId}</p>
              <p className="text-sm text-gray-600">{p.notes || "No notes"}</p>
              <ul className="mt-2 text-sm text-gray-700 space-y-1">
                {JSON.parse(p.medicines || '[]').map((item, idx) => (
                  <li key={idx} className="bg-gray-50 px-3 py-2 rounded-lg">
                    <span className="font-medium">{item.medicine}</span>
                    <span className="text-gray-500"> - {item.dosage} - {item.frequency} - {item.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorPrescriptions;
