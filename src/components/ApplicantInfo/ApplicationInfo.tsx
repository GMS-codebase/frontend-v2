import React from 'react'
import { SolarPen2Bold } from '../core/icons'

function ApplicationInfo() {
  return (
    <div className='w-1/2'>
     <div className="bg-white rounded-2xl p-10 mb-10 flex flex-col gap-6">
        <div className="flex flex-col gap-6  text-black">
          <div className="flex justify-between">
            <div className="text-xl font-bold">Application Information</div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Application number</div>
              </div>
              <div className="mt-2 ml-4">GMS-CON-00087</div>
            </div>
      
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Call</div>
              </div>
              <div className="mt-2 ml-4">NEET: Call for Grant Proposal </div>
            </div>
    
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Window</div>
              </div>
              <div className="mt-2 ml-4">Window 2: Out of school youth</div>
            </div>
          </div>
          <div className="flex  w-4/5  font-semibold ">
            <div className="flex w-full">
              <div className="flex  gap-2  bg-gray-400 bg-opacity-10 px-4  py-2 rounded-full items-center justify-center">
                <div>Current stage</div>
              </div>
              <div className="mt-2 ml-4">Contract signing </div>
            </div>
       
          </div>
      
            <div className=" flex  mt-20 space-x-4">
                <div className="flex gap-2 p-2 bg-[#005DE9] rounded-full w-full text-center justify-center text-white px-4  py-2 ">
              <div>View more application info</div>
            </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default ApplicationInfo