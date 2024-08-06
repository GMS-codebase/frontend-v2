import { Modal, Select } from "@mantine/core";
import { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";
import { SolarSuitcaseLinear, SolarWindowFrameLinear } from "../core/icons";
const AddWindowSubwindow = ({
  isOpenAddWindowSubwindow,
  closeAddWindowSubwindow,
}: {
  isOpenAddWindowSubwindow: boolean;
  closeAddWindowSubwindow: () => void;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    console.log("Form Data: ", formData);
  };

  return (
    <>
      <Modal
        size={"lg"}
        opened={isOpenAddWindowSubwindow}
        onClose={closeAddWindowSubwindow}
        closeOnClickOutside={false}
        withCloseButton={false}
      >
        <div className="w-full h-[500px] relative bg-white rounded-3xl pt-10 pb-6 flex flex-col items-center">
          <button
            className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
            onClick={closeAddWindowSubwindow}
          >
            <IoMdClose size={25} color={"#000"} />
          </button>
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-extrabold">Add Subwindow To Window</h1>
            <h2 className="text-[#000F2369] text-lg font-medium">
              Provide the window and window details to add a new trade.
            </h2>
          </div>
          <div className="w-4/5 flex flex-col items-center mt-10 overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="w-full h-[60vh] overflow-y-auto flex flex-col gap-5 px-2"
            >
              <div className="w-full">
                <label
                  htmlFor="trade"
                  className="block text-base font-medium text-black"
                >
                  Select Window
                </label>
                <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <span className="absolute left-2 top-3 text-black text-lg">
                    <SolarSuitcaseLinear />
                  </span>
                  <Select
                    name="trade"
                    // value={formData.position}
                    onChange={(value: any) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        position: value,
                      }))
                    }
                    data={[
                      {
                        value: "ICT & Digital Skills",
                        label: "ICT & Digital Skills",
                      },
                    ]}
                    placeholder="Type in or select trade"
                    required
                  />
                </div>
              </div>
              <div className="w-full">
                <label
                  htmlFor="window"
                  className="block text-base font-medium text-black"
                >
                  Select Window
                </label>
                <div className="mt-1 pl-6 relative block w-full bg-[#000F230A] py-1 rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                  <span className="absolute left-2 top-3 text-black text-lg">
                    <SolarWindowFrameLinear />
                  </span>
                  <Select
                    name="window"
                    // value={formData.position}
                    onChange={(value: any) =>
                      setFormData((prevData) => ({
                        ...prevData,
                        position: value,
                      }))
                    }
                    data={[
                      { value: "window 1", label: "window 1" },
                      { value: "window 2", label: "window 2" },
                      {
                        value: "window 3",
                        label: "window 4",
                      },
                    ]}
                    placeholder="Type in or select window"
                    required
                  />
                </div>
              </div>

              <div className="w-full flex justify-center mt-4 space-x-4">
                <button
                  type="button"
                  onClick={closeAddWindowSubwindow}
                  className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddWindowSubwindow;
