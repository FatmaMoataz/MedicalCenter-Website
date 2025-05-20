import { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

const API_URL = 'https://json-server-api-production-9295.up.railway.app';

export default function Appointment() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);


useEffect(() => {
  async function fetchData() {
    try {
      const depRes = await fetch(`${API_URL}/departments`);
      const docRes = await fetch(`${API_URL}/doctors`);
      setDepartments(await depRes.json());
      setDoctors(await docRes.json());
    } catch (error) {
      console.error("Failed to fetch departments or doctors", error);
    }
  }
  fetchData();
}, []);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      day: '',
      department: '',
      doctor: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      day: Yup.string().required('Please select a day'),
      department: Yup.string().required('Please select a department'),
      doctor: Yup.string().required('Please select a doctor'),
    }),

    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
 
        const usersRes = await fetch(`${API_URL}/users`);
        const usersData = await usersRes.json();
        const existingUser = usersData.find(user => user.email === values.email);

        let userId;
        if (existingUser) {
          userId = existingUser.id;
        } else {
          const newUserRes = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: values.name,
              email: values.email
            }),
          });
          const newUser = await newUserRes.json();
          userId = newUser.id;
        }

        const [departmentsRes, doctorsRes] = await Promise.all([
          fetch(`${API_URL}/departments`),
          fetch(`${API_URL}/doctors`)
        ]);
        
        const [departmentsData, doctorsData] = await Promise.all([
          departmentsRes.json(),
          doctorsRes.json()
        ]);

        const department = departmentsData.find(dep => dep.name === values.department);
        const doctor = doctorsData.find(doc => doc.name === values.doctor);

        if (!department || !doctor) {
          throw new Error('Invalid department or doctor selected');
        }

        const appointmentRes = await fetch(`${API_URL}/appointments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            day: values.day,
            department_id: department.id,
            doctor_id: doctor.id
          }),
        });

        if (appointmentRes.ok) {
          toast.success('Appointment booked successfully!');
          navigate('/dashboard');
        } else {
          throw new Error('Failed to create appointment');
        }
      } catch (error) {
        console.error('Booking error:', error);
        toast.error(error.message || 'Booking failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
    <>
    <Helmet>
      <title>Appointment</title>
    </Helmet>
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-3xl font-bold text-center my-6">Book an Appointment</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Day</label>
          <select
            name="day"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.day}
          >
            <option value="">Select a day</option>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          {formik.touched.day && formik.errors.day && (
            <p className="text-red-500 text-sm">{formik.errors.day}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Department</label>
          <select
            name="department"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.department}
          >
            <option value="">Select department</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.name}>{dept.name}</option>
            ))}
          </select>
          {formik.touched.department && formik.errors.department && (
            <p className="text-red-500 text-sm">{formik.errors.department}</p>
          )}
        </div>

        <div>
          <label className="block mb-1">Doctor</label>
          <select
            name="doctor"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.doctor}
          >
            <option value="">Select doctor</option>
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
            ))}
          </select>
          {formik.touched.doctor && formik.errors.doctor && (
            <p className="text-red-500 text-sm">{formik.errors.doctor}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
    </>
  );
}