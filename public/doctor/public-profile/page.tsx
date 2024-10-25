import React from 'react';
import { getDoctorById } from '@/data/doctor'; 

export default async function DoctorProfile({ params }: { params: { id: string } }) {
  try {
    const doctor = await getDoctorById(params.id);
    console.log('Fetched doctor:', doctor);

    if (!doctor) {
      console.log('Doctor not found');
      return <div>Doctor not found</div>;
    }

    return (
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-sm mx-auto">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4">
          <button className="text-gray-500">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm">Schedule</button>
        </div>

        {/* Doctor Info */}
        <div className="flex flex-col items-center">
          <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm mb-2">{doctor.professionalExperience || 'Experience not available'}</div>
          <div className="bg-blue-200 text-blue-800 p-3 rounded-lg text-sm w-full text-center">
            Focus: {doctor.specialties || "Information not available"}
          </div>
        </div>

        {/* Doctor Name and Specialization */}
        <div className="text-center mt-4">
          <h2 className="text-xl font-bold">Dr. {doctor.id}</h2>
          <p className="text-gray-600">{doctor.specialization}</p>
        </div>

        {/* Rating and Time */}
        <div className="flex justify-center items-center space-x-2 mt-2">
          <span className="flex items-center">
            <span className="text-yellow-500 mr-1">★</span>
            <span className="text-sm">Rating not available</span>
          </span>
          <span className="border-l-2 border-gray-300 mx-2 h-6"></span>
          <span className="flex items-center">
            <i className="fas fa-clock text-gray-500 mr-1"></i>
            <span className="text-sm">Mon - Sat / 9 AM - 4 PM</span>
          </span>
        </div>

        {/* Profile Description */}
        <p className="text-sm mt-4 text-center px-2">
          {doctor.aboutMe || "No description available."}
        </p>

        {/* Calendar Section */}
        <div className="bg-blue-100 mt-6 p-4 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <button className="text-blue-500">
              <i className="fas fa-chevron-left"></i>
            </button>
            <span className="text-blue-800 font-semibold">Month</span>
            <button className="text-blue-500">
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>
          <div className="grid grid-cols-7 gap-2 text-center text-sm">
            {/* Calendar Days */}
            <div className="text-blue-800">Mon</div>
            <div className="text-blue-800">Tue</div>
            <div className="text-blue-800">Wed</div>
            <div className="text-blue-800">Thu</div>
            <div className="text-blue-800">Fri</div>
            <div className="text-blue-800">Sat</div>
            <div className="text-blue-800">Sun</div>
            {/* Calendar Dates */}
            {[...Array(30)].map((_, i) => (
              <div key={i} className={`p-2 ${i + 1 === 24 ? 'bg-blue-500 text-white rounded-full' : 'text-gray-600'}`}>
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex justify-around mt-6">
          <button className="text-blue-500">
            <i className="fas fa-home"></i>
          </button>
          <button className="text-blue-500">
            <i className="fas fa-user"></i>
          </button>
          <button className="text-blue-500">
            <i className="fas fa-calendar"></i>
          </button>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error in DoctorProfile:', error);
    return <div>Error loading doctor profile</div>;
  }
}