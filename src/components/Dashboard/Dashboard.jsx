import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const api = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get('/appointments', {
        params: {
          populate: '*'
        }
      });

      if (response.data && Array.isArray(response.data.data)) {
        const formattedAppointments = response.data.data.map(item => ({
          id: item.id,
          name: item.name,
          email: item.email,
          phone: item.phone,
          day: item.day,
          department: item.department,
          doctor: item.doctor,
          documentId: item.documentId
        }));
        setAppointments(formattedAppointments);
      } else {
        throw new Error('Invalid data format received from server');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.response?.data?.error?.message || 
              err.message || 
              'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (appointment) => {
    setCurrentAppointment(appointment);
    setActionType('edit');
    setShowModal(true);
    setEmail('');
    setPhone('');
    setVerificationError('');
  };

  const handleDeleteClick = (appointment) => {
    setCurrentAppointment(appointment);
    setActionType('delete');
    setShowModal(true);
    setEmail('');
    setPhone('');
    setVerificationError('');
  };

  const verifyAndProceed = async () => {
    if (!currentAppointment) return;
    
    try {
      // Check against the currentAppointment data we already have
      if (email !== currentAppointment.email || phone !== currentAppointment.phone) {
        setVerificationError('Email or phone number does not match the appointment details');
        toast.error("Verification failed. Please check your details.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }

      setVerificationError('');
      setShowModal(false);

      if (actionType === 'edit') {
        navigate(`/appointments/edit/${currentAppointment.id}`);
        toast.success("Verification successful! You can now edit the appointment.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (actionType === 'delete') {
        await deleteAppointment();
        toast.success("Appointment deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error("Failed to verify appointment details", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const deleteAppointment = async () => {
    try {
      await api.delete(`/appointments/${currentAppointment.id}`);
      fetchAppointments();
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.response?.data?.error?.message || 
              err.message || 
              'Failed to delete appointment');
      throw err;
    }
  };

  if (loading) return <div className="text-center py-8">Loading appointments...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <div className="flex h-screen bg-gray-100">
      <ToastContainer />
      <DashboardSidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Patients Appointments</h1>
            
            {appointments.length === 0 ? (
              <p>No appointments booked yet.</p>
            ) : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map(appointment => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.id}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.doctor}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.day}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {appointment.department}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button 
                            onClick={() => handleEditClick(appointment)}
                            className="text-blue-500 hover:text-blue-700 mr-4"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(appointment)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">
              {actionType === 'edit' ? 'Edit Appointment' : 'Delete Appointment'}
            </h3>
            <p className="mb-4">Please verify your email and phone number to proceed:</p>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            
            {verificationError && (
              <div className="text-red-500 text-sm mb-4">{verificationError}</div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowModal(false);
                  setVerificationError('');
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={verifyAndProceed}
                className={`${actionType === 'edit' ? 'bg-blue-500 hover:bg-blue-700' : 'bg-red-500 hover:bg-red-700'} text-white font-bold py-2 px-4 rounded`}
              >
                {actionType === 'edit' ? 'Edit' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}