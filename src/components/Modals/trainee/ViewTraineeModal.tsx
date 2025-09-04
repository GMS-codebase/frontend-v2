"use client";
import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";

interface ViewTraineeModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainee: any;
}

const ViewTraineeModal = ({ isOpen, onClose, trainee }: ViewTraineeModalProps) => {
  if (!trainee) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const getGenderColor = (gender: string) => {
    switch (gender?.toLowerCase()) {
      case 'male': return 'bg-blue-100 text-blue-800';
      case 'female': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      withCloseButton={false}
      size={""}
    >
      <div className="lg:w-[60vw] w-full max-h-[90vh] overflow-y-auto relative bg-white rounded-3xl p-10 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={onClose}
        >
          <IoMdClose size={25} />
        </button>
        <h1 className="text-2xl font-extrabold mb-6">Trainee Details</h1>

        <div className="w-full space-y-6">
          {/* Personal Information Section */}
          <div className="bg-[#000F230A] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">👤</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Full Name</label>
                <p className="text-base font-medium text-gray-900">{trainee.firstname} {trainee.lastname}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">National ID</label>
                <p className="text-base font-medium text-gray-900">{trainee.nationalId || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Gender</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getGenderColor(trainee.gender)}`}>
                  {trainee.gender || "-"}
                </span>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Date of Birth</label>
                <p className="text-base font-medium text-gray-900">{formatDate(trainee.dob)}</p>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-[#000F230A] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">📞</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Email Address</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📧</span>
                  <p className="text-base font-medium text-gray-900">{trainee.email || "-"}</p>
                </div>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Phone Number</label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">📱</span>
                  <p className="text-base font-medium text-gray-900">{trainee.phoneNumber || "-"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="bg-[#000F230A] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">📍</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Location Information</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Province</label>
                <p className="text-base font-medium text-gray-900">{trainee.province || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">District</label>
                <p className="text-base font-medium text-gray-900">{trainee.district || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Residence Sector</label>
                <p className="text-base font-medium text-gray-900">{trainee.residenceSector || trainee.redidenceSector || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Cell</label>
                <p className="text-base font-medium text-gray-900">{trainee.cell || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Village</label>
                <p className="text-base font-medium text-gray-900">{trainee.village || "-"}</p>
              </div>
            </div>
          </div>

          {/* Applicant Information Section */}
          {trainee.applicant && (
            <div className="bg-[#000F230A] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">👨‍💼</span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800">Applicant Information</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Applicant Name</label>
                  <p className="text-base font-medium text-gray-900">{trainee.applicant.name || "-"}</p>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Applicant Email</label>
                  <p className="text-base font-medium text-gray-900">{trainee.applicant.email || "-"}</p>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Applicant Phone</label>
                  <p className="text-base font-medium text-gray-900">{trainee.applicant.phone || "-"}</p>
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-600">Address</label>
                  <p className="text-base font-medium text-gray-900">{trainee.applicant.address || "-"}</p>
                </div>
              </div>
            </div>
          )}

          {/* Program Information Section */}
          <div className="bg-[#000F230A] rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🎓</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">Program Information</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Window</label>
                <p className="text-base font-medium text-gray-900">{trainee.window?.title || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Sub Window</label>
                <p className="text-base font-medium text-gray-900">{trainee.subWindow?.title || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Sector</label>
                <p className="text-base font-medium text-gray-900">{trainee.sector?.name || trainee.sector || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Trade</label>
                <p className="text-base font-medium text-gray-900">{trainee.trade?.title || trainee.trade?.name || "-"}</p>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium text-gray-600">Status</label>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStageColor(trainee.status)}`}>
                  {trainee.status || "Active"}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {trainee.notes && (
            <div className="bg-[#000F230A] rounded-2xl p-6">
              <div className="space-y-2">
                <label className="block mb-1 text-sm font-medium text-gray-600">Additional Notes</label>
                <p className="text-base text-gray-900">{trainee.notes}</p>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="bg-gray-100 text-gray-700 py-2 px-6 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewTraineeModal;
