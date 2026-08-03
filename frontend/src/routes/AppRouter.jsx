import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MainLayout from '../layouts/MainLayout'
import Login from '../features/login/page/Login'
import Dashboard from '../features/dashboard/page/Dashboard'
import Customer from '../features/customers/page/Customer'
import Employees from '../features/employee/page/Employees'
import Vehicles from '../features/vehicle/page/Vehicle'
import VehicleBrand from '../features/vehiclebrand/page/VehicleBrand'
import Product from '../features/product/page/Product'
import Security from '../features/security/page/Security'
import Order from '../features/order/page/Order'

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
            },
            {
                path: '/product' , element: <Product/>
            },
            {
                path: '/security' , element: <Security/>
            },
            {
                path: '/order' , element: <Order/>
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