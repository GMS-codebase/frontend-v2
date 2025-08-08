import { Modal, MultiSelect, Popover, Select, Stepper } from "@mantine/core";
import { FormEvent, useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import axios from "axios";
import { Training } from "@/types";
import { DatePicker } from "@mantine/dates";
import dayjs from "dayjs";
import { Folder2 } from "solar-icon-set";
import { SolarUploadBold } from "@/components/core/icons";

const AddEditTraining = ({
    isOpenAddEditTraining,
    closeAddEditTraining,
    defaultData,
}: {
    isOpenAddEditTraining: boolean;
    closeAddEditTraining: () => void;
    defaultData?: Training;
}) => {
    const [active, setActive] = useState(0);
    const [loading, setLoading] = useState(false);
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [startOpened, setStartOpened] = useState(false);
    const [endOpened, setEndOpened] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const startRef = useRef<HTMLDivElement | null>(null);
    const endRef = useRef<HTMLDivElement | null>(null);
    const [formData, setFormData] = useState<Partial<Training>>({
        title: "",
        startDate: "",
        endDate: "",
        materialFile: null,
        traineesFile: null,
    });
    const [traineeData, setTraineeData] = useState({
        firstName: "",
        lastName: "",
        nationalId: "",
        dob: "",
        email: "",
        phone: "",
    });
    const [trainees, setTrainees] = useState<
        { name: string; nationalId: string }[]
    >([]);
    const [competencies, setCompetencies] = useState<string[]>([]);
    const [competenceInput, setCompetenceInput] = useState("");

    const nextStep = () =>
        setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () =>
        setActive((current) => (current > 0 ? current - 1 : current));

    const handleChange = (e: any) => {
        const { name, value, files } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
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
            if (
                startRef.current &&
                !startRef.current.contains(e.target as Node)
            ) {
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
        if (traineeData.firstName && traineeData.lastName) {
            setTrainees((prev) => [
                ...prev,
                {
                    name: `${traineeData.firstName} ${traineeData.lastName}`,
                    nationalId: traineeData.nationalId,
                },
            ]);
            setTraineeData({
                firstName: "",
                lastName: "",
                nationalId: "",
                dob: "",
                email: "",
                phone: "",
            });
        }
    };

    const handleRemoveTrainee = (index: number) => {
        setTrainees((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddCompetence = () => {
        if (competenceInput.trim()) {
            setCompetencies((prev) => [...prev, competenceInput.trim()]);
            setCompetenceInput("");
        }
    };

    const handleRemoveCompetence = (index: number) => {
        setCompetencies((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        // submit logic
    };

    return (
        <Modal
            size={"80vw"}
            opened={isOpenAddEditTraining}
            onClose={closeAddEditTraining}
            closeOnClickOutside={false}
            withCloseButton={false}
            styles={{ body: { overflow: "hidden" } }}
        >
            <div className="w-full md:w-[80vw] p-4 lg:w-[70vw] max-h-[90vh] relative bg-white rounded-2xl pt-8 pb-8 flex flex-col items-center modal">
                <button
                    className={
                        "absolute top-4 right-4 bg-gray-100 p-1 rounded-md"
                    }
                    onClick={closeAddEditTraining}
                >
                    <IoMdClose size={20} color={"#000"} />
                </button>
                <div className="w-full flex flex-col items-center">
                    <h1 className="text-2xl font-bold">New Training</h1>
                    <h2 className="text-[#000F2369] text-base font-medium">
                        Provide your details to create a new training.
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
                                    <label
                                        htmlFor="callTitle"
                                        className="block text-sm font-medium text-gray-700"
                                    >
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
                                            placeholder="Call title"
                                            onChange={handleChange}
                                            className="block w-full pl-8 px-3 py-2 bg-[#000F230A] rounded-xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        Select Training
                                    </label>
                                    <Select
                                        placeholder="Select training"
                                        data={[
                                            {
                                                value: "web",
                                                label: "Web Development",
                                            },
                                            {
                                                value: "ml",
                                                label: "Machine Learning",
                                            },
                                        ]}
                                        className="bg-[#000F230A] rounded-xl mt-1"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    {/* START DATE */}
                                    <div className="flex-1">
                                        <label className="text-sm font-medium">
                                            Start Date
                                        </label>
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
                                                    value={formatDisplay(
                                                        formData.startDate
                                                    )}
                                                    placeholder="mm/dd/yy"
                                                    onClick={() => {
                                                        setStartOpened(
                                                            (o) => !o
                                                        );
                                                        setEndOpened(false);
                                                    }}
                                                    className="mt-1 w-full pl-3 py-2 bg-[#000F230A] rounded-xl cursor-pointer text-sm"
                                                />
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <DatePicker
                                                    value={
                                                        formData.startDate
                                                            ? new Date(
                                                                  formData.startDate
                                                              )
                                                            : null
                                                    }
                                                    onChange={(date) => {
                                                        const formatted = date
                                                            ? dayjs(
                                                                  date
                                                              ).format(
                                                                  "YYYY-MM-DD"
                                                              )
                                                            : "";
                                                        setFormData(
                                                            (prev: any) => ({
                                                                ...prev,
                                                                startDate:
                                                                    formatted,
                                                            })
                                                        );
                                                        setStartOpened(false);
                                                    }}
                                                    minDate={new Date()}
                                                />
                                            </Popover.Dropdown>
                                        </Popover>
                                    </div>

                                    {/* END DATE */}
                                    <div className="flex-1">
                                        <label className="text-sm font-medium">
                                            End Date
                                        </label>
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
                                                    value={formatDisplay(
                                                        formData.endDate
                                                    )}
                                                    placeholder="mm/dd/yy"
                                                    onClick={() => {
                                                        setEndOpened((o) => !o);
                                                        setStartOpened(false);
                                                    }}
                                                    className="mt-1 w-full pl-3 py-2 bg-[#000F230A] rounded-xl cursor-pointer text-sm"
                                                />
                                            </Popover.Target>
                                            <Popover.Dropdown>
                                                <DatePicker
                                                    value={
                                                        formData.endDate
                                                            ? new Date(
                                                                  formData.endDate
                                                              )
                                                            : null
                                                    }
                                                    onChange={(date) => {
                                                        const formatted = date
                                                            ? dayjs(
                                                                  date
                                                              ).format(
                                                                  "YYYY-MM-DD"
                                                              )
                                                            : "";
                                                        setFormData(
                                                            (prev: any) => ({
                                                                ...prev,
                                                                endDate:
                                                                    formatted,
                                                            })
                                                        );
                                                        setEndOpened(false);
                                                    }}
                                                    minDate={
                                                        formData.startDate
                                                            ? new Date(
                                                                  formData.startDate
                                                              )
                                                            : undefined
                                                    }
                                                />
                                            </Popover.Dropdown>
                                        </Popover>
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
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">
                                        Training Manual
                                    </label>
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm">
                                        Download Template
                                    </button>
                                </div>

                                <div className="w-full border-dashed border-2 border-blue-500 rounded-xl h-40 flex items-center justify-center bg-[#000F230A]">
                                    <label className="cursor-pointer flex flex-col items-center justify-center text-center">
                                        <SolarUploadBold className="text-blue-500 text-3xl" />
                                        <p className="text-sm">Upload File</p>
                                        <p className="text-xs text-gray-400">
                                            Drag & Drop or click to upload file
                                        </p>
                                        <input
                                            type="file"
                                            name="material"
                                            onChange={(e) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    materialFile:
                                                        e.target.files?.[0] ||
                                                        null,
                                                }))
                                            }
                                            hidden
                                        />
                                    </label>
                                </div>

                                <div>
                                    <label className="text-sm font-medium">
                                        Competencies
                                    </label>
                                    <div className="flex gap-2 mt-1">
                                        <input
                                            type="text"
                                            value={competenceInput}
                                            onChange={handleCompetenceChange}
                                            className="w-full px-3 py-2 bg-[#000F230A] rounded-xl text-sm"
                                            placeholder="Type a competence"
                                        />
                                        <button
                                            onClick={handleAddCompetence}
                                            className="px-3 py-2 bg-blue-600 text-white rounded-xl text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>
                                    <div className="flex gap-2 mt-2 flex-wrap">
                                        {competencies.map(
                                            (competence, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center bg-white px-3 py-1 rounded-xl shadow-sm text-sm"
                                                >
                                                    <span className="mr-2">
                                                        {competence}
                                                    </span>
                                                    <button
                                                        onClick={() =>
                                                            handleRemoveCompetence(
                                                                index
                                                            )
                                                        }
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <IoMdClose size={16} />
                                                    </button>
                                                </div>
                                            )
                                        )}
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
                                {/* Left side */}
                                <div className="flex flex-col gap-4 w-full md:w-3/5">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-medium">
                                            Trainees
                                        </label>
                                        <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm w-full">
                                            Download Template
                                        </button>
                                        <div className="w-full border-dashed border-2 border-blue-500 rounded-xl h-40 flex items-center justify-center bg-[#000F230A]">
                                            <label className="cursor-pointer flex flex-col items-center justify-center text-center">
                                                <SolarUploadBold className="text-blue-500 text-3xl" />
                                                <p className="text-sm">
                                                    Upload File
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    Drag & Drop or click to
                                                    upload file
                                                </p>
                                                <input
                                                    type="file"
                                                    name="trainees"
                                                    onChange={(e) =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            traineesFile:
                                                                e.target
                                                                    .files?.[0] ||
                                                                null,
                                                        }))
                                                    }
                                                    hidden
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium">
                                                Firstname
                                            </label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={traineeData.firstName}
                                                onChange={handleTraineeChange}
                                                className="px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm"
                                                placeholder="mm/dd/yy"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium">
                                                Lastname
                                            </label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={traineeData.lastName}
                                                onChange={handleTraineeChange}
                                                className="px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm"
                                                placeholder="mm/dd/yy"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium">
                                                National ID
                                            </label>
                                            <input
                                                type="text"
                                                name="nationalId"
                                                value={traineeData.nationalId}
                                                onChange={handleTraineeChange}
                                                className="px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm"
                                                placeholder="national ID"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium">
                                                DOB
                                            </label>
                                            <input
                                                type="date"
                                                name="dob"
                                                value={traineeData.dob}
                                                onChange={handleTraineeChange}
                                                className="px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium">
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={traineeData.email}
                                                onChange={handleTraineeChange}
                                                className="px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm"
                                                placeholder="mm/dd/yy"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <label className="text-sm font-medium">
                                                Phone number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={traineeData.phone}
                                                onChange={handleTraineeChange}
                                                className="px-3 py-2 rounded-xl bg-gray-100 outline-none text-sm"
                                                placeholder="mm/dd/yy"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-between gap-4">
                                        <button
                                            onClick={handleAddTrainee}
                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm outline-none text-sm"
                                        >
                                            Add
                                        </button>
                                    </div>

                                    <div className="flex justify-between gap-4 mt-4">
                                        <button
                                            onClick={prevStep}
                                            className="w-full px-4 py-2 bg-black text-white rounded-xl shadow-sm outline-none text-sm"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading}
                                            className="w-full px-4 py-2 bg-blue-600 text-white rounded-xl shadow-sm outline-none text-sm"
                                        >
                                            {loading ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>

                                {/* Right side preview */}
                                <div className="hidden md:block w-full md:w-2/5 bg-gray-100 rounded-xl p-4 h-fit max-h-[80vh] overflow-y-auto">
                                    <h3 className="text-base font-medium mb-2">
                                        Trainees preview
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        {trainees.map((trainee, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-center bg-white px-3 py-1 rounded-xl shadow-sm text-sm"
                                            >
                                                <span>{trainee.name}</span>
                                                <button
                                                    onClick={() =>
                                                        handleRemoveTrainee(
                                                            index
                                                        )
                                                    }
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
