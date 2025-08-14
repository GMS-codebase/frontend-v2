import DisplayListItem from "./display-list";

const competencies = [
  { id: 1, name: "Masonry" },
  { id: 2, name: "Hardworking" },
  { id: 3, name: "Time management" },
  { id: 4, name: "Courage" },
  { id: 5, name: "Masonry" },
  { id: 6, name: "Hardworking" },
  { id: 7, name: "Time management" },
  { id: 8, name: "Courage" },
];

type props = {
  competencies: string[];
};

const CompetenciesSection = ({ competencies }: props) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-primaryText">
        Competencies
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {competencies.map((competency, idx) => (
          <DisplayListItem
            key={idx}
            title={`Competency ${idx + 1}`}
            desc={competency}
          />
        ))}
      </div>
    </div>
  );
};

export default CompetenciesSection;
