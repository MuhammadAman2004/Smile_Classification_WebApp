import React, { useState } from "react";
import axios from "axios";
import ImageUploader from "./components/ImageUploader";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [selectedTab, setSelectedTab] = useState(null);

  const classes = [
    "consonant",
    "not available",
    "reverse- non consonant",
    "straight- non consonant",
  ];

  const formatClassName = (className) => {
    const words = className.split(/[- ]+/);
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploadedImage(URL.createObjectURL(file));

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8000/predict",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setResult(response.data);
      setSelectedTab(response.data.predicted_class);
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Smile Classification
        </h1>

        <ImageUploader onUpload={handleImageUpload} />

        {loading && (
          <div className="flex justify-center items-center my-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}

        {uploadedImage && (
          <div className="mt-8">
            <div className="flex justify-center space-x-8">
              <div className="relative">
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-64 h-64 object-cover rounded-lg shadow-md"
                />
                <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 rounded-t-lg">
                  Uploaded Image
                </div>
              </div>
              {result && (
                <div className="relative">
                  <img
                    src={uploadedImage}
                    alt="Predicted"
                    className="w-64 h-64 object-cover rounded-lg shadow-md"
                  />
                  <div className="absolute top-0 left-0 right-0 bg-black bg-opacity-50 text-white text-center py-2 rounded-t-lg">
                    Predicted: {formatClassName(result.predicted_class)}
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div className="mt-8">
                <div className="flex justify-center mb-8">
                  <div className="inline-flex border border-gray-300 rounded-lg overflow-hidden">
                    {classes.map((cls, index) => (
                      <div
                        key={cls}
                        // onClick={() => setSelectedTab(cls)}
                        className={`px-4 py-2 text-sm cursor-pointer ${
                          selectedTab === cls
                            ? "bg-green-500 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        } ${
                          index !== classes.length - 1
                            ? "border-r border-gray-300"
                            : ""
                        }`}
                      >
                        {formatClassName(cls)}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center items-center space-x-8">
                  <div className="relative w-32 h-32">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="3"
                      />
                      <path
                        d="M18 2.0845
                          a 15.9155 15.9155 0 0 1 0 31.831
                          a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="#10B981"
                        strokeWidth="3"
                        strokeDasharray={`${result.confidence * 100}, 100`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-700">
                        {(result.confidence * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 select-none">
                    {Object.entries(result.all_probabilities).map(
                      ([cls, prob]) => (
                        <div key={cls} className="flex items-center space-x-2">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              cls === result.predicted_class
                                ? "bg-green-500"
                                : "bg-gray-300"
                            }`}
                          />
                          <span className="text-gray-700">
                            {formatClassName(cls)}
                          </span>
                          <span className="text-gray-500">
                            {(prob * 100).toFixed(1)}%
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
