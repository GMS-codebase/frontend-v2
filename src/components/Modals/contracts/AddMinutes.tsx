import { authorizedApi } from "@/utils/api";
import {
  getApplications,
  getApplicationsForContractSigning,
  getApprovedMinutes,
  getContracts,
  getMinutes,
  getNegotiatedMinutes,
  getRejectedMinutes,
  getUploadedMinutes,
} from "@/services";
import { Modal } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { Folder2, Upload } from "solar-icon-set";

interface AddMinuteProps {
  data: any;
  isOpenAddMinute: boolean;
  closeAddMinute: () => void;
  type: "signed" | "unsigned" | "updated" | "negotiated";
}

const AddMinute: React.FC<AddMinuteProps> = ({
  data,
  isOpenAddMinute,
  closeAddMinute,
  type,
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    file: File | null;
    amount: string;
  }>({
    name: "",
    file: null,
    amount: "",
  });
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.file) {
      notifications.show({
        message: "Please upload a file",
        color: "red",
      });
      return;
    }

    setLoading(true);

    const newData = {
      minute: formData.file,
      applicantId: data?.applicant?.uuid ?? data?.application?.applicant?.uuid,
      applicationId: data?.uuid ?? data?.application?.uuid,
    };
    const submitForm = new FormData();
    submitForm.append("attachment", newData.minute as Blob);
    submitForm.append("applicantID", newData.applicantId);
    submitForm.append("applicationID", newData.applicationId);

    try {
      const response =
        type === "unsigned"
          ? await authorizedApi.post(
              "/negotiation-contract/sdf/upload-negotiation",
              submitForm,
              { headers: { "Content-Type": "multipart/form-data" } },
            )
          : type == "signed"
            ? await authorizedApi.patch(
                "/negotiation-contract/sdf/signed-negotiation-attachment",
                submitForm,
                { headers: { "Content-Type": "multipart/form-data" } },
              )
            : type == "updated"
              ? await authorizedApi.patch(
                  "/negotiation-contract/sdf/update-negotiation-attachment",
                  submitForm,
                  { headers: { "Content-Type": "multipart/form-data" } },
                )
              : await authorizedApi.patch(
                  "/negotiation-contract/sdf/update-negotiation-attachment/negotiate",
                  submitForm,
                  { headers: { "Content-Type": "multipart/form-data" } },
                );

      notifications.show({
        message: response?.data?.data?.message,
        color: "blue",
      });

      setFormData({ file: null, name: "", amount: "" });
      getMinutes(dispatch);
      getUploadedMinutes(dispatch, "sdf");
      getApprovedMinutes(dispatch, "sdf");
      getRejectedMinutes(dispatch, "sdf");
      getNegotiatedMinutes(dispatch, "sdf");
      getContracts(dispatch);
      getApplications(dispatch);
      getApplicationsForContractSigning(dispatch);
      closeAddMinute();
    } catch (err: any) {
      notifications.show({
        message: err.response?.data?.message ?? "Failed to create Minute",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const title =
    type == "unsigned"
      ? "Create New Contract Negotiation"
      : type == "signed"
        ? "Upload Signed Contract Negotiation"
        : "Update Contract Negotiation";
  return (
    <Modal
      opened={isOpenAddMinute}
      onClose={closeAddMinute}
      closeOnClickOutside={false}
      withCloseButton={false}
      centered
      size={""}
    >
      <div className="w-[80vh] h-fit relative bg-white rounded-3xl pt-10 pb-6 flex flex-col items-center">
        <button
          className={"absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"}
          onClick={closeAddMinute}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <h2 className="text-[#000F2369] text-lg font-medium">
            Provide your Minute details to {title}.
          </h2>
        </div>
        <div className="w-4/5 flex flex-col items-center mt-10 overflow-hidden">
          <form
            onSubmit={handleSubmit}
            className="w-full overflow-y-auto flex flex-col gap-2 px-2"
          >
            <div className="w-full my-5">
              <label
                htmlFor="fileUpload"
                className="block text-md font-bold text-gray-700"
              >
                {type == "unsigned"
                  ? "Contract negotiation"
                  : type == "signed"
                    ? "Signed Contract negotiation"
                    : "Updated Contract negotiation"}
              </label>
              <div className="flex mt-1 p-4 flex-col items-center justify-center w-full h-[100%] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                >
                  <Upload className="text-[#005DE9] w-64 h-64 " />
                  {formData.file ? (
                    <div className="text-center">
                      <p className="text-md text-gray-500">Uploaded file</p>
                      <p className="text-md text-gray-400">
                        {formData?.file?.name}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-md text-gray-500">Upload file</p>
                      <p className="text-md text-gray-400">or drag and drop</p>
                    </div>
                  )}
                </label>
                <input
                  id="file-upload"
                  type="file"
                  name="file"
                  style={{ display: "none" }}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="w-full flex justify-center mt-4 space-x-4">
              <button
                type="button"
                onClick={closeAddMinute}
                className="w-full px-4 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {loading ? "Loading..." : "Upload"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default AddMinute;
