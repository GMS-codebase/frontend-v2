import React, { useState } from "react";
import DonutChart from "../chart/DonutChart";
import { SolarAltArrowRightOutline } from "@/components/core/icons/index";
import { useRef } from "react";
import { useEffect } from "react";
const CallCard = ({
    call,
}: {
    call: {
        title: string;
        description: string;
    };
}) => {
    return (
        <div className="flex flex-shrink-0  gap-2 w-[680.35px] h-[290px] bg-[#005DE905] rounded-3xl px-4 py-5">
            <div className="flex flex-col gap-4 w-[70%]">
                <h2 className="font-semibold text-[#005DE9] text-2xl">{call.title}</h2>
                <h1 className="font-light flex justify-evenly items-start text-[#000F23B0] text-sm w-11/12">
                    {call.description}
                </h1>
                <div className="flex gap-2 p-2 bg-[#005DE9] font-normal rounded-full text-white px-4  py-2 items-center justify-start w-fit">
                    View details
                </div>
            </div>
            <div className="w-[30%] text-[9px] font-bold flex items-start">
                <DonutChart />
            </div>
        </div>
    );
};


type Call = {
    title: string;
    description: string;
};

type CallsListProps = {
    calls: Call[];
    cardWidth: string;
    scrollAmount: number;
    showArrows: boolean;
};

const CallsList = ({
    calls,
    cardWidth,
    scrollAmount,
    showArrows,
}: CallsListProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [isScrollable, setIsScrollable] = useState(false);

    useEffect(() => {
        const checkScrollable = () => {
            if (scrollRef.current) {
                setIsScrollable(
                    scrollRef.current.scrollWidth >
                        scrollRef.current.clientWidth
                );
            }
        };
        checkScrollable();
        window.addEventListener("resize", checkScrollable);
        return () => window.removeEventListener("resize", checkScrollable);
    }, []);

    const handleNext = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft += scrollAmount;
        }
    };

    const handlePrevious = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft -= scrollAmount;
        }
    };

    return (
        <div className="flex items-center">
            {showArrows &&
                isScrollable &&
                scrollRef.current?.scrollLeft! > 0 && (
                    <button onClick={handlePrevious} className="mr-2">
                        <SolarAltArrowRightOutline className="rotate-180 text-gray-500 w-6 h-6" />
                    </button>
                )}
            <div
                ref={scrollRef}
                className="flex flex-row gap-4 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-500 pb-6 calls-list-cont"
                style={{ width: cardWidth }}
            >
                {calls.map((call, index) => (
                    <CallCard key={index} call={call} />
                ))}
            </div>
            {showArrows &&
                isScrollable &&
                scrollRef.current?.scrollLeft! +
                    scrollRef.current?.clientWidth! <
                    scrollRef.current?.scrollWidth! && (
                    <button
                        onClick={handleNext}
                        className="ml-2 absolute right-0 w-48 text-[#000F23] text-[60px] items-center h-full flex justify-end "
                        style={{
                            background:
                                "linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.74) 30.1%, #FFFFFF 100%)",
                        }}
                    >
                        <SolarAltArrowRightOutline />
                    </button>
                )}
        </div>
    );
};

export default CallsList;
