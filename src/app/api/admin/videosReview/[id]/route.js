import { NextResponse } from 'next/server';
import dbConnect from '@/lib/DBconnection';
import VideoCourse from '@/models/videoReview';
import cloudinary from '@/lib/cloudinary';

export async function GET(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    const video = await VideoCourse.findById(id);
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, video }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    // Check if request contains form data (video file) or JSON (metadata)
    const contentType = req.headers.get('content-type') || '';
    
    // If content type is explicitly application/json, handle as JSON metadata update
    if (contentType.includes('application/json')) {
      // Handle metadata update (JSON)
      const body = await req.json();
      const video = await VideoCourse.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
      });
      
      if (!video) {
        return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
      }
      
      return NextResponse.json({ success: true, video }, { status: 200 });
    } else {
      // Handle video file update (FormData)
      // When FormData is sent, browser automatically sets multipart/form-data with boundary
      const formData = await req.formData();
      const file = formData.get('video');
      
      if (!file) {
        return NextResponse.json({ error: 'No video file provided' }, { status: 400 });
      }

      // Get existing video
      const existingVideo = await VideoCourse.findById(id);
      if (!existingVideo) {
        return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
      }

      // Delete old video from Cloudinary
      if (existingVideo.cloudinaryPublicId) {
        try {
          await cloudinary.uploader.destroy(existingVideo.cloudinaryPublicId, {
            resource_type: 'video',
          });
        } catch (cloudinaryError) {
          console.error('Error deleting old video from Cloudinary:', cloudinaryError);
          // Continue even if deletion fails
        }
      }

      // Upload new video to Cloudinary
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

        file.arrayBuffer().then(buffer => {
          uploadStream.end(Buffer.from(buffer));
        }).catch(reject);
      });

      // Update video in database
      const video = await VideoCourse.findByIdAndUpdate(
        id,
        {
          cloudinaryUrl: uploadResult.secure_url,
          cloudinaryPublicId: uploadResult.public_id,
          duration: uploadResult.duration,
          thumbnail: uploadResult.secure_url.replace(/\.(mp4|mov|avi|webm)$/i, '.jpg'),
        },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!video) {
        return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, video }, { status: 200 });
    }
  } catch (error) {
    console.error('Update error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { id } = params;
    
    const video = await VideoCourse.findById(id);
    if (!video) {
      return NextResponse.json({ success: false, error: 'Video not found' }, { status: 404 });
    }

    // Delete from Cloudinary
    if (video.cloudinaryPublicId) {
      try {
        await cloudinary.uploader.destroy(video.cloudinaryPublicId, {
          resource_type: 'video',
        });
      } catch (cloudinaryError) {
        console.error('Error deleting video from Cloudinary:', cloudinaryError);
        // Continue even if deletion fails
      }
    }

    // Delete from database
    await VideoCourse.findByIdAndDelete(id);

    return NextResponse.json({ success: true, message: 'Video deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}