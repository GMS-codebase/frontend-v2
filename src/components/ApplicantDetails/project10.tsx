import React from "react";
import TextArea from "@/components/ApplicantDetails/TextArea";

export default function Project9() {
  return (
    <div>
      <div>Sustainability</div>
      <div>
        How will your project (the planned training activity) continue beyond
        the phase funded by SDF?
      </div>
      <div>
        <div>
          <TextArea readOnly defaultText="" />
        </div>
      </div>
      <div>
        <div className="flex gap-4">
          <button className="flex gap-2 bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
            <span>i</span>
            <p>Previous</p>
          </button>
          <button className="flex gap-2 cursor-not-allowed" disabled>
            <p>Next</p>
            <span>i</span>
          </button>
        </div>
      </div>
    </div>
  );
}
