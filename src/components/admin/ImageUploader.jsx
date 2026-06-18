import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, X, Loader2, GripVertical } from 'lucide-react';
import { uploadToCloudinary } from '../../config/cloudinary';
import { toast } from 'react-toastify';

/**
 * ImageUploader component handles drag & drop, previews, and uploading to Cloudinary
 * It manages its own internal upload state and then passes the final URLs back up to the parent.
 */
const ImageUploader = ({ existingImages = [], onImagesUpdate }) => {
  const [localFiles, setLocalFiles] = useState([]); // Files selected but not uploaded
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const onDrop = useCallback((acceptedFiles) => {
    // Generate preview URLs for the accepted files
    const newFiles = acceptedFiles.map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));
    setLocalFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const removeLocalFile = (index) => {
    const newFiles = [...localFiles];
    URL.revokeObjectURL(newFiles[index].preview);
    newFiles.splice(index, 1);
    setLocalFiles(newFiles);
  };

  const removeExistingImage = (index) => {
    const newExisting = [...existingImages];
    newExisting.splice(index, 1);
    onImagesUpdate(newExisting);
  };

  const handleUploadFiles = async () => {
    if (localFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);
    const uploadedUrls = [];
    let hasError = false;

    for (let i = 0; i < localFiles.length; i++) {
      try {
        const file = localFiles[i];
        console.log(`[ImageUploader] Uploading ${file.name}...`);
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
        setUploadProgress(Math.round(((i + 1) / localFiles.length) * 100));
      } catch (error) {
        console.error(`[ImageUploader] Failed to upload ${localFiles[i].name}`, error);
        toast.error(`${localFiles[i].name}: ${error.message}`);
        hasError = true;
      }
    }

    if (!hasError && uploadedUrls.length > 0) {
      toast.success("Images uploaded successfully!");
    } else if (hasError && uploadedUrls.length > 0) {
      toast.info("Some images uploaded, but some failed.");
    }

    // Clean up local previews
    localFiles.forEach(file => URL.revokeObjectURL(file.preview));
    
    // Pass URLs back up
    onImagesUpdate([...existingImages, ...uploadedUrls]);
    
    // Clear local state
    setLocalFiles([]);
    setUploading(false);
  };

  return (
    <div className="space-y-4">
      {/* Existing Images Display */}
      {existingImages.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Currently Uploaded Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {existingImages.map((url, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-50">
                <div className="absolute top-2 left-2 z-10 cursor-move bg-white/80 p-1 rounded backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity text-gray-500">
                   <GripVertical className="w-4 h-4" />
                </div>
                <img src={url} alt={`Uploaded ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(idx)}
                  className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-md opacity-0 group-hover:opacity-100 transition-all shadow-sm"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dropzone Area */}
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
          isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <UploadCloud className={`mx-auto h-10 w-10 mb-3 transition-colors ${isDragActive ? 'text-primary' : 'text-gray-400'}`} />
        <p className="text-base font-medium text-gray-700 mb-1">
          {isDragActive ? "Drop the images here..." : "Drag & drop images, or click to select"}
        </p>
        <p className="text-xs text-gray-500">PNG, JPG, WEBP up to 10MB each</p>
      </div>

      {/* Local Files Preview (Not yet uploaded) */}
      {localFiles.length > 0 && (
        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold text-orange-800">Ready to Upload ({localFiles.length})</h4>
            <button
              type="button"
              onClick={handleUploadFiles}
              disabled={uploading}
              className="flex items-center px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors shadow-sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading... {uploadProgress}%
                </>
              ) : (
                <>
                  <UploadCloud className="w-4 h-4 mr-2" /> Start Upload
                </>
              )}
            </button>
          </div>
          
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {localFiles.map((file, idx) => (
              <div key={file.name + idx} className="relative rounded-lg overflow-hidden border border-orange-200 aspect-square opacity-70 group">
                <img src={file.preview} alt="preview" className="w-full h-full object-cover" />
                {!uploading && (
                  <button
                    type="button"
                    onClick={() => removeLocalFile(idx)}
                    className="absolute top-1 right-1 p-1 bg-white hover:bg-red-50 text-red-500 rounded border border-red-100 shadow-sm transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
          
          {uploading && (
             <div className="w-full h-1.5 bg-orange-200 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
             </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
