import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "@mantine/core";
import DonutChart from "../chart/DonutChart";
import { SolarAltArrowRightOutline } from "@/components/core/icons/index";
import Link from "next/link";

const CallCard = ({
  call,
}: {
  call: {
    uuid: string;
    title: string;
    description: string;
  };
}) => {
  return (
    <div className="flex flex-shrink-0 gap-2 w-[600px] bg-[#005DE9] bg-opacity-10 rounded-3xl px-4 py-2">
      <div className="flex flex-col gap-4 w-[60%]">
        <h2 className="font-semibold text-[#005DE9]">{call.title}</h2>
        <div className="font-medium flex justify-evenly items-start">
          {call.description}
        </div>
        <Link href={`/applicant/applications/${call.uuid}`}>
          <div className="flex gap-2 p-2 bg-[#005DE9] font-normal rounded-full text-white px-4 py-2 items-center justify-start w-fit">
            View details
          </div>
        </Link>
      </div>
      <div className="w-[40%] text-[6px] font-bold">
        <DonutChart />
      </div>
    </div>
  );
};

type Call = {
  title: string;
  description: string;
};

const CallsList = () => {
  const calls = useSelector((state: any) => state.calls);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        setIsScrollable(
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth
        );
      }
    };
    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    return () => window.removeEventListener("resize", checkScrollable);
  }, []);

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 20;
    }
  };

  const handlePrevious = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 20;
    }
  };

  return (
    <div className="flex items-center">
      {isScrollable && scrollRef.current?.scrollLeft! > 0 && (
        <button onClick={handlePrevious} className="mr-2">
          <SolarAltArrowRightOutline className="rotate-180 text-gray-500 w-6 h-6" />
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 w-full"
        style={{ width: "100%" }}
      >
        {calls.loading ? (
          <>
            <Skeleton height={150} width={600} radius="xl" />
            <Skeleton height={150} width={600} radius="xl" />
            <Skeleton height={150} width={600} radius="xl" />
          </>
        ) : (
          calls.calls.map((call: any, index: any) => {
            console.log(call);
            return <CallCard key={index} call={call} />;
          })
        )}
      </div>
      {isScrollable &&
        scrollRef.current?.scrollLeft! + scrollRef.current?.clientWidth! <
          scrollRef.current?.scrollWidth! && (
          <button onClick={handleNext} className="ml-2">
            <SolarAltArrowRightOutline className="text-gray-500 w-6 h-6" />
          </button>
        )}
    </div>
  );
};

export default CallsList;
