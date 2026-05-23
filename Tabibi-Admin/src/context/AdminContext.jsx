import { createContext, useState, useContext } from "react";
import { toast } from "react-toastify";
import { api, adminApi, crmApi, referralsApi, appointmentsApi } from "../lib/api";
import { useAuth } from "./AuthContext";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)
    const [crmTasks, setCrmTasks] = useState([])
    const [crmSummary, setCrmSummary] = useState(null)
    const [referrals, setReferrals] = useState([])
    const [receptionAppointments, setReceptionAppointments] = useState([])

    const extract = (res) => {
        const data = res.data;
        if (data && data.success !== undefined) {
            return data.data !== undefined ? data.data : data;
        }
        return data;
    }

    const getAllDoctors = async () => {
        try {
            const res = await adminApi.getAllDoctors()
            const data = extract(res)
            if (data.doctors) {
                setDoctors(data.doctors)
            } else if (Array.isArray(data)) {
                setDoctors(data)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const res = await api.post('/api/admin/change-availability', { docId })
            const data = res.data;
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const getAllAppointments = async () => {
        try {
            const res = await adminApi.getAllAppointments()
            const data = extract(res)
            const appointmentsList = data.appointments || (Array.isArray(data) ? data : [])
            setAppointments([...appointmentsList].reverse())
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const cancelAppointment = async (appointmentId) => {
        try {
            const res = await appointmentsApi.cancel(appointmentId)
            const data = res.data
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const completeAppointment = async (appointmentId) => {
        try {
            const res = await appointmentsApi.complete(appointmentId)
            const data = res.data
            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const getDashData = async () => {
        try {
            const res = await adminApi.getDashboard()
            const data = extract(res)
            if (data.dashboard) {
                setDashData(data.dashboard)
            } else {
                setDashData(data)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const deleteDoctor = async (docId) => {
        try {
            const res = await api.post('/api/admin/delete-doctor', { docId })
            const data = res.data
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    const getCrmTasks = async (filters = {}) => {
        try {
            const backendFilters = { ...filters };
            if (backendFilters.status) {
                backendFilters.status = backendFilters.status.toUpperCase().replace(' ', '_');
            }

            const res = await crmApi.getAll(backendFilters)
            const data = extract(res)
            // crm data is { data: tasks, pagination }
            setCrmTasks(data.data || data || [])
        } catch (error) {
            toast.error(error.message)
        }
    }

    const createCrmTask = async (payload) => {
        try {
            const { data } = await crmApi.create(payload)
            if (data.success) {
                toast.success('CRM task created')
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const updateCrmTask = async (taskId, payload) => {
        try {
            const { data } = await crmApi.update(taskId, payload)
            if (data.success) {
                toast.success('CRM task updated')
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getCrmSummary = async () => {
        try {
            const { data } = await api.get('/api/crm/summary')
            const result = data;
            if (result.success) {
                setCrmSummary(result.data)
            } else {
                toast.error(result.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getReferrals = async (filters = {}) => {
        try {
            const res = await referralsApi.getAll(filters)
            const data = extract(res)
            // Backend returns { data: [...], pagination: {...} }
            setReferrals(data.data || data.referrals || (Array.isArray(data) ? data : []))
        } catch (error) {
            toast.error(error.message)
        }
    }

    const createReferral = async (payload) => {
        try {
            const res = await referralsApi.create(payload)
            if (res.data.success) {
                toast.success('Referral created')
                return true
            }
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const updateReferralStatus = async (referralId, status) => {
        try {
            const res = await api.put(`/api/referrals/${referralId}`, { status })
            if (res.data.success) {
                toast.success('Referral updated')
                return true
            }
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const getReceptionAppointments = async () => {
        try {
            const res = await api.get('/api/reception/appointments')
            const data = extract(res)
            const appointmentsList = data.appointments || (Array.isArray(data) ? data : [])
            setReceptionAppointments([...appointmentsList].reverse())
        } catch (error) {
            toast.error(error.message)
        }
    }

    const confirmReceptionAppointment = async (appointmentId) => {
        try {
            const { data } = await api.post('/api/reception/appointments/confirm', { appointmentId })
            if (data.success) {
                toast.success(data.message)
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const cancelReceptionAppointment = async (appointmentId) => {
        try {
            const { data } = await api.post('/api/reception/appointments/cancel', { appointmentId })
            if (data.success) {
                toast.success(data.message)
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const verifyPayment = async (appointmentId, status, notes = '') => {
        try {
            const { data } = await appointmentsApi.verifyPayment(appointmentId, { status, notes })
            if (data.success) {
                toast.success(`Payment marked as ${status.toLowerCase()}`)
                getAllAppointments()
                return true
            }
            toast.error(data.message)
            return false
        } catch (error) {
            toast.error(error.message)
            return false
        }
    }

    const value = {
        backendUrl,
        doctors,
        getAllDoctors,
        changeAvailability,
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        completeAppointment,
        verifyPayment,
        dashData,
        deleteDoctor,
        crmTasks, setCrmTasks,
        getCrmTasks,
        createCrmTask,
        updateCrmTask,
        crmSummary, setCrmSummary,
        getCrmSummary,
        referrals, setReferrals,
        getReferrals,
        createReferral,
        updateReferralStatus,
        receptionAppointments, setReceptionAppointments,
        getReceptionAppointments,
        confirmReceptionAppointment,
        cancelReceptionAppointment
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider
