import { Modal, MultiSelect, Popover, Select, Stepper } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { authorizedApi } from "@/utils/api";
import { Training } from "@/types";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { Folder2 } from "solar-icon-set";
import { SolarUploadBold, SolarCheckCircleBold } from "@/components/core/icons";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import {
  ADD_TRAINING_SUCCESS,
  UPDATE_TRAINING_SUCCESS,
} from "@/actions/TrainingActions";
import { getMyApplications, getTrainings } from "@/services";
import { UnknownAction } from "redux";
import { IPaginatedQuery } from "@/types/base.type";

const AddEditTraining = ({
  isOpenAddEditTraining,
  closeAddEditTraining,
  defaultData,
  applicationId,
}: {
  isOpenAddEditTraining: boolean;
  closeAddEditTraining: () => void;
  defaultData?: Training;
  applicationId?: string;
}) => {
  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [startOpened, setStartOpened] = useState(false);
  const [endOpened, setEndOpened] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const startRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [trainingManual, setTrainingManual] = useState<File | string | null>(
    null
  );
  const [traineesFile, setTraineesFile] = useState<File | string | null>(null);

  const [formData, setFormData] = useState<Partial<Training>>({
    title: "",
    startDate: "",
    endDate: "",
    competencies: [],
    applicationId: applicationId || "",
  });

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
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [competenceInput, setCompetenceInput] = useState("");
  const dispatch = useDispatch();
  // const myApplications = useSelector((state: any) => state.applications);
  // console.log(myApplications.myApplications);

  const {
    myApplications,
    myApplicationsLoading,
    total: totalApplications,
    page: currentPageFromRedux,
  } = useSelector((state: any) => state.applications);

  const [paginateOpts, setLocalPaginateOpts] = useState<
    IPaginatedQuery & { totalPages: number }
  >({
    page: (currentPageFromRedux ?? 1) - 1,
    limit: 30,
    totalPages: 1,
  });

  useEffect(() => {
    setLocalPaginateOpts((prev) => ({
      ...prev,
      totalPages: Math.ceil((totalApplications ?? 0) / (prev?.limit ?? 10)),
    }));
  }, [totalApplications]);

  // Fetch data whenever page or limit changes
  useEffect(() => {
    dispatch(
      getMyApplications(
        (paginateOpts.page ?? 0) + 1,
        paginateOpts.limit
      ) as unknown as UnknownAction
    );
  }, [dispatch, paginateOpts.page, paginateOpts.limit]);

  useEffect(() => {
    if (defaultData) {
      setFormData({
        title: defaultData.title,
        startDate: defaultData.startDate.toString(),
        endDate: defaultData.endDate.toString(),
        competencies:
          JSON.parse(defaultData.competencies.join(",") as string) || [],
        applicationId: defaultData.applicationId || applicationId || "",
      });
      setTrainingManual(defaultData.trainingManual || null);
      setTraineesFile(defaultData.traineesFile || null);
      setCompetencies(
        JSON.parse(defaultData.competencies.join(",") as string) || []
      );
      setTrainees(defaultData.trainees || []);
    }
  }, [defaultData, applicationId]);

  const nextStep = () =>
    setActive((current) => (current < 2 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTraineeChange = (e: any) => {
    const { name, value } = e.target;
    setTraineeData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCompetenceChange = (e: any) => {
    setCompetenceInput(e.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (startRef.current && !startRef.current.contains(e.target as Node)) {
        setShowStartPicker(false);
      }
      if (endRef.current && !endRef.current.contains(e.target as Node)) {
        setShowEndPicker(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const formatDisplay = (dateStr?: string) =>
    dateStr ? dayjs(dateStr).format("YYYY-MM-DD") : "";

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
    setErrors({});
  };

  const handleRemoveTrainee = (index: number) => {
    setTrainees((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCompetence = () => {
    if (competenceInput.trim()) {
      setCompetencies((prev) => [...prev, competenceInput.trim()]);
      setFormData((prev) => ({
        ...prev,
        competencies: [...(prev.competencies || []), competenceInput.trim()],
      }));
      setCompetenceInput("");
    }
  };

  const handleRemoveCompetence = (index: number) => {
    setCompetencies((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      competencies: prev.competencies?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const newErrors: any = {};
    if (!formData.title) newErrors.title = "Title is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.competencies?.length)
      newErrors.competencies = "At least one competency is required";
    if (!formData.applicationId)
      newErrors.applicationId = "Application ID is required";
    if (!trainees.length && !traineesFile)
      newErrors.trainees = "Trainees or trainees file is required";

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setLoading(false);
      notifications.show({
        message: "Please fill all required fields",
        color: "red",
      });
      return;
    }

    const submitData = new FormData();
    submitData.append("title", formData.title as string);
    submitData.append("startDate", formData.startDate as string);
    submitData.append("endDate", formData.endDate as string);
    submitData.append("competencies", JSON.stringify(formData.competencies));
    submitData.append("applicationId", formData.applicationId as string);

    if (trainees.length) {
      trainees.forEach((trainee, index) => {
        submitData.append(`trainees[${index}][firstName]`, trainee.firstName);
        submitData.append(`trainees[${index}][lastName]`, trainee.lastName);
        submitData.append(`trainees[${index}][nationalId]`, trainee.nationalId);
        submitData.append(`trainees[${index}][dob]`, trainee.dob);
        submitData.append(
          `trainees[${index}][gender]`,
          trainee.gender.toUpperCase()
        );
        submitData.append(`trainees[${index}][district]`, trainee.district);
        submitData.append(`trainees[${index}][disability]`, trainee.disability);
        submitData.append(
          `trainees[${index}][parentPhoneNumber]`,
          trainee.parentPhoneNumber
        );
        submitData.append(
          `trainees[${index}][traineePhoneNumber]`,
          trainee.traineePhoneNumber
        );
        submitData.append(
          `trainees[${index}][trainingProgram]`,
          trainee.trainingProgram
        );
        submitData.append(
          `trainees[${index}][educationLevel]`,
          trainee.educationLevel
        );
        submitData.append(
          `trainees[${index}][institutionName]`,
          trainee.institutionName
        );
        submitData.append(
          `trainees[${index}][maritalStatus]`,
          trainee.maritalStatus.toUpperCase()
        );
      });
    }

    if (traineesFile) {
      submitData.append("traineesFile", traineesFile);
    }

    if (trainingManual) {
      submitData.append("trainingManual", trainingManual);
    }

    for (const [key, value] of submitData.entries()) {
      console.log(`FormData ${key}:`, value);
    }

    const apiUrl = defaultData
      ? `/training/${defaultData.uuid}`
      : "/training/create";

    try {
      const res = await (defaultData
        ? authorizedApi.put(apiUrl, submitData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
        : authorizedApi.post(apiUrl, submitData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }));

      dispatch({
        type: defaultData ? UPDATE_TRAINING_SUCCESS : ADD_TRAINING_SUCCESS,
        payload: res.data.data.data,
      });

      notifications.show({
        message: defaultData
          ? "Training updated successfully!"
          : "Training created successfully!",
        color: "blue",
      });

      // Reset form
      setFormData({
        title: "",
        startDate: "",
        endDate: "",
        competencies: [],
        applicationId: applicationId || "",
      });
      setTrainingManual(null);
      setTraineesFile(null);
      setTrainees([]);
      setCompetencies([]);
      setActive(0);

      getTrainings(dispatch);
      closeAddEditTraining();
    } catch (err: any) {
      console.error("Submission error:", err.response?.data);
      notifications.show({
        message: err.response?.data?.message,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      size={"60%"}
      opened={isOpenAddEditTraining}
      onClose={closeAddEditTraining}
      centered
      closeOnClickOutside={false}
      withCloseButton={false}
      styles={{ body: { overflow: "auto", maxHeight: "90vh" } }}
    >
      <div className="w-full max-w-[100vw] md:max-w-[90vw] max-h-[90vh] overflow-y-auto relative bg-white rounded-2xl pt-8 pb-8 flex flex-col items-center">
        <button
          className={"absolute top-4 right-4 bg-gray-100 p-1 rounded-md"}
          onClick={closeAddEditTraining}
        >
          <IoMdClose size={20} color={"#000"} />
        </button>
        <div className="w-full flex flex-col items-center">
          <h1 className="text-2xl font-bold">
            {defaultData ? "Update Training" : "Create Training"}
          </h1>
          <h2 className="text-[#000F2369] text-base font-medium">
            Provide your details to {defaultData ? "update" : "create a new"}{" "}
            training.
          </h2>
        </div>
        <div className="w-full flex flex-col items-center mt-4 px-[3%]">
          <Stepper
            active={active}
            onStepClick={setActive}
            className="w-full"
            styles={{ steps: { gap: "1rem" } }}
          >
            {/* Step 1 - Training Details */}
            <Stepper.Step label="Training Details">
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700">
                    Title
                  </label>
                  <div className="w-full relative mt-1">
                    <span className="absolute left-2 top-[10px]">
                      <Folder2 />
                    </span>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      placeholder="Training title"
                      onChange={handleChange}
                      className={`block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm ${errors.title ? "border-red-500" : ""}`}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.title}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">
                    Select Application
                  </label>
                  <Select
                    placeholder="Select application"
                    data={
                      myApplications
                        ?.filter(
                          (app: any) => app.currentStage === "CONTRACT_SIGNING"
                        )
                        .map((app: any) => ({
                          value: app.uuid,
                          label: app.applicationNumber,
                        })) || "No applications on contract signing"
                    }
                    value={formData.applicationId}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        applicationId: value || "",
                      }))
                    }
                    className="bg-[#000F230A] rounded-xl mt-1"
                    error={errors.applicationId}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-sm font-medium">Start Date</label>
                    <Popover
                      opened={startOpened}
                      onChange={setStartOpened}
                      position="bottom-start"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <input
                          type="text"
                          readOnly
                          value={formatDisplay(formData.startDate)}
                          placeholder="YYYY-MM-DD"
                          onClick={() => {
                            setStartOpened((o) => !o);
                            setEndOpened(false);
                          }}
                          className={`mt-1 w-full pl-3 py-2 bg-[#000F230A] rounded-xl cursor-pointer text-sm ${errors.startDate ? "border-red-500" : ""}`}
                        />
                      </Popover.Target>
                      <Popover.Dropdown>
                        <DatePicker
                          value={
                            formData.startDate
                              ? new Date(formData.startDate)
                              : null
                          }
                          onChange={(date) => {
                            const formatted = date
                              ? dayjs(date).format("YYYY-MM-DD")
                              : "";
                            setFormData((prev: any) => ({
                              ...prev,
                              startDate: formatted,
                            }));
                            setStartOpened(false);
                          }}
                          minDate={new Date()}
                        />
                      </Popover.Dropdown>
                    </Popover>
                    {errors.startDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.startDate}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="text-sm font-medium">End Date</label>
                    <Popover
                      opened={endOpened}
                      onChange={setEndOpened}
                      position="bottom-start"
                      withArrow
                      shadow="md"
                    >
                      <Popover.Target>
                        <input
                          type="text"
                          readOnly
                          value={formatDisplay(formData.endDate)}
                          placeholder="YYYY-MM-DD"
                          onClick={() => {
                            setEndOpened((o) => !o);
                            setStartOpened(false);
                          }}
                          className={`mt-1 w-full pl-3 py-2 bg-[#000F230A] rounded-xl cursor-pointer text-sm ${errors.endDate ? "border-red-500" : ""}`}
                        />
                      </Popover.Target>
                      <Popover.Dropdown>
                        <DatePicker
                          value={
                            formData.endDate ? new Date(formData.endDate) : null
                          }
                          onChange={(date) => {
                            const formatted = date
                              ? dayjs(date).format("YYYY-MM-DD")
                              : "";
                            setFormData((prev: any) => ({
                              ...prev,
                              endDate: formatted,
                            }));
                            setEndOpened(false);
                          }}
                          minDate={
                            formData.startDate
                              ? new Date(formData.startDate)
                              : undefined
                          }
                        />
                      </Popover.Dropdown>
                    </Popover>
                    {errors.endDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.endDate}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={closeAddEditTraining}
                    className="w-full px-4 py-2 bg-black text-white rounded-xl shadow-sm outline-none text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm outline-none text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>
            {/* Step 2 - Training Material Upload */}
            <Stepper.Step label="Training Material Upload">
              <div className="flex flex-col gap-4">
                <div className="w-full border-dashed border-2 border-blue-500 rounded-xl h-40 flex items-center justify-center bg-[#000F230A]">
                  <label className="cursor-pointer flex flex-col items-center justify-center text-center">
                    {trainingManual ? (
                      <>
                        <SolarCheckCircleBold className="text-blue-500 text-3xl" />
                        <p className="text-sm">File Uploaded</p>
                        <p className="text-xs text-gray-400">
                          {trainingManual instanceof File
                            ? trainingManual.name
                            : trainingManual}
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
                      name="trainingManual"
                      onChange={(e) =>
                        setTrainingManual(e.target.files?.[0] || null)
                      }
                      accept=".pdf,.doc,.docx"
                      hidden
                    />
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium">Competencies</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="text"
                      value={competenceInput}
                      onChange={handleCompetenceChange}
                      className={`w-full px-3 py-2 bg-[#000F230A] rounded-xl text-sm ${errors.competencies ? "border-red-500" : ""}`}
                      placeholder="Type a competence"
                    />
                    <button
                      onClick={handleAddCompetence}
                      className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm"
                    >
                      Add
                    </button>
                  </div>
                  {errors.competencies && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.competencies}
                    </p>
                  )}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {competencies.map((competence, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-white px-3 py-1 rounded-xl shadow-sm text-sm"
                      >
                        <span className="mr-2">{competence}</span>
                        <button
                          onClick={() => handleRemoveCompetence(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <IoMdClose size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between gap-4 mt-4">
                  <button
                    onClick={prevStep}
                    className="w-full px-4 py-2 bg-black text-white rounded-xl shadow-sm outline-none text-sm"
                  >
                    Back
                  </button>
                  <button
                    onClick={nextStep}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm outline-none text-sm"
                  >
                    Next
                  </button>
                </div>
              </div>
            </Stepper.Step>
            {/* Step 3 - Trainees Details */}
            <Stepper.Step label="Trainees Details">
              <div className="flex flex-col gap-4 md:flex-row">
                <div className="flex flex-col gap-4 w-full md:w-3/5">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <a
                        href={"/files/trainee_creation_format.xlsx"}
                        download={true}
                        className="w-full py-2 px-4 text-center justify-center font-bold bg-primary text-white flex items-center rounded-full"
                      >
                        <span className="hidden lg:flex">
                          Download Template
                        </span>
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
                      <label className="text-sm font-medium">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={traineeData.dob}
                        onChange={handleTraineeChange}
                        className={`px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm ${errors.dob ? "border-red-500" : ""}`}
                      />
                      {errors.dob && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dob}
                        </p>
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.gender}
                        </p>
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
                      <label className="text-sm font-medium">
                        Trainee Phone
                      </label>
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
                      <label className="text-sm font-medium">
                        Education Level
                      </label>
                      <Select
                        data={[
                          "Primary",
                          "Secondary",
                          "Vocational",
                          "University",
                        ]}
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
                      <label className="text-sm font-medium">
                        Marital Status
                      </label>
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
                  <div className="flex justify-between gap-4">
                    <button
                      onClick={handleAddTrainee}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm outline-none text-sm"
                    >
                      Add Trainee
                    </button>
                  </div>
                  <div className="flex justify-between gap-4 mt-4">
                    <button
                      onClick={prevStep}
                      className="w-full px-4 py-2 bg-black text-white rounded-xl shadow-sm outline-none text-sm"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm outline-none text-sm"
                    >
                      {loading
                        ? "Saving..."
                        : defaultData
                          ? "Update Training"
                          : "Create Training"}
                    </button>
                  </div>
                </div>
                <div className="hidden md:block w-full md:w-2/5 bg-gray-100 rounded-xl p-4 max-h-[100vh]">
                  <h3 className="text-base font-medium mb-2">
                    Trainees Preview
                  </h3>
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
              </div>
            </Stepper.Step>
          </Stepper>
        </div>
      </div>
    </Modal>
  );
};

export default AddEditTraining;
