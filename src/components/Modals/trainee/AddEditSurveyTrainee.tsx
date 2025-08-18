"use client";

import React, { useEffect, useState } from "react";
import { Modal, Select } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { SECTOR_STATUS, SUBWINDOW_STATUS, TRADE_STATUS, WINDOW_STATUS } from "@/utils/enums";
import { getSurveyTrainee } from "@/services";
import { getApplicantApplicationsInfo, ApplicantApplicationInfo } from "@/services/api/survey";

interface Props {
    isOpenAddEditSurveyTrainee: boolean;
    closeAddEditSurveyTrainee: () => void;
    defaultData?: any;
}

const AddEditSurveyTrainee: React.FC<Props> = ({
    isOpenAddEditSurveyTrainee,
    closeAddEditSurveyTrainee,
    defaultData,
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [applicationsInfo, setApplicationsInfo] = useState<ApplicantApplicationInfo[]>([]);
    const [applicationsLoading, setApplicationsLoading] = useState(true);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        nationalId: "",
        dob: "",
        gender: "",
        windowId: "",
        subWindowId: "",
        tradeId: "",
        sectorId: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Fetch applicant applications info on component mount
    useEffect(() => {
        const fetchApplicationsInfo = async () => {
            try {
                setApplicationsLoading(true);
                const data = await getApplicantApplicationsInfo();
                setApplicationsInfo(data);
            } catch (error) {
                console.error("Failed to fetch applications info:", error);
                notifications.show({
                    message: "Failed to fetch applications information",
                    color: "red",
                });
            } finally {
                setApplicationsLoading(false);
            }
        };

        if (isOpenAddEditSurveyTrainee) {
            fetchApplicationsInfo();
        }
    }, [isOpenAddEditSurveyTrainee]);

    useEffect(() => {
        if (defaultData) {
            setFormData({
                firstname: defaultData.firstname || "",
                lastname: defaultData.lastname || "",
                email: defaultData.email || "",
                phoneNumber: defaultData.phoneNumber || "",
                dob: defaultData.dob || "",
                gender: defaultData.gender || "",
                nationalId: defaultData.nationalId || "",
                windowId: defaultData.windowId || "",
                subWindowId: defaultData.subWindowId || "",
                tradeId: defaultData.tradeId || "",
                sectorId: defaultData.sectorId || "",
            });
        }
    }, [defaultData]);

    // Get all unique windows from applications
    const MultiWindowData = applicationsInfo
        .flatMap(app => app.windows)
        .filter(window => 
            window.status === WINDOW_STATUS.ACTIVE &&
            window.subWindows.some(sub => sub.status === SUBWINDOW_STATUS.ACTIVE)
        )
        .map(window => ({
                value: window.uuid,
                label: window.title,
        }))
        .filter((window, index, self) => 
            index === self.findIndex(w => w.value === window.value)
        );

    // Get subwindows for selected window
    const getSubWindowsData = () => {
        if (!formData.windowId) return [];
        
        return applicationsInfo
            .flatMap(app => app.windows)
            .filter(window => window.uuid === formData.windowId)
            .flatMap(window => 
                window.subWindows
                    .filter(sub => sub.status === SUBWINDOW_STATUS.ACTIVE)
                    .map(subWindow => ({
                        value: subWindow.uuid,
                        label: subWindow.title,
                    }))
            );
    };

    // Get sectors for selected subwindow
    const getSectorData = () => {
        if (!formData.subWindowId) return [];
        
        const sectorMap = new Map();
        
        applicationsInfo.forEach(app => {
            app.windows.forEach(window => {
                window.subWindows.forEach(subWindow => {
                    if (subWindow.uuid === formData.subWindowId) {
                        subWindow.sectors.forEach(sector => {
                            if (sector.status === SECTOR_STATUS.ACTIVE) {
                                const hasActiveTrades = sector.trades.some(
                                    trade => trade.trade.status === TRADE_STATUS.ACTIVE
                                );
                                
                                if (hasActiveTrades && !sectorMap.has(sector.uuid)) {
                                    sectorMap.set(sector.uuid, {
                                        value: sector.uuid,
                                        label: sector.name,
                                    });
                                }
                            }
                        });
                    }
                });
            });
        });
        
        return Array.from(sectorMap.values());
    };

    // Get trades for selected sector
    const getTradesData = () => {
        if (!formData.sectorId) return [];
        
        const trades: { value: string; label: string }[] = [];
        
        applicationsInfo.forEach(app => {
            app.windows.forEach(window => {
                window.subWindows.forEach(subWindow => {
                    subWindow.sectors.forEach(sector => {
                        if (sector.uuid === formData.sectorId) {
                            sector.trades.forEach(trade => {
                                if (trade.trade.status === TRADE_STATUS.ACTIVE) {
                                    trades.push({
                    value: trade.uuid,
                                        label: trade.trade.title,
                                    });
                                }
                            });
                        }
                    });
                });
            });
        });
        
        return trades;
    };

    // Reset dependent fields when parent selection changes
    const handleWindowChange = (windowId: string | null) => {
        setFormData(prev => ({ 
            ...prev, 
            windowId: windowId || "",
            subWindowId: "",
            sectorId: "",
            tradeId: ""
        }));
        setErrors(prev => ({ 
            ...prev, 
            subWindowId: "",
            sectorId: "",
            tradeId: ""
        }));
    };

    const handleSubWindowChange = (subWindowId: string | null) => {
        setFormData(prev => ({ 
            ...prev, 
            subWindowId: subWindowId || "",
            sectorId: "",
            tradeId: ""
        }));
        setErrors(prev => ({ 
            ...prev, 
            sectorId: "",
            tradeId: ""
        }));
    };

    const handleSectorChange = (sectorId: string | null) => {
        setFormData(prev => ({ 
            ...prev, 
            sectorId: sectorId || "",
            tradeId: ""
        }));
        setErrors(prev => ({ 
            ...prev, 
            tradeId: ""
        }));
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.firstname.trim()) newErrors.firstname = "First name is required.";
        if (!formData.lastname.trim()) newErrors.lastname = "Last name is required.";
        if (!formData.email.trim()) newErrors.email = "Email is required.";
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone is required.";
        if (!formData.nationalId.trim()) newErrors.nationalId = "National Id is required.";
        if (!formData.dob) newErrors.dob = "Date of birth is required.";
        if (!formData.gender) newErrors.gender = "Gender is required.";
        if (!formData.windowId) newErrors.windowId = "Window is required.";
        if (!formData.subWindowId) newErrors.subWindowId = "Sub window is required.";
        if (!formData.tradeId) newErrors.tradeId = "Trade is required.";
        if (!formData.sectorId) newErrors.sectorId = "Sector is required.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: "" }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        const request = defaultData
            ? authorizedApi.put(`/survey-trainee/${defaultData.uuid}`, formData)
            : authorizedApi.post("/survey-trainee", formData);

        request
            .then(() => {
                notifications.show({
                    message: defaultData
                        ? "Survey trainee updated successfully"
                        : "Survey trainee created successfully",
                    color: "blue",
                });
                // Dispatch to refresh the survey trainees list
                getSurveyTrainee(dispatch);
                closeAddEditSurveyTrainee();
            })
            .catch((err) => {
                notifications.show({
                    message:
                        err.response?.data?.message ||
                        `Failed to ${defaultData ? "update" : "create"} trainee`,
                    color: "red",
                });
            })
            .finally(() => setLoading(false));
    };

    return (
        <Modal
            opened={isOpenAddEditSurveyTrainee}
            onClose={closeAddEditSurveyTrainee}
            closeOnClickOutside={false}
            withCloseButton={false}
            size={""}
        >
            <div className="lg:w-[45vw] w-full max-h-[90vh] overflow-y-auto relative bg-white rounded-3xl p-10 flex flex-col items-center">
                <button
                    className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
                    onClick={closeAddEditSurveyTrainee}
                >
                    <IoMdClose size={25} />
                </button>
                <h1 className="text-2xl font-extrabold">
                    {defaultData ? "Update Survey Trainee" : "Create Survey Trainee"}
                </h1>

                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6">
                    <div>
                        <label className="block mb-1 font-medium">First Name</label>
                        <input
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="w-full p-2 bg-[#000F230A] rounded-2xl"
                        />
                        {errors.firstname && <p className="text-red-500 text-sm">{errors.firstname}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Last Name</label>
                        <input
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="w-full p-2 bg-[#000F230A] rounded-2xl"
                        />
                        {errors.lastname && <p className="text-red-500 text-sm">{errors.lastname}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Email</label>
                        <input
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 bg-[#000F230A] rounded-2xl"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Phone</label>
                        <input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="w-full p-2 bg-[#000F230A] rounded-2xl"
                        />
                        {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Date of Birth</label>
                        <input
                            type="date"
                            name="dob"
                            value={formData.dob}
                            onChange={handleChange}
                            className="w-full p-2 bg-[#000F230A] rounded-2xl"
                        />
                        {errors.dob && <p className="text-red-500 text-sm">{errors.dob}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Gender</label>
                        <Select
                            placeholder="Select Gender"
                            data={[
                                { value: "MALE", label: "Male" },
                                { value: "FEMALE", label: "Female" }
                            ]}
                            value={formData.gender}
                            onChange={(val) => setFormData((prev) => ({ ...prev, gender: val || "" }))}
                        />
                        {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">National Id</label>
                        <input
                            name="nationalId"
                            value={formData.nationalId}
                            onChange={handleChange}
                            className="w-full p-2 bg-[#000F230A] rounded-2xl"
                        />
                        {errors.nationalId && <p className="text-red-500 text-sm">{errors.nationalId}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Window</label>
                        <Select
                            placeholder={applicationsLoading ? "Loading..." : "Select Window"}
                            data={MultiWindowData || []}
                            value={formData.windowId}
                            onChange={handleWindowChange}
                            disabled={applicationsLoading}
                        />
                        {errors.windowId && <p className="text-red-500 text-sm">{errors.windowId}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Sub Window</label>
                        <Select
                            placeholder="Select Sub Window"
                            data={getSubWindowsData() || []}
                            value={formData.subWindowId}
                            onChange={handleSubWindowChange}
                            disabled={!formData.windowId}
                        />
                        {errors.subWindowId && <p className="text-red-500 text-sm">{errors.subWindowId}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Sector</label>
                        <Select
                            placeholder="Select Sector"
                            data={getSectorData() || []}
                            value={formData.sectorId}
                            onChange={handleSectorChange}
                            disabled={!formData.subWindowId}
                        />
                        {errors.sectorId && <p className="text-red-500 text-sm">{errors.sectorId}</p>}
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Trade</label>
                        <Select
                            placeholder="Select Trade"
                            data={getTradesData() || []}
                            value={formData.tradeId}
                            onChange={(val) => setFormData((prev) => ({ ...prev, tradeId: val || "" }))}
                            disabled={!formData.sectorId}
                        />
                        {errors.tradeId && <p className="text-red-500 text-sm">{errors.tradeId}</p>}
                    </div>

                    <div className="w-full flex justify-center mt-4 space-x-4">
                        <button
                            type="button"
                            onClick={closeAddEditSurveyTrainee}
                            className="w-full px-4 py-3 bg-black text-white rounded-full"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full px-4 py-3 bg-blue-500 text-white rounded-full"
                        >
                            {loading ? "Loading..." : defaultData ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AddEditSurveyTrainee;
