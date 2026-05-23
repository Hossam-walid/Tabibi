import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import usePatientSession from '../hooks/usePatientSession'

const publicRoutes = ['/', '/doctors', '/login', '/about', '/contact', '/collaborations', '/verify']

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate()
    const location = useLocation()
    const { isPatient, isPending } = usePatientSession()

    useEffect(() => {
        if (isPending) return

        const isPublicRoute = publicRoutes.some(route => {
            if (route.includes(':')) {
                const routePattern = route.split('/').slice(0, -1).join('/')
                return location.pathname.startsWith(routePattern)
            }
            return location.pathname === route
        })

        if (!isPatient && !isPublicRoute) {
            navigate('/login', { replace: true })
        }
    }, [isPatient, isPending, navigate, location])

    if (isPending) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return children
}

export default ProtectedRoute
