import { authorizedApi } from "@/utils/api";
import { Fieldset, Modal, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { BsPerson, BsFileEarmarkText } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { SolarAddSquareBold } from "../core/icons";
import { CashOut, Upload } from "solar-icon-set";
import { Trade } from "@/types";
import {
  getApplicants,
  getApplications,
  getApplicationsForContractSigning,
  getContracts,
} from "@/utils/funcs";
import { useRouter } from "next/navigation";

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
  const dispatch = useDispatch();
  const navigate = useRouter();
  const [loading, setLoading] = useState(false);
  const [installmentsInput, setInstallmentsInput] = useState(0);
  const [traineesNumber, setTraineesNumber] = useState(0);
  const [installmentsError, setInstallmentsError] = useState("");
  const [comment, setComment] = useState("");
  const [title, setTitle] = useState("");
  const [paymentType, setPaymentType] = useState<"instant" | "installments">(
    "instant",
  );
  const [formData, setFormData] = useState<{
    name: string;
    file: File | null;
    paymentType: string;
    installments?: {
      title: string;
      amount: number;
      condition: string;
      percentage: number;
    }[];
    amount: number;
    tradeTrainees: { trade: Trade; trainees: number }[];
  }>({
    name: "",
    amount: 0,
    file: null,
    paymentType: "",
    tradeTrainees: [],
  });

  const validateAddingInstallment = () => {
    const currentTotal = formData.installments?.reduce(
      (sum, value) => sum + value.percentage,
      0,
    );

    if ((currentTotal || 0) + installmentsInput > 100) {
      setInstallmentsError(
        "The total value of installments can not exceed 100%",
      );
      return true;
    } else if (installmentsInput <= 0 || !comment || !title) {
      setInstallmentsError(
        "Title, Installment percentage and comment are required",
      );
      return true;
    } else {
      return false;
    }
  };

  // Add this validation function before handleSubmit
  const validateForm = () => {
    if (!formData.file) {
      notifications.show({
        message: "Please upload a contract file",
        color: "red",
      });
      return false;
    }

    if (formData.amount <= 0) {
      notifications.show({
        message: "Amount must be greater than 0",
        color: "red",
      });
      return false;
    }

    if (traineesNumber <= 0) {
      notifications.show({
        message: "Number of trainees must be greater than 0",
        color: "red",
      });
      return false;
    }
    if (paymentType === "installments") {
      const totalPercentage =
        formData.installments?.reduce(
          (sum, value) => sum + value.percentage,
          0,
        ) || 0;

      if (totalPercentage !== 100) {
        setInstallmentsError("Total installments percentage must equal 100%");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Add form validation
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const newData = {
      name: formData.name,
      contract: formData.file,
      applicantId: data?.application?.applicant?.uuid, // Add null check
      applicationId: data?.application?.uuid,
      amount: formData.amount,
      installments:
        paymentType === "instant"
          ? [
              {
                title: "Full Payment",
                percentage: 100,
                amount: formData.amount,
                condition: "Instant payment",
              },
            ]
          : formData.installments,
    };

    const submitForm = new FormData();
    submitForm.append("attachment", newData.contract as Blob);
    submitForm.append("applicantID", newData.applicantId);
    submitForm.append("totalAmount", newData.amount.toString());
    submitForm.append("numberOfTrainees", traineesNumber.toString());
    submitForm.append("applicationID", newData.applicationId);
    newData.installments &&
      submitForm.append("installments", JSON.stringify(newData.installments));

    try {
      const res = await authorizedApi.post(
        "/negotiation-contract/sdf/upload-contract",
        submitForm,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      notifications.show({
        message: "Contract created successfully",
        color: "blue",
      });
      getApplicants(dispatch);
      getContracts(dispatch);
      getApplications(dispatch);
      getApplicationsForContractSigning(dispatch);
      closeAddContract();
      navigate.refresh();
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
            <div className="w-full mb-4 ">
              <label
                htmlFor="name"
                className="block text-md font-bold text-gray-700"
              >
                Number of Trainees
              </label>
              <div className="flex items-center w-full bg-gray2 p-2 px-3 rounded-2xl gap-2">
                <CashOut />
                <input
                  type="number"
                  min={0}
                  placeholder="Number of Trainees"
                  value={traineesNumber}
                  onChange={(e) => setTraineesNumber(parseInt(e.target.value))}
                  className="flex-grow outline-none bg-transparent py-1"
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
                  <Fieldset legend="Installment">
                    <div className="flex items-center gap-4">
                      <div className="w-full mb-4 ">
                        <label
                          htmlFor="paymentType"
                          className="block text-md font-bold text-gray-700"
                        >
                          Title
                        </label>
                        <div className="flex items-center w-full bg-gray2 p-2 px-3 rounded-2xl gap-2">
                          <CashOut />
                          <input
                            type="text"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => {
                              setTitle(e.target.value);
                            }}
                            className="flex-grow outline-none bg-transparent py-1"
                          />
                        </div>
                        <label
                          htmlFor="paymentType"
                          className="block text-md font-bold text-gray-700"
                        >
                          Percentage
                        </label>
                        <div className="flex items-center w-full bg-gray2 p-2 px-3 rounded-2xl gap-2">
                          <CashOut />
                          <input
                            type="number"
                            // min={1}
                            placeholder="Installment Percentage eg. 20%"
                            value={installmentsInput}
                            onChange={(e) => {
                              setInstallmentsInput(parseInt(e.target.value));
                              installmentsError && setInstallmentsError("");
                            }}
                            className="flex-grow outline-none bg-transparent py-1"
                          />
                        </div>
                        <div className="w-full mb-4 ">
                          <label
                            htmlFor="paymentType"
                            className="block text-md font-bold text-gray-700"
                          >
                            Condition
                          </label>
                          <div className="flex items-center w-full bg-gray2 p-2 px-3 rounded-2xl gap-2">
                            <CashOut />
                            <input
                              type="text"
                              placeholder="Comment"
                              value={comment}
                              onChange={(e) => {
                                setComment(e.target.value);
                              }}
                              className="flex-grow outline-none bg-transparent py-1"
                            />
                          </div>
                        </div>
                        <div
                          className=" bg-blue-500 bg-opacity-15 py-1 rounded-2xl px-2 justify-self-end flex gap-1 cursor-pointer"
                          onClick={() => {
                            setInstallmentsError("");
                            if (validateAddingInstallment()) return;
                            setFormData((prev) => ({
                              ...prev,
                              installments: [
                                ...(prev.installments || []),
                                {
                                  title,
                                  percentage: installmentsInput,
                                  amount:
                                    (installmentsInput * formData.amount) / 100,
                                  condition: comment,
                                },
                              ],
                            }));
                            setTitle("");
                            setInstallmentsInput(0);
                            setComment("");
                          }}
                        >
                          <SolarAddSquareBold className="mt-[1px] w-5 h-5 text-blue-500" />
                          <div className="text-blue-500">Add</div>
                        </div>
                      </div>
                    </div>
                  </Fieldset>
                  {installmentsError && (
                    <p className="text-red-500 text-sm mt-3">
                      {installmentsError}
                    </p>
                  )}
                  {formData.installments &&
                    formData.installments.length > 0 && (
                      <div className="mt-4 overflow-x-auto">
                        <h1 className="text-lg font-bold">Preview</h1>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                No.
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Percentage
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Condition
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {formData.installments.map((installment, index) => (
                              <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {index + 1}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {installment.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {installment.percentage}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {installment.amount.toLocaleString()} Rwf
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {installment.condition.length > 20
                                    ? `${installment.condition.substring(0, 20)}...`
                                    : installment.condition}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <button
                                    onClick={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        installments: prev.installments?.filter(
                                          (_, i) => i !== index,
                                        ),
                                      }));
                                    }}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                </div>
              )}
            </div>
            <div className="space-y-3 mb-4">
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
