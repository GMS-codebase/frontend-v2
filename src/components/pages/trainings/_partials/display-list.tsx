import React, { FC } from "react";

type props = {
  title: string;
  desc: string;
};
const DisplayListItem: FC<props> = ({ title, desc }) => {
  return (
    <div className="flex items-center gap-4 py-2">
      <span className="text-primaryText text-center text-sm font-semibold md:text-lg min-w-[120px] bg-[#000F230A] px-2 py-1 md:px-3 md:py-2 rounded-full">
        {title}
      </span>
      <span className="text-primaryText text-sm font-semibold md:text-lg">
        {desc}
      </span>
    </div>
  );
};

export default DisplayListItem;
