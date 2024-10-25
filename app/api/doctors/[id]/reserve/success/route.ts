'use server'

import { NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function POST(request: Request) {
  try {
    const { doctorId, date, time, reason, userId } = await request.json();

    if (!doctorId || !date || !time || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: doctorId, date, time, and userId are required.' },
        { status: 400 }
      );
    }

    // Create the appointment in the database
    const appointment = await db.appointment.create({
      data: {
        doctor: { connect: { id: doctorId } },
        user: { connect: { id: userId } },
        date: new Date(date),
        time,
        reason,
      },
    });

    return NextResponse.json(
      { message: 'Appointment successfully booked!', appointment },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create appointment:', error);
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    );
  }
}