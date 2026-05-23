import { createContext, useState, useEffect } from "react";
import { toast } from 'react-toastify'
import { doctorApi, recordsApi, prescriptionsApi, referralsApi, pharmacyApi, labApi, api, patientsApi } from "../lib/api";

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [appointments, setAppointments] = useState([])
    const [dashData, setDashData] = useState(false)
    const [profileData, setProfileData] = useState(false)
    const [records, setRecords] = useState([])
    const [prescriptions, setPrescriptions] = useState([])
    const [referrals, setReferrals] = useState([])
    const [pharmacies, setPharmacies] = useState([])
    const [labs, setLabs] = useState([])
    const [availability, setAvailability] = useState([])
    const [patients, setPatients] = useState([])

    const extract = (res) => {
        // If the result is already extracted data from api.ts helpers
        if (res?.success && res?.data !== undefined) {
            return res.data;
        }
        
        const data = res?.data || res;
        if (data && data.success !== undefined) {
            return data.data !== undefined ? data.data : data;
        }
        return data;
    }

    const getAppointments = async () => {
        try {
            if (!localStorage.getItem('role')) return;
            const res = await doctorApi.getAppointments()
            const data = extract(res)
            const appointmentsList = data.appointments || (Array.isArray(data) ? data : [])
            setAppointments([...appointmentsList].reverse())
        } catch (error) {
            console.log(error)
            // toast.error(error.message)
        }
    }

    const getProfileData = async () => {
        try {
            if (!localStorage.getItem('role')) return;

            const res = await doctorApi.getProfile()
            const data = extract(res)
            const profile = data.doctor || data
            setProfileData(profile)
            
            // Proactively fetch patients once profile is loaded
            if (profile?.id) {
                const pRes = await patientsApi.getAll({ doctorId: profile.id });
                const pData = extract(pRes);
                setPatients(Array.isArray(pData) ? pData : (pData?.data || pData?.patients || []));
            }
        } catch (error) {
            console.log(error)
            // toast.error(error.message)
        }
    }

    const updateProfile = async (profileData) => {
        try {
            const res = await doctorApi.updateProfile(profileData)
            const data = res.data;
            if (data.success) {
                toast.success('Profile updated')
                getProfileData()
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const res = await doctorApi.cancelAppointment(appointmentId)
            const data = res.data;
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const res = await doctorApi.completeAppointment(appointmentId)
            const data = res.data;
            if (data.success) {
                toast.success(data.message)
                getAppointments()
                getDashData()
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const getDashData = async () => {
        try {
            if (!localStorage.getItem('role')) return;
            const res = await doctorApi.getDashboard()
            const data = extract(res)
            if (data.dashboard) {
                setDashData(data.dashboard)
            } else {
                setDashData(data)
            }
            
            // Proactively load patients if profile is missing but we're on dashboard
            // Only if authenticated to avoid noise on login screen
            if (!profileData?.id) {
                await getProfileData()
            }
        } catch (error) {
            console.log(error)
            // toast.error(error.message) // removed to avoid noise
        }
    }

    const getPatientRecords = async (patientId) => {
        try {
            // Ensure patients are loaded for selection
            if (patients.length === 0) {
                await getPatients()
            }
            const res = await recordsApi.getAll({ patientId, doctorId: profileData?.id })
            const data = extract(res)
            setRecords(data.records || data.patientRecords || (Array.isArray(data) ? data : []))
        } catch (error) {
            toast.error(error.message)
        }
    }

    const createPatientRecord = async (payload, doctorId) => {
        try {
            // Ensure patients are loaded
            if (patients.length === 0) {
                await getPatients()
            }
            const recordPayload = {
                ...payload,
                doctorId,
                visitDate: new Date().toISOString(),
            }
            const res = await recordsApi.create(recordPayload)
            if (res.data.success) {
                toast.success('Patient record created')
                // Reload records after creation
                await getPatientRecords(payload.patientId)
                return true
            }
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getMyPrescriptions = async () => {
        try {
            if (patients.length === 0) {
                await getPatients()
            }
            const res = await prescriptionsApi.getAll()
            const data = extract(res)
            setPrescriptions(data.prescriptions || data.myPrescriptions || (Array.isArray(data) ? data : []))
        } catch (error) {
            toast.error(error.message)
        }
    }

    const createPrescription = async (payload) => {
        try {
            if (patients.length === 0) {
                await getPatients()
            }
            const res = await prescriptionsApi.create({
                ...payload,
                doctorId: profileData?.id,
            })
            if (res.data.success) {
                toast.success('Prescription created')
                await getMyPrescriptions()
                return true
            }
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getMyReferrals = async () => {
        try {
            if (!profileData?.id || !localStorage.getItem('role')) {
                return;
            }
            const res = await referralsApi.getAll({ doctorId: profileData.id })
            const data = extract(res)
            setReferrals(data.referrals || data.data || (Array.isArray(data) ? data : []))
        } catch (error) {
            console.log(error)
            // toast.error(error.message)
        }
    }

    const createReferral = async (payload) => {
        try {
            if (patients.length === 0) {
                await getPatients()
            }
            const res = await referralsApi.create(payload)
            if (res.data.success) {
                toast.success('Referral created')
                await getMyReferrals()
                return true
            }
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getPharmacies = async () => {
        try {
            const res = await pharmacyApi.getAll({ isActive: true })
            const data = extract(res)
            setPharmacies(data.data || (Array.isArray(data) ? data : []))
        } catch (error) {
            console.error(error)
        }
    }

    const getLabs = async () => {
        try {
            const res = await labApi.getAll({ isActive: true })
            const data = extract(res)
            setLabs(data.data || (Array.isArray(data) ? data : []))
        } catch (error) {
            console.error(error)
        }
    }

    const getPatients = async () => {
        try {
            if (!profileData?.id || !localStorage.getItem('role')) {
                return;
            }
            
            // Fetch patients assigned to this doctor via appointments
            const res = await patientsApi.getAll({
                doctorId: profileData.id
            })
            const data = extract(res)
            // handle cases where data might be nested or direct array
            const patientList = Array.isArray(data) ? data : (data?.data || data?.patients || [])
            setPatients(patientList)
        } catch (error) {
            console.error(error)
        }
    }

    const getAvailability = async (doctorId) => {
        try {
            const res = await doctorApi.getAvailability(doctorId)
            const data = extract(res)
            setAvailability(data.data || (Array.isArray(data) ? data : []))
        } catch (error) {
            console.error(error)
        }
    }

    const updateAvailability = async (doctorId, availabilityData) => {
        try {
            const res = await doctorApi.setAvailability(doctorId, availabilityData)
            if (res.data.success) {
                toast.success('Availability updated')
                getAvailability(doctorId)
                return true
            }
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    useEffect(() => {
        if (localStorage.getItem('role')) {
            getProfileData()
        }
    }, [])

    const value = {
        backendUrl,
        appointments,
        getAppointments,
        cancelAppointment,
        completeAppointment,
        dashData, setDashData,
        getDashData,
        profileData, setProfileData,
        getProfileData,
        updateProfile,
        records, setRecords,
        getPatientRecords,
        createPatientRecord,
        prescriptions, setPrescriptions,
        getMyPrescriptions,
        createPrescription,
        referrals, setReferrals,
        getMyReferrals,
        createReferral,
        pharmacies,
        labs,
        getPharmacies,
        getLabs,
        availability,
        patients,
        getPatients,
        getAvailability,
        updateAvailability,
    }

    return (
        <DoctorContext.Provider value={value}>
            {props.children}
        </DoctorContext.Provider>
    )
}

export default DoctorContextProvider
