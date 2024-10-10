// import React from "react";

// const Dash = () => {
//   return (
//     <div className="bg-white p-6 rounded-2xl w-full">
//       {/* Headers */}
//       <div className="flex justify-between text-black font-bold mb-2">
//         <span className="w-1/3">Sectors</span>
//         <span className="w-1/4 text-center">Applications</span>
//         <span className="w-1/4 ">Applicants</span>
//       </div>

//       {/* Data Rows */}
//       <div>
//         {[
//           {
//             name: "Culinary Programs",
//             application: 32,
//             applicant: 1090,
//           },
//           {
//             name: "Tech Innovators",
//             application: 14,
//             applicant: 123,
//           },
//           {
//             name: "Masonry Internships",
//             application: 20,
//             applicant: 149,
//           },
//         ].map((sector, index) => (
//           <div
//             key={index}
//             className="flex justify-between items-center bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2 "
//           >
//             <span className="text-base w-1/3">{sector.name}</span>
//             <span className="text-base bg-[#005DE91F] rounded-2xl px-3 text-primary font-bold  text-center w-1/4">
//               {sector.application}
//             </span>
//             <span className="text-base bg-[#005DE91F] rounded-2xl px-3 text-primary font-bold  text-center w-1/4">
//               {sector.applicant}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dash;


import React from "react";

interface DashProps {
    col1: string;
    col2: string;
    data: Array<{ col1Data: string | number; col2Data: string | number }>;
}

const Dash: React.FC<DashProps> = ({ col1, col2, data }) => {
    return (
        <div className="bg-white p-6 rounded-2xl w-full">
            {/* Headers */}
            <div className="flex justify-between text-black font-bold mb-2">
                <span className="w-1/3">Priority sectors</span>
                <span className="w-1/4">{col1}</span>
                <span className="w-1/4 text-center">{col2}</span>
            </div>

            {/* Data Rows */}
            <div>
                {data.map((item, index) => (
                    <div
                        key={index}
                        className="flex justify-between items-center bg-[#005DE91F] px-4 py-2 rounded-xl text-primary mt-2"
                    >
                        <span className="text-base w-1/3">
                            Priority sectors
                        </span>
                        <span className="text-base bg-[#005DE91F] rounded-2xl px-3 text-primary font-bold text-center w-1/4">
                            {item.col1Data}
                        </span>
                        <span className="text-base bg-[#005DE91F] rounded-2xl px-3 text-primary font-bold text-center w-1/4">
                            {item.col2Data}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dash;
