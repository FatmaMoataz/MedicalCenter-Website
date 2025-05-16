import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:1337/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export default function Appointment() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: '',
      day: '',
      department: '',
      doctor: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      phone: Yup.string()
        .required('Phone number is required')
        .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
      day: Yup.string().required('Please select a day'),
      department: Yup.string().required('Please select a department'),
      doctor: Yup.string().required('Please select a doctor'),
    }),
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const { data } = await api.post('/appointments', {
          data: values
        });

        if (data.data) {
          toast.success('Appointment booked successfully!');
          navigate('/dashboard');
        }
      } catch (error) {
        const errorMsg = error.response?.data?.error?.message || 
                       error.message || 
                       'Booking failed. Please try again.';
        toast.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  return (
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
            value={formik.values.name}
          />
          {formik.errors.name && <p className="text-red-500 text-sm">{formik.errors.name}</p>}
        </div>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email && <p className="text-red-500 text-sm">{formik.errors.email}</p>}
        </div>

        <div>
          <label className="block mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.phone}
          />
          {formik.errors.phone && <p className="text-red-500 text-sm">{formik.errors.phone}</p>}
        </div>

        <div>
          <label className="block mb-1">Day</label>
          <select
            name="day"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.day}
          >
            <option value="">Select a day</option>
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
          {formik.errors.day && <p className="text-red-500 text-sm">{formik.errors.day}</p>}
        </div>

        <div>
          <label className="block mb-1">Department</label>
          <select
            name="department"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.department}
          >
            <option value="">Select department</option>
            {['Cardiology', 'Dentistry', 'Neurology', 'Pediatrics', 'Orthopedics'].map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
          {formik.errors.department && <p className="text-red-500 text-sm">{formik.errors.department}</p>}
        </div>

        <div>
          <label className="block mb-1">Doctor</label>
          <select
            name="doctor"
            className="w-full p-2 border rounded"
            onChange={formik.handleChange}
            value={formik.values.doctor}
          >
            <option value="">Select doctor</option>
            {['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'].map(doctor => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>
          {formik.errors.doctor && <p className="text-red-500 text-sm">{formik.errors.doctor}</p>}
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
  );
}