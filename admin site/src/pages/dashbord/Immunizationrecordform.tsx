import React, { useState, useEffect } from "react";
import axios from "axios";

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
  { age: "At Birth", vaccines: ["BCG", "OPV 0", "Hepatitis B 1"] },
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
  { age: "9 Months", vaccines: ["MMR 1 (Measles, Mumps, Rubella)"] },
  { age: "12 Months", vaccines: ["Live JE (Japanese Encephalitis)"] },
  { age: "18 Months", vaccines: ["DPT Booster", "OPV 4", "MMR 2"] },
  { age: "3 Years", vaccines: ["MMR 2 (if not given at 18 months)"] },
  { age: "5 Years", vaccines: ["DT (Diphtheria, Tetanus)", "OPV 5"] },
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const GET_API =
    "http://localhost:5001/child-health-system-6ba6d/us-central1/getImmunizationData";
  const POST_API =
    "http://localhost:5001/child-health-system-6ba6d/us-central1/createImmunizationData";
  const DELETE_API =
    "http://localhost:5001/child-health-system-6ba6d/us-central1/deleteImmunizationData";

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const response = await axios.get(GET_API);

      if (Array.isArray(response.data)) {
        setRecords(response.data);
      } else {
        console.error("Invalid data format:", response.data);
        setRecords([]);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch records.");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setCurrentRecord((prev) => ({ ...prev, [name]: value }));
  };

  const addRecord = async () => {
    if (
      !currentRecord.age ||
      !currentRecord.vaccineType ||
      !currentRecord.date
    ) {
      setError("Please fill Age, Vaccine Type and Date.");
      return;
    }

    try {
      const response = await axios.post(POST_API, currentRecord);

      if (response.data) {
        setRecords((prev) => [...prev, response.data]);
      }

      setCurrentRecord({
        id: "",
        age: "",
        vaccineType: "",
        date: "",
        batchNo: "",
        givenBy: "",
        nextDue: "",
      });

      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to save record.");
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await axios.delete(`${DELETE_API}/${id}`);
      setRecords((prev) => prev.filter((record) => record.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete record.");
    }
  };

  const getVaccineStatus = (age: string, vaccines: string[]) => {
    const givenVaccines = records.filter((r) => r.age === age);

    const allGiven = vaccines.every((v) =>
      givenVaccines.some((r) =>
        r.vaccineType.toLowerCase().includes(v.toLowerCase().split(" ")[0]),
      ),
    );

    if (allGiven && vaccines.length > 0) return "complete";
    if (givenVaccines.length > 0) return "partial";
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

      {error && <p className="text-red-600 mb-4">{error}</p>}
      {loading && <p className="text-gray-500 mb-4">Loading records...</p>}

      <div className="mb-6">
        <button
          onClick={() => setShowSchedule(!showSchedule)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200"
        >
          {showSchedule ? "Hide" : "View"} Immunization Schedule
        </button>
      </div>

      {showSchedule && (
        <section className="mb-6 bg-purple-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">
            Standard Immunization Schedule (Sri Lanka)
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded-lg">
              <thead className="bg-purple-100">
                <tr>
                  <th>Age</th>
                  <th>Vaccines</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {immunizationSchedule.map((schedule, idx) => {
                  const status = getVaccineStatus(
                    schedule.age,
                    schedule.vaccines,
                  );
                  return (
                    <tr key={idx}>
                      <td>{schedule.age}</td>
                      <td>
                        <ul className="list-disc list-inside">
                          {schedule.vaccines.map((vaccine, i) => (
                            <li key={i}>{vaccine}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="text-center">
                        {status === "complete" && (
                          <span className="text-green-800">✓ Complete</span>
                        )}
                        {status === "partial" && (
                          <span className="text-yellow-800">⚠ Partial</span>
                        )}
                        {status === "pending" && (
                          <span className="text-gray-800">○ Pending</span>
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

      <section className="bg-blue-50 p-4 rounded-lg mb-6">
        <h2>Add Immunization Record</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label>Age</label>
            <select
              name="age"
              value={currentRecord.age}
              onChange={handleInputChange}
            >
              <option value="">Select Age</option>
              {immunizationSchedule.map((s) => (
                <option key={s.age} value={s.age}>
                  {s.age}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Vaccine Type</label>
            <input
              type="text"
              name="vaccineType"
              value={currentRecord.vaccineType}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Date Given</label>
            <input
              type="date"
              name="date"
              value={currentRecord.date}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Batch No.</label>
            <input
              type="text"
              name="batchNo"
              value={currentRecord.batchNo}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Given By</label>
            <input
              type="text"
              name="givenBy"
              value={currentRecord.givenBy}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label>Next Due</label>
            <input
              type="date"
              name="nextDue"
              value={currentRecord.nextDue}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <button
          onClick={addRecord}
          className="bg-blue-600 text-white px-4 py-2"
        >
          Add Immunization
        </button>
      </section>

      <section>
        {!Array.isArray(records) || records.length === 0 ? (
          <p>No immunization records yet.</p>
        ) : (
          <table className="min-w-full">
            <thead>
              <tr>
                <th>Age</th>
                <th>Vaccine Type</th>
                <th>Date</th>
                <th>Batch No.</th>
                <th>Given By</th>
                <th>Next Due</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((r) => (
                <tr key={r.id}>
                  <td>{r.age}</td>
                  <td>{r.vaccineType}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                  <td>{r.batchNo}</td>
                  <td>{r.givenBy}</td>
                  <td>
                    {r.nextDue ? new Date(r.nextDue).toLocaleDateString() : "-"}
                  </td>
                  <td>
                    <button
                      onClick={() => deleteRecord(r.id)}
                      className="text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};
