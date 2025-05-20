import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const API_URL = 'https://json-server-api-production-9295.up.railway.app';

const daysOfWeek = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export default function AppointmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [day, setDay] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [doctorId, setDoctorId] = useState('');

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [appointmentRes, departmentsRes, doctorsRes] = await Promise.all([
          axios.get(`${API_URL}/appointments/${id}`),
          axios.get(`${API_URL}/departments`),
          axios.get(`${API_URL}/doctors`)
        ]);

        const appointmentData = appointmentRes.data;
        setAppointment(appointmentData);

        setDay(appointmentData.day); 
        setDepartmentId(appointmentData.department_id);
        setDoctorId(appointmentData.doctor_id);

        setDepartments(departmentsRes.data);
        setDoctors(doctorsRes.data);

        setLoading(false);
      } catch (err) {
        setError('Failed to load appointment or related data');
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/appointments/${id}`, {
        ...appointment,
        day,
        department_id: departmentId,
        doctor_id: doctorId,
      });
      toast.success('Appointment updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error('Failed to update appointment');
    }
  };


  if (loading) return <div>Loading appointment...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <>
       <Helmet>
      <title>Appointment Edit Details</title>
    </Helmet>
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-4">Edit Appointment #{id}</h2>
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Day:
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="">-- Select Day --</option>
            {daysOfWeek.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Department:
          <select
            value={departmentId}
            onChange={(e) => setDepartmentId(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="">-- Select Department --</option>
            {departments.map((dep) => (
              <option key={dep.id} value={dep.id}>
                {dep.name}
              </option>
            ))}
          </select>
        </label>

        <label className="block mb-2">
          Doctor:
          <select
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="">-- Select Doctor --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id}>
                {doc.name}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Save Changes
        </button>
      </form>
    </div>
    </>
  );
}
