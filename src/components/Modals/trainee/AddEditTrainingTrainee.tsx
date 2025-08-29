import { SolarCheckCircleBold, SolarUploadBold } from "@/components/core/icons";
import { addTrainees, editTrainee } from "@/services";
import { ITrainingTrainee } from "@/types/trainings";
import { Modal, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";

const AddEditTrainingTrainee = ({
  isOpenAddEditTrainee,
  closeAddEditTrainee,
  defaultData,
  trainingId,
}: {
  isOpenAddEditTrainee: boolean;
  closeAddEditTrainee: () => void;
  defaultData?: ITrainingTrainee;
  trainingId?: string;
}) => {
  const dispatch = useDispatch();
  const { editTraineeLoading, addTraineesLoading } = useSelector(
    (state: any) => state.trainings
  );
  const [errors, setErrors] = useState<any>({});
  const [traineesFile, setTraineesFile] = useState<File | string | null>(null);

  const [trainees, setTrainees] = useState<
    {
      firstName: string;
      lastName: string;
      nationalId: string;
      dob: string;
      gender: string;
      district: string;
      disability: string;
      parentPhoneNumber: string;
      traineePhoneNumber: string;
      trainingProgram: string;
      educationLevel: string;
      institutionName: string;
      maritalStatus: string;
    }[]
  >([]);

  const [traineeData, setTraineeData] = useState({
    firstName: "",
    lastName: "",
    nationalId: "",
    dob: "",
    gender: "",
    district: "",
    disability: "",
    parentPhoneNumber: "",
    traineePhoneNumber: "",
    trainingProgram: "",
    educationLevel: "",
    institutionName: "",
    maritalStatus: "",
  });

  useEffect(() => {
    if (defaultData) {
      setTraineeData({
        firstName: defaultData.firstName,
        lastName: defaultData.lastName,
        nationalId: defaultData.nationalId,
        dob: defaultData.dob!,
        gender: defaultData.gender.toUpperCase(),
        district: defaultData.district,
        disability: defaultData.disability,
        parentPhoneNumber: defaultData.parentPhoneNumber,
        traineePhoneNumber: defaultData.traineePhoneNumber,
        trainingProgram: defaultData.trainingProgram,
        educationLevel: defaultData.educationLevel,
        institutionName: defaultData.institutionName,
        maritalStatus: defaultData.maritalStatus.toUpperCase(),
      });
    }
  }, [defaultData, trainingId]);

  const handleTraineeChange = (e: any) => {
    const { name, value } = e.target;
    setTraineeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const reset = () => {
    setTraineeData({
      firstName: "",
      lastName: "",
      nationalId: "",
      dob: "",
      gender: "",
      district: "",
      disability: "",
      parentPhoneNumber: "",
      traineePhoneNumber: "",
      trainingProgram: "",
      educationLevel: "",
      institutionName: "",
      maritalStatus: "",
    });
  };

  const handleAddTrainee = () => {
    const newErrors: any = {
      firstName: !traineeData.firstName ? "First name is required" : "",
      lastName: !traineeData.lastName ? "Last name is required" : "",
      nationalId: !traineeData.nationalId ? "National ID is required" : "",
      dob: !traineeData.dob ? "Date of birth is required" : "",
      gender: !traineeData.gender ? "Gender is required" : "",
      district: !traineeData.district ? "District is required" : "",
      disability: !traineeData.disability
        ? "Disability status is required"
        : "",
      parentPhoneNumber: !traineeData.parentPhoneNumber
        ? "Parent phone number is required"
        : "",
      traineePhoneNumber: !traineeData.traineePhoneNumber
        ? "Trainee phone number is required"
        : "",
      trainingProgram: !traineeData.trainingProgram
        ? "Training program is required"
        : "",
      educationLevel: !traineeData.educationLevel
        ? "Education level is required"
        : "",
      institutionName: !traineeData.institutionName
        ? "Institution name is required"
        : "",
      maritalStatus: !traineeData.maritalStatus
        ? "Marital status is required"
        : "",
    };

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }

    setTrainees((prev) => [...prev, { ...traineeData }]);
    reset();
    setErrors({});
  };

  const handleRemoveTrainee = (index: number) => {
    setTrainees((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    setErrors({});

    if (defaultData) {
      dispatch(editTrainee(defaultData.uuid, traineeData) as any);
    } else {
      if (!trainees.length && !traineesFile) {
        setErrors({ trainees: "Trainees or trainees file is required" });
        return notifications.show({
          message: "Please fill all required fields",
          color: "red",
        });
      }
      dispatch(addTrainees(trainingId!, trainees) as any);
    }
    reset();
    setTrainees([]);
    setTraineesFile(null);
    closeAddEditTrainee();
  };

  return (
    <Modal
      size={defaultData ? "40%" : "70%"}
      opened={isOpenAddEditTrainee}
      onClose={closeAddEditTrainee}
      centered
      closeOnClickOutside={false}
      withCloseButton={false}
      styles={{ body: { overflow: "auto", maxHeight: "90vh" } }}
    >
      <div className="w-full max-w-[100vw] md:max-w-[90vw] max-h-[90vh] overflow-y-auto relative bg-white rounded-2xl pt-8 pb-8 flex flex-col items-center">
        <button
          className={"absolute top-4 right-4 bg-gray-100 p-1 rounded-md"}
          onClick={closeAddEditTrainee}
        >
          <IoMdClose size={20} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold">
            {defaultData ? "Update Trainee" : "Add Trainee(s)"}
          </h1>
          <h2 className="text-[#000F2369] text-base font-medium">
            Provide the details to {defaultData ? "update" : "add  new"}{" "}
            trainee(s).
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-4 px-10">
          <div className="flex flex-col gap-4 md:flex-row w-full">
            <div
              className={`flex flex-col gap-4 w-full ${defaultData === undefined && "md:w-3/5"}`}
            >
              {!defaultData && (
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2">
                    <a
                      href={"/files/trainee_creation_format.xlsx"}
                      download={true}
                      className="w-full py-2 px-4 text-center justify-center font-bold bg-primary text-white flex items-center rounded-full"
                    >
                      <span className="hidden lg:flex">Download Template</span>
                    </a>
                  </div>
                  <div className="w-full border-dashed border-2 border-blue-500 rounded-xl h-40 flex items-center justify-center bg-[#000F230A]">
                    <label className="cursor-pointer flex flex-col items-center justify-center text-center">
                      {traineesFile ? (
                        <>
                          <SolarCheckCircleBold className="text-blue-500 text-3xl" />
                          <p className="text-sm">File Uploaded</p>
                          <p className="text-xs text-gray-400">
                            {traineesFile instanceof File
                              ? traineesFile.name
                              : traineesFile}
                          </p>
                        </>
                      ) : (
                        <>
                          <SolarUploadBold className="text-blue-500 text-3xl" />
                          <p className="text-sm">Upload File</p>
                          <p className="text-xs text-gray-400">
                            Drag & Drop or click to upload file
                          </p>
                        </>
                      )}
                      <input
                        type="file"
                        name="traineesFile"
                        onChange={(e) =>
                          setTraineesFile(e.target.files?.[0] || null)
                        }
                        accept=".xlsx,.xls"
                        hidden
                      />
                    </label>
                  </div>
                  {errors.trainees && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.trainees}
                    </p>
                  )}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={traineeData.firstName}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.firstName ? "border-red-500" : ""}`}
                    placeholder="First name"
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={traineeData.lastName}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.lastName ? "border-red-500" : ""}`}
                    placeholder="Last name"
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">National ID</label>
                  <input
                    type="text"
                    name="nationalId"
                    value={traineeData.nationalId}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.nationalId ? "border-red-500" : ""}`}
                    placeholder="National ID"
                  />
                  {errors.nationalId && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.nationalId}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={traineeData.dob}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.dob ? "border-red-500" : ""}`}
                  />
                  {errors.dob && (
                    <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Gender</label>
                  <Select
                    data={["MALE", "FEMALE", "OTHER"]}
                    value={traineeData.gender}
                    onChange={(val) =>
                      setTraineeData((prev) => ({
                        ...prev,
                        gender: val || "",
                      }))
                    }
                    placeholder="Select gender"
                    className={`rounded-xl text-sm bg-gray-100 ${errors.gender ? "border-red-500" : ""}`}
                  />
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">District</label>
                  <input
                    type="text"
                    name="district"
                    value={traineeData.district}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.district ? "border-red-500" : ""}`}
                    placeholder="District"
                  />
                  {errors.district && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.district}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Disability</label>
                  <Select
                    data={["Yes", "No"]}
                    value={traineeData.disability}
                    onChange={(val) =>
                      setTraineeData((prev) => ({
                        ...prev,
                        disability: val || "",
                      }))
                    }
                    placeholder="Do they have a disability?"
                    className={`rounded-xl text-sm bg-gray-100 ${errors.disability ? "border-red-500" : ""}`}
                  />
                  {errors.disability && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.disability}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">
                    Parent/Guardian Phone
                  </label>
                  <input
                    type="tel"
                    name="parentPhoneNumber"
                    value={traineeData.parentPhoneNumber}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.parentPhoneNumber ? "border-red-500" : ""}`}
                    placeholder="Parent phone"
                  />
                  {errors.parentPhoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.parentPhoneNumber}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Trainee Phone</label>
                  <input
                    type="tel"
                    name="traineePhoneNumber"
                    value={traineeData.traineePhoneNumber}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.traineePhoneNumber ? "border-red-500" : ""}`}
                    placeholder="Trainee phone"
                  />
                  {errors.traineePhoneNumber && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.traineePhoneNumber}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">
                    Training Program
                  </label>
                  <input
                    type="text"
                    name="trainingProgram"
                    value={traineeData.trainingProgram}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.trainingProgram ? "border-red-500" : ""}`}
                    placeholder="Training program"
                  />
                  {errors.trainingProgram && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.trainingProgram}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Education Level</label>
                  <Select
                    data={["Primary", "Secondary", "Vocational", "University"]}
                    value={traineeData.educationLevel}
                    onChange={(val) =>
                      setTraineeData((prev) => ({
                        ...prev,
                        educationLevel: val || "",
                      }))
                    }
                    placeholder="Select level"
                    className={`rounded-xl text-sm bg-gray-100 ${errors.educationLevel ? "border-red-500" : ""}`}
                  />
                  {errors.educationLevel && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.educationLevel}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">
                    Institution Name
                  </label>
                  <input
                    type="text"
                    name="institutionName"
                    value={traineeData.institutionName}
                    onChange={handleTraineeChange}
                    className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.institutionName ? "border-red-500" : ""}`}
                    placeholder="Institution name"
                  />
                  {errors.institutionName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.institutionName}
                    </p>
                  )}
                </div>
                <div className="flex flex-col">
                  <label className="text-sm font-medium">Marital Status</label>
                  <Select
                    data={["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"]}
                    value={traineeData.maritalStatus}
                    onChange={(val) =>
                      setTraineeData((prev) => ({
                        ...prev,
                        maritalStatus: val || "",
                      }))
                    }
                    placeholder="Select marital status"
                    className={`rounded-xl text-sm bg-gray-100 ${errors.maritalStatus ? "border-red-500" : ""}`}
                  />
                  {errors.maritalStatus && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.maritalStatus}
                    </p>
                  )}
                </div>
              </div>
              {defaultData === undefined && (
                <div className="flex justify-between gap-4">
                  <button
                    onClick={handleAddTrainee}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm outline-none text-sm"
                  >
                    Add Trainee
                  </button>
                </div>
              )}
              <div className="flex justify-between gap-4 mt-4">
                <button
                  onClick={closeAddEditTrainee}
                  className="w-full px-4 py-2 bg-black text-white rounded-xl shadow-sm outline-none text-sm"
                >
                  cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={addTraineesLoading || editTraineeLoading}
                  className="w-full px-4 py-2 bg-blue-600 text-white flex items-center justify-center gap-5 rounded-xl shadow-sm outline-none text-sm"
                >
                  {editTraineeLoading && (
                    <Loader2 className="animate-spin mr-2" />
                  )}
                  {addTraineesLoading || editTraineeLoading
                    ? "Saving..."
                    : defaultData
                      ? "Update Trainee"
                      : "Add Trainee(s)"}
                </button>
              </div>
            </div>
            {defaultData === undefined && (
              <div
                className={`hidden md:block w-full ${defaultData === undefined && "md:w-2/5"} bg-gray-100 rounded-xl p-4 max-h-[100vh]`}
              >
                <h3 className="text-base font-medium mb-2">Trainees Preview</h3>
                <div className="flex flex-col gap-2 overflow-y-scroll max-h-[90vh]">
                  {trainees.map((trainee, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-white px-3 py-1 rounded-xl shadow-sm text-sm"
                    >
                      <span>{`${trainee.firstName} ${trainee.lastName}`}</span>
                      <button
                        onClick={() => handleRemoveTrainee(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <IoMdClose size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditTrainingTrainee;
