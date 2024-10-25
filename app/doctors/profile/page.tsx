'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Footer from '@/components/footer/page'

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  about: string;
  specialties: string[];
  certifications: string[];
  experience: string[];
  languages: string[];
}

export default function DoctorProfilePage({ params }: { params: { id: string } }) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch the doctor's details based on the ID from the URL
    const fetchDoctor = async () => {
      try {
        const response = await fetch(`/api/doctors/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setDoctor(data);
        } else {
          console.error('Failed to fetch doctor details');
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    fetchDoctor();
  }, [params.id]);

  if (!doctor) {
    return <p className="text-center text-red-500">Loading doctor details...</p>;
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center mb-8">
          <Image
            src={doctor.imageUrl || "/images/placeholder-doctor-image.jpg"}
            alt={doctor.name}
            width={200}
            height={200}
            className="mb-4 md:mb-0 md:mr-8"
          />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold">{doctor.name}</h1>
            <p className="text-xl text-gray-600">{doctor.specialty}</p>
          </div>
        </div>

        <div className="flex space-x-4 mb-8">
          <button
            className="flex-1 bg-black text-white py-3 rounded-md font-semibold text-lg"
            onClick={() => router.push(`/doctors/profile/${doctor.id}/message`)}
          >
            Message
          </button>
          <button
            className="flex-1 bg-black text-white py-3 rounded-md font-semibold text-lg"
            onClick={() => router.push(`/doctors/profile/${doctor.id}/reserve`)}
          >
            Reserve
          </button>
        </div>

        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">About me</h2>
          <p className="text-gray-700">{doctor.about || 'No information available'}</p>
        </div>

        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Specialties</h2>
          <ul className="list-disc list-inside text-gray-700">
            {doctor.specialties.length > 0 ? (
              doctor.specialties.map((specialty, index) => <li key={index}>{specialty}</li>)
            ) : (
              <p>No specialties available</p>
            )}
          </ul>
        </div>

        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Certifications</h2>
          <ul className="list-disc list-inside text-gray-700">
            {doctor.certifications.length > 0 ? (
              doctor.certifications.map((cert, index) => <li key={index}>{cert}</li>)
            ) : (
              <p>No certifications available</p>
            )}
          </ul>
        </div>

        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Professional Experience</h2>
          <ul className="list-disc list-inside text-gray-700">
            {doctor.experience.length > 0 ? (
              doctor.experience.map((exp, index) => <li key={index}>{exp}</li>)
            ) : (
              <p>No experience available</p>
            )}
          </ul>
        </div>

        <div className="mb-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">Languages</h2>
          <p className="text-gray-700">{doctor.languages.length > 0 ? doctor.languages.join(', ') : 'No languages available'}</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}