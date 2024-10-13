import { Modal, Stepper, Button } from "@mantine/core";
import { FormEvent, useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { SolarDownloadMinimalisticBold, SolarUploadBold } from "../core/icons";
import { authorizedApi } from "@/utils/api";
import { notifications } from "@mantine/notifications";

const AddTrainee = ({
  isOpenEditTrainee,
  closeEditTrainee,
  finishEditingTrainee,
}: {
  isOpenEditTrainee: boolean;
  closeEditTrainee: () => void;
  finishEditingTrainee?: () => void;
}) => {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleDownload = () => {
    const data = `
            Title of Application:
            The focus of this application is to provide a Master in Business Administration (MBA) in ICT program for Leaders, Professional Managers for a meaningful impact in the disruptive new era.

            Project Activities and Outcome:
            COFOPRO is a private company limited by individual shares aimed to develop made in Rwanda garment manufacturing at fair and affordable prices on the Rwandan market and also aimed to expand our garment manufacturing by exporting our products. We also give training for skills upgrading for workers and other individuals who have knowledge in tailoring, and we also provide training on the use of modern tailoring equipment.

            Information about the institution to host beneficiaries:
            We are a domestic garment company which sews all kinds of men's clothes which are: suits, shirts, trousers, and different kinds of uniforms, and we also deal with women's clothes excluding underwear.

            Information about the institution to host beneficiaries - (Continued):
            The applying company/industry to host apprentices should attach the recommendation from PSF
        `;
    const blob = new Blob([data], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "Trainee_Details.txt"; // Change file name to Trainee
    link.click();
    URL.revokeObjectURL(url); // Clean up the URL object
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    // Add your upload logic here using `authorizedApi`
    // Example:
    // try {
    //     await authorizedApi.post('/upload', formData);
    //     notifications.show({ title: 'Success', message: 'File uploaded successfully' });
    //     finishEditingTrainee && finishEditingTrainee();
    // } catch (error) {
    //     notifications.show({ title: 'Error', message: 'File upload failed' });
    // } finally {
    //     setLoading(false);
    // }
  };

  const nextStep = () => {
    setActive((current) => (current < 2 ? current + 1 : current));
  };

  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Modal
      size="lg"
      opened={isOpenEditTrainee}
      onClose={closeEditTrainee}
      closeOnClickOutside={false}
      withCloseButton={false}
    >
      <div className="w-[600px] relative bg-white rounded-3xl pt-10 pb-10 flex flex-col items-center p-5">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={closeEditTrainee}
        >
          <IoMdClose size={25} color={"#000"} />
        </button>

        <div className="w-full">
          {/* Left section: Add Trainee information */}
          <div className="flex flex-col items-start pr-4">
            <h2 className="text-[#000F23] text-lg font-extrabold">
              Edit Trainee
            </h2>
            <p className="text-slate-400 font-medium">
              You can fill and upload an Excel file to edit trainees.
            </p>
          </div>

          {/* Right section: Stepper with inputs */}
          <div>
            <Stepper active={active} onStepClick={setActive} className="w-full">
              <Stepper.Step label="Get Template" className="text-xs">
                <div className="w-full flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <div className="font-bold text-[#000F23]">
                      <p>Download Excel Template</p>
                    </div>
                    <div
                      className="flex gap-2 text-[#005DE9] cursor-pointer bg-[#005DE9] bg-opacity-10 rounded-3xl border border-1 border-[#005DE9] border-opacity-10 py-2 px-2 items-center justify-center"
                      onClick={handleDownload}
                    >
                      <span>
                        <SolarDownloadMinimalisticBold />
                      </span>
                      <p>Download Excel Template</p>
                    </div>
                  </div>
                </div>
              </Stepper.Step>

              <Stepper.Step label="Upload File" className="text-xs">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-normal">Attachment</h3>
                    <div className="relative mt-1 flex flex-col items-center justify-center w-full h-[15vh] border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                      <label
                        htmlFor="file-upload"
                        className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
                      >
                        <SolarUploadBold className="text-blue-500 text-3xl" />
                        <div className="text-center">
                          <p className="text-sm text-[#000F23] font-bold">
                            Upload Excel file
                          </p>
                          <p className="text-xs text-gray-400">
                            Drag & Drop or Click to upload file
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
                </div>
              </Stepper.Step>
            </Stepper>

            {/* Navigation Buttons */}
            <div className="w-full flex justify-between gap-3 mt-4">
              <button
                onClick={prevStep}
                disabled={active === 0}
                className="w-full px-6 py-3 bg-black text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Previous
              </button>
              <button
                onClick={nextStep}
                disabled={active === 1}
                className="w-full px-6 py-3 bg-blue-500 text-white rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddTrainee;
