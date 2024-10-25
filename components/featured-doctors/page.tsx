import Image from 'next/image';
import Link from 'next/link';
import { getFeaturedDoctors } from '@/lib/doctors';
import { Doctor } from '@/lib/doctors'; 

export default async function FeaturedDoctors() {
  try {
    const doctors: Doctor[] = await getFeaturedDoctors();

    // Check if doctors data is empty
    if (doctors.length === 0) {
      return <p className="text-center text-gray-500 mt-8">No featured doctors available at this time.</p>;
    }

    console.log("Fetched Featured Doctors:", doctors); // Log to check fetched data

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Link key={doctor.id} href={`/doctors/profile/${doctor.id}`} passHref>
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <Image
                src={doctor.images && doctor.images[0] ? doctor.images[0] : '/images/placeholder-doctor-image.jpg'}
                alt={`Doctor specializing in ${doctor.specialization || 'General Medicine'}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{doctor.user?.name || 'Name not available'}</h2>
                <p className="text-gray-500 text-sm mb-2 line-clamp-3">{doctor.aboutMe || 'No information available.'}</p>
                <p className="text-gray-500 text-sm mb-2">Experience: {doctor.professionalExperience || 'No experience information available.'}</p>
                <p className="text-gray-500 text-sm">Languages: {doctor.languages || 'Not specified'}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch featured doctors:", error);
    return <p className="text-center text-red-500 mt-8">An error occurred while fetching featured doctors.</p>;
  }
}