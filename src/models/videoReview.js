import mongoose from 'mongoose';

const VideoCourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
  cloudinaryUrl: {
    type: String,
    required: true,
  },
  cloudinaryPublicId: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  thumbnail: {
    type: String,
    required: false,
  },
}, {
  timestamps: true,
});

export default mongoose.models.VideoCourse || mongoose.model('VideoCourse', VideoCourseSchema);