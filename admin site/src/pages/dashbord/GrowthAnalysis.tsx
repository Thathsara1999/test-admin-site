import React, { useMemo, useState } from "react";
import { Upload, RefreshCw, FileText } from "lucide-react";
import {
  calculateAgeMonths,
  classifyPercentile,
  getPercentileResult,
} from "../../utils/growthAnalysis";
import { Sex, whoGrowthLms } from "../../data/growthLms";

type FormState = {
  sex: Sex;
  birthDate: string;
  measurementDate: string;
  heightCm: string;
  weightKg: string;
  heightPercentile: string;
  weightPercentile: string;
  notes: string;
};

const defaultForm: FormState = {
  sex: "female",
  birthDate: "",
  measurementDate: "",
  heightCm: "",
  weightKg: "",
  heightPercentile: "",
  weightPercentile: "",
  notes: "",
};

const parseNumber = (value: string) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const clampPercentile = (value: number | null) => {
  if (value === null) {
    return null;
  }
  if (value < 0) {
    return 0;
  }
  if (value > 100) {
    return 100;
  }
  return value;
};

export default function GrowthAnalysis() {
  const [form, setForm] = useState<FormState>(defaultForm);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  const hasReferenceData =
    whoGrowthLms.male.heightCm.length > 1 &&
    whoGrowthLms.female.heightCm.length > 1;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleNotesChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setForm((prev) => ({ ...prev, notes: value }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    const file = event.target.files[0];
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(URL.createObjectURL(file));
  };

  const handleReset = () => {
    setForm(defaultForm);
    setShowResults(false);
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
  };

  const analysis = useMemo(() => {
    const ageMonths = calculateAgeMonths(form.birthDate, form.measurementDate);
    const heightCm = parseNumber(form.heightCm);
    const weightKg = parseNumber(form.weightKg);
    const manualHeightPercentile = clampPercentile(
      parseNumber(form.heightPercentile),
    );
    const manualWeightPercentile = clampPercentile(
      parseNumber(form.weightPercentile),
    );

    const heightResult = getPercentileResult(
      heightCm,
      ageMonths,
      form.sex,
      manualHeightPercentile,
      "heightCm",
    );
    const weightResult = getPercentileResult(
      weightKg,
      ageMonths,
      form.sex,
      manualWeightPercentile,
      "weightKg",
    );

    return {
      input: {
        sex: form.sex,
        birthDate: form.birthDate,
        measurementDate: form.measurementDate,
        heightCm,
        weightKg,
      },
      computed: {
        ageMonths,
        heightPercentile: heightResult.percentile,
        heightPercentileSource: heightResult.source,
        heightClassification: classifyPercentile(heightResult.percentile),
        weightPercentile: weightResult.percentile,
        weightPercentileSource: weightResult.source,
        weightClassification: classifyPercentile(weightResult.percentile),
      },
      notes: form.notes,
    };
  }, [form]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowResults(true);
  };

  const handleDownload = () => {
    const data = JSON.stringify(analysis, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "growth-analysis.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Growth Chart Analysis
        </h2>
        <p className="text-sm text-gray-600 mt-2">
          Upload a growth chart image and enter the values you want analyzed.
          Percentiles can be auto-calculated when WHO reference data is added,
          or you can type them manually.
        </p>
        {!hasReferenceData && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Reference data is not installed yet. Add WHO LMS values in
            src/data/growthLms.ts to enable automatic percentiles.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Upload Chart
          </h3>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition cursor-pointer">
            <Upload className="w-10 h-10 text-gray-400 mb-3" />
            <p className="text-sm text-gray-600">Upload JPG or PNG chart</p>
            <input
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt="Uploaded chart preview"
                className="rounded-lg border border-gray-200"
              />
            </div>
          )}
          <div className="mt-4 text-xs text-gray-500">
            OCR parsing is not configured yet. Use the fields on the right to
            enter values from the chart.
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Manual Entry
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Sex</label>
                <select
                  name="sex"
                  value={form.sex}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Birth date</label>
                <input
                  type="date"
                  name="birthDate"
                  value={form.birthDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Measurement date
                </label>
                <input
                  type="date"
                  name="measurementDate"
                  value={form.measurementDate}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Height (cm)</label>
                <input
                  type="number"
                  name="heightCm"
                  value={form.heightCm}
                  onChange={handleChange}
                  placeholder="e.g. 68.5"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Weight (kg)</label>
                <input
                  type="number"
                  name="weightKg"
                  value={form.weightKg}
                  onChange={handleChange}
                  placeholder="e.g. 7.9"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Height percentile (optional)
                </label>
                <input
                  type="number"
                  name="heightPercentile"
                  value={form.heightPercentile}
                  onChange={handleChange}
                  placeholder="0 - 100"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Weight percentile (optional)
                </label>
                <input
                  type="number"
                  name="weightPercentile"
                  value={form.weightPercentile}
                  onChange={handleChange}
                  placeholder="0 - 100"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Notes</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={handleNotesChange}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                placeholder="Optional observations"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <FileText className="w-4 h-4 mr-2" />
                Analyze
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="flex items-center rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset
              </button>
              {showResults && (
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-lg border border-blue-200 px-4 py-2 text-blue-700 hover:bg-blue-50"
                >
                  Download JSON
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {showResults && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Analysis Output
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Age (months)</p>
              <p className="text-xl font-semibold text-gray-800">
                {analysis.computed.ageMonths !== null
                  ? analysis.computed.ageMonths.toFixed(1)
                  : "Missing"}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Height percentile</p>
              <p className="text-xl font-semibold text-gray-800">
                {analysis.computed.heightPercentile !== null
                  ? `${analysis.computed.heightPercentile.toFixed(1)}%`
                  : "Missing"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {analysis.computed.heightClassification} (
                {analysis.computed.heightPercentileSource})
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 p-4">
              <p className="text-sm text-gray-500">Weight percentile</p>
              <p className="text-xl font-semibold text-gray-800">
                {analysis.computed.weightPercentile !== null
                  ? `${analysis.computed.weightPercentile.toFixed(1)}%`
                  : "Missing"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {analysis.computed.weightClassification} (
                {analysis.computed.weightPercentileSource})
              </p>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm text-gray-600 mb-2">Structured data</p>
            <pre className="text-xs bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
              {JSON.stringify(analysis, null, 2)}
            </pre>
            <p className="text-xs text-gray-500 mt-3">
              This tool is informational only and does not replace professional
              medical advice.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
