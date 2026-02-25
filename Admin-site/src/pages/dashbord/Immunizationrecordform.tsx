import React, { useState } from "react";

interface ImmunizationRecord {
  id: string;
  age: string;
  vaccineType: string;
  date: string;
  batchNo: string;
  givenBy: string;
  nextDue: string;
}

const immunizationSchedule = [
  {
    age: "At Birth",
    vaccines: ["BCG", "OPV 0", "Hepatitis B 1"],
  },
  {
    age: "2 Months",
    vaccines: ["Pentavalent 1", "OPV 1", "Pneumococcal 1", "Rotavirus 1"],
  },
  {
    age: "4 Months",
    vaccines: ["Pentavalent 2", "OPV 2", "Pneumococcal 2", "Rotavirus 2"],
  },
  {
    age: "6 Months",
    vaccines: ["Pentavalent 3", "OPV 3", "Pneumococcal 3", "Rotavirus 3"],
  },
  {
    age: "9 Months",
    vaccines: ["MMR 1 (Measles, Mumps, Rubella)"],
  },
  {
    age: "12 Months",
    vaccines: ["Live JE (Japanese Encephalitis)"],
  },
  {
    age: "18 Months",
    vaccines: ["DPT Booster", "OPV 4", "MMR 2"],
  },
  {
    age: "3 Years",
    vaccines: ["MMR 2 (if not given at 18 months)"],
  },
  {
    age: "5 Years",
    vaccines: ["DT (Diphtheria, Tetanus)", "OPV 5"],
  },
  {
    age: "10-11 Years",
    vaccines: [
      "HPV 1",
      "HPV 2 (6 months after 1st dose)",
      "Adult Tetanus & Diphtheria",
    ],
  },
];

export const ImmunizationRecordForm: React.FC = () => {
  const [records, setRecords] = useState<ImmunizationRecord[]>([]);
  const [currentRecord, setCurrentRecord] = useState<ImmunizationRecord>({
    id: "",
    age: "",
    vaccineType: "",
    date: "",
    batchNo: "",
    givenBy: "",
    nextDue: "",
  });
  const [showSchedule, setShowSchedule] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentRecord((prev) => ({ ...prev, [name]: value }));
  };

  const addRecord = () => {
    if (currentRecord.vaccineType && currentRecord.date) {
      const newRecord = {
        ...currentRecord,
        id: Date.now().toString(),
      };
      setRecords((prev) => [...prev, newRecord]);
      setCurrentRecord({
        id: "",
        age: "",
        vaccineType: "",
        date: "",
        batchNo: "",
        givenBy: "",
        nextDue: "",
      });
    }
  };

  const deleteRecord = (id: string) => {
    setRecords((prev) => prev.filter((record) => record.id !== id));
  };

  const getVaccineStatus = (age: string, vaccines: string[]) => {
    const givenVaccines = records.filter((r) => r.age === age);
    const allGiven = vaccines.every((v) =>
      givenVaccines.some((r) =>
        r.vaccineType.toLowerCase().includes(v.toLowerCase().split(" ")[0]),
      ),
    );
    const someGiven = givenVaccines.length > 0;

    if (allGiven) return "complete";
    if (someGiven) return "partial";
    return "pending";
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Immunization Record
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          ප්‍රතිශක්තිකරණ වාර්තාව / தடுப்பூசி பதிவு
        </p>
      </div>

      {/* Quick View Schedule Toggle */}
      <div className="mb-6">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {showSchedule ? "Hide" : "View"} Immunization Schedule
        </button>
      </div>

      {/* Immunization Schedule Table */}
      {showSchedule && (
        <section className="mb-6 bg-purple-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">
            Standard Immunization Schedule (Sri Lanka)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-purple-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                    Vaccines
                  </th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {immunizationSchedule.map((schedule, index) => {
                  const status = getVaccineStatus(
                    schedule.age,
                    schedule.vaccines,
                  );
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {schedule.age}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        <ul className="list-disc list-inside">
                          {schedule.vaccines.map((vaccine, vIdx) => (
                            <li key={vIdx}>{vaccine}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {status === "complete" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓ Complete
                          </span>
                        )}
                        {status === "partial" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⚠ Partial
                          </span>
                        )}
                        {status === "pending" && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            ○ Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Add New Immunization Record */}
      <section className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Add Immunization Record
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Age / වයස
            </label>
            <select
              name="age"
              value={currentRecord.age}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Age</option>
              <option value="At Birth">At Birth</option>
              <option value="2 Months">2 Months</option>
              <option value="4 Months">4 Months</option>
              <option value="6 Months">6 Months</option>
              <option value="9 Months">9 Months</option>
              <option value="12 Months">12 Months</option>
              <option value="18 Months">18 Months</option>
              <option value="3 Years">3 Years</option>
              <option value="5 Years">5 Years</option>
              <option value="10-11 Years">10-11 Years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vaccine Type / එන්නත වර්ගය
            </label>
            <input
              type="text"
              name="vaccineType"
              value={currentRecord.vaccineType}
              onChange={handleInputChange}
              placeholder="e.g., BCG, Pentavalent 1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Given / දිනය
            </label>
            <input
              type="date"
              name="date"
              value={currentRecord.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Batch No. / කණ්ඩායම් අංකය
            </label>
            <input
              type="text"
              name="batchNo"
              value={currentRecord.batchNo}
              onChange={handleInputChange}
              placeholder="e.g., 220105H520A"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Given By / ලබා දුන්නේ
            </label>
            <input
              type="text"
              name="givenBy"
              value={currentRecord.givenBy}
              onChange={handleInputChange}
              placeholder="Healthcare provider name"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Next Due Date / ඊළඟ දිනය
            </label>
            <input
              type="date"
              name="nextDue"
              value={currentRecord.nextDue}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={addRecord}
          className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Immunization
        </button>
      </section>

      {/* Immunization Records Table */}
      <section className="bg-white border rounded-lg overflow-hidden">
        <div className="bg-green-100 px-4 py-3 border-b">
          <h2 className="text-lg font-semibold text-green-900">
            Immunization History
          </h2>
        </div>

        {records.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <svg
              className="mx-auto h-12 w-12 text-gray-400 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p>
              No immunization records yet. Add vaccines above to track
              immunization.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Age
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vaccine Type
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Given
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Batch No.
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Given By
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Due
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.age}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {record.vaccineType}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {new Date(record.date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {record.batchNo}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {record.givenBy}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {record.nextDue
                        ? new Date(record.nextDue).toLocaleDateString()
                        : "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <button
                        onClick={() => deleteRecord(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Important Notes */}
      <section className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-sm font-semibold text-yellow-900 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          Important Notes
        </h3>
        <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
          <li>
            Follow the recommended immunization schedule for optimal protection
          </li>
          <li>Keep the immunization card in a safe place</li>
          <li>Inform the healthcare provider of any allergic reactions</li>
          <li>Some vaccines may cause mild fever - this is normal</li>
          <li>Record batch numbers for vaccine traceability</li>
        </ul>
      </section>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-end mt-6 pt-4 border-t">
        <button
          onClick={() => window.print()}
          className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Print Record
        </button>
        <button
          onClick={() => {
            const dataStr = JSON.stringify(records, null, 2);
            const dataBlob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "immunization-records.json";
            link.click();
          }}
          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Export Data
        </button>
      </div>
    </div>
  );
};
