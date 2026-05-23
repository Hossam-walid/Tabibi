import React from 'react'
import { useAuth } from './context/AuthContext';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Dashboard from './pages/Admin/Dashboard';
import AllAppointments from './pages/Admin/AllAppointments';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import EditDoctor from './pages/Admin/EditDoctor';
import CrmBoard from './pages/Admin/CrmBoard';
import ReferralsBoard from './pages/Admin/ReferralsBoard';
import ReceptionAppointments from './pages/Admin/ReceptionAppointments';
import DoctorAppointments from './pages/Doctor/DoctorAppointments';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorRecords from './pages/Doctor/DoctorRecords';
import DoctorPrescriptions from './pages/Doctor/DoctorPrescriptions';
import DoctorReferrals from './pages/Doctor/DoctorReferrals';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import PageTransition from './components/PageTransition';
import AdminLayout from './layouts/AdminLayout';
import DoctorLayout from './layouts/DoctorLayout';
import ReceptionLayout from './layouts/ReceptionLayout';

const App = () => {
  const { isAuthenticated, isLoading, role } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <LoadingScreen />
  }

  if (!isAuthenticated) {
    return (
      <AnimatePresence mode="wait">
        <ToastContainer />
        <Login key="login" />
      </AnimatePresence>
    )
  }

  const getDefaultRoute = () => {
    if (role === 'RECEPTIONIST') return '/reception-appointments';
    if (role === 'OWNER') return '/admin-dashboard';
    if (role === 'ADMIN') return '/admin-dashboard';
    if (role === 'DOCTOR') return '/doctor-dashboard';
    return '/login';
  };

  return (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path='/' element={<Navigate to={getDefaultRoute()} />} />
          
          {/* Admin Routes with Layout */}
          <Route path='/admin-dashboard' element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
              <AdminLayout>
                <PageTransition><Dashboard /></PageTransition>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path='/all-appointments' element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
              <AdminLayout>
                <PageTransition><AllAppointments /></PageTransition>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path='/add-doctor' element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
              <AdminLayout>
                <PageTransition><AddDoctor /></PageTransition>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path='/doctor-list' element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
              <AdminLayout>
                <PageTransition><DoctorsList /></PageTransition>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path='/edit-doctor/:id' element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
              <AdminLayout>
                <PageTransition><EditDoctor /></PageTransition>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path='/crm-board' element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
              <AdminLayout>
                <PageTransition><CrmBoard /></PageTransition>
              </AdminLayout>
            </ProtectedRoute>
          } />
          <Route path='/referrals-board' element={
            <ProtectedRoute allowedRoles={['ADMIN', 'OWNER']}>
              <AdminLayout>
                <PageTransition><ReferralsBoard /></PageTransition>
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Receptionist Routes with Layout */}
          <Route path='/reception-appointments' element={
            <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
              <ReceptionLayout>
                <PageTransition><ReceptionAppointments /></PageTransition>
              </ReceptionLayout>
            </ProtectedRoute>
          } />

          {/* Doctor Routes with Layout */}
          <Route path='/doctor-dashboard' element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorLayout>
                <PageTransition><DoctorDashboard /></PageTransition>
              </DoctorLayout>
            </ProtectedRoute>
          } />
          <Route path='/doctor-appointments' element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorLayout>
                <PageTransition><DoctorAppointments /></PageTransition>
              </DoctorLayout>
            </ProtectedRoute>
          } />
          <Route path='/doctor-profile' element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorLayout>
                <PageTransition><DoctorProfile /></PageTransition>
              </DoctorLayout>
            </ProtectedRoute>
          } />
          <Route path='/doctor-records' element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorLayout>
                <PageTransition><DoctorRecords /></PageTransition>
              </DoctorLayout>
            </ProtectedRoute>
          } />
          <Route path='/doctor-prescriptions' element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorLayout>
                <PageTransition><DoctorPrescriptions /></PageTransition>
              </DoctorLayout>
            </ProtectedRoute>
          } />
          <Route path='/doctor-referrals' element={
            <ProtectedRoute allowedRoles={['DOCTOR']}>
              <DoctorLayout>
                <PageTransition><DoctorReferrals /></PageTransition>
              </DoctorLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AnimatePresence>
    </div>
  )
}

export default App
