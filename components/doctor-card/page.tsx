import Image from 'next/image';
import Link from 'next/link';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  profileUrl: string;
}

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
  return (
    <div className="bg-white text-black rounded-lg shadow-lg p-4 sm:p-6 transform hover:scale-105 transition-transform duration-300">
      <Image
        src={doctor.imageUrl || '/images/placeholder-doctor-image.jpg'} 
        alt={doctor.name || 'Doctor Image'}
        width={200}
        height={200}
        className="mx-auto object-cover"
      />
      <h3 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mt-3 sm:mt-4">{doctor.name}</h3>
      <p className="text-center text-gray-600 text-sm sm:text-base">{doctor.specialty}</p>
      <Link href={doctor.profileUrl}>
        <button className="block mt-4 sm:mt-6 w-full text-center bg-blue-600 hover:bg-green-600 text-white text-base sm:text-lg font-bold py-2 sm:py-3 rounded-lg">
          View Profile
        </button>
      </Link>
    </div>
  );
};

export default DoctorCard;