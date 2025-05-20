import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Helmet } from 'react-helmet';

export default function Department() {
  const [departments, setDepartments] = useState([]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('https://json-server-api-production-9295.up.railway.app/departments');
      setDepartments(response.data); 
      console.log(response.data); 
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <>
        <Helmet>
      <title>Departments</title>
    </Helmet>
    <div className='py-14 bg-white'>
      <div className='container mx-auto px-4 text-center'>
        <div className='mb-12'>
          <span className='text-blue-600 text-2xl uppercase font-medium'>Our Departments</span>
          <h2 className='text-4xl font-bold text-gray-800'>Our Medical Services</h2>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {departments.map((dept) => (
            <div key={dept.id} className='p-6 bg-gray-50 rounded shadow-lg'>
              <div className='text-blue-600 text-3xl mb-4'>
                <i className={dept.icon}></i>
              </div>
              <h3 className='text-2xl font-semibold mb-4'>{dept.name}</h3>
              <p className='text-gray-600 mb-6'>{dept.description}</p>
              <Link to={'/appointments'}>
                <button className='py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700'>
                  Make an Appointment
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
