import { useEffect, useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';

export default function Doctor() {
  const [doctors, setDoctors] = useState([]);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get('https://json-server-api-production-9295.up.railway.app/doctors');
      return response.data;
    } catch (error) {
      console.error('Error fetching doctors:', error);
      return [];
    }
  };

  useEffect(() => {
    fetchDoctors().then((data) => setDoctors(data));
  }, []);

  return (
    <>
    <Helmet>
      <title>Doctors</title>
    </Helmet>
    <div className="py-14 bg-gray-50">
      <div className="container mx-auto px-4 text-center">
        <div className="mb-12">
          <span className="text-blue-600 text-2xl uppercase font-medium">Our Doctors</span>
          <h2 className="text-4xl font-bold text-gray-800">Our Specialist</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="p-6 bg-white rounded shadow-md">
              {doctor.img ? (
                <img
                  src={doctor.img}
                  alt={doctor.name}
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}
              <div className="mt-4">
                <h3 className="text-2xl font-semibold">{doctor.name}</h3>
                <span className="text-gray-600">{doctor.role}</span>
                <div className="mt-4 flex justify-center gap-4 text-blue-600">
                  <a href="#" className="hover:text-blue-800">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className="hover:text-blue-800">
                    <i className="fas fa-globe"></i>
                  </a>
                  <a href="#" className="hover:text-blue-800">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className="hover:text-blue-800">
                    <i className="fab fa-pinterest-p"></i>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
