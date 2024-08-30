import { Skeleton } from "@mantine/core";
import React, { useState } from "react";
import { FaFile, FaTimes, FaEye } from "react-icons/fa";

interface Contract {
  id: number;
  name: string;
  fileUrl: string;
}

const contracts: Contract[] = [
  { id: 1, name: "Contract 1", fileUrl: "/path/to/contract1.pdf" },
  { id: 2, name: "Contract 2", fileUrl: "/path/to/contract2.pdf" },
  { id: 3, name: "Contract 3", fileUrl: "/path/to/contract3.pdf" },
];

const Contracts = ({
  data = [],
  loading = false,
}: {
  data?: any;
  loading?: boolean;
}) => {
  const [hoveredContract, setHoveredContract] = useState<number | null>(null);
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Contracts</h2>
      <div className="flex flex-wrap gap-6">
        {loading ? (
          <div className="w-full h-full flex items-center justify-between">
            <Skeleton width={330} height={200} />
            <Skeleton width={330} height={200} />
            <Skeleton width={330} height={200} />
          </div>
        ) : !data ? (
          <div className="">
            <h1>No Contracts Created!</h1>
          </div>
        ) : (
          data.map((contract: any) => (
            <div
              key={contract.uuid}
              className="relative flex flex-col items-center pb-16 p-4 bg-white shadow-md rounded-lg w-64 hover:shadow-lg transition-shadow duration-300"
              onMouseEnter={() => setHoveredContract(contract.uuid)}
              onMouseLeave={() => setHoveredContract(null)}
            >
              <div className="flex flex-col items-center space-y-2">
                <FaFile size={48} className="text-blue-700" />
                <span className="text-lg font-semibold">{contract.name}</span>
              </div>
              {hoveredContract === contract.uuid && (
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-row space-x-2">
                  <button
                    className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    aria-label="View contract"
                  >
                    <FaEye />
                    <span>View</span>
                  </button>
                  <button
                    className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                    aria-label="Cancel contract"
                  >
                    <FaTimes />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Contracts;
