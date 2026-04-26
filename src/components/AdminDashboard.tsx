import React, { useState, useEffect } from 'react';
import { Upload, Trash2, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { GalleryImage } from '../types';
import { api, API_BASE_URL } from '../utils/api';


interface AdminDashboardProps {
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      const images = await api.getGalleryImages();
      setGalleryImages(images);
    } catch (error) {
      console.error('Failed to load gallery images:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const CLOUDINARY_CLOUD_NAME = 'dcz6nm2bf';
  const CLOUDINARY_UPLOAD_PRESET = 'nstars_gallery';

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedFile) return;

    setUploading(true);
    try {
      // ── Step 1: Upload directly from browser → Cloudinary (no server needed) ──
      const cloudFormData = new FormData();
      cloudFormData.append('file', selectedFile);
      cloudFormData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      cloudFormData.append('folder', 'nstars-gallery');

      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: cloudFormData }
      );

      if (!cloudRes.ok) {
        const errText = await cloudRes.text();
        throw new Error(`Cloudinary error: ${errText}`);
      }

      let cloudData;
      const cloudText = await cloudRes.text();
      try {
        cloudData = cloudText ? JSON.parse(cloudText) : {};
      } catch (e) {
        throw new Error(`Failed to parse Cloudinary response as JSON. Status: ${cloudRes.status}. Response: ${cloudText.slice(0, 100)}`);
      }

      if (cloudData.error) {
        throw new Error(cloudData.error.message);
      }

      // ── Step 2: Save the Cloudinary URL + description to our server ──────────
      const saveRes = await fetch(`${API_BASE_URL}/admin/gallery/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: description || 'No description',
          image_path: cloudData.secure_url,
          cloudinary_id: cloudData.public_id,
        }),
      });

      let saveData;
      const responseText = await saveRes.text();
      
      try {
        saveData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        throw new Error(`Failed to parse server response as JSON. Status: ${saveRes.status} ${saveRes.statusText}. Response: ${responseText.slice(0, 100)}`);
      }

      if (!saveRes.ok || !saveData.success) {
        throw new Error(saveData.message || `Server error: ${saveRes.status} ${saveRes.statusText}`);
      }

      setDescription('');
      setSelectedFile(null);
      setPreviewUrl(null);
      loadGalleryImages();
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload error details:', error);
      alert('Upload failed: ' + (error instanceof Error ? error.message : String(error)));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const result = await api.deleteGalleryImage(imageId);

      if (result.success) {
        loadGalleryImages();
        alert('Image deleted successfully!');
      } else {
        alert('Delete failed: ' + result.message);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Delete failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage:
            'url("https://images.pexels.com/photos/7045558/pexels-photo-7045558.jpeg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-85"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="bg-black shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Site</span>
            </button>
            <h1 className="text-2xl font-bold flex-1 text-center" style={{ fontFamily: 'Garamond, serif' }}>
              Admin Dashboard - Gallery Management
            </h1>
            <div className="w-24"></div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Upload Section */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ fontFamily: 'Garamond, serif' }}>
              <Upload className="mr-3" />
              Upload New Image
            </h2>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Image Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  rows={3}
                  placeholder="Enter image description..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-yellow-500 file:text-black hover:file:bg-yellow-600"
                  required
                />
              </div>

              {previewUrl && (
                <div>
                  <label className="block text-sm font-medium mb-2">Preview</label>
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-48 h-36 object-cover rounded-md border border-gray-600"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={uploading || !selectedFile}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-600 text-black font-bold py-3 px-6 rounded-lg transition-all duration-300 flex items-center"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2" size={16} />
                    Upload Image
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Gallery Management */}
          <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ fontFamily: 'Garamond, serif' }}>
              <ImageIcon className="mr-3" />
              Gallery Images ({galleryImages.length})
            </h2>

            {galleryImages.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No images in gallery yet.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleryImages.map((image) => (
                  <div
                    key={image.id}
                    className="bg-gray-800 rounded-lg overflow-hidden border border-gray-600 hover:border-yellow-400 transition-all duration-300"
                  >
                    <img
                      src={image.image_path}
                      alt={image.description}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <p className="text-sm text-gray-300 mb-3 line-clamp-2">{image.description}</p>
                      <button
                        onClick={() => handleDelete(image.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm flex items-center transition-colors"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
