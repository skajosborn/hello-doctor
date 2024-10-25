import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const featuredDoctors = await db.doctor.findMany({
      take: 5,
      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
        specialization: true,
      },
    });

    const formattedDoctors = featuredDoctors.map(doctor => ({
      id: doctor.id,
      name: doctor.user?.name || 'Unknown',
      specialization: doctor.specialization,
      profileUrl: `/api/doctors/${doctor.id}`,
    }));

    return NextResponse.json(formattedDoctors);
  } catch (error) {
    console.error('Error fetching featured doctors:', error);
    return NextResponse.json({ error: 'Failed to fetch doctors' }, { status: 500 });
  } finally {
    await db.$disconnect();
  }
}