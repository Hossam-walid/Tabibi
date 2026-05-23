import React, { useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import { api } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'

const AddDoctor = () => {
    const [docImg, setDocImg] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('1 Year')
    const [fees, setFees] = useState('')
    const [bio, setBio] = useState('')
    const [specialization, setSpecialization] = useState('Cardiology')
    const [qualification, setQualification] = useState('')

    const { token } = useAuth()

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {
            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            const formData = new FormData();

            formData.append('image', docImg)
            formData.append('firstName', firstName)
            formData.append('lastName', lastName)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', parseInt(experience))
            formData.append('fees', Number(fees))
            formData.append('bio', bio)
            formData.append('specialization', specialization)
            formData.append('qualification', qualification)

            const { data } = await api.post('/api/admin/add-doctor', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            if (data.success) {
                toast.success(data.message)
                setDocImg(false)
                setFirstName('')
                setLastName('')
                setPassword('')
                setEmail('')
                setQualification('')
                setBio('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <h2 className="text-2xl font-light text-gray-900">Add Doctor</h2>
                <p className="text-sm text-gray-500 mt-1">Create a new doctor profile</p>
            </div>

            <form onSubmit={onSubmitHandler} className="bg-white border border-gray-100 rounded-xl p-6 lg:p-8">
                <div className="mb-8">
                    <label htmlFor="doc-img" className="cursor-pointer">
                        <div className="flex items-center gap-4">
                            <img 
                                className="w-16 h-16 object-cover bg-gray-50 rounded-full border-2 border-dashed border-gray-300 hover:border-primary transition-colors" 
                                src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} 
                                alt="" 
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-700">Upload photo</p>
                                <p className="text-xs text-gray-500">Click to select</p>
                            </div>
                        </div>
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">First Name</label>
                            <input 
                                onChange={e => setFirstName(e.target.value)} 
                                value={firstName} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                type="text" 
                                placeholder="John" 
                                required 
                            />
                        </div>
                        
                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Last Name</label>
                            <input 
                                onChange={e => setLastName(e.target.value)} 
                                value={lastName} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                type="text" 
                                placeholder="Smith" 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Email</label>
                            <input 
                                onChange={e => setEmail(e.target.value)} 
                                value={email} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                type="email" 
                                placeholder="doctor@clinic.com" 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Password</label>
                            <input 
                                onChange={e => setPassword(e.target.value)} 
                                value={password} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                type="password" 
                                placeholder="Set password" 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Experience</label>
                            <select 
                                onChange={e => setExperience(e.target.value)} 
                                value={experience} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white" 
                            >
                                <option value="1">1 Year</option>
                                <option value="2">2 Years</option>
                                <option value="3">3 Years</option>
                                <option value="4">4 Years</option>
                                <option value="5">5 Years</option>
                                <option value="6">6 Years</option>
                                <option value="8">8 Years</option>
                                <option value="9">9 Years</option>
                                <option value="10">10 Years</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Consultation Fees</label>
                            <input 
                                onChange={e => setFees(e.target.value)} 
                                value={fees} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                type="number" 
                                placeholder="500" 
                                required 
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Specialization</label>
                            <select 
                                onChange={e => setSpecialization(e.target.value)} 
                                value={specialization} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all bg-white"
                            >
                                <option value="Cardiology">Cardiology</option>
                                <option value="Neurology">Neurology</option>
                                <option value="General Surgery">General Surgery</option>
                                <option value="Urology">Urology</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Dentistry">Dentistry</option>
                                <option value="Ear, Nose and Throat">Ear, Nose and Throat</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="Ophthalmology">Ophthalmology</option>
                                <option value="Gastroenterology">Gastroenterology</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Qualification</label>
                            <input 
                                onChange={e => setQualification(e.target.value)} 
                                value={qualification} 
                                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                                type="text" 
                                placeholder="MBBS, MD" 
                                required 
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-gray-700 uppercase tracking-wider mb-1.5">Bio</label>
                            <textarea 
                                onChange={e => setBio(e.target.value)} 
                                value={bio} 
                                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none" 
                                rows={4} 
                                placeholder="Brief professional summary..."
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button 
                        type="submit" 
                        className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors duration-150 active:scale-[0.99]"
                    >
                        Add Doctor
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddDoctor
