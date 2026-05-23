import { useEffect, useState } from 'react'
import api from '../api/client'

const PATIENT_ROLE = 'MEMBER'

export const usePatientSession = () => {
  const [session, setSession] = useState(() => {
    const token = localStorage.getItem('tabibi_client_token')
    const storedUser = localStorage.getItem('tabibi_client_user')
    const orgId = localStorage.getItem('tabibi_client_organization_id')
    if (token && storedUser) {
      try {
        return {
          user: JSON.parse(storedUser),
          session: { token, activeOrganizationId: orgId },
          activeOrganizationId: orgId
        }
      } catch (e) {
        return null
      }
    }
    return null
  })

  const [role, setRole] = useState(() => {
    return localStorage.getItem('tabibi_client_role') || null
  })

  const [isRoleLoading, setIsRoleLoading] = useState(() => {
    const token = localStorage.getItem('tabibi_client_token')
    const storedUser = localStorage.getItem('tabibi_client_user')
    return !!(token && storedUser)
  })

  const [version, setVersion] = useState(0)

  useEffect(() => {
    const loadRole = async () => {
      const token = localStorage.getItem('tabibi_client_token')
      const storedUser = localStorage.getItem('tabibi_client_user')

      if (!token || !storedUser) {
        setSession(null)
        setRole(null)
        setIsRoleLoading(false)
        return
      }

      setIsRoleLoading(true)
      try {
        const parsedUser = JSON.parse(storedUser)
        const response = await api.get('/api/members/me')
        const memberData = response.data?.data || response.data
        const fetchedRole = memberData?.role ? memberData.role.toUpperCase() : null

        setRole(fetchedRole)
        setSession({
          user: parsedUser,
          session: { token, activeOrganizationId: memberData?.organizationId },
          activeOrganizationId: memberData?.organizationId
        })
        if (memberData?.organizationId) {
          localStorage.setItem('tabibi_client_organization_id', memberData.organizationId)
        }
        if (fetchedRole) {
          localStorage.setItem('tabibi_client_role', fetchedRole)
        }
        if (fetchedRole && fetchedRole !== PATIENT_ROLE) {
          localStorage.removeItem('tabibi_client_token')
          localStorage.removeItem('tabibi_client_user')
          localStorage.removeItem('tabibi_client_role')
          localStorage.removeItem('tabibi_client_organization_id')
          setSession(null)
          setRole(null)
        }
      } catch (error) {
        console.error('Failed to load member role:', error)
        // We do not clear the session here because a temporary network error
        // should not log the user out. The 401 interceptor in client.js
        // handles clearing the local storage and redirecting on auth failures.
      } finally {
        setIsRoleLoading(false)
      }
    }

    loadRole()
  }, [version])

  useEffect(() => {
    const handleStorage = () => {
      const token = localStorage.getItem('tabibi_client_token')
      const storedUser = localStorage.getItem('tabibi_client_user')
      const orgId = localStorage.getItem('tabibi_client_organization_id')
      const storedRole = localStorage.getItem('tabibi_client_role')
      
      if (token && storedUser) {
        try {
          setSession({
            user: JSON.parse(storedUser),
            session: { token, activeOrganizationId: orgId },
            activeOrganizationId: orgId
          })
          setRole(storedRole || null)
        } catch (e) {
          setSession(null)
          setRole(null)
        }
      } else {
        setSession(null)
        setRole(null)
      }
      setVersion((current) => current + 1)
    }

    window.addEventListener('storage', handleStorage)
    window.addEventListener('tabibi-client-auth', handleStorage)
    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('tabibi-client-auth', handleStorage)
    }
  }, [])

  const normalizedRole = role?.toUpperCase()
  const isPatient = !!session?.user && normalizedRole === PATIENT_ROLE

  return {
    session,
    user: isPatient ? session?.user : null,
    role: normalizedRole,
    isPatient,
    refresh: () => setVersion((current) => current + 1),
    isPending: isRoleLoading
  }
}

export default usePatientSession
