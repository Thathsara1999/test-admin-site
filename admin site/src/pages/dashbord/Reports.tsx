import React, { useState } from "react";
import { Upload, FileText, Download, Trash2 } from "lucide-react";

interface Document {
  name: string;
  date: string;
  type: string;
  url?: string; // Optional URL for download
}

export default function Records() {
  const [documents, setDocuments] = useState<Document[]>([
    {
      name: "Vaccination Card.pdf",
      date: "Jan 10, 2026",
      type: "PDF",
      url: "#",
    },
    { name: "Lab Results.pdf", date: "Dec 15, 2025", type: "PDF", url: "#" },
  ]);

  // Upload new documents
  const handleUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newDocs = Array.from(event.target.files).map((file) => ({
        name: file.name,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        type: file.name.split(".").pop()?.toUpperCase() || "File",
        url: URL.createObjectURL(file),
      }));
      setDocuments((prev) => [...newDocs, ...prev]);
    }
  };

  // Delete a document by index
  const handleDelete = (index: number) => {
    setDocuments((prev) => prev.filter((_, idx) => idx !== index));
  };

  return (
    <div className="p-6">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <label className="w-full cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">
              Upload Medical Documents
            </p>
            <p className="text-sm text-gray-500">PDF, JPG, PNG</p>
          </div>
          <input
            type="file"
            multiple
            className="hidden"
            onChange={handleUpload}
          />
        </label>
      </div>

      {/* Documents List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition flex flex-col justify-between"
          >
            <div className="bg-blue-100 rounded-lg h-32 flex items-center justify-center mb-3">
              <FileText className="w-12 h-12 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-800 truncate">{doc.name}</p>
              <p className="text-sm text-gray-600">{doc.date}</p>
              <p className="text-xs text-gray-500 mt-1">{doc.type}</p>
            </div>
            {/* Action Buttons */}
            <div className="mt-3 flex space-x-2">
              {doc.url && (
                <a
                  href={doc.url}
                  download={doc.name}
                  className="flex items-center px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </a>
              )}
              <button
                onClick={() => handleDelete(idx)}
                className="flex items-center px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
