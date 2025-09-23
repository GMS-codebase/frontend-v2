import DisplayListItem from "./display-list";

type Competency = {
  uuid?: string; 
  name: string;
  code?: string; 
  id?: number; 
};

type Props = {
  competencies: Competency[];
};

const CompetenciesSection = ({ competencies }: Props) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-bold text-primaryText">
        Competencies
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {competencies.map((competency, idx) => (
          <DisplayListItem
            key={competency.uuid || idx} 
            title={`Competency ${idx + 1}`}
            desc={`${competency.name}`} 
          />
        ))}
      </div>
    </div>
  );
};

export default CompetenciesSection;