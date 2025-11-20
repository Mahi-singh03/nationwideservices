import { NextResponse } from 'next/server';
import dbConnect from '@/lib/DBconnection';
import VideoCourse from '@/models/videoReview';

export async function GET() {
  try {
    await dbConnect();
    const videos = await VideoCourse.find({}).sort({ order: 1, createdAt: -1 });
    return NextResponse.json({ success: true, videos }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    
    const videoCount = await VideoCourse.countDocuments();
    if (videoCount >= 5) {
      return NextResponse.json({ 
        success: false, 
        error: 'Maximum limit of 5 videos reached' 
      }, { status: 400 });
    }

    const body = await req.json();
    const video = await VideoCourse.create(body);
    return NextResponse.json({ success: true, video }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}