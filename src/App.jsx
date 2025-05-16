import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Home from './components/Home/Home'
import Dashboard from './components/Dashboard/Dashboard'
import Appointment from './components/Appointment/Appointment'
import About from './components/About/About'
import Department from './components/Department/Department'
import Doctor from './components/Doctor/Doctor'
import { ToastContainer } from 'react-toastify'

function App() {
  
  const myRoutes = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
         { index: true, element: <Home /> }, 
        {
          path: "home",
          element: <Home />,
        },
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "appointments",
          element: <Appointment />,
        },
         {
          path: "about",
          element: <About />,
        },
                 {
          path: "department",
          element: <Department />,
        },
                        {
          path: "doctor",
          element: <Doctor />,
        },
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
