import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Customer from '../pages/Customer'
import Employees from '../pages/Employees'
import Vehicles from '../pages/Vehicles'
import VehicleBrand from '../pages/VehicleBrand'

const ProtectedRoute = ({ children }) => {

    const { token } = useAuth()
    return token ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
    const { token } = useAuth()
    return token ? <Navigate to="/" replace /> : children
}

const router = createBrowserRouter([
    {
        path: '/login',
        element: (
            <PublicRoute>
                <Login/>
            </PublicRoute>
        )
    },
    {
        path: '/',
        element: (
            <ProtectedRoute>
                <MainLayout />
            </ProtectedRoute>
        ),
        children: [
            {
                index: true, element: <Dashboard />
            },
            {
                path: '/customer' , element: <Customer/>
            },
            {
                path: '/employee' , element: <Employees/>
            },
            {
                path: '/vehicles' , element: <Vehicles/>
            },
            {
                path: '/vehiclebrand' , element: <VehicleBrand/>
            }
        ]
    },
    {
        path: '*', element: <Navigate to="/" replace />
    }
])

export default function AppRouter() {
    return <RouterProvider router={router} />
}