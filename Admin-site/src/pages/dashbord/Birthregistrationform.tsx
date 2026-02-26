import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface BirthRegistrationData {
  babyName: string;
  registrationNumber: string;
  dateOfBirth: string;
  timeOfBirth: string;
  placeOfBirth: string;
  sex: "male" | "female" | "";
  deliveryType: "normal" | "cesarean" | "";
  gestationalAge: string;
  birthWeight: string;
  birthLength: string;
  headCircumference: string;
  hospital: string;
  ward: string;
  bedNumber: string;
  motherName: string;
  motherAge: string;
  fatherName: string;
  fatherAge: string;
  address: string;
  contactNumber: string;
  medicalOfficer: string;
  nurseInCharge: string;
  complications: string;
  remarks: string;
}

const initialFormData: BirthRegistrationData = {
  babyName: "",
  registrationNumber: "",
  dateOfBirth: "",
  timeOfBirth: "",
  placeOfBirth: "",
  sex: "",
  deliveryType: "",
  gestationalAge: "",
  birthWeight: "",
  birthLength: "",
  headCircumference: "",
  hospital: "",
  ward: "",
  bedNumber: "",
  motherName: "",
  motherAge: "",
  fatherName: "",
  fatherAge: "",
  address: "",
  contactNumber: "",
  medicalOfficer: "",
  nurseInCharge: "",
  complications: "",
  remarks: "",
};

export const BirthRegistrationForm: React.FC = () => {
  const [formData, setFormData] =
    useState<BirthRegistrationData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:5001/child-app-2b2c3/us-central1/registerBaby",
        formData,
      );
      console.log("Response:", response.data);

      // Show success toast
      toast.success("Birth registration saved successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setFormData(initialFormData); // clear form
    } catch (error) {
      console.error("Error submitting birth data:", error);

      // Show error toast
      toast.error("Failed to save birth registration.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 border-b pb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Birth Registration Form
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          පළමු දින තොරතුරු / பிறப்பு பதிவு படிவம்
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Baby Information Section */}
        <section className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">
            Baby Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Baby Name / දරුවාගේ නම
              </label>
              <input
                type="text"
                name="babyName"
                value={formData.babyName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration No. / ලියාපදිංචි අංකය
              </label>
              <input
                type="text"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth / උපන් දිනය
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time of Birth / උපන් වේලාව
              </label>
              <input
                type="time"
                name="timeOfBirth"
                value={formData.timeOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sex / ස්ත්‍රී පුරුෂ භාවය
              </label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select / තෝරන්න</option>
                <option value="male">Male / පිරිමි</option>
                <option value="female">Female / ගැහැණු</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Place of Birth / උපන් ස්ථානය
              </label>
              <input
                type="text"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Birth Details Section */}
        <section className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-green-900 mb-4">
            Birth Details
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Delivery Type / ප්‍රසව ක්‍රමය
              </label>
              <select
                name="deliveryType"
                value={formData.deliveryType}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select / තෝරන්න</option>
                <option value="normal">Normal Vaginal / සාමාන්‍ය</option>
                <option value="cesarean">Cesarean / සීසේරියන්</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gestational Age (weeks) / ගර්භණී වයස
              </label>
              <input
                type="number"
                name="gestationalAge"
                value={formData.gestationalAge}
                onChange={handleInputChange}
                placeholder="e.g., 39"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Weight (kg) / උපත් බර
              </label>
              <input
                type="number"
                step="0.01"
                name="birthWeight"
                value={formData.birthWeight}
                onChange={handleInputChange}
                placeholder="e.g., 2.650"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Birth Length (cm) / දිග
              </label>
              <input
                type="number"
                step="0.1"
                name="birthLength"
                value={formData.birthLength}
                onChange={handleInputChange}
                placeholder="e.g., 51"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Head Circumference (cm) / හිස වට
              </label>
              <input
                type="number"
                step="0.1"
                name="headCircumference"
                value={formData.headCircumference}
                onChange={handleInputChange}
                placeholder="e.g., 34"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Hospital Information */}
        <section className="bg-purple-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-purple-900 mb-4">
            Hospital Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hospital / රෝහල
              </label>
              <input
                type="text"
                name="hospital"
                value={formData.hospital}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ward / වාට්ටුව
              </label>
              <input
                type="text"
                name="ward"
                value={formData.ward}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bed Number / ඇඳ අංකය
              </label>
              <input
                type="text"
                name="bedNumber"
                value={formData.bedNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Parent Information */}
        <section className="bg-yellow-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-yellow-900 mb-4">
            Parent Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Name / මවගේ නම
              </label>
              <input
                type="text"
                name="motherName"
                value={formData.motherName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mother's Age / මවගේ වයස
              </label>
              <input
                type="number"
                name="motherAge"
                value={formData.motherAge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Name / පියාගේ නම
              </label>
              <input
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Father's Age / පියාගේ වයස
              </label>
              <input
                type="number"
                name="fatherAge"
                value={formData.fatherAge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address / ලිපිනය
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number / දුරකථන අංකය
              </label>
              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Medical Staff */}
        <section className="bg-pink-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-pink-900 mb-4">
            Medical Staff
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Officer / වෛද්‍ය නිළධාරී
              </label>
              <input
                type="text"
                name="medicalOfficer"
                value={formData.medicalOfficer}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nurse in Charge / භාරව සිටින හෙද
              </label>
              <input
                type="text"
                name="nurseInCharge"
                value={formData.nurseInCharge}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Additional Notes */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Additional Information
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Complications / සංකූලතා
              </label>
              <textarea
                name="complications"
                value={formData.complications}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Remarks / සටහන්
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              />
            </div>
          </div>
        </section>

        {/* Submit Buttons */}
        <div className="flex gap-4 justify-end pt-4 border-t">
          <button
            type="button"
            onClick={() =>
              setFormData({
                babyName: "",
                registrationNumber: "",
                dateOfBirth: "",
                timeOfBirth: "",
                placeOfBirth: "",
                sex: "",
                deliveryType: "",
                gestationalAge: "",
                birthWeight: "",
                birthLength: "",
                headCircumference: "",
                hospital: "",
                ward: "",
                bedNumber: "",
                motherName: "",
                motherAge: "",
                fatherName: "",
                fatherAge: "",
                address: "",
                contactNumber: "",
                medicalOfficer: "",
                nurseInCharge: "",
                complications: "",
                remarks: "",
              })
            }
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Registration
          </button>
        </div>
      </form>
    </div>
  );
};
