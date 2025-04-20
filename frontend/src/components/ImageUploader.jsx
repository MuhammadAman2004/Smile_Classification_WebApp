import React, { useState } from "react";

function ImageUploader({ onUpload }) {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0 file:text-sm file:font-semibold
                  file:bg-blue-500 file:text-white hover:file:bg-blue-600 cursor-pointer"
      />
      {preview && (
        <img
          src={preview}
          alt="Uploaded Preview"
          className="mt-4 rounded-xl border shadow w-full object-contain"
        />
      )}
    </div>
  );
}

export default ImageUploader;
