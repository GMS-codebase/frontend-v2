import { ComboboxItem, Select } from "@mantine/core";

export const FilterDropDown = ({
  placeholderText,
  data,
  filterKey,
  className,
  selectedFilters,
  setSelectedFilters,
  key,
}: {
  placeholderText: string;
  data: any[];
  filterKey: any;
  className?: string;
  selectedFilters: any;
  setSelectedFilters: (value: any) => void;
  key?: number;
}) => {
  const displayValue =
    selectedFilters[filterKey] === "All" ? "" : selectedFilters[filterKey];

  return (
    <Select
      data={data.map((item) => ({ value: item, label: item }))}
      placeholder={placeholderText}
      value={displayValue}
      onChange={(value) =>
        setSelectedFilters((prev: any) => ({ ...prev, [filterKey]: value }))
      }
      className={`w-fit px-3 py-2 text-base text-black font-semibold rounded-full bg-[#005DE908] border-none outline-none placeholder:text-black ${className}`}
    />
  );
};
