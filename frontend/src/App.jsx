import React, { useState } from "react";
import axios from "axios";
import ImageUploader from "./components/ImageUploader";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

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
    } catch (error) {
      console.error("Prediction failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 p-6 font-sans">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Smile Classification
        </h1>

        <ImageUploader onUpload={handleImageUpload} />

        {loading && (
          <p className="text-center text-blue-500 mt-4">Processing...</p>
        )}

        {result && (
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-700">
                Prediction Result
              </h2>
              <p className="text-lg mt-2">
                <strong className="text-blue-600">
                  {result.predicted_class}
                </strong>{" "}
                <br />
                Confidence: {(result.confidence * 100).toFixed(2)}%
              </p>
            </div>

            <div className="mt-4">
              <h3 className="text-gray-600 font-medium mb-2">
                All Class Probabilities:
              </h3>
              <ul className="space-y-1">
                {Object.entries(result.all_probabilities).map(([cls, prob]) => (
                  <li key={cls} className="flex justify-between">
                    <span>{cls}</span>
                    <span>{(prob * 100).toFixed(2)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
