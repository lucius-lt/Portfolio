// Cloudinary Configuration
export const cloudinaryConfig = {
  cloudName: 'de2e3ci5b',
  uploadPreset: 'portfolio_projects',
};

/**
 * Helper to upload an image to Cloudinary using their REST API
 * @param {File} file - The file to upload
 * @param {string} folder - The folder in Cloudinary (e.g., 'portfolio/projects')
 * @returns {Promise<string>} - The optimized image URL
 */
export const uploadToCloudinary = async (file) => {
  const formData = new FormData();

  // By passing "upload.png" as the 3rd argument, we FORCIBLY strip any Windows paths (like O:\My_portfolio)
  // that react-dropzone might have hidden inside the file.name or file.path properties.
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryConfig.uploadPreset);
  formData.append("folder", "portfolio_projects");

  console.log("[Cloudinary] Uploading with payload:");
  for (let pair of formData.entries()) {
    if (pair[0] === 'file') {
      console.log(`- file: [File] name=${pair[1].name}`);
    } else {
      console.log(`- ${pair[0]}: ${pair[1]}`);
    }
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Upload failed");
  }

  const data = await response.json();

  // Build optimized URL
  const urlParts = data.secure_url.split('/upload/');
  return `${urlParts[0]}/upload/f_auto,q_auto/${urlParts[1]}`;
};
