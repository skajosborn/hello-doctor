import Image from 'next/image';
import Link from 'next/link';
import { getDoctors } from '@/lib/doctors';
import { Doctor } from '@/lib/doctors';

export default async function DoctorSearchResults({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const searchCriteria: { name?: string; specialization?: string; location?: string } = {};

  // Check for correct parsing of search parameters
  if (searchParams.name) {
    searchCriteria.name = String(searchParams.name);
  }
  if (searchParams.specialty) { // Ensure this matches the form input key
    searchCriteria.specialization = String(searchParams.specialty);
  }
  if (searchParams.location) {
    searchCriteria.location = String(searchParams.location);
  }

  try {
    const doctors: Doctor[] = await getDoctors(searchCriteria);

    // Ensure doctors are being fetched based on the criteria
    if (doctors.length === 0) {
      return <p className="text-center text-gray-500 mt-8">No doctors found matching your search criteria.</p>;
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
          <Link key={doctor.id} href={`/doctors/profile/${doctor.id}`} passHref>
            <div className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
              <Image
                src={doctor.images && doctor.images[0] ? doctor.images[0] : '/images/placeholder-doctor-image.jpg'}
                alt={`Doctor specializing in ${doctor.specialization}`}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{doctor.specialization}</h2>
                <p className="text-gray-500 text-sm mb-2 line-clamp-3">{doctor.aboutMe}</p>
                <p className="text-gray-500 text-sm mb-2">Experience: {doctor.professionalExperience}</p>
                <p className="text-gray-500 text-sm">Languages: {doctor.languages}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch doctors:", error);
    return <p className="text-center text-red-500 mt-8">An error occurred while fetching doctors.</p>;
  }
}