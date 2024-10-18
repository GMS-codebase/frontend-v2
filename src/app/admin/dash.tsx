import React from "react";

interface DashProps {
  col1: string;
  col2?: string;
  data: Array<{
    sector: string;
    col1Data: string | number;
    col2Data?: string | number;
  }>;
  showSingleRow?: boolean;
}

const Dash: React.FC<DashProps> = ({ col1, col2, data, showSingleRow }) => {
  const displayData = data;

  return (
    <div className="bg-white p-6 rounded-2xl w-full">
      {/* Headers */}
      <div className="flex justify-between text-black font-bold mb-2">
        <span className="w-1/3">Priority sectors</span>
        <span className="w-1/4">{col1}</span>
        {col2 && <span className="w-1/4 text-center">{col2}</span>}
      </div>

      {/* Data Rows */}
      <div>
        {displayData.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
          >
            <span className="text-base w-1/2">{item.sector}</span>
            <span className="text-base bg-[#005DE91F] rounded-2xl px-3 text-primary font-bold text-center w-1/5">
              {item.col1Data}
            </span>
            {col2 && (
              <span className="text-base bg-[#005DE91F] rounded-2xl px-3 text-primary font-bold text-center w-1/5">
                {item.col2Data}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dash;
