import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Skeleton } from "@mantine/core";
import DonutChart from "../chart/DonutChart";
import { SolarAltArrowRightOutline } from "@/components/core/icons/index";
import Link from "next/link";
import { Call } from "@/types";
import ProgressCircle from "./ProgressBar";
import ContentCollapse from "../ui/ContentCollapse";

const CallsList = () => {
  const calls = useSelector((state: any) => state.calls);
  const { myApplications } = useSelector((state: any) => state.applications);
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

  const CallCard = ({ call }: { call: Call }) => {
    return (
        <div className="flex flex-col items-center w-full">
            <div className="relative w-full overflow-hidden mb-5">
                {/* Left Arrow */}
                {isScrollable && scrollRef.current?.scrollLeft! > 0 && (
                    <button
                        onClick={handlePrevious}
                        className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-20 bg-primary p-3 rounded-full text-white shadow-lg transition hover:bg-primary-dark"
                    >
                        <SolarAltArrowRightOutline className="rotate-180 w-6 h-6 font-extrabold" />
                    </button>
                )}

                {/* Scrollable Content */}
                <div
                    ref={scrollRef}
                    className="flex flex-row gap-4 overflow-x-auto w-screen scrollbar-hide relative scroll-smooth px-6"
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
                    scrollRef.current?.scrollLeft! +
                        scrollRef.current?.clientWidth! <
                        scrollRef.current?.scrollWidth! && (
                        <button
                            onClick={handleNext}
                            className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20 bg-primary p-3 rounded-full text-white shadow-lg transition hover:bg-primary-dark"
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
                      className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-20 bg-primary p-3 rounded-full text-white shadow-lg transition hover:bg-primary-dark"
                  >
                      <SolarAltArrowRightOutline className="rotate-180 w-6 h-6 font-extrabold" />
                  </button>
              )}

              {/* Scrollable Content */}
              <div
                  ref={scrollRef}
                  className="flex flex-row gap-4 overflow-x-auto w-screen scrollbar-hide relative scroll-smooth px-6"
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
                  scrollRef.current?.scrollLeft! +
                      scrollRef.current?.clientWidth! <
                      scrollRef.current?.scrollWidth! && (
                      <button
                          onClick={handleNext}
                          className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20 bg-primary p-3 rounded-full text-white shadow-lg transition hover:bg-primary-dark"
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
