import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import DashboardSidebar from './Sidebar';
import DashboardHeader from './Header';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

export default function Dashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [actionType, setActionType] = useState('');
  const [email, setEmail] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); 
  const [totalItems, setTotalItems] = useState(0);

  const API_URL = 'https://json-server-api-production-9295.up.railway.app';

  const fetchAppointments = useCallback(async () => {
    try {
      setLoading(true);
      const [appointmentsRes, usersRes, doctorsRes, departmentsRes] = await Promise.all([
        axios.get(`${API_URL}/appointments`),
        axios.get(`${API_URL}/users`),
        axios.get(`${API_URL}/doctors`),
        axios.get(`${API_URL}/departments`)
      ]);

      const users = usersRes.data;
      const doctors = doctorsRes.data;
      const departments = departmentsRes.data;

      const formattedAppointments = appointmentsRes.data.map(app => {
        const user = users.find(u => u.id === app.user_id);
        const doctor = doctors.find(d => d.id === app.doctor_id);
        const department = departments.find(dep => dep.id === app.department_id);

        return {
          id: app.id,
          user_id: app.user_id,
          name: user?.name || 'Unknown',
          email: user?.email || '',
          day: app.day,
          department: department?.name || '',
          doctor: doctor?.name || '',
        };
      });

      setTotalItems(formattedAppointments.length);
      setAppointments(formattedAppointments);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to fetch appointments');
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAppointments = appointments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditClick = (appointment) => {
    setCurrentAppointment(appointment);
    setActionType('edit');
    setShowModal(true);
    setEmail('');
    setVerificationError('');
  };

  const handleDeleteClick = (appointment) => {
    setCurrentAppointment(appointment);
    setActionType('delete');
    setShowModal(true);
    setEmail('');
    setVerificationError('');
  };

  const verifyAndProceed = async () => {
    if (!currentAppointment) return;

    try {
      if (email !== currentAppointment.email) {
        setVerificationError('Email does not match the appointment details');
        toast.error("Verification failed. Please check your details.");
        return;
      }

      setVerificationError('');
      setShowModal(false);

      if (actionType === 'edit') {
        navigate(`/appointments/${currentAppointment.id}`);
        toast.success("Verification successful! You can now edit the appointment.");
      } else if (actionType === 'delete') {
        await deleteAppointment();
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error("Failed to verify appointment details");
    }
  };

  const deleteAppointment = async () => {
    try {
      await axios.delete(`${API_URL}/appointments/${currentAppointment.id}`);
      
      const userAppointments = await axios.get(
        `${API_URL}/appointments?user_id=${currentAppointment.user_id}`
      );
      
      if (userAppointments.data.length === 0) {
        await axios.delete(`${API_URL}/users/${currentAppointment.user_id}`);
      }
      
      fetchAppointments();
      toast.success("Appointment deleted successfully!");
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'Failed to delete appointment');
      toast.error("Failed to delete appointment");
      throw err;
    }
  };

  if (loading) return <div className="text-center py-8">Loading appointments...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;

  return (
    <>
       <Helmet>
      <title>Dashboard</title>
    </Helmet>
    <div className="flex h-screen bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-4">
          <div className="container mx-auto">
            <h1 className="text-3xl font-bold mb-6">Patients Appointments</h1>

            {appointments.length === 0 ? (
              <p>No appointments booked yet.</p>
            ) : (
              <>
                <div className="bg-white shadow rounded-lg overflow-hidden mb-4">
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
                      {currentAppointments.map(appointment => (
                        <tr key={appointment.id}>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.doctor}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.day}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{appointment.department}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <button 
                              onClick={() => handleEditClick(appointment)} 
                              className="text-blue-500 hover:text-blue-700 mr-4"
                              aria-label="Edit appointment"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(appointment)} 
                              className="text-red-500 hover:text-red-700"
                              aria-label="Delete appointment"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastItem, totalItems)}
                    </span>{' '}
                    of <span className="font-medium">{totalItems}</span> results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 border rounded ${currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.ceil(totalItems / itemsPerPage) }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 border rounded ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-white hover:bg-gray-100'}`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === Math.ceil(totalItems / itemsPerPage)}
                      className={`px-4 py-2 border rounded ${currentPage === Math.ceil(totalItems / itemsPerPage) ? 'bg-gray-200 cursor-not-allowed' : 'bg-white hover:bg-gray-100'}`}
                    >
                      Next
                    </button>
                  </div>
                </div>
              </>
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
            <p className="mb-4">Please verify your email to proceed:</p>

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
                autoComplete="off"
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
                className={`${
                  actionType === 'edit' 
                    ? 'bg-blue-500 hover:bg-blue-700' 
                    : 'bg-red-500 hover:bg-red-700'
                } text-white font-bold py-2 px-4 rounded`}
              >
                {actionType === 'edit' ? 'Edit' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
}