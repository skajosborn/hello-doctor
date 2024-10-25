import { getDoctors } from '../lib/doctors'; // Adjust the path as needed

async function testGetDoctors() {
  try {
    const searchParams = {
      name: 'John', // Example search parameters
      specialty: 'Cardiology',
      location: 'New York',
    };

    const doctors = await getDoctors(searchParams);
    console.log(doctors);
  } catch (error) {
    console.error('Error fetching doctors:', error);
  }
}

// Run the test function
testGetDoctors();