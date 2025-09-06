"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/core/data-table";
import { HiDotsHorizontal } from "react-icons/hi";
import { Menu, Select, Button } from "@mantine/core";
import { CiSearch } from "react-icons/ci";
import { BiShow } from "react-icons/bi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { authorizedApi } from "@/utils/api";
import { IPaginatedQuery } from "@/types/base.type";
import ViewTraineeModal from "@/components/Modals/trainee/ViewTraineeModal";
import { useDisclosure } from "@mantine/hooks";
import rwandaLocations from "@/utils/location";
import { useSelector } from "react-redux";
import { SolarAddFolderBold } from "@/components/core/icons";
import ImportTraineesModal from "@/components/Modals/trainee/ImportTraineesModal";
import DeleteModal from "@/components/Modals/DeleteModal";
import AddEditSurveyTrainee from "@/components/Modals/trainee/AddEditSurveyTrainee";

const Page = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
    const [selectedTrainee, setSelectedTrainee] = useState<any>(null);
    const [isOpenView, { open: openView, close: closeView }] = useDisclosure(false);
    const auth = useSelector((state: any) => state.auth);
    const [
        isOpenCreateEdit,
        { open: openCreateEditModal, close: closeCreateEditModal },
    ] = useDisclosure(false);
    const [
        isOpenImport,
        { open: openImportModal, close: closeImportModal },
    ] = useDisclosure(false);
    const [isOpenDelete, { open: openDeleteModal, close: closeDeleteModal }] =
        useDisclosure(false);

    // Data states
    const [trainees, setTrainees] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalTrainees, setTotalTrainees] = useState(0);

    // Filter states with "All" as default
    const [filters, setFilters] = useState({
        gender: "All",
        province: "All",
        district: "All",
        sector: "All",
        cell: "All",
        village: "All",
    });

    // Ref for horizontal scroll
    const filtersContainerRef = useRef<HTMLDivElement>(null);

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "fullname",
            header: "Full Name",
            cell: ({ row }) => (
                <div className="truncate">
                    {`${row.original.firstname} ${row.original.lastname}`}
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => (
                <div className="truncate">{row.original.email}</div>
            ),
        },
        {
            accessorKey: "phoneNumber",
            header: "Phone",
            cell: ({ row }) => (
                <div className="truncate">{row.original.phoneNumber}</div>
            ),
        },
        {
            accessorKey: "nationalId",
            header: "National ID",
            cell: ({ row }) => (
                <div className="truncate">{row.original.nationalId}</div>
            ),
        },
        {
            accessorKey: "gender",
            header: "Gender",
            cell: ({ row }) => (
                <div className="truncate capitalize">{row.original.gender?.toLowerCase()}</div>
            ),
        },
        {
            accessorKey: "province",
            header: "Province",
            cell: ({ row }) => (
                <div className="truncate">{row.original.province || "-"}</div>
            ),
        },
        {
            accessorKey: "district",
            header: "District",
            cell: ({ row }) => (
                <div className="truncate">{row.original.district || "-"}</div>
            ),
        },
        {
            accessorKey: "residenceSector",
            header: "Residence Sector",
            cell: ({ row }) => (
                <div className="truncate">{row.original.residenceSector || row.original.redidenceSector || "-"}</div>
            ),
        },
        {
            accessorKey: "cell",
            header: "Cell",
            cell: ({ row }) => (
                <div className="truncate">{row.original.cell || "-"}</div>
            ),
        },
        {
            accessorKey: "village",
            header: "Village",
            cell: ({ row }) => (
                <div className="truncate">{row.original.village || "-"}</div>
            ),
        },
        {
            accessorKey: "window",
            header: "Window",
            cell: ({ row }) => (
                <div className="truncate">{row.original.window?.title || "-"}</div>
            ),
        },
        {
            accessorKey: "subWindow",
            header: "Sub Window",
            cell: ({ row }) => (
                <div className="truncate">{row.original.subWindow?.title || "-"}</div>
            ),
        },
        {
            accessorKey: "sector",
            header: "Sector",
            cell: ({ row }) => (
                <div className="truncate">{row.original.sector?.name || row.original.sector || "-"}</div>
            ),
        },
        {
            accessorKey: "trade",
            header: "Trade",
            cell: ({ row }) => (
                <div className="truncate">{row.original.trade?.title || row.original.trade?.name || "-"}</div>
            ),
        },
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <Menu shadow="md" width={200}>
                    <Menu.Target>
                        <Button variant="subtle" size="sm">
                            <HiDotsHorizontal size={16} />
                        </Button>
                    </Menu.Target>
                    <Menu.Dropdown>
                        <Menu.Item onClick={() => handleView(row.original)}>
                            <div className="flex items-center gap-2">
                                <BiShow size={16} />
                                View
                            </div>
                        </Menu.Item>
                    </Menu.Dropdown>
                </Menu>
            ),
        },
    ];

    // Local state for pagination
    const [paginateOpts, setLocalPaginateOpts] = useState<
        IPaginatedQuery & { totalPages: number }
    >({
        page: 0, // UI 0-based
        limit: 10,
        totalPages: 1,
    });

    // Location options with "All" option
    const ProvincesOptions = ["All", ...rwandaLocations.getProvinces()];
    const DistrictOptions = filters.province === "All" ? ["All"] :
        filters.province ? ["All", ...rwandaLocations.getDistricts(filters.province)] : ["All"];
    const SectorLocationOptions = filters.district === "All" || filters.province === "All" ? ["All"] :
        filters.district && filters.province ? ["All", ...rwandaLocations.getSectors(filters.province, filters.district)] : ["All"];
    const CellOptions = filters.sector === "All" || filters.district === "All" || filters.province === "All" ? ["All"] :
        filters.sector && filters.district && filters.province ? ["All", ...rwandaLocations.getCells(filters.province, filters.district, filters.sector)] : ["All"];
    const VillageOptions = filters.cell === "All" || filters.sector === "All" || filters.district === "All" || filters.province === "All" ? ["All"] :
        filters.cell && filters.sector && filters.district && filters.province ? ["All", ...rwandaLocations.getVillages(filters.province, filters.district, filters.sector, filters.cell)] : ["All"];

    // Gender options with "All"
    const GenderOptions = ["All", "MALE", "FEMALE"];

    // FilterDropDown component
    const FilterDropDown = ({
        placeholderText,
        data,
        filterKey,
        className,
    }: {
        placeholderText: string;
        data: string[];
        filterKey: keyof typeof filters;
        className?: string;
    }) => {
        const displayValue = filters[filterKey] === "All" ? "" : filters[filterKey];

        return (
            <Select
                data={data.map((item) => ({ value: item, label: item }))}
                placeholder={placeholderText}
                value={displayValue}
                onChange={(value) => handleFilterChange(filterKey, value || "All")}
                className={`w-fit px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black ${className}`}
            />
        );
    };

    // Horizontal scroll handler
    const handleScroll = (direction: "left" | "right") => {
        if (filtersContainerRef.current) {
            const scrollAmount = 100;
            if (direction === "left") {
                filtersContainerRef.current.scrollLeft -= scrollAmount;
            } else {
                filtersContainerRef.current.scrollLeft += scrollAmount;
            }
        }
    };

    // API fetch function
    const fetchTrainees = useCallback(async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            // Add pagination
            params.append('page', ((paginateOpts?.page ?? 0) + 1).toString());
            params.append('limit', (paginateOpts?.limit ?? 10).toString());

            // Add filters (only if not "All")
            if (filters.gender && filters.gender !== "All") params.append('gender', filters.gender);
            if (filters.province && filters.province !== "All") params.append('province', filters.province);
            if (filters.district && filters.district !== "All") params.append('district', filters.district);
            if (filters.sector && filters.sector !== "All") params.append('sector', filters.sector);
            if (filters.cell && filters.cell !== "All") params.append('cell', filters.cell);
            if (filters.village && filters.village !== "All") params.append('village', filters.village);
            if (debouncedSearchTerm) params.append('search', debouncedSearchTerm);

            const response = await authorizedApi.get(`/survey-trainee?${params.toString()}`);

            // Handle the new API response structure
            const responseData = response.data?.data?.data;
            if (responseData?.items) {
                setTrainees(responseData.items);
                setTotalTrainees(responseData.meta?.totalItems || 0);
            } else {
                setTrainees([]);
                setTotalTrainees(0);
            }
        } catch (error) {
            console.error('Failed to fetch trainees:', error);
            setTrainees([]);
            setTotalTrainees(0);
        } finally {
            setLoading(false);
        }
    }, [paginateOpts.page, paginateOpts.limit, filters, debouncedSearchTerm]);

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Update total pages when total changes
    useEffect(() => {
        setLocalPaginateOpts((prev) => ({
            ...prev,
            totalPages: Math.ceil((totalTrainees ?? 0) / (prev?.limit ?? 10)),
        }));
    }, [totalTrainees]);

    // Fetch data whenever page, limit, filters, or debounced search changes
    useEffect(() => {
        fetchTrainees();
    }, [fetchTrainees]);

    const setPaginateOpts: React.Dispatch<
        React.SetStateAction<IPaginatedQuery & { totalPages: number }>
    > = (value) => {
        if (typeof value === "function") {
            setLocalPaginateOpts((prev) => {
                const next = value(prev);
                return next;
            });
        } else {
            setLocalPaginateOpts(value);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => {
            const newFilters = { ...prev, [key]: value };

            // Reset dependent filters when parent changes
            if (key === 'province') {
                newFilters.district = 'All';
                newFilters.sector = 'All';
                newFilters.cell = 'All';
                newFilters.village = 'All';
            } else if (key === 'district') {
                newFilters.sector = 'All';
                newFilters.cell = 'All';
                newFilters.village = 'All';
            } else if (key === 'sector') {
                newFilters.cell = 'All';
                newFilters.village = 'All';
            } else if (key === 'cell') {
                newFilters.village = 'All';
            }

            return newFilters;
        });
    };

    const handleView = (trainee: any) => {
        setSelectedTrainee(trainee);
        openView();
    };

    // Removed clearFilters function - using "All" as default values instead

    // trainees state is now managed locally

    return (
        <div className="w-full flex flex-col bg-white rounded-2xl mb-20 pb-10">
            <div className="flex items-center justify-end p-4">
            <div className="flex gap-2">
                    <button
                        onClick={openImportModal}
                        className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
                    >
                        <span className="text-2xl">
                            <SolarAddFolderBold />
                        </span>
                        <h1 className="text-base font-medium text-white">Import Trainees</h1>
                    </button>
                    <button
                        onClick={openCreateEditModal}
                        className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3"
                    >
                        <span className="text-2xl">
                            <SolarAddFolderBold />
                        </span>
                        <h1 className="text-base font-medium text-white">New Survey Trainee</h1>
                    </button>
                </div>
            </div>
            {/* Header with Search */}
            <div className="w-full flex flex-col md:flex-row justify-between items-center p-4 gap-4">
                <div className="relative w-full md:w-[20rem]">
                    <span className="absolute top-4 left-4">
                        <CiSearch size={25} color="" />
                    </span>
                    <input
                        name="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 py-4 pl-12 text-base text-black placeholder:text-black rounded-full bg-[#005DE908] border-none outline-none"
                        placeholder="Search trainees..."
                    />
                </div>
                <div className="flex-grow">
                    <div className="flex items-center w-full">
                        <button
                            onClick={() => handleScroll("left")}
                            className="p-2 bg-white shadow-lg rounded-full mr-2"
                        >
                            <FiChevronLeft size={25} />
                        </button>

                        <div
                            ref={filtersContainerRef}
                            className="flex items-center gap-3 overflow-x-hidden scrollbar-hide flex-grow"
                            style={{ scrollBehavior: "smooth" }}
                        >
                            <FilterDropDown
                                placeholderText="Filter By Gender"
                                data={GenderOptions}
                                filterKey="gender"
                                className="flex-shrink-0"
                            />
                            <FilterDropDown
                                placeholderText="Filter By Province"
                                data={ProvincesOptions}
                                filterKey="province"
                                className="flex-shrink-0"
                            />
                            <FilterDropDown
                                placeholderText="Filter By District"
                                data={DistrictOptions}
                                filterKey="district"
                                className="flex-shrink-0"
                            />
                            <FilterDropDown
                                placeholderText="Filter By Sector"
                                data={SectorLocationOptions}
                                filterKey="sector"
                                className="flex-shrink-0"
                            />
                            <FilterDropDown
                                placeholderText="Filter By Cell"
                                data={CellOptions}
                                filterKey="cell"
                                className="flex-shrink-0"
                            />
                            <FilterDropDown
                                placeholderText="Filter By Village"
                                data={VillageOptions}
                                filterKey="village"
                                className="flex-shrink-0"
                            />
                        </div>

                        <button
                            onClick={() => handleScroll("right")}
                            className="p-2 bg-white shadow-lg rounded-full ml-2"
                        >
                            <FiChevronRight size={25} />
                        </button>
                    </div>
                </div>
            </div>


            {/* Data Table */}
            <div className="w-full h-full">
                <DataTable
                    columns={columns}
                    data={trainees}
                    loading={loading}
                    noDataMessage={
                        searchTerm || Object.values(filters).some(f => f && f !== "All")
                            ? "No trainees matching the search criteria found"
                            : "No survey trainees found"
                    }
                    totalApplications={totalTrainees}
                    paginationProps={{
                        isPaginated: true,
                        paginateOpts,
                        setPaginateOpts,
                    }}
                />
            </div>

            {/* View Modal */}
            <ViewTraineeModal
                isOpen={isOpenView}
                onClose={closeView}
                trainee={selectedTrainee}
            />
            <ImportTraineesModal
                isOpen={isOpenImport}
                onClose={closeImportModal}
                applicantId={auth?.userProfile?.uuid}
            />
            <DeleteModal
                isOpenModal={isOpenDelete}
                closeModal={() => {
                    closeDeleteModal();
                    setSelectedTrainee(null);
                }}
                type="surveyTrainee"
                id={selectedTrainee?.uuid}
            />
            <AddEditSurveyTrainee
                isOpenAddEditSurveyTrainee={isOpenCreateEdit}
                closeAddEditSurveyTrainee={() => {
                    closeCreateEditModal();
                    setSelectedTrainee(null);
                }}
                defaultData={selectedTrainee}
                applicantId={auth?.userProfile?.uuid}
            />
        </div>
    );
};

export default Page;
