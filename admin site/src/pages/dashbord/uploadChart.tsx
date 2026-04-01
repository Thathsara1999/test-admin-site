import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const UploadChart: React.FC<{ childId: string }> = ({ childId }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      setError(null);

      // 1️⃣ Upload to Firebase Storage
      const storageRef = ref(storage, `charts/${Date.now()}-${file.name}`);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // 2️⃣ Call Cloud Function (onRequest endpoint)
      const response = await fetch(
        "https://us-central1-child-health-system-6ba6d.cloudfunctions.net/extractChartData",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            imageUrl,
            childId,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            handleUpload(e.target.files[0]);
          }
        }}
      />

      {loading && <p>Processing...</p>}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default UploadChart;
