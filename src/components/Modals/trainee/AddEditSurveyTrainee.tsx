"use client";

import React, { useEffect, useState } from "react";
import { Modal, Select } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { notifications } from "@mantine/notifications";
import { useDispatch, useSelector } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { SECTOR_STATUS, SUBWINDOW_STATUS, TRADE_STATUS, WINDOW_STATUS } from "@/utils/enums";
import { getWindows, getSectors } from "@/services";
import { getSurveyTrainee } from "@/services";
import rwandaLocations from "@/utils/location";

interface Props {
    isOpenAddEditSurveyTrainee: boolean;
    closeAddEditSurveyTrainee: () => void;
    defaultData?: any;
    applicantId?: string;
}

const AddEditSurveyTrainee: React.FC<Props> = ({
    isOpenAddEditSurveyTrainee,
    closeAddEditSurveyTrainee,
    defaultData,
    applicantId,
}) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [currentUserId, setCurrentUserId] = useState<string>("");

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
        province: "",
        district: "",
        sectorLocation: "",
        cell: "",
        village: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // Redux selectors
    const windows = useSelector((state: any) => state.windows?.windows || []);
    const trades = useSelector((state: any) => state.trades?.trades || []);
    const sectors = useSelector((state: any) => state.sectors?.sectors || []);

    // Utility function to remove duplicate values, keeping only the first occurrence
    const removeDuplicates = (items: { value: string; label: string }[]): { value: string; label: string }[] => {
        const seen = new Set<string>();
        return items.filter(item => {
            if (seen.has(item.value)) {
                return false; // Skip duplicate
            }
            seen.add(item.value);
            return true; // Keep first occurrence
        });
    };

    // Get location options using rwandaLocations utility
    const ProvincesOptions = rwandaLocations.getProvinces();
    const DistrictOptions = formData.province ? rwandaLocations.getDistricts(formData.province) : [];
    const SectorLocationOptions = formData.district && formData.province
        ? rwandaLocations.getSectors(formData.province, formData.district)
        : [];
    const CellOptions = formData.sectorLocation && formData.district && formData.province
        ? rwandaLocations.getCells(formData.province, formData.district, formData.sectorLocation)
        : [];
    const VillageOptions = formData.cell && formData.sectorLocation && formData.district && formData.province
        ? rwandaLocations.getVillages(formData.province, formData.district, formData.sectorLocation, formData.cell)
        : [];

    // Fetch data and user info on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                setDataLoading(true);
                
                // Fetch windows and sectors
                await Promise.all([
                    getWindows(dispatch),
                    getSectors(dispatch)
                ]);

                // Fetch current user info if applicantId is not provided
                if (!applicantId) {
                    try {
                        const response = await authorizedApi.get("/auth/me");
                        const userData = response.data.data.data;
                        if (userData?.uuid) {
                            setCurrentUserId(userData.uuid);
                        }
                    } catch (error) {
                        console.error("Failed to fetch user data:", error);
                        notifications.show({
                            message: "Failed to fetch user information",
                            color: "red",
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                notifications.show({
                    message: "Failed to fetch required data",
                    color: "red",
                });
            } finally {
                setDataLoading(false);
            }
        };

        if (isOpenAddEditSurveyTrainee) {
            fetchData();
        }
    }, [isOpenAddEditSurveyTrainee, applicantId, dispatch]);

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
                province: defaultData.province || "",
                district: defaultData.district || "",
                sectorLocation: defaultData.sectorLocation || "",
                cell: defaultData.cell || "",
                village: defaultData.village || "",
            });
        } else {
            // Reset form when adding new trainee
            setFormData({
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
                province: "",
                district: "",
                sectorLocation: "",
                cell: "",
                village: "",
            });
        }
    }, [defaultData, isOpenAddEditSurveyTrainee]);

    // Get all unique windows from Redux state
    const MultiWindowData = removeDuplicates(
        windows?.filter((window: any) => 
            window?.status === WINDOW_STATUS.ACTIVE &&
            window?.subWindows?.some((sub: any) => sub.status === SUBWINDOW_STATUS.ACTIVE)
        )
        .map((window: any) => ({
            value: window.uuid,
            label: window.title,
        })) || []
    );

    // Get subwindows for selected window
    const getSubWindowsData = () => {
        if (!formData.windowId) return [];
        
        const subWindows = windows?.filter((window: any) => window.uuid === formData.windowId)
            .flatMap((window: any) => 
                window.subWindows
                    ?.filter((sub: any) => sub.status === SUBWINDOW_STATUS.ACTIVE)
                    .map((subWindow: any) => ({
                        value: subWindow.uuid,
                        label: subWindow.title,
                    }))
            ) || [];
        
        return removeDuplicates(subWindows);
    };

    // Get sectors for selected subwindow
    const getSectorData = () => {
        if (!formData.subWindowId) return [];
        
        const sectorMap = new Map();
        windows?.forEach((window: any) =>
            window.subWindows
                ?.filter((subWindow: any) => subWindow.uuid === formData.subWindowId)
                .forEach((subWindow: any) =>
                    subWindow.sectors?.forEach((sector: any) => {
                        const matching = sectors.find(
                            (s: any) =>
                                s.uuid === sector.uuid &&
                                s.trades?.some(
                                    (trad: any) => trad.trade.status === TRADE_STATUS.ACTIVE
                                ) &&
                                sector.status === SECTOR_STATUS.ACTIVE
                        );
                        if (matching && !sectorMap.has(matching.uuid)) {
                            sectorMap.set(matching.uuid, {
                                value: matching.uuid,
                                label: matching.name,
                            });
                        }
                    })
                )
        );
        return Array.from(sectorMap.values());
    };

    // Get trades for selected sector
    const getTradesData = () => {
        if (!formData.sectorId) return [];
        
        return sectors
            .filter((sc: any) => sc.uuid === formData.sectorId)
            .flatMap((sec: any) => {
                return sec.trades?.map((trade: any) => ({
                    value: trade.uuid,
                    label: trade.trade.title
                })) || [];
            });
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

    // Handle location field changes
    const handleProvinceChange = (province: string | null) => {
        setFormData(prev => ({ 
            ...prev, 
            province: province || "",
            district: "",
            sectorLocation: "",
            cell: "",
            village: ""
        }));
        setErrors(prev => ({ 
            ...prev, 
            district: "",
            sectorLocation: "",
            cell: "",
            village: ""
        }));
    };

    const handleDistrictChange = (district: string | null) => {
        setFormData(prev => ({ 
            ...prev, 
            district: district || "",
            sectorLocation: "",
            cell: "",
            village: ""
        }));
        setErrors(prev => ({ 
            ...prev, 
            sectorLocation: "",
            cell: "",
            village: ""
        }));
    };

    const handleSectorLocationChange = (sectorLocation: string | null) => {
        setFormData(prev => ({ 
            ...prev, 
            sectorLocation: sectorLocation || "",
            cell: "",
            village: ""
        }));
        setErrors(prev => ({ 
            ...prev, 
            cell: "",
            village: ""
        }));
    };

    const handleCellChange = (cell: string | null) => {
        setFormData(prev => ({ 
            ...prev, 
            cell: cell || "",
            village: ""
        }));
        setErrors(prev => ({ 
            ...prev, 
            village: ""
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
        if (!formData.province) newErrors.province = "Province is required.";
        if (!formData.district) newErrors.district = "District is required.";
        if (!formData.sectorLocation) newErrors.sectorLocation = "Sector (Location) is required.";
        if (!formData.cell) newErrors.cell = "Cell is required.";
        if (!formData.village) newErrors.village = "Village is required.";
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

        // Prepare request data with applicantId if provided
        const userIdToUse = applicantId || currentUserId;
        const requestData = {
            ...formData,
            ...(userIdToUse && { applicantId: userIdToUse }),
        };

        const request = defaultData
            ? authorizedApi.put(`/survey-trainee/${defaultData.uuid}`, requestData)
            : authorizedApi.post("/survey-trainee", requestData);

        request
            .then(() => {
                notifications.show({
                    message: defaultData
                        ? "Survey trainee updated successfully"
                        : "Survey trainee created successfully",
                    color: "blue",
                });
                // Dispatch to refresh the survey trainees list
                getSurveyTrainee(dispatch, userIdToUse);
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
            <div className="lg:w-[60vw] w-full max-h-[90vh] overflow-y-auto relative bg-white rounded-3xl p-10 flex flex-col items-center">
                <button
                    className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
                    onClick={closeAddEditSurveyTrainee}
                >
                    <IoMdClose size={25} />
                </button>
                <h1 className="text-2xl font-extrabold">
                    {defaultData ? "Update Survey Trainee" : "Create Survey Trainee"}
                </h1>

                {dataLoading ? (
                    <div className="w-full flex justify-center items-center py-8">
                        <p className="text-gray-600">Loading data...</p>
                    </div>
                ) : (
                <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4 mt-6">
                    {/* Personal Information */}
                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                    {/* Application Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Window</label>
                            <Select
                                placeholder={dataLoading ? "Loading..." : "Select Window"}
                                data={MultiWindowData || []}
                                value={formData.windowId}
                                onChange={handleWindowChange}
                                disabled={dataLoading}
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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
                    </div>

                    {/* Location Information */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Province</label>
                            <Select
                                placeholder="Select Province"
                                data={ProvincesOptions.map((province: string) => ({
                                    value: province,
                                    label: province
                                }))}
                                value={formData.province}
                                onChange={handleProvinceChange}
                            />
                            {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">District</label>
                            <Select
                                placeholder="Select District"
                                data={DistrictOptions.map((district: string) => ({
                                    value: district,
                                    label: district
                                }))}
                                value={formData.district}
                                onChange={handleDistrictChange}
                                disabled={!formData.province}
                            />
                            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-medium">Sector (Location)</label>
                            <Select
                                placeholder="Select Sector"
                                data={SectorLocationOptions.map((sector: string) => ({
                                    value: sector,
                                    label: sector
                                }))}
                                value={formData.sectorLocation}
                                onChange={handleSectorLocationChange}
                                disabled={!formData.district}
                            />
                            {errors.sectorLocation && <p className="text-red-500 text-sm">{errors.sectorLocation}</p>}
                        </div>

                        <div>
                            <label className="block mb-1 font-medium">Cell</label>
                            <Select
                                placeholder="Select Cell"
                                data={CellOptions.map((cell: string) => ({
                                    value: cell,
                                    label: cell
                                }))}
                                value={formData.cell}
                                onChange={handleCellChange}
                                disabled={!formData.sectorLocation}
                            />
                            {errors.cell && <p className="text-red-500 text-sm">{errors.cell}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block mb-1 font-medium">Village</label>
                        <Select
                            placeholder="Select Village"
                            data={VillageOptions.map((village: string) => ({
                                value: village,
                                label: village
                            }))}
                            value={formData.village}
                            onChange={(val) => setFormData((prev) => ({ ...prev, village: val || "" }))}
                            disabled={!formData.cell}
                        />
                        {errors.village && <p className="text-red-500 text-sm">{errors.village}</p>}
                    </div>

                    <div className="w-full flex justify-center mt-4 space-x-4">
                        <button
                            type="button"
                            onClick={closeAddEditSurveyTrainee}
                            className="w-full px-4 py-2 bg-black text-white rounded-full"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-full"
                        >
                            {loading ? "Loading..." : defaultData ? "Update" : "Create"}
                        </button>
                    </div>
                </form>
                )}
            </div>
        </Modal>
    );
};

export default AddEditSurveyTrainee;
