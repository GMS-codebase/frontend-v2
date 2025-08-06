import DisplayListItem from "./display-list";

const details = [
  { label: "Title", value: "My Training" },
  { label: "Start date", value: "23.4.2025" },
  { label: "End Date", value: "21.4.2026" },
];

const DetailsSection = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-primaryText">
        Details
      </h2>
      <div className="space-y-2">
        {details.map((detail) => (
          <DisplayListItem
            key={detail.label}
            title={detail.label}
            desc={detail.value}
          />
        ))}
      </div>
    </div>
  );
};

export default DetailsSection;
