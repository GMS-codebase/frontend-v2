import { Skeleton } from "@mantine/core";
import React, { useState } from "react";
import { FaFile, FaTimes, FaEye } from "react-icons/fa";

const Minutes = ({
  data,
  loading,
}: {
  data?: any;
  loading?: boolean;
}) => {

  return (
    <div className="p-4">
      <div className="flex flex-wrap gap-6">
        {loading ? (
          <div className="w-full h-full flex items-center justify-between">
            <Skeleton width={330} height={200} />
            <Skeleton width={330} height={200} />
            <Skeleton width={330} height={200} />
          </div>
        ) : !data ? (
          <div className="w-full flex items-center mt-10">
            <h1 className="w-full text-center text-xl font-bold">No Minutes Uploaded!</h1>
          </div>
        ) : (
          data.map((_item: any) => (
            <div
              key={_item.uuid}
              className="relative flex flex-col items-center pb-8 p-4 bg-white shadow-lg rounded-lg w-[25rem] hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center space-y-2">
                <FaFile size={48} className="text-blue-700" />
                <span className="text-lg font-semibold">{_item.application?.applicationNumber}</span>
                <p className="text-xl text-neutral-300 font-normal">{_item.application?.projectFunding?.title}</p>
              </div>
              <div className="flex items-center gap-4 mt-5">
                <button
                  className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                >
                  <FaEye size={20}/>
                  <span className="text-sm">View</span>
                </button>
                <button
                  className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                >
                  <FaTimes size={20}/>
                  <span className="text-sm">Cancel</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Minutes;
