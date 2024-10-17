import { Modal } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { SolarDocumentBold } from "@/components/core/icons/index";
import { useState } from "react";

interface EditEvalModalProps {
  isOpenEditEval: boolean;
  closeEditEval: () => void;
  formData: { title: string; description: string };
  onUpdate: (updatedData: { title: string; description: string }) => void;
}

const EditEvalModal = ({
  isOpenEditEval,
  closeEditEval,
  formData,
  onUpdate,
}: EditEvalModalProps) => {
  const [editData, setEditData] = useState(formData);

  const handleEditChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setEditData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUpdate = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    onUpdate(editData);
    closeEditEval();
  };

  return (
    <Modal
      size={"xl"}
      opened={isOpenEditEval}
      onClose={closeEditEval}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-full h-[500px] relative bg-white rounded-3xl pt-6 pb-6 flex flex-col items-center">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeEditEval}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">
            Edit Evaluation decision details
          </h1>
        </div>
        <div className="w-4/5 flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleUpdate}
            className="w-full h-[60vh] overflow-y-auto flex flex-col gap-4 px-2"
          >
            <div className="w-full flex justify-between gap-3">
              <div className="w-full">
                <label
                  htmlFor="WindowTitle"
                  className="block text-sm text-gray-700"
                >
                  Decision
                </label>
                <div className="w-full relative">
                  <span className="absolute left-2 top-[10px]">
                    <SolarDocumentBold />
                  </span>
                  <select
                    name="title"
                    value={editData.title}
                    onChange={handleEditChange}
                    className="mt-1 block w-full pl-8 px-12 text-gray-400 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                    required
                  >
                    <option value="" disabled>
                      Select your decision
                    </option>
                    <option value="decision1">Decision 1</option>
                    <option value="decision2">Decision 2</option>
                    <option value="decision3">Decision 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="">
              <label
                htmlFor="description"
                className="block text-sm text-gray-700"
              >
                Comment
              </label>
              <div className="w-full relative">
                <input
                  type="text"
                  name="description"
                  value={editData.description}
                  placeholder="Provide a comment"
                  onChange={handleEditChange}
                  className="mt-1 block w-full pb-28 pt-2 pl-8 px-6 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                  required
                />
              </div>
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeEditEval}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Update Decision
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};
export default EditEvalModal;
