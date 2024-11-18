import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { notifications } from "@mantine/notifications";

interface AddQuestionTypeProps {
  isOpen: boolean;
  closeModal: () => void;
  onAddType: (newType: { name: string; description: string }) => void;
}

const AddQuestionType = ({
  isOpen,
  closeModal,
  onAddType,
}: AddQuestionTypeProps) => {
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState({ name: "", description: "" });

  const handleAddType = () => {
    if (!formData.name.trim()) {
      setErrors({ ...errors, name: "Type name is required." });
      return;
    }
    onAddType(formData);
    setFormData({ name: "", description: "" });
    closeModal();
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-50">
      <div className="w-[30vw] bg-white rounded-3xl p-6 flex flex-col items-center relative">
        <button
          className="absolute top-3 right-3 bg-gray-100 p-1 rounded-full"
          onClick={closeModal}
        >
          <IoMdClose size={20} />
        </button>
        <h2 className="text-2xl font-bold mb-4">Add New Question Type</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          placeholder="Enter question type name"
          onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          style={{
            boxShadow: errors.name ? "0 0 0 1px red" : undefined,
          }}
        />
        {errors.name && <p className="text-red-500">{errors.name}</p>}

        <textarea
          name="description"
          value={formData.description}
          placeholder="Enter description (optional)"
          onChange={handleChange}
          className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          rows={3}
          style={{
            boxShadow: errors.description ? "0 0 0 1px red" : undefined,
          }}
        />

        <div className="w-full flex justify-center mt-4 space-x-4">
          <button
            type="button"
            onClick={closeModal}
            className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleAddType}
            className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none"
          >
            Add Type
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddQuestionType;
