import React from "react";
import { SolarPen2Bold } from "../core/icons";

function InstallmentInfo() {
  return (
    <div className="w-1/2">
      <div className="bg-white rounded-2xl p-10 mb-10 flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Installment Information</div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Installment type</div>
              </div>
              <div className="mt-2 ml-4">First installment</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Remaining Amount</div>
              </div>
              <div className="mt-2 ml-4">14363666.50</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Percentage</div>
              </div>
              <div className="mt-2 ml-4">50%</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Payment condition</div>
              </div>
              <div className="mt-2 ml-4">After contract signing </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InstallmentInfo;
