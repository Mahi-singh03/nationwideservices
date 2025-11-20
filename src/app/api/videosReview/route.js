import dbConnect from '@/lib/DBconnection';
import VideoCourse from '@/models/videoReview';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();
  try {
    const videos = await VideoCourse.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .select('-cloudinaryPublicId');

    return NextResponse.json({ success: true, data: videos }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error && error.message) ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}