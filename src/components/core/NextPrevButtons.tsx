import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

interface Props {
  handleNext: () => void;
  handlePrev: () => void;
  isFirst?: boolean;
}
const NextPrevButtons = ({ handleNext, handlePrev, isFirst }: Props) => {
  return (
    <div className="flex gap-4">
      <button
        className={`flex gap-2 bg-gray-300 text-gray-700 font-medium text-base w-[118px] h-[45px] items-center justify-center rounded-full ${isFirst && "cursor-not-allowed"}`}
        disabled={isFirst}
        onClick={handlePrev}
      >
        <IoIosArrowBack color="text-gray-700" />
        <span>Prev</span>
      </button>
      <button
        className="flex gap-2 bg-[#005DE914] text-blue-500 font-medium text-base w-[118px] h-[45px] items-center justify-center rounded-full border border-[#005DE9]"
        onClick={handleNext}
      >
        <p>Next</p>
        <IoIosArrowForward color="text-blue-500" />
      </button>
    </div>
  );
};

export default NextPrevButtons;
