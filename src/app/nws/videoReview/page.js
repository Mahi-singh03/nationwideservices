"use client"
import { useState, useEffect } from 'react';

export default function AdminDashboard() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('videos');
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [updatingVideo, setUpdatingVideo] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [updateStatus, setUpdateStatus] = useState('');
  const [showUploadSuccess, setShowUploadSuccess] = useState(false); // New state for success popup

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    courseName: '',
    videoFile: null
  });

  // Edit form state
  const [editForm, setEditForm] = useState({});

  // Fetch videos from API
  const fetchVideos = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/videosReview');
      if (response.ok) {
        const result = await response.json();
        setVideos(result.videos || []);
      } else {
        throw new Error('Failed to fetch videos');
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Failed to load videos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({
        ...prev,
        videoFile: file
      }));
    }
  };

  // Handle video upload with progress
  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!uploadForm.videoFile) {
      alert('Please select a video file');
      return;
    }

    // Validate file size (50MB max)
    if (uploadForm.videoFile.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('Starting upload...');

    const uploadData = new FormData();
    uploadData.append('video', uploadForm.videoFile);
    uploadData.append('title', uploadForm.title);
    uploadData.append('description', uploadForm.description);
    uploadData.append('courseName', uploadForm.courseName);

    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        const progress = Math.round(percentComplete);
        setUploadProgress(progress);
        setUploadStatus(`Uploading... ${progress}%`);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          setVideos(prev => [...prev, result.video]);
          setUploadForm({ 
            title: '', 
            description: '', 
            courseName: '',
            videoFile: null 
          });
          setUploadProgress(100);
          setUploadStatus('Upload complete! Processing video...');
          
          // Reset file input
          const fileInput = document.querySelector('input[type="file"]');
          if (fileInput) fileInput.value = '';
          
          setTimeout(() => {
            setUploadStatus('Video uploaded successfully!');
            
            // Show success confirmation popup
            setShowUploadSuccess(true);
            
            // Redirect to videos tab after a short delay
            setTimeout(() => {
              setActiveTab('videos');
              setUploading(false);
              setUploadProgress(0);
              setUploadStatus('');
              
              // Hide success popup after redirect
              setTimeout(() => {
                setShowUploadSuccess(false);
              }, 2000);
            }, 1500);
          }, 1000);
        } catch (parseError) {
          console.error('Parse error:', parseError);
          setUploadStatus('Upload failed: Invalid response');
          setTimeout(() => {
            setUploading(false);
            setUploadProgress(0);
            setUploadStatus('');
          }, 3000);
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          setUploadStatus(`Upload failed: ${error.error || 'Upload failed'}`);
        } catch (parseError) {
          setUploadStatus('Upload failed: Server error');
        }
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
          setUploadStatus('');
        }, 3000);
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      setUploadStatus('Upload failed due to network error');
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
        setUploadStatus('');
      }, 3000);
    });

    xhr.open('POST', '/api/admin/videosReview/upload');
    xhr.send(uploadData);
  };

  // Handle video details update
  const handleSaveEdit = async (videoId) => {
    try {
      const response = await fetch(`/api/admin/videosReview/${videoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const result = await response.json();
        setVideos(prev => prev.map(video => 
          video._id === videoId ? result.video : video
        ));
        setEditingId(null);
        setEditForm({});
        alert('Video updated successfully!');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      alert('Failed to update video');
    }
  };

  // Handle video file update
  const handleVideoUpdate = async (videoId, file) => {
    if (!file) {
      alert('Please select a new video file');
      return;
    }

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      alert('File size must be less than 50MB');
      return;
    }

    setUpdatingVideo(videoId);
    setUpdateProgress(0);
    setUpdateStatus('Starting update...');

    const uploadData = new FormData();
    uploadData.append('video', file);

    const xhr = new XMLHttpRequest();
    
    // Track upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        const progress = Math.round(percentComplete);
        setUpdateProgress(progress);
        setUpdateStatus(`Uploading... ${progress}%`);
      }
    });

    // Handle completion
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText);
          setVideos(prev => prev.map(video => 
            video._id === videoId ? result.video : video
          ));
          setUpdateProgress(100);
          setUpdateStatus('Update complete! Processing video...');
          
          // Reset file input
          const fileInput = document.querySelector(`input[type="file"][data-video-id="${videoId}"]`);
          if (fileInput) fileInput.value = '';
          
          setTimeout(() => {
            setUpdateStatus('Video updated successfully!');
            setTimeout(() => {
              setUpdatingVideo(null);
              setUpdateProgress(0);
              setUpdateStatus('');
            }, 1500);
          }, 1000);
        } catch (parseError) {
          console.error('Parse error:', parseError);
          setUpdateStatus('Update failed: Invalid response');
          setTimeout(() => {
            setUpdatingVideo(null);
            setUpdateProgress(0);
            setUpdateStatus('');
          }, 3000);
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          setUpdateStatus(`Update failed: ${error.error || 'Update failed'}`);
        } catch (parseError) {
          setUpdateStatus('Update failed: Server error');
        }
        setTimeout(() => {
          setUpdatingVideo(null);
          setUpdateProgress(0);
          setUpdateStatus('');
        }, 3000);
      }
    });

    // Handle errors
    xhr.addEventListener('error', () => {
      setUpdateStatus('Update failed due to network error');
      setTimeout(() => {
        setUpdatingVideo(null);
        setUpdateProgress(0);
        setUpdateStatus('');
      }, 3000);
    });

    xhr.open('PUT', `/api/admin/videosReview/${videoId}`);
    xhr.send(uploadData);
  };

  // Handle video deletion
  const handleDelete = async (videoId) => {
    if (confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/videosReview/${videoId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setVideos(prev => prev.filter(video => video._id !== videoId));
          alert('Video deleted successfully!');
        } else {
          throw new Error('Delete failed');
        }
      } catch (error) {
        console.error('Delete error:', error);
        alert('Failed to delete video');
      }
    }
  };

  // Start editing a video
  const startEdit = (video) => {
    setEditingId(video._id);
    setEditForm({
      title: video.title,
      description: video.description,
      courseName: video.courseName,
      order: video.order,
      isActive: video.isActive,
    });
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  // Handle form input changes
  const handleUploadInputChange = (e) => {
    setUploadForm({
      ...uploadForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditForm({
      ...editForm,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Videos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Upload Success Popup */}
      {showUploadSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Successful!</h3>
              <p className="text-gray-600 mb-6">
                Your video has been uploaded successfully and is now being processed.
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-600 mb-4">
                <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Redirecting to Video Management...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Video Admin Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage your course videos and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                {videos.length}/5 Videos
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-[88px] z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-2 sm:space-x-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab('videos')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === 'videos'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              📹 Video Management
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-all duration-200 ${
                activeTab === 'upload'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              ⬆️ Upload New Video
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Upload Tab */}
          {activeTab === 'upload' && (
            <div className="mb-8 animate-fade-in">
              <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Upload New Video</h2>
                <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                  Upload a new course video. The first frame will be automatically used as thumbnail.
                </p>
              </div>
              
              {videos.length < 5 ? (
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-100 max-w-4xl mx-auto">
                  {/* Upload Progress Bar */}
                  {uploading && (
                    <div className="mb-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-lg font-semibold text-blue-700">Uploading Video</span>
                        <span className="text-lg font-bold text-blue-700">{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-4 mb-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-medium ${
                          uploadProgress === 100 ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          {uploadStatus}
                        </p>
                        {uploadProgress === 100 && (
                          <div className="mt-2 flex items-center justify-center space-x-2 text-green-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span>Video uploaded successfully! Redirecting...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <form onSubmit={handleUpload} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Form Fields */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                          <h3 className="font-semibold text-gray-900 mb-4 text-lg">Video Information</h3>
                          
                          <div className="space-y-5">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Course Name *
                              </label>
                              <input
                                type="text"
                                name="courseName"
                                value={uploadForm.courseName}
                                onChange={handleUploadInputChange}
                                required
                                disabled={uploading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="e.g., Web Development Basics"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Video Title *
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={uploadForm.title}
                                onChange={handleUploadInputChange}
                                required
                                disabled={uploading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="e.g., Introduction to React Hooks"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                              </label>
                              <textarea
                                name="description"
                                value={uploadForm.description}
                                onChange={handleUploadInputChange}
                                rows={4}
                                required
                                disabled={uploading}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white resize-vertical disabled:bg-gray-100 disabled:cursor-not-allowed"
                                placeholder="Describe the video content, key topics, and learning objectives..."
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Video File Upload & Guidelines */}
                      <div className="space-y-6">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-100">
                          <h3 className="font-semibold text-gray-900 mb-4 text-lg">Video File</h3>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Select Video File *
                            </label>
                            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors duration-200 relative ${
                              uploading 
                                ? 'border-gray-300 bg-gray-100' 
                                : uploadForm.videoFile
                                ? 'border-green-400 bg-green-50'
                                : 'border-gray-300 bg-white hover:border-blue-400 cursor-pointer'
                            }`}>
                              <input
                                type="file"
                                name="video"
                                accept="video/*"
                                required
                                disabled={uploading}
                                onChange={handleFileSelect}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                              />
                              <div className="space-y-3">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${
                                  uploading 
                                    ? 'bg-gray-200' 
                                    : uploadForm.videoFile
                                    ? 'bg-green-100'
                                    : 'bg-blue-100'
                                }`}>
                                  {uploadForm.videoFile ? (
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <svg className={`w-6 h-6 ${uploading ? 'text-gray-400' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                  )}
                                </div>
                                <div>
                                  <p className={`font-medium text-sm ${
                                    uploading 
                                      ? 'text-gray-500' 
                                      : uploadForm.videoFile
                                      ? 'text-green-700'
                                      : 'text-gray-900'
                                  }`}>
                                    {uploading 
                                      ? 'Upload in progress...' 
                                      : uploadForm.videoFile
                                      ? `Selected: ${uploadForm.videoFile.name}`
                                      : 'Click to upload video'
                                    }
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {uploadForm.videoFile 
                                      ? `Size: ${(uploadForm.videoFile.size / (1024 * 1024)).toFixed(2)} MB`
                                      : 'MP4, MOV, AVI, WebM (Max 50MB)'
                                    }
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Upload Guidelines */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm h-fit">
                          <h3 className="font-semibold text-gray-900 mb-4 text-lg flex items-center">
                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            Upload Guidelines
                          </h3>
                          <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex items-start">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>Maximum 5 videos allowed per account</span>
                            </li>
                            <li className="flex items-start">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>First frame becomes thumbnail automatically</span>
                            </li>
                            <li className="flex items-start">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>Videos are stored in Cloudinary CDN</span>
                            </li>
                            <li className="flex items-start">
                              <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <span>You can update videos and details later</span>
                            </li>
                          </ul>
                          
                          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm text-blue-700">
                                  <strong>Remaining slots:</strong> {5 - videos.length} of 5 videos
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 gap-4">
                      <button
                        type="button"
                        onClick={() => setActiveTab('videos')}
                        disabled={uploading}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all duration-200 font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ← Back to Videos
                      </button>
                      <button
                        type="submit"
                        disabled={uploading || !uploadForm.videoFile}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg hover:shadow-xl w-full sm:w-auto flex items-center justify-center space-x-2"
                      >
                        {uploading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            <span>Uploading... {uploadProgress}%</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span>Upload Video</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-2xl p-8 text-center shadow-lg">
                    <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-yellow-800 mb-3">Maximum Limit Reached</h3>
                    <p className="text-yellow-700 mb-2">You have reached the maximum limit of 5 videos.</p>
                    <p className="text-yellow-600 mb-6">Please delete existing videos to upload new ones.</p>
                    <button
                      onClick={() => setActiveTab('videos')}
                      className="bg-yellow-500 text-white px-8 py-3 rounded-xl hover:bg-yellow-600 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                    >
                      Manage Existing Videos
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Videos Management Tab */}
          {activeTab === 'videos' && (
            <div className="animate-fade-in">
              <div className="mb-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Video Management</h2>
                    <p className="text-gray-600">
                      Edit, update, or delete your existing videos. Click on any video to play preview.
                    </p>
                  </div>
                  {videos.length < 5 && (
                    <button
                      onClick={() => setActiveTab('upload')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Upload New Video</span>
                    </button>
                  )}
                </div>
              </div>

              {videos.length === 0 ? (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center max-w-2xl mx-auto">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">No videos yet</h3>
                  <p className="text-gray-600 mb-2 max-w-md mx-auto">
                    Start building your video library by uploading your first educational content.
                  </p>
                  <p className="text-gray-500 text-sm mb-8">You can upload up to 5 videos</p>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl"
                  >
                    Upload Your First Video
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                    <div className="flex items-center space-x-2 text-blue-800">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">
                        Total Videos: {videos.length} of 5
                      </span>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    {videos.map((video) => (
                      <div key={video._id} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                        {editingId === video._id ? (
                          // Edit Mode
                          <div className="p-6 sm:p-8">
                            <div className="flex items-center justify-between mb-6">
                              <h3 className="text-xl font-bold text-gray-900">Edit Video</h3>
                              <div className="flex items-center space-x-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  video.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                }`}>
                                  {video.isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                              <div className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                      Course Name
                                    </label>
                                    <input
                                      type="text"
                                      name="courseName"
                                      value={editForm.courseName}
                                      onChange={handleEditInputChange}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                      Display Order
                                    </label>
                                    <input
                                      type="number"
                                      name="order"
                                      value={editForm.order}
                                      onChange={handleEditInputChange}
                                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Video Title
                                  </label>
                                  <input
                                    type="text"
                                    name="title"
                                    value={editForm.title}
                                    onChange={handleEditInputChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                  />
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Description
                                  </label>
                                  <textarea
                                    name="description"
                                    value={editForm.description}
                                    onChange={handleEditInputChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-vertical"
                                  />
                                </div>

                                <div className="flex items-center space-x-4">
                                  <label className="flex items-center space-x-3 cursor-pointer">
                                    <div className="relative">
                                      <input
                                        type="checkbox"
                                        name="isActive"
                                        checked={editForm.isActive}
                                        onChange={handleEditInputChange}
                                        className="sr-only"
                                      />
                                      <div className={`block w-14 h-8 rounded-full transition-all duration-300 ${
                                        editForm.isActive ? 'bg-green-500' : 'bg-gray-300'
                                      }`}></div>
                                      <div className={`absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${
                                        editForm.isActive ? 'transform translate-x-6' : ''
                                      }`}></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                      {editForm.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                  </label>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Current Video Preview
                                  </label>
                                  <div className="relative rounded-xl overflow-hidden border border-gray-200">
                                    <video
                                      src={video.cloudinaryUrl}
                                      controls
                                      className="w-full"
                                      poster={video.thumbnail}
                                    />
                                    <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                      Current Video
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Update Video File
                                  </label>
                                  
                                  {/* Update Progress Bar */}
                                  {updatingVideo === video._id && (
                                    <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-blue-700">Updating Video</span>
                                        <span className="text-sm font-bold text-blue-700">{updateProgress}%</span>
                                      </div>
                                      <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                                        <div 
                                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                                          style={{ width: `${updateProgress}%` }}
                                        ></div>
                                      </div>
                                      <p className={`text-xs font-medium text-center ${
                                        updateProgress === 100 ? 'text-green-600' : 'text-blue-600'
                                      }`}>
                                        {updateStatus}
                                      </p>
                                      {updateProgress === 100 && (
                                        <div className="mt-2 flex items-center justify-center space-x-1 text-green-600">
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-xs">Video updated successfully!</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors duration-200 relative">
                                    <input
                                      type="file"
                                      accept="video/*"
                                      data-video-id={video._id}
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) handleVideoUpdate(video._id, file);
                                      }}
                                      disabled={updatingVideo === video._id}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <div className="space-y-2">
                                      {updatingVideo === video._id ? (
                                        <div className="flex items-center justify-center space-x-2">
                                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                          <span className="text-blue-600 font-medium">Updating video...</span>
                                        </div>
                                      ) : (
                                        <>
                                          <svg className="w-8 h-8 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                          </svg>
                                          <div>
                                            <p className="font-medium text-gray-900 text-sm">Click to replace video</p>
                                            <p className="text-xs text-gray-500 mt-1">Same rules apply for new uploads</p>
                                          </div>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 mt-6 border-t border-gray-200">
                              <button
                                onClick={() => handleSaveEdit(video._id)}
                                className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 order-2 sm:order-1"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Save Changes</span>
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="bg-gray-500 text-white px-6 py-3 rounded-xl hover:bg-gray-600 font-semibold transition-all duration-200 order-1 sm:order-2"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          // View Mode
                          <div className="p-6 sm:p-8">
                            <div className="flex flex-col lg:flex-row gap-6">
                              {/* Video Preview */}
                              <div className="lg:w-2/5 xl:w-1/3">
                                <div className="relative rounded-xl overflow-hidden shadow-lg bg-black">
                                  <video
                                    src={video.cloudinaryUrl}
                                    controls
                                    className="w-full aspect-video"
                                    poster={video.thumbnail}
                                  />
                                  <div className="absolute top-3 left-3 bg-black bg-opacity-70 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                    {formatDuration(video.duration)}
                                  </div>
                                  {video.thumbnail && (
                                    <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-lg text-xs font-medium">
                                      Auto-thumbnail
                                    </div>
                                  )}
                                </div>
                                
                                {/* Update Video File */}
                                <div className="mt-4">
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Update Video File
                                  </label>
                                  
                                  {/* Update Progress Bar */}
                                  {updatingVideo === video._id && (
                                    <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                      <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold text-blue-700">Updating Video</span>
                                        <span className="text-sm font-bold text-blue-700">{updateProgress}%</span>
                                      </div>
                                      <div className="w-full bg-blue-200 rounded-full h-3 mb-2">
                                        <div 
                                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300 ease-out"
                                          style={{ width: `${updateProgress}%` }}
                                        ></div>
                                      </div>
                                      <p className={`text-xs font-medium text-center ${
                                        updateProgress === 100 ? 'text-green-600' : 'text-blue-600'
                                      }`}>
                                        {updateStatus}
                                      </p>
                                      {updateProgress === 100 && (
                                        <div className="mt-2 flex items-center justify-center space-x-1 text-green-600">
                                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                          </svg>
                                          <span className="text-xs">Video updated successfully!</span>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors duration-200 relative">
                                    <input
                                      type="file"
                                      accept="video/*"
                                      data-video-id={video._id}
                                      onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) handleVideoUpdate(video._id, file);
                                      }}
                                      disabled={updatingVideo === video._id}
                                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                    />
                                    <div className="space-y-2">
                                      {updatingVideo === video._id ? (
                                        <div className="flex items-center justify-center space-x-2">
                                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                          <span className="text-blue-600 font-medium">Updating video...</span>
                                        </div>
                                      ) : (
                                        <>
                                          <svg className="w-6 h-6 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                          </svg>
                                          <p className="font-medium text-gray-900 text-sm">Click to replace video</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Video Details */}
                              <div className="lg:w-3/5 xl:w-2/3">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                                  <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2 mb-3">
                                      <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm">
                                        {video.courseName}
                                      </span>
                                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                                        video.isActive 
                                          ? 'bg-green-100 text-green-800 border border-green-200' 
                                          : 'bg-red-100 text-red-800 border border-red-200'
                                      }`}>
                                        <span className={`w-2 h-2 rounded-full mr-2 ${
                                          video.isActive ? 'bg-green-500' : 'bg-red-500'
                                        }`}></span>
                                        {video.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                                        </svg>
                                        Order: {video.order}
                                      </span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{video.title}</h3>
                                  </div>
                                  <div className="flex space-x-2 shrink-0">
                                    <button
                                      onClick={() => startEdit(video)}
                                      className="bg-blue-600 text-white px-4 py-2.5 rounded-xl hover:bg-blue-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      onClick={() => handleDelete(video._id)}
                                      className="bg-red-600 text-white px-4 py-2.5 rounded-xl hover:bg-red-700 font-semibold transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      <span>Delete</span>
                                    </button>
                                  </div>
                                </div>

                                <p className="text-gray-600 mb-6 leading-relaxed text-lg">{video.description}</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-500 mb-6">
                                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Duration: {formatDuration(video.duration)}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Uploaded: {new Date(video.createdAt).toLocaleDateString()}</span>
                                  </div>
                                  <div className="flex items-center space-x-2 bg-gray-50 p-3 rounded-lg">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                                    </svg>
                                    <span>Status: {video.isActive ? 'Published' : 'Draft'}</span>
                                  </div>
                                </div>

                                <div className="text-xs text-gray-400 border-t border-gray-200 pt-4">
                                  Last updated: {new Date(video.updatedAt || video.createdAt).toLocaleString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Add some custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}