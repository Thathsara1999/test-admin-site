import { useState, useRef, useEffect } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../../firebase";
import { toast } from "react-toastify";

interface ChartUploadProps {
  onUpload: (data: Record<string, any>) => void;
  onLoading: (loading: boolean) => void;
  isLoading: boolean;
  childId?: string;
}

interface DataPoint {
  id: string;
  pixelX: number;
  pixelY: number;
  actualX: number;
  actualY: number;
  percentile: string;
}

interface CalibrationPoint {
  x: number;
  y: number;
  valueX: number;
  valueY: number;
}

const CHART_TYPES = [
  {
    value: "who_baby_weight",
    label: "WHO Baby Weight Chart",
    xLabel: "Age (months)",
    yLabel: "Weight (kg)",
    defaultXMin: 0,
    defaultXMax: 60,
    defaultYMin: 0,
    defaultYMax: 20,
  },
  {
    value: "who_baby_height",
    label: "WHO Baby Height Chart",
    xLabel: "Age (months)",
    yLabel: "Height (cm)",
    defaultXMin: 0,
    defaultXMax: 60,
    defaultYMin: 40,
    defaultYMax: 100,
  },
  {
    value: "baby_bmi",
    label: "Baby BMI Chart",
    xLabel: "Age (months)",
    yLabel: "BMI",
    defaultXMin: 0,
    defaultXMax: 60,
    defaultYMin: 10,
    defaultYMax: 30,
  },
  {
    value: "custom",
    label: "Custom Chart Data",
    xLabel: "X Axis",
    yLabel: "Y Axis",
    defaultXMin: 0,
    defaultXMax: 100,
    defaultYMin: 0,
    defaultYMax: 100,
  },
];

const PERCENTILES = [
  "97th",
  "95th",
  "90th",
  "85th",
  "75th",
  "50th",
  "25th",
  "15th",
  "10th",
  "5th",
  "3rd",
];

export default function ChartUpload({
  onUpload,
  onLoading,
  isLoading,
  childId,
}: ChartUploadProps) {
  const [chartType, setChartType] = useState("who_baby_weight");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [activeTab, setActiveTab] = useState<"table" | "json">("table");
  const [showJsonModal, setShowJsonModal] = useState(false);

  // Calibration points
  const [calibrationMode, setCalibrationMode] = useState<
    "none" | "bottomLeft" | "topRight"
  >("none");
  const [bottomLeftPoint, setBottomLeftPoint] =
    useState<CalibrationPoint | null>(null);
  const [topRightPoint, setTopRightPoint] = useState<CalibrationPoint | null>(
    null,
  );

  // Current selection
  const [selectedPercentile, setSelectedPercentile] = useState("50th");
  const [showCalibrationDialog, setShowCalibrationDialog] = useState(false);
  const [tempCalibrationValues, setTempCalibrationValues] = useState({
    x: 0,
    y: 0,
  });
  const [pendingCalibrationClick, setPendingCalibrationClick] = useState<{
    pixelX: number;
    pixelY: number;
  } | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const selectedChartType =
    CHART_TYPES.find((t) => t.value === chartType) || CHART_TYPES[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = ["image/png", "image/jpeg", "image/jpg"].includes(
      file.type,
    );

    if (!isImage) {
      setError("Please upload a PNG, JPG, or JPEG image file");
      return;
    }

    setSelectedFile(file);
    setDataPoints([]);
    setBottomLeftPoint(null);
    setTopRightPoint(null);
    setError("");
    setActiveTab("table");
    setShowJsonModal(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target?.result as string);
      toast.info("Image loaded. Please calibrate the chart first.");
    };
    reader.readAsDataURL(file);
  };

  // Draw image on canvas with all points
  useEffect(() => {
    if (!canvasRef.current || !imageUrl) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // Draw calibration points
      if (bottomLeftPoint) {
        ctx.beginPath();
        ctx.arc(bottomLeftPoint.x, bottomLeftPoint.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
        ctx.fill();
        ctx.strokeStyle = "green";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.shadowBlur = 0;
        ctx.fillText(
          `(${bottomLeftPoint.valueX}, ${bottomLeftPoint.valueY})`,
          bottomLeftPoint.x + 10,
          bottomLeftPoint.y - 5,
        );
      }

      if (topRightPoint) {
        ctx.beginPath();
        ctx.arc(topRightPoint.x, topRightPoint.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
        ctx.fill();
        ctx.strokeStyle = "blue";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "white";
        ctx.font = "bold 14px Arial";
        ctx.fillText(
          `(${topRightPoint.valueX}, ${topRightPoint.valueY})`,
          topRightPoint.x + 10,
          topRightPoint.y - 5,
        );
      }

      // Draw data points
      dataPoints.forEach((point) => {
        ctx.beginPath();
        ctx.arc(point.pixelX, point.pixelY, 6, 0, 2 * Math.PI);

        // Color based on percentile
        if (
          point.percentile.includes("97") ||
          point.percentile.includes("95")
        ) {
          ctx.fillStyle = "rgba(255, 0, 0, 0.7)";
        } else if (
          point.percentile.includes("90") ||
          point.percentile.includes("85")
        ) {
          ctx.fillStyle = "rgba(255, 165, 0, 0.7)";
        } else if (point.percentile.includes("75")) {
          ctx.fillStyle = "rgba(255, 215, 0, 0.7)";
        } else if (point.percentile.includes("50")) {
          ctx.fillStyle = "rgba(0, 255, 0, 0.7)";
        } else if (point.percentile.includes("25")) {
          ctx.fillStyle = "rgba(173, 216, 230, 0.7)";
        } else {
          ctx.fillStyle = "rgba(0, 0, 255, 0.7)";
        }

        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Show values
        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.shadowBlur = 0;
        ctx.fillText(
          `${point.actualX.toFixed(1)}, ${point.actualY.toFixed(1)}`,
          point.pixelX + 8,
          point.pixelY - 5,
        );
      });
    };
    img.src = imageUrl;
  }, [imageUrl, bottomLeftPoint, topRightPoint, dataPoints]);

  // Algorithm: Convert pixel coordinates to actual chart values using linear interpolation
  const pixelToActual = (
    pixelX: number,
    pixelY: number,
  ): { x: number; y: number } => {
    if (!bottomLeftPoint || !topRightPoint) {
      return { x: 0, y: 0 };
    }

    // Linear interpolation formula
    const xPercent =
      (pixelX - bottomLeftPoint.x) / (topRightPoint.x - bottomLeftPoint.x);
    const yPercent =
      1 - (pixelY - bottomLeftPoint.y) / (topRightPoint.y - bottomLeftPoint.y);

    const actualX =
      bottomLeftPoint.valueX +
      xPercent * (topRightPoint.valueX - bottomLeftPoint.valueX);
    const actualY =
      bottomLeftPoint.valueY +
      yPercent * (topRightPoint.valueY - bottomLeftPoint.valueY);

    return {
      x: Math.max(
        selectedChartType.defaultXMin,
        Math.min(selectedChartType.defaultXMax, actualX),
      ),
      y: Math.max(
        selectedChartType.defaultYMin,
        Math.min(selectedChartType.defaultYMax, actualY),
      ),
    };
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    const pixelX = (e.clientX - rect.left) * scaleX;
    const pixelY = (e.clientY - rect.top) * scaleY;

    if (calibrationMode === "bottomLeft") {
      setShowCalibrationDialog(true);
      setTempCalibrationValues({
        x: selectedChartType.defaultXMin,
        y: selectedChartType.defaultYMin,
      });
      setPendingCalibrationClick({ pixelX, pixelY });
      return;
    }

    if (calibrationMode === "topRight") {
      setShowCalibrationDialog(true);
      setTempCalibrationValues({
        x: selectedChartType.defaultXMax,
        y: selectedChartType.defaultYMax,
      });
      setPendingCalibrationClick({ pixelX, pixelY });
      return;
    }

    // Normal mode - add data point
    if (bottomLeftPoint && topRightPoint) {
      const actualValues = pixelToActual(pixelX, pixelY);

      const newPoint: DataPoint = {
        id: Date.now().toString(),
        pixelX,
        pixelY,
        actualX: actualValues.x,
        actualY: actualValues.y,
        percentile: selectedPercentile,
      };

      setDataPoints([...dataPoints, newPoint]);
      toast.success(
        `Added point: ${actualValues.x.toFixed(1)}, ${actualValues.y.toFixed(1)}`,
      );
    } else {
      toast.error(
        "Please calibrate the chart first (set bottom-left and top-right points)",
      );
    }
  };

  const handleCalibrationConfirm = () => {
    if (!pendingCalibrationClick) return;

    const { pixelX, pixelY } = pendingCalibrationClick;

    if (calibrationMode === "bottomLeft") {
      setBottomLeftPoint({
        x: pixelX,
        y: pixelY,
        valueX: tempCalibrationValues.x,
        valueY: tempCalibrationValues.y,
      });
      setCalibrationMode("none");
      toast.success("Bottom-left calibration point set!");
    } else if (calibrationMode === "topRight") {
      setTopRightPoint({
        x: pixelX,
        y: pixelY,
        valueX: tempCalibrationValues.x,
        valueY: tempCalibrationValues.y,
      });
      setCalibrationMode("none");
      toast.success("Top-right calibration point set!");
    }

    setShowCalibrationDialog(false);
    setPendingCalibrationClick(null);
  };

  const startCalibration = (mode: "bottomLeft" | "topRight") => {
    if (!imageUrl) {
      toast.error("Please upload an image first");
      return;
    }
    setCalibrationMode(mode);
    toast.info(
      `Click on the ${mode === "bottomLeft" ? "bottom-left" : "top-right"} corner of the chart area`,
    );
  };

  const deletePoint = (id: string) => {
    setDataPoints(dataPoints.filter((p) => p.id !== id));
    toast.info("Point deleted");
  };

  // Algorithm: Generate structured JSON from extracted points
  const getJsonData = () => {
    // Group points by percentile
    const pointsByPercentile: Record<
      string,
      { age_months: number; value: number }[]
    > = {};
    dataPoints.forEach((point) => {
      if (!pointsByPercentile[point.percentile]) {
        pointsByPercentile[point.percentile] = [];
      }
      pointsByPercentile[point.percentile].push({
        age_months: point.actualX,
        value: point.actualY,
      });
    });

    // Sort each percentile group by age
    Object.keys(pointsByPercentile).forEach((percentile) => {
      pointsByPercentile[percentile].sort(
        (a, b) => a.age_months - b.age_months,
      );
    });

    // Calculate statistics
    const allX = dataPoints.map((p) => p.actualX);
    const allY = dataPoints.map((p) => p.actualY);

    return {
      chartType: chartType,
      chartInfo: {
        xAxis: selectedChartType.xLabel,
        yAxis: selectedChartType.yLabel,
        xRange: [selectedChartType.defaultXMin, selectedChartType.defaultXMax],
        yRange: [selectedChartType.defaultYMin, selectedChartType.defaultYMax],
        calibrationPoints: {
          bottomLeft: bottomLeftPoint
            ? {
                pixelX: bottomLeftPoint.x,
                pixelY: bottomLeftPoint.y,
                valueX: bottomLeftPoint.valueX,
                valueY: bottomLeftPoint.valueY,
              }
            : null,
          topRight: topRightPoint
            ? {
                pixelX: topRightPoint.x,
                pixelY: topRightPoint.y,
                valueX: topRightPoint.valueX,
                valueY: topRightPoint.valueY,
              }
            : null,
        },
      },
      totalPoints: dataPoints.length,
      pointsByPercentile: pointsByPercentile,
      allDataPoints: dataPoints.map((p) => ({
        age_months: Number(p.actualX.toFixed(2)),
        value: Number(p.actualY.toFixed(2)),
        percentile: p.percentile,
      })),
      statistics: {
        minAge: Math.min(...allX).toFixed(2),
        maxAge: Math.max(...allX).toFixed(2),
        minValue: Math.min(...allY).toFixed(2),
        maxValue: Math.max(...allY).toFixed(2),
        avgValue: (allY.reduce((a, b) => a + b, 0) / allY.length).toFixed(2),
      },
      metadata: {
        source: "manual_extraction",
        fileName: selectedFile?.name || null,
        imageUrl: imageUrl || null,
        extractedAt: new Date().toISOString(),
        childId: childId || null,
        totalPointsExtracted: dataPoints.length,
        percentilesFound: Array.from(
          new Set(dataPoints.map((p) => p.percentile)),
        ),
      },
      createdAt: new Date().toISOString(),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (dataPoints.length === 0) {
      setError("Please add at least one data point");
      return;
    }

    if (!bottomLeftPoint || !topRightPoint) {
      setError("Please calibrate the chart first");
      return;
    }

    onLoading(true);

    try {
      let imageUrl_storage = null;
      if (selectedFile) {
        const storageRef = ref(
          storage,
          `charts/${Date.now()}-${selectedFile.name}`,
        );
        await uploadBytes(storageRef, selectedFile);
        imageUrl_storage = await getDownloadURL(storageRef);
      }

      const jsonData = getJsonData();
      const resultData = {
        ...jsonData,
        imageUrl: imageUrl_storage,
      };

      await addDoc(collection(db, "chartData"), {
        ...resultData,
        createdAt: serverTimestamp(),
      });

      onUpload(resultData);
      toast.success(`Saved ${dataPoints.length} data points successfully!`);

      // Show JSON after saving
      setShowJsonModal(true);
    } catch (err: any) {
      setError(err?.message ?? "An unexpected error occurred");
      toast.error(err?.message ?? "Failed to save");
    } finally {
      onLoading(false);
    }
  };

  const resetAll = () => {
    setDataPoints([]);
    setBottomLeftPoint(null);
    setTopRightPoint(null);
    setSelectedFile(null);
    setImageUrl(null);
    setError("");
    setCalibrationMode("none");
    setShowJsonModal(false);
    setActiveTab("table");
    toast.info("All data reset");
  };

  const copyJsonToClipboard = () => {
    const jsonData = getJsonData();
    navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2));
    toast.success("JSON copied to clipboard!");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
        <h2 className="text-xl font-semibold text-blue-900 mb-2">
          📊 Chart Data Extractor
        </h2>
        <p className="text-sm text-blue-800">
          1. Upload a chart image
          <br />
          2. Calibrate by clicking bottom-left and top-right corners
          <br />
          3. Click on data points to extract values
          <br />
          4. Select percentile for each point
          <br />
          5. View JSON and save to database
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Controls */}
          <div className="space-y-4">
            {/* Chart Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {CHART_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Chart Image
              </label>
              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                onChange={handleFileChange}
                disabled={isLoading}
                className="block w-full text-sm text-gray-500 file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              {selectedFile && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ {selectedFile.name}
                </p>
              )}
            </div>

            {/* Calibration Buttons */}
            {imageUrl && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Calibration (Required)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => startCalibration("bottomLeft")}
                    className={`px-3 py-2 text-sm rounded-lg border transition ${
                      bottomLeftPoint
                        ? "bg-green-100 border-green-500 text-green-700"
                        : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {bottomLeftPoint
                      ? "✓ Bottom-Left Set"
                      : "📍 Set Bottom-Left"}
                  </button>
                  <button
                    type="button"
                    onClick={() => startCalibration("topRight")}
                    className={`px-3 py-2 text-sm rounded-lg border transition ${
                      topRightPoint
                        ? "bg-blue-100 border-blue-500 text-blue-700"
                        : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {topRightPoint ? "✓ Top-Right Set" : "📍 Set Top-Right"}
                  </button>
                </div>
                {bottomLeftPoint && topRightPoint && (
                  <p className="text-xs text-green-600">
                    ✓ Calibration complete! Click on the chart to add data
                    points.
                  </p>
                )}
              </div>
            )}

            {/* Percentile Selector */}
            {bottomLeftPoint && topRightPoint && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Percentile for next points
                </label>
                <select
                  value={selectedPercentile}
                  onChange={(e) => setSelectedPercentile(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                >
                  {PERCENTILES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={resetAll}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Reset All
              </button>
              {dataPoints.length > 0 && (
                <>
                  <button
                    type="button"
                    onClick={() => setShowJsonModal(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center gap-2"
                  >
                    <span>{`{ }`}</span>
                    <span>View JSON</span>
                  </button>
                  <button
                    type="button"
                    onClick={copyJsonToClipboard}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
                  >
                    <span>📋</span>
                    <span>Copy JSON</span>
                  </button>
                </>
              )}
              <button
                type="submit"
                disabled={isLoading || dataPoints.length === 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition"
              >
                {isLoading ? "💾 Saving..." : "✨ Save to Database"}
              </button>
            </div>

            {/* Show stats when data exists */}
            {dataPoints.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-3 mt-2">
                <div className="text-sm font-medium text-gray-700">
                  Current Data:
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  {dataPoints.length} points •{" "}
                  {new Set(dataPoints.map((p) => p.percentile)).size}{" "}
                  percentiles
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Canvas */}
          {imageUrl && (
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">
                Chart Preview - Click to add points
              </h3>
              {calibrationMode !== "none" && (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 py-2 rounded-lg mb-2 text-sm">
                  ⚡ Calibration mode: Click on the{" "}
                  {calibrationMode === "bottomLeft"
                    ? "bottom-left"
                    : "top-right"}{" "}
                  corner of the chart
                </div>
              )}
              <div
                className="border rounded-lg overflow-auto bg-white"
                style={{ maxHeight: "500px" }}
              >
                <canvas
                  ref={canvasRef}
                  onClick={handleCanvasClick}
                  className="cursor-crosshair max-w-full h-auto"
                  style={{ display: "block" }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Data Display Section - Always visible when data exists */}
        {dataPoints.length > 0 && (
          <div className="space-y-4">
            <div className="border-b border-gray-200">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setActiveTab("table")}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === "table"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  📊 Table View ({dataPoints.length} points)
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("json")}
                  className={`px-4 py-2 font-medium text-sm transition-colors ${
                    activeTab === "json"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {`{ }`} JSON View
                </button>
              </div>
            </div>

            {/* Table View */}
            {activeTab === "table" && (
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 sticky top-0">
                      <tr>
                        <th className="px-4 py-2 text-left">
                          {selectedChartType.xLabel}
                        </th>
                        <th className="px-4 py-2 text-left">
                          {selectedChartType.yLabel}
                        </th>
                        <th className="px-4 py-2 text-left">Percentile</th>
                        <th className="px-4 py-2 text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataPoints.map((point) => (
                        <tr
                          key={point.id}
                          className="border-b border-gray-100 hover:bg-gray-50"
                        >
                          <td className="px-4 py-2">
                            {point.actualX.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            {point.actualY.toFixed(2)}
                          </td>
                          <td className="px-4 py-2">
                            <span
                              className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                                point.percentile.includes("97") ||
                                point.percentile.includes("95")
                                  ? "bg-red-100 text-red-800"
                                  : point.percentile.includes("90") ||
                                      point.percentile.includes("85")
                                    ? "bg-orange-100 text-orange-800"
                                    : point.percentile.includes("75")
                                      ? "bg-yellow-100 text-yellow-800"
                                      : point.percentile.includes("50")
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {point.percentile}
                            </span>
                          </td>
                          <td className="px-4 py-2">
                            <button
                              type="button"
                              onClick={() => deletePoint(point.id)}
                              className="text-red-600 hover:text-red-800 text-xs"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* JSON View */}
            {activeTab === "json" && (
              <div className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="bg-gray-800 px-4 py-3 flex justify-between items-center">
                  <h4 className="font-medium text-gray-200">
                    Generated JSON Data
                  </h4>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={copyJsonToClipboard}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-2 py-1 rounded transition"
                    >
                      📋 Copy JSON
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowJsonModal(true)}
                      className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded transition"
                    >
                      🔍 Full Screen
                    </button>
                  </div>
                </div>
                <pre className="p-4 overflow-x-auto max-h-96 text-sm font-mono text-gray-300">
                  {JSON.stringify(getJsonData(), null, 2)}
                </pre>
              </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-blue-600">
                  {dataPoints.length}
                </div>
                <div className="text-xs text-blue-800">Total Points</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <div className="text-2xl font-bold text-green-600">
                  {new Set(dataPoints.map((p) => p.percentile)).size}
                </div>
                <div className="text-xs text-green-800">Percentiles</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3">
                <div className="text-sm font-bold text-purple-600">
                  {selectedChartType.xLabel}
                </div>
                <div className="text-xs text-purple-800">
                  {Math.min(...dataPoints.map((p) => p.actualX)).toFixed(1)} -{" "}
                  {Math.max(...dataPoints.map((p) => p.actualX)).toFixed(1)}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-3">
                <div className="text-sm font-bold text-orange-600">
                  {selectedChartType.yLabel}
                </div>
                <div className="text-xs text-orange-800">
                  {Math.min(...dataPoints.map((p) => p.actualY)).toFixed(1)} -{" "}
                  {Math.max(...dataPoints.map((p) => p.actualY)).toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calibration Dialog */}
        {showCalibrationDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold mb-4">
                Enter Calibration Values
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    X Value ({selectedChartType.xLabel})
                  </label>
                  <input
                    type="number"
                    value={tempCalibrationValues.x}
                    onChange={(e) =>
                      setTempCalibrationValues({
                        ...tempCalibrationValues,
                        x: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    step="0.1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Y Value ({selectedChartType.yLabel})
                  </label>
                  <input
                    type="number"
                    value={tempCalibrationValues.y}
                    onChange={(e) =>
                      setTempCalibrationValues({
                        ...tempCalibrationValues,
                        y: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    step="0.1"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setShowCalibrationDialog(false)}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCalibrationConfirm}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* JSON Modal */}
        {showJsonModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="bg-gray-800 px-6 py-4 rounded-t-lg flex justify-between items-center">
                <h3 className="text-lg font-semibold text-white">
                  {`{ }`} Generated JSON Data
                </h3>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-auto p-6">
                <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                  {JSON.stringify(getJsonData(), null, 2)}
                </pre>
              </div>
              <div className="bg-gray-800 px-6 py-4 rounded-b-lg flex justify-end gap-3">
                <button
                  onClick={copyJsonToClipboard}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  onClick={() => setShowJsonModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!imageUrl && dataPoints.length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-gray-600">
              Upload a chart image to start extracting data
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Click on points to add data values
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
