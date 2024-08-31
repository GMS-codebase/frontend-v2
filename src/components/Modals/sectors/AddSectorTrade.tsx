import { Modal, Select } from "@mantine/core";
import { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";
import { IoMdClose } from "react-icons/io";
import { Folder2, Subtitles } from "solar-icon-set";

import { SolarSuitcaseLinear, SolarWindowFrameLinear } from "../../core/icons";
import { useSelector } from "react-redux";
import { useParams } from "next/navigation";
const AddSectorTrade = ({
  isOpenAddSectorTrade,
  closeAddSectorTrade,
}: {
  isOpenAddSectorTrade: boolean;
  closeAddSectorTrade: () => void;
}) => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const windows = useSelector((state: any) => state.windows);
  const trades = useSelector((state: any) => state.trades);

  const tradeOptions = trades.trades.map((trade: any) => ({
    value: trade.uuid,
    label: trade.title,
  }));
  const windowOptions = windows.windows
    .filter((window: any) =>
      window.subWindows.some((subWindow: any) =>
        subWindow.sectors.some((sec: any) => {
          console.log({ sec: sec.uuid, id });
          return sec.uuid === id;
        })
      )
    )
    .map((window: any) => ({
      value: window.uuid,
      label: window.title,
    }));

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    setLoading(true);
    e.preventDefault();
    setLoading(false);
  };

  return (
    <>
      <Modal
        size={""}
        opened={isOpenAddSectorTrade}
        onClose={closeAddSectorTrade}
        closeOnClickOutside={false}
        withCloseButton={false}
      >
        <div className="w-[45vw] max-h-[90vh] overflow-y-auto  relative bg-white rounded-3xl  flex flex-col items-center p-16">
          <button
            className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
            onClick={closeAddSectorTrade}
          >
            <IoMdClose size={25} color={"#000"} />
          </button>
          <div className="w-full flex flex-col items-center">
            <h1 className="text-2xl font-extrabold">Add Trade To Sector</h1>
            <h2 className="text-[#000F2369] text-lg font-medium">
              Provide the sector and window details to add a new trade.
            </h2>
          </div>
          <div className="w-full  flex flex-col items-center mt-10 overflow-hidden">
            <form
              onSubmit={handleSubmit}
              className="w-full  flex flex-col gap-5 px-2"
            >
              <div className="w-full">
                <label
                  htmlFor="trade"
                  className="block text-base font-medium text-black"
                >
                  Select Trade
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
                    data={tradeOptions}
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
                    data={windowOptions}
                    placeholder="Type in or select window"
                    required
                  />
                </div>
              </div>

              <div className="w-full flex justify-center mt-4 space-x-4">
                <button
                  type="button"
                  onClick={closeAddSectorTrade}
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

export default AddSectorTrade;
