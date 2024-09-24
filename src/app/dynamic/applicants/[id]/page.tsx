"use client";
import React from "react";
import { SolarPen2Bold } from "@/components/core/icons";
import ApplicantTable from "./IndexTable";

const Page = () => {
  return (
    <div className="">
      <div className="bg-white rounded-2xl p-10 mb-10 flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Legal Status</div>
            <div className="flex gap-2 p-2 bg-[#005DE9] rounded-full text-white px-4  py-2 items-center justify-center">
              <span>
                <SolarPen2Bold />
              </span>
              <div>Export Applicant Details</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Business Name</div>
              </div>
              <div className="mt-2 ml-4">RUTARE TVET SCHOOL</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Business Type </div>
              </div>
              <div className="mt-2 ml-4">TRAINING_INSTITUTE</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Phone</div>
              </div>
              <div className="mt-2 ml-4">Phone 250788472005</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Registration number</div>
              </div>
              <div className="mt-2 ml-4">103733616</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Is Private</div>
              </div>
              <div className="mt-2 ml-4">YES</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Email</div>
              </div>
              <div className="mt-2 ml-4">jniyonambaza@yahoo.fr</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>TIN</div>
              </div>
              <div className="mt-2 ml-4">103733616</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Bank</div>
              </div>
              <div className="mt-2 ml-4">BPR</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>PO Box</div>
              </div>
              <div className="mt-2 ml-4">0987654</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Registration date</div>
              </div>
              <div className="mt-2 ml-4">2013-01-01</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Bank Account</div>
              </div>
              <div className="mt-2 ml-4">558373164110173</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Year of estabrishment</div>
              </div>
              <div className="mt-2 ml-4">2013</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Number of Employee</div>
              </div>
              <div className="mt-2 ml-4">8</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Address</div>
              </div>
              <div className="mt-2 ml-4">
                Rutare-gicumbi district-northern province-Rwanda{" "}
              </div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Business Name</div>
              </div>
              <div className="mt-2 ml-4">Butare Tvet</div>
            </div>
            <div className="flex w-1/2">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Business Name</div>
              </div>
              <div className="mt-2 ml-4">Butare Tvet</div>
            </div>
          </div>
        </div>
      </div>
      <ApplicantTable />
    </div>
  )
};

export default Page;
