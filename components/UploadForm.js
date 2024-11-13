// components/UploadForm.js
import React, { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState(null);
  const [mediaType, setMediaType] = useState("image");
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64File = reader.result;

      const fileName = `${Date.now()}-${file.name}`;

      const response = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ file: base64File, fileName, mediaType }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("File uploaded successfully!");
      } else {
        alert("Upload failed");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">Upload Image or Video</h2>
      <div className="flex flex-col space-y-4">
        <input type="file" onChange={handleFileChange} />
        {preview && (
          <img src={preview} alt="Preview" className="w-full h-auto" />
        )}
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <button
          onClick={handleUpload}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Upload
        </button>
      </div>
    </div>
  );
}
