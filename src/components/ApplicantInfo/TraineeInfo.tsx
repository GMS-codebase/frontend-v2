import React from "react";
import { SolarPen2Bold } from "../core/icons";

function TraineeInfo() {
  return (
    <div>
      <div className="bg-white rounded-2xl p-10 mb-10 flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Trainee</div>
            <div className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center">
              <span>
                <SolarPen2Bold />
              </span>
              <div>Export Trainee Details</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>National ID</div>
              </div>
              <div className="mt-2 ml-4">1200470130063087</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Education Level </div>
              </div>
              <div className="mt-2 ml-4">L 5 CROP PRODUCTION</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Name</div>
              </div>
              <div className="mt-2 ml-4">Amen IJURURYOGUKOMORERWA</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Graduate status</div>
              </div>
              <div className="mt-2 ml-4">ONGOING</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Phone</div>
              </div>
              <div className="mt-2 ml-4">+250793034347</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Training</div>
              </div>
              <div className="mt-2 ml-4">NEET</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Date of birth</div>
              </div>
              <div className="mt-2 ml-4">2004-01-01</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Disability</div>
              </div>
              <div className="mt-2 ml-4">No</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Institution</div>
              </div>
              <div className="mt-2 ml-4">KTSS</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Institution</div>
              </div>
              <div className="mt-2 ml-4">KTSS</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Gender</div>
              </div>
              <div className="mt-2 ml-4">FEMALE</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>District</div>
              </div>
              <div className="mt-2 ml-4">RWAMAGANA</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Marital Status</div>
              </div>
              <div className="mt-2 ml-4">Single</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Trade</div>
              </div>
              <div className="mt-2 ml-4">Networking</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TraineeInfo;
