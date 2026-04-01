interface JsonDisplayProps {
  data: Record<string, any>;
}

export default function JsonDisplay({ data }: JsonDisplayProps) {
  const jsonString = JSON.stringify(data, null, 2);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([jsonString], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `chart-data-${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    alert("JSON copied to clipboard!");
  };

  return (
    <div className="space-y-4">
      {/* JSON Display */}
      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-96 font-mono text-sm leading-relaxed">
        <pre>{jsonString}</pre>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          ⬇️ Download
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          📋 Copy
        </button>
      </div>

      {/* Metadata */}
      {data.metadata && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Metadata</h3>
          <dl className="text-sm text-blue-800 space-y-1">
            {Object.entries(data.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <dt className="font-medium capitalize">{key}:</dt>
                <dd>{String(value)}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
