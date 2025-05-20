import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import { ToastContainer } from 'react-toastify'
import React, { Suspense, lazy } from 'react'

const Home = lazy(() => import('./components/Home/Home'))
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'))
const Appointment = lazy(() => import('./components/Appointment/Appointment'))
const AppointmentEdit = lazy(() => import('./components/Appointment/AppointmentEdit'))
const About = lazy(() => import('./components/About/About'))
const Department = lazy(() => import('./components/Department/Department'))
const Doctor = lazy(() => import('./components/Doctor/Doctor'))

function App() {
  const myRoutes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense> },
        { path: "home", element: <Suspense fallback={<div>Loading...</div>}><Home /></Suspense> },
        { path: "dashboard", element: <Suspense fallback={<div>Loading...</div>}><Dashboard /></Suspense> },
        { path: "appointments", element: <Suspense fallback={<div>Loading...</div>}><Appointment /></Suspense> },
        { path: "appointments/:id", element: <Suspense fallback={<div>Loading...</div>}><AppointmentEdit /></Suspense> },
        { path: "about", element: <Suspense fallback={<div>Loading...</div>}><About /></Suspense> },
        { path: "department", element: <Suspense fallback={<div>Loading...</div>}><Department /></Suspense> },
        { path: "doctor", element: <Suspense fallback={<div>Loading...</div>}><Doctor /></Suspense> },
      ],
    },
  ])

  return (
    <>
      <RouterProvider router={myRoutes} />
      <ToastContainer />
    </>
  )
}

export default App
