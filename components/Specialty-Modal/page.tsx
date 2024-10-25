import React from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  onSelectSpecialty: (specialty: string) => void;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, onSelectSpecialty }) => {
  const doctorTypes = [
    'Allergy and Immunology',
    'Cardiology',
    'Cosmetic Surgery',
    'Dentist',
    'Dermatology',
    'Diagnostic Radiology',
    'Emergency Medicine',
    'Endocrinology',
    'Family Medicine',
    'Gastroenterology',
    'Genetics',
    'Geriatrics',
    'Hematology',
    'Nephrology',
    'Neurology',
    'Obstetrics and Gynaecology',
    'Oncology',
    'Opthamology',
    'Orthopedics',
    'Pathology',
    'Pediatrics',
    'Preventative Medicine',
    'Psychiatry',
    'Pulmonology',
    'Surgery',
    'Urology'
  ];

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Select a Specialty</h2>
        <div className="max-h-60 overflow-y-auto">
          <ul className="space-y-4">
            {doctorTypes.map((type) => (
              <li
                key={type}
                className="cursor-pointer text-lg text-blue-600 hover:underline"
                onClick={() => {
                  onSelectSpecialty(type);
                  onClose();
                }}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
        <button
          className="mt-6 w-full bg-gray-800 text-white py-2 rounded-lg"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;