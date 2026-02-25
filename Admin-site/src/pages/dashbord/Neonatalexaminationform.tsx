import React, { useState } from 'react';

interface NeonatalExamData {
    date: string;
    maturityWeeks: string;
    babyGrowth: 'SGA' | 'AGA' | 'LGA' | '';
    bloodGroup: string;

    // Physical Examination - Normal/Abnormal checkboxes
    peripheriesPinkWarm: 'normal' | 'abnormal' | '';
    hydration: 'normal' | 'abnormal' | '';
    responseToHandling: 'normal' | 'abnormal' | '';
    capillaryRefillTime: 'normal' | 'abnormal' | '';
    pulseRate: string;
    heartMurmurs: 'absent' | 'present' | '';
    femoralPulse: string;
    respiratoryRate: string;
    grunting: 'absent' | 'present' | '';
    intercostalRecession: 'absent' | 'present' | '';
    tone: string;
    ofc: string;
    fontanelleSutureLine: string;
    eyesRedReflex: string;

    // Body Parts Examination
    scalp: 'normal' | 'abnormal' | '';
    mouthLips: 'normal' | 'abnormal' | '';
    palate: 'normal' | 'abnormal' | '';
    ears: 'normal' | 'abnormal' | '';
    abdomen: string;
    umbilicus: 'normal' | 'abnormal' | '';
    genitalia: 'normal' | 'abnormal' | '';
    anus: 'normal' | 'abnormal' | '';
    hips: 'normal' | 'abnormal' | '';
    spine: 'normal' | 'abnormal' | '';
    limbs: 'normal' | 'abnormal' | '';
    down: 'absent' | 'present' | '';
    superficialNeck: 'absent' | 'present' | '';
    birthInjuries: 'absent' | 'present' | '';

    // Pulse Oximetry
    pulseOximetryPreDuctal: string;
    pulseOximetryPostDuctal: string;
    pulseOximetryStatus: 'pass' | 'fail' | 'referred' | '';

    // Action Taken
    actionTaken: 'transferred' | 'discharged' | '';
    diagnosisAtDischarge: string;
    dateOfDischarge: string;

    // Additional Assessments
    vitaminKGiven: boolean;

    // Other abnormalities
    otherAbnormalities: string;
}

export const NeonatalExaminationForm: React.FC = () => {
    const [formData, setFormData] = useState<NeonatalExamData>({
        date: '',
        maturityWeeks: '',
        babyGrowth: '',
        bloodGroup: '',
        peripheriesPinkWarm: '',
        hydration: '',
        responseToHandling: '',
        capillaryRefillTime: '',
        pulseRate: '',
        heartMurmurs: '',
        femoralPulse: '',
        respiratoryRate: '',
        grunting: '',
        intercostalRecession: '',
        tone: '',
        ofc: '',
        fontanelleSutureLine: '',
        eyesRedReflex: '',
        scalp: '',
        mouthLips: '',
        palate: '',
        ears: '',
        abdomen: '',
        umbilicus: '',
        genitalia: '',
        anus: '',
        hips: '',
        spine: '',
        limbs: '',
        down: '',
        superficialNeck: '',
        birthInjuries: '',
        pulseOximetryPreDuctal: '',
        pulseOximetryPostDuctal: '',
        pulseOximetryStatus: '',
        actionTaken: '',
        diagnosisAtDischarge: '',
        dateOfDischarge: '',
        vitaminKGiven: false,
        otherAbnormalities: '',
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Neonatal Exam Data:', formData);
        // Handle form submission
    };

    return (
        <div className= "max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-lg" >
        <div className="mb-6 border-b pb-4" >
            <h1 className="text-2xl font-bold text-gray-800" >
                Neonatal Examination Form
                    </h1>
                    < p className = "text-sm text-gray-600 mt-1" >
                        To be filled by the medical officer performing neonatal examination
                            </p>
                            </div>

                            < form onSubmit = { handleSubmit } className = "space-y-6" >
                                {/* Basic Information */ }
                                < section className = "bg-blue-50 p-4 rounded-lg" >
                                    <h2 className="text-lg font-semibold text-blue-900 mb-4" > Basic Information </h2>
                                        < div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" >
                                            <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1" >
                                                Date of Examination
                                                    </label>
                                                    < input
    type = "date"
    name = "date"
    value = { formData.date }
    onChange = { handleInputChange }
    className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        </div>

        < div >
        <label className="block text-sm font-medium text-gray-700 mb-1" >
            Maturity of Baby(weeks)
                </label>
                < input
    type = "number"
    name = "maturityWeeks"
    value = { formData.maturityWeeks }
    onChange = { handleInputChange }
    placeholder = "e.g., 39"
    className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        </div>

        < div >
        <label className="block text-sm font-medium text-gray-700 mb-1" >
            Baby's Growth
                </label>
                < select
    name = "babyGrowth"
    value = { formData.babyGrowth }
    onChange = { handleInputChange }
    className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        >
        <option value="" > Select </option>
            < option value = "SGA" > SGA(Small for Gestational Age)</option>
                < option value = "AGA" > AGA(Appropriate for Gestational Age)</option>
                    < option value = "LGA" > LGA(Large for Gestational Age)</option>
                        </select>
                        </div>

                        < div >
                        <label className="block text-sm font-medium text-gray-700 mb-1" >
                            Baby's Blood Group
                                </label>
                                < input
    type = "text"
    name = "bloodGroup"
    value = { formData.bloodGroup }
    onChange = { handleInputChange }
    placeholder = "e.g., O+"
    className = "w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
        />
        </div>
        </div>
        </section>

    {/* Physical Examination - Vital Signs */ }
    <section className="bg-green-50 p-4 rounded-lg" >
        <h2 className="text-lg font-semibold text-green-900 mb-4" > Physical Examination </h2>

            < div className = "overflow-x-auto" >
                <table className="w-full border-collapse" >
                    <thead>
                    <tr className="bg-green-100" >
                        <th className="border border-green-300 px-4 py-2 text-left" > Component </th>
                            < th className = "border border-green-300 px-4 py-2 text-center" > Status </th>
                                < th className = "border border-green-300 px-4 py-2 text-left" > Value / Notes </th>
                                    </tr>
                                    </thead>
                                    < tbody >
                                    <tr>
                                    <td className="border border-green-200 px-4 py-2 font-medium" >
                                        Peripheries pink and warm
                                            </td>
                                            < td className = "border border-green-200 px-4 py-2" >
                                                <div className="flex gap-4 justify-center" >
                                                    <label className="flex items-center" >
                                                        <input
                          type="radio"
    name = "peripheriesPinkWarm"
    value = "normal"
    checked = { formData.peripheriesPinkWarm === 'normal' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Normal
        </label>
        < label className = "flex items-center" >
            <input
                          type="radio"
    name = "peripheriesPinkWarm"
    value = "abnormal"
    checked = { formData.peripheriesPinkWarm === 'abnormal' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Abnormal
        </label>
        </div>
        </td>
        < td className = "border border-green-200 px-4 py-2" > </td>
            </tr>

            < tr >
            <td className="border border-green-200 px-4 py-2 font-medium" >
                Hydration
                </td>
                < td className = "border border-green-200 px-4 py-2" >
                    <div className="flex gap-4 justify-center" >
                        <label className="flex items-center" >
                            <input
                          type="radio"
    name = "hydration"
    value = "normal"
    checked = { formData.hydration === 'normal' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Normal
        </label>
        < label className = "flex items-center" >
            <input
                          type="radio"
    name = "hydration"
    value = "abnormal"
    checked = { formData.hydration === 'abnormal' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Abnormal
        </label>
        </div>
        </td>
        < td className = "border border-green-200 px-4 py-2" > </td>
            </tr>

            < tr >
            <td className="border border-green-200 px-4 py-2 font-medium" >
                Response to handling
                    </td>
                    < td className = "border border-green-200 px-4 py-2" >
                        <div className="flex gap-4 justify-center" >
                            <label className="flex items-center" >
                                <input
                          type="radio"
    name = "responseToHandling"
    value = "normal"
    checked = { formData.responseToHandling === 'normal' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Normal
        </label>
        < label className = "flex items-center" >
            <input
                          type="radio"
    name = "responseToHandling"
    value = "abnormal"
    checked = { formData.responseToHandling === 'abnormal' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Abnormal
        </label>
        </div>
        </td>
        < td className = "border border-green-200 px-4 py-2" > </td>
            </tr>

            < tr >
            <td className="border border-green-200 px-4 py-2 font-medium" >
                Capillary refilling time
                    </td>
                    < td className = "border border-green-200 px-4 py-2" >
                        <div className="flex gap-4 justify-center" >
                            <label className="flex items-center" >
                                <input
                          type="radio"
    name = "capillaryRefillTime"
    value = "normal"
    checked = { formData.capillaryRefillTime === 'normal' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Normal
        </label>
        < label className = "flex items-center" >
            <input
                          type="radio"
    name = "capillaryRefillTime"
    value = "abnormal"
    checked = { formData.capillaryRefillTime === 'abnormal' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Abnormal
        </label>
        </div>
        </td>
        < td className = "border border-green-200 px-4 py-2" > </td>
            </tr>

            < tr >
            <td className="border border-green-200 px-4 py-2 font-medium" >
                Pulse rate / volume
                    </td>
                    < td className = "border border-green-200 px-4 py-2" > </td>
                        < td className = "border border-green-200 px-4 py-2" >
                            <input
                      type="text"
    name = "pulseRate"
    value = { formData.pulseRate }
    onChange = { handleInputChange }
    placeholder = "e.g., 140/min"
    className = "w-full px-2 py-1 border border-gray-300 rounded"
        />
        </td>
        </tr>

        < tr >
        <td className="border border-green-200 px-4 py-2 font-medium" >
            Heart murmurs
                </td>
                < td className = "border border-green-200 px-4 py-2" >
                    <div className="flex gap-4 justify-center" >
                        <label className="flex items-center" >
                            <input
                          type="radio"
    name = "heartMurmurs"
    value = "absent"
    checked = { formData.heartMurmurs === 'absent' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Absent
        </label>
        < label className = "flex items-center" >
            <input
                          type="radio"
    name = "heartMurmurs"
    value = "present"
    checked = { formData.heartMurmurs === 'present' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Present
        </label>
        </div>
        </td>
        < td className = "border border-green-200 px-4 py-2" > </td>
            </tr>

            < tr >
            <td className="border border-green-200 px-4 py-2 font-medium" >
                Femoral pulse
                    </td>
                    < td className = "border border-green-200 px-4 py-2" > </td>
                        < td className = "border border-green-200 px-4 py-2" >
                            <input
                      type="text"
    name = "femoralPulse"
    value = { formData.femoralPulse }
    onChange = { handleInputChange }
    className = "w-full px-2 py-1 border border-gray-300 rounded"
        />
        </td>
        </tr>

        < tr >
        <td className="border border-green-200 px-4 py-2 font-medium" >
            Respiratory rate
                </td>
                < td className = "border border-green-200 px-4 py-2" > </td>
                    < td className = "border border-green-200 px-4 py-2" >
                        <input
                      type="text"
    name = "respiratoryRate"
    value = { formData.respiratoryRate }
    onChange = { handleInputChange }
    placeholder = "e.g., 40/min"
    className = "w-full px-2 py-1 border border-gray-300 rounded"
        />
        </td>
        </tr>

        < tr >
        <td className="border border-green-200 px-4 py-2 font-medium" >
            Grunting
            </td>
            < td className = "border border-green-200 px-4 py-2" >
                <div className="flex gap-4 justify-center" >
                    <label className="flex items-center" >
                        <input
                          type="radio"
    name = "grunting"
    value = "absent"
    checked = { formData.grunting === 'absent' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Absent
        </label>
        < label className = "flex items-center" >
            <input
                          type="radio"
    name = "grunting"
    value = "present"
    checked = { formData.grunting === 'present' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Present
        </label>
        </div>
        </td>
        < td className = "border border-green-200 px-4 py-2" > </td>
            </tr>

            < tr >
            <td className="border border-green-200 px-4 py-2 font-medium" >
                Intercostal / subcostal recession
                    </td>
                    < td className = "border border-green-200 px-4 py-2" >
                        <div className="flex gap-4 justify-center" >
                            <label className="flex items-center" >
                                <input
                          type="radio"
    name = "intercostalRecession"
    value = "absent"
    checked = { formData.intercostalRecession === 'absent' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Absent
        </label>
        < label className = "flex items-center" >
            <input
                          type="radio"
    name = "intercostalRecession"
    value = "present"
    checked = { formData.intercostalRecession === 'present' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Present
        </label>
        </div>
        </td>
        < td className = "border border-green-200 px-4 py-2" > </td>
            </tr>
            </tbody>
            </table>
            </div>
            </section>

    {/* Body Parts Examination */ }
    <section className="bg-purple-50 p-4 rounded-lg" >
        <h2 className="text-lg font-semibold text-purple-900 mb-4" > Detailed Body Examination </h2>

            < div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
            {
                [
                { name: 'scalp', label: 'Scalp' },
                { name: 'mouthLips', label: 'Mouth / lips' },
                { name: 'palate', label: 'Palate' },
                { name: 'ears', label: 'Ears' },
                { name: 'umbilicus', label: 'Umbilicus' },
                { name: 'genitalia', label: 'Genitalia' },
                { name: 'anus', label: 'Anus' },
                { name: 'hips', label: 'Hips' },
                { name: 'spine', label: 'Spine' },
                { name: 'limbs', label: 'Limbs' },
            ].map((field) => (
                    <div key= { field.name } className = "flex items-center justify-between border-b border-purple-200 pb-2" >
                    <label className="font-medium text-gray-700" > { field.label } </label>
                < div className = "flex gap-4" >
                <label className="flex items-center" >
                <input
                      type="radio"
                      name = { field.name }
                      value = "normal"
                      checked = { formData[field.name as keyof NeonatalExamData] === 'normal' }
                      onChange = { handleInputChange }
                      className = "mr-2"
                    />
                    Normal
                    </label>
                    < label className = "flex items-center" >
                    <input
                      type="radio"
                      name = { field.name }
                      value = "abnormal"
                      checked = { formData[field.name as keyof NeonatalExamData] === 'abnormal' }
                      onChange = { handleInputChange }
                      className = "mr-2"
                    />
                    Abnormal
                    </label>
                    </div>
                    </div>
                ))
            }

                < div className = "md:col-span-2" >
                    <label className="block text-sm font-medium text-gray-700 mb-1" >
                        Abdomen
                        </label>
                        < input
    type = "text"
    name = "abdomen"
    value = { formData.abdomen }
    onChange = { handleInputChange }
    className = "w-full px-3 py-2 border border-gray-300 rounded-md"
    placeholder = "Enter findings"
        />
        </div>
        </div>
        </section>

    {/* Pulse Oximetry */ }
    <section className="bg-yellow-50 p-4 rounded-lg" >
        <h2 className="text-lg font-semibold text-yellow-900 mb-4" > Pulse Oximetry </h2>
            < div className = "grid grid-cols-1 md:grid-cols-3 gap-4" >
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" >
                    Pre ductal SpO₂ (%)
                        </label>
                        < input
    type = "number"
    name = "pulseOximetryPreDuctal"
    value = { formData.pulseOximetryPreDuctal }
    onChange = { handleInputChange }
    placeholder = "e.g., 96"
    className = "w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        </div>

        < div >
        <label className="block text-sm font-medium text-gray-700 mb-1" >
            Post ductal SpO₂ (%)
                </label>
                < input
    type = "number"
    name = "pulseOximetryPostDuctal"
    value = { formData.pulseOximetryPostDuctal }
    onChange = { handleInputChange }
    placeholder = "e.g., 95"
    className = "w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        </div>

        < div >
        <label className="block text-sm font-medium text-gray-700 mb-1" >
            Status
            </label>
            < select
    name = "pulseOximetryStatus"
    value = { formData.pulseOximetryStatus }
    onChange = { handleInputChange }
    className = "w-full px-3 py-2 border border-gray-300 rounded-md"
        >
        <option value="" > Select </option>
            < option value = "pass" > Pass </option>
                < option value = "fail" > Fail </option>
                    < option value = "referred" > Referred </option>
                        </select>
                        </div>
                        </div>
                        </section>

    {/* Action Taken */ }
    <section className="bg-pink-50 p-4 rounded-lg" >
        <h2 className="text-lg font-semibold text-pink-900 mb-4" > Action Taken </h2>
            < div className = "grid grid-cols-1 md:grid-cols-2 gap-4" >
                <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" >
                    Action
                    </label>
                    < div className = "flex gap-6" >
                        <label className="flex items-center" >
                            <input
                    type="radio"
    name = "actionTaken"
    value = "transferred"
    checked = { formData.actionTaken === 'transferred' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Transferred for special care
            </label>
            < label className = "flex items-center" >
            <input
                    type= "radio"
    name = "actionTaken"
    value = "discharged"
    checked = { formData.actionTaken === 'discharged' }
    onChange = { handleInputChange }
    className = "mr-2"
        />
        Discharged
        </label>
        </div>
        </div>

        < div >
        <label className="block text-sm font-medium text-gray-700 mb-1" >
            Date of Discharge
                </label>
                < input
    type = "date"
    name = "dateOfDischarge"
    value = { formData.dateOfDischarge }
    onChange = { handleInputChange }
    className = "w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        </div>

        < div className = "md:col-span-2" >
            <label className="block text-sm font-medium text-gray-700 mb-1" >
                Diagnosis at Discharge
                    </label>
                    < textarea
    name = "diagnosisAtDischarge"
    value = { formData.diagnosisAtDischarge }
    onChange = { handleInputChange }
    rows = { 2}
    className = "w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        </div>
        </div>
        </section>

    {/* Additional Information */ }
    <section className="bg-gray-50 p-4 rounded-lg" >
        <h2 className="text-lg font-semibold text-gray-900 mb-4" > Additional Information </h2>
            < div >
            <label className="block text-sm font-medium text-gray-700 mb-1" >
                Any other abnormalities
                    </label>
                    < textarea
    name = "otherAbnormalities"
    value = { formData.otherAbnormalities }
    onChange = { handleInputChange }
    rows = { 3}
    className = "w-full px-3 py-2 border border-gray-300 rounded-md"
    placeholder = "Enter any other findings or abnormalities..."
        />
        </div>
        </section>

    {/* Submit Buttons */ }
    <div className="flex gap-4 justify-end pt-4 border-t" >
        <button
            type="button"
    onClick = {() => window.history.back()}
className = "px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
    >
    Cancel
    </button>
    < button
type = "submit"
className = "px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
    >
    Save Examination
        </button>
        </div>
        </form>
        </div>
  );
};