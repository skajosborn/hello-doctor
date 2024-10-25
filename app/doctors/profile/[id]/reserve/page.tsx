"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Calendar } from "@/components/ui/calendar";
import 'react-calendar/dist/Calendar.css';
import { useSession } from "next-auth/react";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  imageUrl: string;
  aboutMe: string;
}

type CalendarValue = Date | [Date | null, Date | null] | null;

export default function DoctorReservePage() {
  const router = useRouter();
  const params = useParams();
  const { data: session } = useSession();
  const doctorId = typeof params?.id === 'string' ? params.id : undefined;
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [date, setDate] = useState<CalendarValue>(null);
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (doctorId) {
      fetch(`/api/doctors/${doctorId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch');
          }
          return res.json();
        })
        .then((data: Doctor) => {
          setDoctor(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Failed to fetch doctor:', error);
          setLoading(false);
        });
    }
  }, [doctorId]);

  const handleDateChange = (value: CalendarValue) => {
    setDate(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    const userId = session?.user?.id; 
    if (!doctor?.id || !date || !(date instanceof Date) || !userId) {
      console.error("Doctor ID, valid date, or user ID is missing!");
      return;
    }
  
    try {
      const response = await fetch(`/api/doctors/${doctor.id}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doctorId: doctor.id,
          userId, 
          date: date.toISOString(),
          time,
          reason,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to book appointment:', errorData);
        throw new Error('Failed to book appointment');
      }
  
      // Redirect to success page with appointment date and time in the query parameters
      router.push(`/doctors/profile/${doctor.id}/reserve/success?date=${encodeURIComponent(date.toISOString())}&time=${encodeURIComponent(time)}`);
    } catch (error) {
      console.error('Error booking appointment:', error);
    }
  };
  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (!doctor) {
    return <p className="text-center text-red-500">Doctor not found!</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-4 relative">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="/images/whiteglobe3.jpg"
          alt="Medical Background"
          layout="fill"
          objectFit="cover"
          quality={100}
        />
      </div>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black opacity-20 z-10"></div>
      <div className="w-full max-w-2xl relative z-20 bg-black bg-opacity-80 rounded-lg shadow-xl overflow-hidden">
        <div className="relative z-30">
          <h2 className="text-4xl font-bold mb-6 text-white text-center pt-6">Reserve an Appointment</h2>
          <form onSubmit={handleSubmit} className="rounded-lg px-8 pt-6 pb-8 mb-4">
            <div className="text-center mb-6">
              <Image
                src={doctor.imageUrl || "/images/placeholder-doctor-image.jpg"}
                alt={doctor.name}
                width={150}
                height={150}
                className="mx-auto mb-2"
                unoptimized
                priority
              />
              <h3 className="text-2xl text-green-600 font-bold">{doctor.name}</h3>
              <p className="text-xl text-white">{doctor.specialization}</p>
              <p className="mt-2 text-md text-gray-300">{doctor.aboutMe}</p>
            </div>
            <div className="mb-4">
              <label className="block text-white text-xl font-bold mb-2">Select Date</label>
              <div className="bg-gray-200 rounded-md border p-3">
                <Calendar
                  onChange={handleDateChange}
                  value={date}
                  className="mx-auto"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-white text-xl font-bold mb-2">Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="shadow appearance-none cursor-pointer border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-white text-xl font-bold mb-2">Reason for Visit</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Enter the reason for your visit"
                rows={3}
                required
              />
            </div>
            <div className="flex items-center justify-center">
              <button
                type="submit"
                className="bg-green-600 hover:bg-blue-800 text-white text-xl font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}