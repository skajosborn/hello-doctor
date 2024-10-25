import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { db } from '@/lib/db';

interface AppointmentRequest {
  doctorId: string;
  userId: string;
  date: string;
  time: string;
  reason: string;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const { userId, date, time, reason } = await req.json() as AppointmentRequest;
  
    // Log the data to verify what is being received
    console.log('Received appointment data:', { doctorId: id, userId, date, time, reason });
  
    // Validate input
    if (!userId || !ObjectId.isValid(userId) || !date || !time || !reason) {
      console.log('Invalid or missing fields:', { doctorId: id, userId, date, time, reason });
      return NextResponse.json({ message: 'Invalid or missing fields' }, { status: 400 });
    }
  
    try {
      const appointment = await db.appointment.create({
        data: {
          date: new Date(date).toISOString(),
          time,
          reason,
          doctor: {
            connect: { id: String(id) },
          },
          user: {
            connect: { id: String(userId) },
          },
        },
      });
  
      return NextResponse.json(appointment, { status: 201 });
  
    } catch (error) {
      console.error('Failed to create appointment:', error);
      if (error instanceof Error) {
        return NextResponse.json(
          { error: 'Failed to create appointment', details: error.message },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { error: 'Failed to create appointment', details: 'An unknown error occurred' },
          { status: 500 }
        );
      }
    }
  }