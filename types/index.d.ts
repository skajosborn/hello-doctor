 interface Doctor {
    id: string;
    name: string;
    specialty: string;
    experience: number;
    rating: number;
    imageUrl: string;
    about: string;
    specialties: string[];
    certifications: string[];
    professionalExperience: string[];
    languages: string[];
  }

  
  
   interface Appointment {
    id: string;
    doctorId: string;
    patientId: string;
    date: string;
    time: string;
  }