import React from "react";
import { SolarPen2Bold } from "../core/icons";
interface Props {
  contract: any
}
function ContractInfo({
  contract
}: Props) {
  return (
    <div className="w-1/2">
      <div className="bg-white rounded-2xl p-10 mb-10 flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Contract Information</div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Contract number</div>
              </div>
              <div className="mt-2 ml-4">{contract?.contractNumber}</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Remaining amount</div>
              </div>
              <div className="mt-2 ml-4">{contract?.remainedAmount}</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Contract amount</div>
              </div>
              <div className="mt-2 ml-4">{contract?.totalAmount}</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Contract Status</div>
              </div>
              <div className="mt-2 ml-4">{contract?.contractStatus}</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Number of Trainees</div>
              </div>
              <div className="mt-2 ml-4">{contract?.numberOfTrainees} Trainees</div>
            </div>
          </div>
          <div className=" flex  mt-4 space-x-4">
            <div className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 ">
              <span>
                <SolarPen2Bold />
              </span>
              <div>Download Contract</div>
            </div>{" "}
            <div className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 ">
              <span>
                <SolarPen2Bold />
              </span>
              <div>Download meeting minute</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractInfo;
