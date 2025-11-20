import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import dbConnect from '@/lib/DBconnection';
import VideoCourse from '@/models/videoReview';

export async function POST(req) {
  try {
    await dbConnect();

    // Check video count limit
    const videoCount = await VideoCourse.countDocuments();
    if (videoCount >= 5) {
      return NextResponse.json({ 
        error: 'Maximum limit of 5 videos reached. Please delete existing videos to upload new ones.' 
      }, { status: 400 });
    }

    // Handle multipart form data
    const formData = await req.formData();
    const file = formData.get('video');
    const title = formData.get('title');
    const description = formData.get('description');
    const courseName = formData.get('courseName');

    if (!file) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video',
          folder: 'course-videos',
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Convert file to buffer and pipe to Cloudinary
      file.arrayBuffer().then(buffer => {
        uploadStream.end(Buffer.from(buffer));
      }).catch(reject);
    });

    // Save to database
    const videoCourse = new VideoCourse({
      title: title || 'Untitled Video',
      description: description || '',
      courseName: courseName || 'General Course',
      cloudinaryUrl: uploadResult.secure_url,
      cloudinaryPublicId: uploadResult.public_id,
      duration: uploadResult.duration,
      thumbnail: uploadResult.secure_url.replace(/\.(mp4|mov|avi|webm)$/i, '.jpg'),
    });

    await videoCourse.save();

    return NextResponse.json({
      success: true,
      video: {
        _id: videoCourse._id.toString(),
        title: videoCourse.title,
        description: videoCourse.description,
        courseName: videoCourse.courseName,
        cloudinaryUrl: videoCourse.cloudinaryUrl,
        duration: videoCourse.duration,
        thumbnail: videoCourse.thumbnail,
        order: videoCourse.order,
        isActive: videoCourse.isActive,
        createdAt: videoCourse.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload video', details: error.message }, { status: 500 });
  }
}