import { authorizedApi } from "@/utils/api";
import { Modal, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { BsPerson, BsFileEarmarkText } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { SolarAddSquareBold } from "../core/icons";
import { CashOut, Upload } from "solar-icon-set";
import { Trade } from "@/types";

interface AddContractProps {
  data: any;
  isOpenAddContract: boolean;
  closeAddContract: () => void;
  trades: Trade[]; // Added trades array prop
}

const AddContract: React.FC<AddContractProps> = ({
  data,
  isOpenAddContract,
  closeAddContract,
  trades, // Added trades prop
}) => {
  const [loading, setLoading] = useState(false);
  const [installmentsInput, setInstallmentsInput] = useState(0);
  const [selectedTrade, setSelectedTrade] = useState<any>();
  const [traineesNumber, setTraineesNumber] = useState(0);
  const [paymentType, setPaymentType] = useState<"instant" | "installments">(
    "instant"
  );
  const [formData, setFormData] = useState<{
    name: string;
    file: File | null;
    paymentType: string;
    installments?: number[];
    amount: number;
    tradeTrainees: { trade: Trade; trainees: number }[];
  }>({
    name: "",
    amount: 0,
    file: null,
    paymentType: "",
    tradeTrainees: [],
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const newData = {
      name: formData.name,
      contract: formData.file,
      applicantId: data.applicant.uuid,
      applicationId: data?.uuid,
      amount: formData.amount,
      tradeTrainees: formData.tradeTrainees.map((trd) => ({
        trade_id: trd.trade.uuid,
        numberOfTrainees: trd.trainees,
      })),
      installments: formData.installments,
    };
    console.log(newData);

    const submitForm = new FormData();
    submitForm.append("name", newData.name);
    submitForm.append("contract", newData.contract as Blob);
    submitForm.append("applicantId", newData.applicantId);
    submitForm.append("amount", newData.amount.toString());
    submitForm.append("applicationId", newData.applicationId);
    newData.installments &&
      submitForm.append("installments", newData.installments as any);
    submitForm.append("tradeNumbers", newData.tradeTrainees as any);

    try {
      const res = await authorizedApi.post("/contracts", submitForm, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      notifications.show({
        message: res?.data?.message,
        color: "blue",
      });
      //   setFormData({ file: null, name: "", paymentType: "" });
      closeAddContract();
    } catch (err: any) {
      notifications.show({
        message: err.response?.data?.message ?? "Failed to create contract",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={isOpenAddContract}
      onClose={closeAddContract}
      closeOnClickOutside={false}
      withCloseButton={false}
      centered
      size={""}
    >
      <div className="max-h-[90vh]  w-full md:w-[60vw] lg:w-[45vw]  relative bg-white rounded-3xl p-10 flex flex-col items-center space-y-4">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeAddContract}
        >
          <IoMdClose size={25} color="#000" />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">Amend Contract Info</h1>
        </div>
        <div className="flex flex-col items-center overflow-y-auto modal w-full ">
          <form
            onSubmit={handleSubmit}
            className="w-full  flex flex-col gap-2 px-2"
          >
            <div className="w-full mb-4 ">
              <label
                htmlFor="name"
                className="block text-md font-bold text-gray-700"
              >
                Name of the Contract
              </label>
              <div className="flex items-center w-full bg-gray2 p-2 px-3 rounded-2xl gap-2">
                <CashOut />
                <input
                  type="text"
                  placeholder="Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="flex-grow outline-none bg-transparent py-1"
                />
              </div>
            </div>
            <div className="w-full my-2">
              <label
                htmlFor="fileUpload"
                className="block text-md font-bold text-gray-700"
              >
                Contract
              </label>
              <div className="flex mt-1 p-4 flex-col items-center justify-center w-full h-[100%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer text-primaryText"
                >
                  {formData.file ? (
                    <>
                      <BsFileEarmarkText className="text-primary w-10 h-10" />
                      <div className="text-center">
                        <p className="text-md ">Uploaded file</p>
                        <p className="text-md ">{formData.file.name}</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <Upload className="text-primary w-10 h-10" />
                      <div className="text-center">
                        <p className="text-md   ">Upload file</p>
                        <p className="text-md ">or drag and drop</p>
                      </div>
                    </>
                  )}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      file: e.target.files ? e.target.files[0] : null,
                    }))
                  }
                  required
                  accept=".pdf,.doc,.docx,.odt"
                />
              </div>
            </div>
            <div className="w-full mb-4 ">
              <label
                htmlFor="paymentType"
                className="block text-md font-bold text-gray-700"
              >
                Amount of the Contract
              </label>
              <div className="flex items-center w-full bg-gray2 p-2 px-3 rounded-2xl gap-2">
                <CashOut />
                <input
                  type="number"
                  min={0}
                  placeholder="Total Amount in Rwf"
                  className="flex-grow outline-none bg-transparent py-1"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount: parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            <div className="w-full mb-4">
              <label
                htmlFor="paymentType"
                className="block text-md font-bold text-gray-700"
              >
                Payment Type
              </label>
              <div className="flex items-center w-full bg-gray2 p-2 px-3 rounded-2xl">
                <CashOut />
                <div className="flex-grow">
                  <Select
                    name="paymentType"
                    value={paymentType}
                    onChange={(value) => setPaymentType(value as any)}
                    data={[
                      {
                        value: "instant",
                        label: "Instant Payment",
                      },
                      {
                        value: "installments",
                        label: "Installments Payment",
                      },
                    ]}
                    placeholder="Select your employee role"
                  />
                </div>
              </div>
            </div>
            <div className="mb-4">
              {paymentType === "installments" && (
                <div>
                  <div className="flex items-center gap-4">
                    <div className="w-full mb-4 ">
                      <label
                        htmlFor="paymentType"
                        className="block text-md font-bold text-gray-700"
                      >
                        Installment
                      </label>
                      <div className="flex items-center w-full bg-gray2 p-2 px-3 rounded-2xl gap-2">
                        <CashOut />
                        <input
                          type="number"
                          min={1}
                          max={100}
                          placeholder="Installment Percentage eg:10%"
                          value={installmentsInput}
                          onChange={(e) =>
                            setInstallmentsInput(parseInt(e.target.value))
                          }
                          className="flex-grow outline-none bg-transparent py-1"
                        />
                        <span
                          className=" bg-blue-500 bg-opacity-15 py-1 rounded-2xl px-2  flex gap-1"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              installments: [
                                ...(prev.installments || []),
                                installmentsInput,
                              ],
                            }));
                          }}
                        >
                          <SolarAddSquareBold className="mt-[1px] w-5 h-5 text-blue-500" />
                          <div className="text-blue-500">Add</div>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    {formData.installments?.map((installment, index) => (
                      <div
                        className="bg-primary text-white font-medium px-4 py-2 rounded-full"
                        key={index}
                      >
                        {index + 1} th : {installment} %
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <div className="w-full">
                  <label
                    htmlFor="trade"
                    className="block  font-bold text-gray-700"
                  >
                    Trade/Number of trainees
                  </label>
                  <div className="w-full  flex items-center  bg-gray2  rounded-2xl">
                    <div className="flex-grow  flex items-center gap-2 border-r border-r-gray h-full  p-2">
                      <BsPerson className="w-5 h-5" />
                      <div className="flex-grow">
                        <Select
                          name="trade"
                          value={selectedTrade}
                          onChange={(value) =>
                            setSelectedTrade(
                              trades.find((trade) => trade.uuid === value)
                            )
                          }
                          data={trades.map((trade) => ({
                            value: trade.uuid,
                            label: trade.title,
                          }))}
                          placeholder="Select trade"
                        />
                      </div>
                    </div>
                    <div className="flex-grow flex items-center gap-2 p-2">
                      <BsPerson className="w-5 h-5" />
                      <input
                        type="number"
                        name="trainees"
                        value={traineesNumber}
                        placeholder="Number of trainees"
                        className="outline-none flex-grow  bg-transparent"
                        onChange={(e) =>
                          setTraineesNumber(parseInt(e.target.value))
                        }
                      />
                      <span
                        className=" bg-blue-500 bg-opacity-15 py-1 rounded-2xl px-2  flex gap-1"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            tradeTrainees: [
                              ...prev.tradeTrainees,
                              {
                                trade: selectedTrade,
                                trainees: traineesNumber,
                              },
                            ],
                          }))
                        }
                      >
                        <SolarAddSquareBold className="mt-[1px] w-5 h-5 text-blue-500" />
                        <div className="text-blue-500">Add</div>
                      </span>
                    </div>
                  </div>
                </div>
                <table className="mt-3">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-sm font-medium text-gray-700">
                        Trade
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-700">
                        Number of Trainees
                      </th>
                      <th className="px-4 py-2 text-sm font-medium text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.tradeTrainees?.map((tradeTrainee, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-sm">
                          {tradeTrainee.trade.title}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {tradeTrainee.trainees}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          <button
                            className="bg-primary px-2 text-sm py-1 text-white font-medium rounded-full"
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                tradeTrainees: prev.tradeTrainees.filter(
                                  (trade) =>
                                    trade.trade.uuid !== tradeTrainee.trade.uuid
                                ),
                              }))
                            }
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="w-full flex justify-center mt-4 space-x-4">
                <button
                  type="button"
                  onClick={closeAddContract}
                  className="w-full px-4 py-3 bg-black text-white rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-full px-4 py-3 bg-blue-500 text-white rounded-full"
                >
                  {loading ? "Loading..." : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddContract;
