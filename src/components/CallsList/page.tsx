import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "@mantine/core";
import DonutChart from "../chart/DonutChart";
import { SolarAltArrowRightOutline } from "@/components/core/icons/index";
import Link from "next/link";
import { Call } from "@/types";

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
        <Link href={`/applicant/applications/call/${call.uuid}`}>
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

const CallsList = () => {
  const calls = useSelector((state: any) => state.calls);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const checkScrollable = () => {
      if (scrollRef.current) {
        setIsScrollable(
          scrollRef.current.scrollWidth > scrollRef.current.clientWidth,
        );
      }
    };

    const handleScroll = () => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const scrolledPercentage =
          (scrollLeft / (scrollWidth - clientWidth)) * 100;
        setScrollProgress(scrolledPercentage);
      }
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);

    if (scrollRef.current) {
      scrollRef.current.addEventListener("scroll", handleScroll);
    }

    return () => {
      window.removeEventListener("resize", checkScrollable);
      if (scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleNext = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += 300;
    }
  };

  const handlePrevious = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft -= 300;
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div className="relative w-full overflow-hidden mb-5">
        {/* Left Arrow */}
        {isScrollable && scrollRef.current?.scrollLeft! > 0 && (
          <button
            onClick={handlePrevious}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-primary p-3 rounded-full text-white shadow-lg transition hover:bg-primary-dark"
            style={{ zIndex: 20 }} // Ensuring visibility
          >
            <SolarAltArrowRightOutline className="rotate-180 w-6 h-6 font-extrabold" />
          </button>
        )}

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex flex-row gap-4 overflow-x-auto w-full scrollbar-hide relative scroll-smooth"
          style={{ width: "100%" }}
        >
          {calls.loading ? (
            <>
              <Skeleton height={150} width={600} radius="xl" />
              <Skeleton height={150} width={600} radius="xl" />
              <Skeleton height={150} width={600} radius="xl" />
            </>
          ) : (
            <>
              {calls.calls
                .filter((call: Call) => call.status === "OPEN")
                .map((call: any, index: any) => (
                  <CallCard key={index} call={call} />
                ))}
            </>
          )}
        </div>

        {/* Right Arrow */}
        {isScrollable &&
          scrollRef.current?.scrollLeft! + scrollRef.current?.clientWidth! <
            scrollRef.current?.scrollWidth! && (
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-primary p-3 rounded-full text-white shadow-lg transition hover:bg-primary-dark"
              style={{ zIndex: 20 }} // Ensuring visibility
            >
              <SolarAltArrowRightOutline className="w-6 h-6 font-extrabold" />
            </button>
          )}
      </div>

      {/* Scroll Progress Bar */}
      <div className="bg-gray rounded-full w-full md:w-[70%] lg:w-[40%]">
        <div
          className="p-1 bg-primary rounded-full transition-all duration-300"
          style={{
            width: `${scrollProgress}%`,
          }}
        />
      </div>
    </div>
  );
};

export default CallsList;
