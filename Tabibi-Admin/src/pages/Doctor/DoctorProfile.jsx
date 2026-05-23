import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'
import { api } from '../../lib/api'

const DoctorProfile = () => {

    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

    const { profileData, setProfileData, getProfileData, availability, getAvailability, updateAvailability } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const { token } = useAuth()
    const [isEdit, setIsEdit] = useState(false)
    const [activeDay, setActiveDay] = useState(1) // Monday default

    const updateProfile = async () => {

        try {

            const updateData = {
                fees: profileData.fees,
                bio: profileData.bio,
                isAvailable: profileData.isAvailable
            }

            const { data } = await api.post('/api/doctor/profile', updateData, { 
                headers: { Authorization: `Bearer ${token}` } 
            })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        getProfileData()
    }, [])

    useEffect(() => {
        if (profileData?.id) {
            getAvailability(profileData.id)
        }
    }, [profileData?.id])

    const handleAvailabilityToggle = async (dayIdx) => {
        const existing = availability.find(a => a.dayOfWeek === dayIdx);
        const payload = {
            dayOfWeek: dayIdx,
            startTime: existing?.startTime || "09:00",
            endTime: existing?.endTime || "17:00",
            isActive: !existing?.isActive
        };
        await updateAvailability(profileData.id, payload);
    }

    const handleTimeChange = async (dayIdx, type, value) => {
        const existing = availability.find(a => a.dayOfWeek === dayIdx);
        const payload = {
            dayOfWeek: dayIdx,
            startTime: type === 'start' ? value : (existing?.startTime || "09:00"),
            endTime: type === 'end' ? value : (existing?.endTime || "17:00"),
            isActive: existing ? existing.isActive : true
        };
        await updateAvailability(profileData.id, payload);
    }

return profileData && (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex flex-col gap-6">

                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 flex flex-col sm:flex-row gap-8 items-start">
                    <div className="w-full sm:max-w-xs relative">
                        <img className="bg-gray-50 w-full rounded-xl object-cover aspect-square" src={profileData.image} alt="" />
                        {isEdit && <div className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer text-xs text-gray-500">Change via Admin</div>}
                    </div>

                    <div className="flex-1 w-full">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-medium text-gray-900">{profileData.firstName} {profileData.lastName}</h1>
                                <div className="flex items-center gap-2 text-gray-500 mt-1">
                                    <span className="text-sm">{profileData.qualification} - {profileData.specialization}</span>
                                    <span className="px-2.5 py-0.5 border border-gray-200 text-xs rounded-full bg-gray-50">{profileData.experience} Years</span>
                                </div>
                            </div>
                            <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${profileData.isAvailable ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {profileData.isAvailable ? 'Available' : 'Unavailable'}
                            </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Consultation Fee</p>
                                <div className="flex items-center gap-1 text-gray-900 text-lg font-medium">
                                    <span>{currency}</span>
                                    {isEdit ? (
                                        <input 
                                            type="number" 
                                            onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                            value={profileData.fees} 
                                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-1.5 w-28 focus:outline-none focus:ring-2 focus:ring-primary/20" 
                                        />
                                    ) : profileData.fees}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Status</p>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="status-toggle"
                                        onChange={() => isEdit && setProfileData(prev => ({ ...prev, isAvailable: !prev.isAvailable }))}
                                        checked={profileData.isAvailable}
                                        disabled={!isEdit}
                                        className={`w-4 h-4 border-gray-300 rounded cursor-pointer ${!isEdit && 'opacity-50 cursor-not-allowed'}`}
                                    />
                                    <label 
                                        htmlFor="status-toggle" 
                                        className={`text-sm ${isEdit ? 'cursor-pointer text-gray-700 font-medium' : 'text-gray-500'}`}
                                    >
                                        Accepting Appointments
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">About</h3>
                    <div className="text-gray-600 leading-relaxed text-sm">
                        {isEdit ? (
                            <textarea 
                                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))} 
                                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none resize-y min-h-[120px]" 
                                rows={5} 
                                value={profileData.bio} 
                                placeholder="Write something about yourself..." 
                            />
                        ) : (
                            <p className="whitespace-pre-wrap">{profileData.bio}</p>
                        )}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Availability Schedule</h3>
                    <div className="grid grid-cols-7 gap-2 mb-6">
                        {daysOfWeek.map((day, idx) => {
                            const isDayActive = availability.find(a => a.dayOfWeek === idx)?.isActive;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setActiveDay(idx)}
                                    className={`py-2.5 px-1 rounded-lg text-xs font-medium transition-all ${
                                        activeDay === idx 
                                            ? 'bg-gray-900 text-white' 
                                            : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                    }`}
                                >
                                    {day.substring(0, 3)}
                                </button>
                            );
                        })}
                    </div>

                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">{daysOfWeek[activeDay]}</h4>
                            <button 
                                onClick={() => handleAvailabilityToggle(activeDay)}
                                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                    availability.find(a => a.dayOfWeek === activeDay)?.isActive 
                                        ? 'bg-green-50 text-green-700' 
                                        : 'bg-gray-200 text-gray-600'
                                }`}
                            >
                                {availability.find(a => a.dayOfWeek === activeDay)?.isActive ? 'Active' : 'Inactive'}
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 block mb-1.5">Start Time</label>
                                <input 
                                    type="time" 
                                    value={availability.find(a => a.dayOfWeek === activeDay)?.startTime || "09:00"}
                                    onChange={(e) => handleTimeChange(activeDay, 'start', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 block mb-1.5">End Time</label>
                                <input 
                                    type="time" 
                                    value={availability.find(a => a.dayOfWeek === activeDay)?.endTime || "17:00"}
                                    onChange={(e) => handleTimeChange(activeDay, 'end', e.target.value)}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-6 z-10 flex justify-end">
                    {isEdit ? (
                        <button 
                            onClick={updateProfile} 
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Save Changes
                        </button>
                    ) : (
                        <button 
                            onClick={() => setIsEdit(prev => !prev)} 
                            className="px-6 py-2.5 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile