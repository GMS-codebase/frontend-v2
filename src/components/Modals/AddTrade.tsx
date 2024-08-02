import { Modal } from "@mantine/core";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";

const AddTrade = ({
  isOpenAddTrade,
  closeAddTrade,
}: {
  isOpenAddTrade: boolean;
  closeAddTrade: () => void;
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
    // Handle form submission logic here
    console.log("Form Data: ", formData);
  };

  return (
    <>
      <Modal
        size={""}
        opened={isOpenAddTrade}
        onClose={closeAddTrade}
        closeOnClickOutside={false}
        withCloseButton={false}
      >
        <div className="w-[80vh] h-[500px] relative bg-white rounded-3xl pt-10 pb-6 flex flex-col items-center">
          <button
            className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
            onClick={closeAddTrade}
          >
            <IoMdClose size={25} color={"#000"} />
          </button>
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-extrabold">Create New Trade</h1>
            <h2 className="text-[#000F2369] text-lg font-medium">
              Provide your Trade details to create a new Trade.
            </h2>
          </div>
          <div className="w-4/5 flex flex-col items-center mt-10 overflow-hidden">
            <form
                  onSubmit={handleSubmit}
                  className="w-full h-[60vh] overflow-y-auto flex flex-col gap-2 px-2"
                >
                  <div className="w-full flex justify-between gap-3">
                    <div className="w-full">
                      <label
                        htmlFor="TradeTitle"
                        className="block text-lg font-bold text-gray-700"
                      >
                        Title
                      </label>
                      <div className="w-full relative">
                        <span className="absolute left-2 top-[10px]">
                          <Folder2 />
                        </span>
                        <input
                          type="text"
                          name="TradeTitle"
                          value={formData.title}
                          placeholder="Trade title"
                          onChange={handleChange}
                          className="mt-1 block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="">
                    <label
                      htmlFor="description"
                      className="block text-lg font-bold text-gray-700"
                    >
                      Description
                    </label>
                    <div className="w-full relative">
                      <span className="absolute left-2 top-[10px]">
                        <Subtitles/>
                      </span>
                      <input
                        type="text"
                        name="description"
                        value={formData.description}
                        placeholder="Add description"
                        onChange={handleChange}
                        className="mt-1 block w-full pb-28 pt-2 pl-8 px-3  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                        required
                      />
                    </div>
                  </div>

                  <div className="w-full flex justify-center mt-4 space-x-4">
                    <button
                      type="button"
                      onClick={closeAddTrade}
                      className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Create
                    </button>
                  </div>
            </form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AddTrade;
