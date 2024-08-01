import { SolarCalendarBold } from "@/components/core/icons";

const Page = () => {
  return (
    <div className="w-full text-secondaryText">
      <div className="flex items-center justify-between">
        <p>Evaluation</p>
        <button className="bg-primary text-white py-3 px-7 rounded-full flex flex-row items-center gap-3">
          <h1 className="text-base font-medium text-white">Today</h1>
          <span className="text-2xl">
            <SolarCalendarBold />
          </span>
        </button>
      </div>

      {/* Boxes Section */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* First Box */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Applicants per Priority Sector
          </h2>
          <div className="flex justify-between">
            <span className="text-base">Culinary Programs</span>
            <span className="text-base font-medium">32</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-base">Tech Innovators</span>
            <span className="text-base font-medium">14</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-base">Masonry Internships</span>
            <span className="text-base font-medium">20</span>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-base">Culinary Workshops</span>
            <span className="text-base font-medium">8</span>
          </div>
        </div>

        {/* Second Box */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Selected Applications</h2>
          <div className="flex justify-between">
            <span className="text-base">Total Selected</span>
            <span className="text-2xl font-bold text-primary">56</span>
          </div>
        </div>

        {/* Third Box */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">Total Applications</h2>
          <div className="flex justify-between">
            <span className="text-base">All Applications</span>
            <span className="text-2xl font-bold text-primary">124</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
