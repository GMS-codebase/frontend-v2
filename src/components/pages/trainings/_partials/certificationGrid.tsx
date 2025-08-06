import Button from "@/components/ui/Button";
import { Checkbox } from "@mantine/core";

const CertificationGrid = () => {
  const trainees = [
    { id: 1, name: "John Mukunzi", attended: true },
    { id: 2, name: "Jane Doe", attended: false },
    { id: 3, name: "Alex Smith", attended: true },
    { id: 4, name: "Sarah Johnson", attended: true },
    { id: 5, name: "Mike Brown", attended: false },
  ];

  return (
    <div className="flex flex-col gap-10 pt-10">
      <div className="flex items-center justify-between">
        <h2 className="text-xl md:text-2xl font-bold text-primaryText">
          Certification
        </h2>
        <Button className="!rounded-full !bg-primary py-3">
          Request certification
        </Button>
      </div>
      <div className="p-6 bg-[#F6F6F6] rounded-3xl">
        <h2 className="text-base font-normal mb-6">
          Checkmark trainees that attended at least 3/4 of all sessions provided
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {trainees.map((trainee) => (
            <div
              key={trainee.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span className="text-primaryText font-medium truncate">
                {trainee.name}
              </span>
              <Checkbox color="blue" size="md" className="ml-2 !bg-inherit" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CertificationGrid;
