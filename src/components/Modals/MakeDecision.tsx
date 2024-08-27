import { ADD_WINDOW_SUCCESS } from "@/actions/WindowsActions";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { Modal, MultiSelect } from "@mantine/core";
import { SolarDocumentsBold } from "@/components/core/icons/index";
import TextArea2 from "../textarea2";
import TextArea from "../ApplicantDetails/TextArea";
import { SolarAddSquareBold, SolarUploadBold } from "../core/icons";

interface DueDiligencyProps {
    isOpenAddDue: boolean;
    closeAddDue: () => void;
    onMakeDecision: () => void;
}

const MakeDecision = ({
    isOpenAddDue,
    closeAddDue,
    onMakeDecision,
}: DueDiligencyProps) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });
    const [selectedSelectors, setSelectedSelectors] = useState<any>([]);
    const trades = useSelector((state: any) => state.trades);
    console.log(trades);
    const MultiSelectData = trades?.trades?.map((trade: any) => {
        return { value: trade.uuid, label: trade.name };
    });

    const handleChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Modal
            size={"xl"}
            opened={isOpenAddDue}
            onClose={closeAddDue}
            closeOnClickOutside={false}
            withCloseButton={false}
        >
            <div className="w-full h-[90vh] relative bg-white rounded-3xl pt-6 pb-6 flex flex-col items-center">
                <button
                    className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
                    onClick={closeAddDue}
                >
                    <IoMdClose size={25} color={"#000"} />
                </button>
                <div className="w-full flex flex-col items-center">
                    <h1 className="text-2xl font-extrabold">Make decision</h1>
                </div>
                <div className="w-4/5 flex flex-col items-center mt-10 overflow-hidden">
                    <form className="w-full overflow-y-auto flex flex-col gap-4 px-2">
                        <div className="w-full flex justify-between gap-3">
                            <div className="w-full">
                                <label
                                    htmlFor="WindowTitle"
                                    className="block font-semibold text-sm text-gray-700"
                                >
                                    Decision
                                </label>
                                <div className="w-full relative">
                                    <span className="absolute left-2 top-[10px]">
                                        <SolarDocumentsBold />
                                    </span>
                                    <select
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="mt-1 block w-full pl-8 px-12 text-gray-400 py-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-base"
                                        required
                                    >
                                        <option value="" disabled>
                                            Select your decision
                                        </option>
                                        <option value="decision1">
                                            Decision 1
                                        </option>
                                        <option value="decision2">
                                            Decision 2
                                        </option>
                                        <option value="decision3">
                                            Decision 3
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <label
                                htmlFor="trade"
                                className="block text-base font-medium text-black"
                            >
                                Choose Trades
                            </label>
                            <div className="mt-1 pl-6 relative w-full bg-[#000F230A] py-1 block rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <span className="absolute left-2 top-3 text-black text-lg">
                                    <SolarDocumentsBold />
                                </span>
                                <div className="flex items-center justify-between">
                                    <MultiSelect
                                        name="sectors"
                                        disabled={!MultiSelectData}
                                        onChange={setSelectedSelectors}
                                        data={
                                            MultiSelectData
                                                ? MultiSelectData
                                                : [
                                                      {
                                                          value: "NO trades",
                                                          label: "No trades Created!",
                                                      },
                                                  ]
                                        }
                                        placeholder="Select or type in a sector"
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="ml-2 bg-[#005DE9] bg-opacity-15 text-[#005DE9]   py-2 px-2 rounded-full flex items-center gap-2"
                                    >
                                        <span className="text-xl">
                                            <SolarAddSquareBold />
                                        </span>
                                        <span>Add Trades</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col mt-4">
                            {/* <span className="absolute left-2 top-[10px]">
                                <SolarDocumentsBold />
                            </span> */}
                            <h3 className="font-semibold text-sm">
                                Number of trainees
                            </h3>
                            <TextArea2 />
                        </div>

                        <div className="flex flex-col mt-4">
                            <h3 className="font-semibold text-sm">
                                Add Attachment
                            </h3>
                            <div className="relative mt-1 flex flex-col items-center justify-center w-full h-[15vh] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                                <label
                                    htmlFor="file-upload"
                                    className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                                >
                                    <SolarUploadBold className="text-blue-500 text-3xl" />
                                    <div className="text-center">
                                        <p className="text-sm text-gray-500">
                                            Upload file
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Drag & Drop or click to upload
                                        </p>
                                    </div>
                                </label>
                                <input
                                    id="file-upload"
                                    type="file"
                                    style={{ display: "none" }}
                                    className="content-none"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col mt-4">
                            <h3 className="font-semibold text-sm">Comment</h3>
                            <TextArea />
                        </div>

                        <div className="w-full flex justify-center mt-4 space-x-4">
                            <button
                                type="button"
                                onClick={closeAddDue}
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
    );
};

export default MakeDecision;
