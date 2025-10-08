# Video Upload Guide

This guide explains how to use the new video upload functionality that supports both URL-based videos and direct file uploads to MySQL using LONGBLOB storage.

## How It Works

The system now supports two methods of video upload:

1. **URL-based upload** - Traditional method using YouTube, Vimeo, or direct video URLs
2. **File upload** - New method that stores video files directly in the MySQL database as LONGBLOB data

## Database Schema

The Video model has been updated with new fields to support file uploads:

- `videoFile` - LONGBLOB column that stores the actual video file data
- `fileName` - Original filename of the uploaded video
- `fileSize` - Size of the video file in bytes
- `mimeType` - MIME type of the video file
- `uploadType` - ENUM field indicating whether the video is stored as 'url' or 'file'

## Frontend Implementation

### Upload Page

The upload page now includes:
- A file input field for direct video uploads
- Logic to handle either URL or file uploads
- File validation and size display
- Disabled URL field when a file is selected

### Video Player

The video player component has been updated to:
- Detect locally stored videos (uploadType = 'file')
- Use the new `/api/v1/videos/:id/file` endpoint for serving local videos
- Continue supporting URL-based videos as before

## Backend Implementation

### API Endpoints

1. **POST /api/v1/videos** - For file uploads (protected by auth and admin middleware)
   - Accepts multipart/form-data
   - Stores video file in MySQL LONGBLOB column
   - Returns video metadata

2. **GET /api/v1/videos/:id/file** - For serving video files
   - Streams video data from MySQL LONGBLOB
   - Supports HTTP range requests for smooth playback
   - Sets appropriate content headers

### File Handling

- Uses Multer with memory storage for handling file uploads
- 500MB file size limit
- Video file type validation
- Range request support for video streaming

## Usage Instructions

### Uploading a Video File

1. Navigate to the Admin Upload page
2. Fill in the video title, description, and category
3. Select a video file using the "Upload Video File" input
4. Optionally provide a custom thumbnail URL
5. Click "Upload Video"

### Uploading a Video URL

1. Navigate to the Admin Upload page
2. Fill in the video title, description, and category
3. Enter a valid YouTube, Vimeo, or direct video URL
4. Thumbnail will be auto-generated for YouTube/Vimeo videos
5. Click "Upload Video"

## Technical Details

### MySQL LONGBLOB Storage

- Video files are stored directly in the MySQL database using LONGBLOB columns
- This approach eliminates the need for external file storage services
- Supports videos up to 4GB in size (MySQL LONGBLOB limit)
- Videos are served with proper HTTP headers for streaming

### Video Streaming

- HTTP range request support for smooth video playback
- Proper MIME type handling
- Content-Length headers for accurate progress tracking
- Efficient memory usage during streaming

## Limitations

- Maximum file size: 500MB (configurable in multer settings)
- Only video files are accepted (no images or other file types)
- Large files may impact database performance
- No compression or transcoding is performed

## Security Considerations

- File type validation to prevent malicious uploads
- Authentication and authorization required for uploads
- Admin-only access to upload functionality
- Proper error handling and validation