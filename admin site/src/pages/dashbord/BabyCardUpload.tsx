import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { babyAPI, BabyInfo, Measurement } from "../../services/api";
import { ocrService } from "../../services/ocr";

export const BabyCardUpload: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Baby info
  const [babyInfo, setBabyInfo] = useState<BabyInfo>({
    firstName: "",
    lastName: "",
    birthDate: "",
    sex: "female",
    motherName: "",
  });

  // Image
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  // Measurement
  const [measurement, setMeasurement] = useState({
    heightCm: "",
    weightKg: "",
    measurementDate: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleBabyInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setBabyInfo({ ...babyInfo, [e.target.name]: e.target.value });
  };

  const handleMeasurementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setMeasurement({ ...measurement, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    setIsProcessing(true);
    try {
      const extracted = await ocrService.extractFromImage(file);
      setOcrResult(extracted);

      if (extracted.confidence > 0.5) {
        setMeasurement({
          ...measurement,
          heightCm: extracted.heightCm?.toString() || measurement.heightCm,
          weightKg: extracted.weightKg?.toString() || measurement.weightKg,
          measurementDate:
            extracted.measurementDate || measurement.measurementDate,
        });
      }
      setStep(3);
    } catch (err) {
      setError("OCR failed. Please enter manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !imageFile ||
      !babyInfo.firstName ||
      !babyInfo.birthDate ||
      !babyInfo.motherName ||
      !measurement.heightCm ||
      !measurement.weightKg
    ) {
      setError("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const result = await babyAPI.uploadBabyCard(
        imageFile,
        babyInfo,
        {
          heightCm: parseFloat(measurement.heightCm),
          weightKg: parseFloat(measurement.weightKg),
          measurementDate: measurement.measurementDate,
          notes: measurement.notes,
        },
        ocrResult,
      );

      navigate(`/baby/${result.babyId}`);
    } catch (err) {
      setError("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Baby Card</h1>

      {/* Steps */}
      <div className="flex mb-6">
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`flex-1 text-center py-2 ${step >= s ? "bg-blue-600 text-white" : "bg-gray-200"}`}
          >
            Step {s}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}

      {/* Step 1: Baby Info */}
      {step === 1 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Baby Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="firstName"
              placeholder="First Name *"
              value={babyInfo.firstName}
              onChange={handleBabyInfoChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={babyInfo.lastName}
              onChange={handleBabyInfoChange}
              className="w-full border p-2 rounded"
            />
            <input
              type="date"
              name="birthDate"
              value={babyInfo.birthDate}
              onChange={handleBabyInfoChange}
              className="w-full border p-2 rounded"
            />
            <select
              name="sex"
              value={babyInfo.sex}
              onChange={handleBabyInfoChange}
              className="w-full border p-2 rounded"
            >
              <option value="female">Female</option>
              <option value="male">Male</option>
            </select>
            <input
              type="text"
              name="motherName"
              placeholder="Mother's Name *"
              value={babyInfo.motherName}
              onChange={handleBabyInfoChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <button
            onClick={() => setStep(2)}
            className="mt-6 w-full bg-blue-600 text-white py-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: Upload */}
      {step === 2 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Upload Chart Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full"
            disabled={isProcessing}
          />
          {isProcessing && (
            <p className="mt-2 text-blue-600">Processing image...</p>
          )}
          {imagePreview && (
            <img src={imagePreview} alt="Preview" className="mt-4 max-h-48" />
          )}
          <button
            onClick={() => setStep(1)}
            className="mt-4 px-4 py-2 border rounded"
          >
            Back
          </button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold mb-2">Baby Info</h2>
            <p>
              {babyInfo.firstName} {babyInfo.lastName}
            </p>
            <p>Born: {babyInfo.birthDate}</p>
            <p>Mother: {babyInfo.motherName}</p>
          </div>

          {ocrResult && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="font-semibold">
                OCR Detected ({(ocrResult.confidence * 100).toFixed(0)}%
                confidence)
              </p>
              {ocrResult.heightCm && <p>Height: {ocrResult.heightCm} cm</p>}
              {ocrResult.weightKg && <p>Weight: {ocrResult.weightKg} kg</p>}
              {ocrResult.measurementDate && (
                <p>Date: {ocrResult.measurementDate}</p>
              )}
            </div>
          )}

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="font-semibold mb-4">Measurements</h2>
            <div className="space-y-4">
              <input
                type="number"
                name="heightCm"
                placeholder="Height (cm) *"
                value={measurement.heightCm}
                onChange={handleMeasurementChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="number"
                name="weightKg"
                placeholder="Weight (kg) *"
                value={measurement.weightKg}
                onChange={handleMeasurementChange}
                className="w-full border p-2 rounded"
              />
              <input
                type="date"
                name="measurementDate"
                value={measurement.measurementDate}
                onChange={handleMeasurementChange}
                className="w-full border p-2 rounded"
              />
              <textarea
                name="notes"
                placeholder="Notes"
                value={measurement.notes}
                onChange={handleMeasurementChange}
                className="w-full border p-2 rounded"
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 border py-2 rounded"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 rounded disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Baby Card"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
