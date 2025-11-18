"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getCompetenceById } from "@/services/index";

const CompetencePage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<any>();

  const { competence, loading, error } = useSelector(
    (state: any) => state.competences
  );

  useEffect(() => {
    if (id) {
      dispatch(getCompetenceById(id));
    }
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading competency...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!competence) {
    return (
      <div className="flex items-center justify-center h-screen">
        No competency found.
      </div>
    );
  }

  return (
    <div className="max-w-2xl p-6">
      <h1 className="text-2xl font-bold mb-6">Competency Details</h1>

      <div className="space-y-4 ">
        <div className="flex flex-row gap-4">
          <span className="text-md text-[#576074] font-medium">Competence Name:</span>
          <div className=" text-base">{competence.name}</div>
        </div>

        {/* <div>
          <span className="text-sm text-[#576074] font-medium">Trade:</span>
          <div className="mt-1 text-base">
            {competence.trades?.length
              ? competence.trades.map((t: any) => t.title).join(", ")
              : "-"}
          </div>
        </div> */}

        <div className="flex flex-row gap-4">
          <span className="text-md text-[#576074] font-medium">
            Competence Code:
          </span>
          <div className=" text-base">{competence.code}</div>
        </div>
      </div>
    </div>
  );
};

export default CompetencePage;
