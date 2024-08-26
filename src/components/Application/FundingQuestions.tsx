import { ApplicationQuestions } from "@/types/application";
import { Select } from "@mantine/core";
import React, { useState, ChangeEvent } from "react";
import { useSelector } from "react-redux";

interface FundingQuestionsProps {
  data: ApplicationQuestions;
  setData: React.Dispatch<React.SetStateAction<any>>;
  subwindows: string[];
}

const FundingQuestions: React.FC<FundingQuestionsProps> = ({
  data,
  setData,
  subwindows,
}) => {
  const trades = useSelector((state: any) =>
    state.trades.trades.map((trade: any) => ({
      label: trade.title,
      value: trade.uuid,
    })),
  );
  console.log(trades);

  const [files, setFiles] = useState<{ [key: string]: File | undefined }>({});
  const [trainingProcessInputs, setTrainingProcessInputs] = useState({
    trade: "",
    moduleName: "",
    from: "",
    to: "",
    numberOfHours: "",
  });
  const [trainingEquipments, setTrainingEquipments] = useState({
    trade: "",
    nameOfEquipment: "",
    numberOfEquipment: "",
  });
  const [staffInputs, setStaffInputs] = useState({
    number: "",
    position: "",
    available: "",
    qualification: "",
  });

  const handleInputChange = (inputName: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [inputName]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [key]: file }));
      setData((prev: any) => ({ ...prev, [key]: file }));
    }
  };

  const handleArrayOfObjectsChange = (
    inputName: string,
    value: any,
    index: number,
  ) => {
    setData((prev: any) => {
      const newData = [...(prev[inputName] || [])];
      newData[index] = value;
      return {
        ...prev,
        [inputName]: newData,
      };
    });
  };

  const validateTrainingProcessInputs = () => {
    const { trade, moduleName, from, to, numberOfHours } =
      trainingProcessInputs;
    return trade && moduleName && from && to && numberOfHours;
  };

  const validateTrainingEquipments = () => {
    const { trade, nameOfEquipment, numberOfEquipment } = trainingEquipments;
    return trade && nameOfEquipment && numberOfEquipment;
  };

  const addTrainingProcess = () => {
    if (!validateTrainingProcessInputs()) {
      alert("Please fill in all fields before adding.");
      return;
    }

    handleArrayOfObjectsChange(
      "trainingProcess",
      trainingProcessInputs,
      data.trainingProcess?.length || 0,
    );

    setTrainingProcessInputs({
      trade: "",
      moduleName: "",
      from: "",
      to: "",
      numberOfHours: "",
    });
  };

  const addTrainingEquipment = () => {
    if (!validateTrainingEquipments()) {
      alert("Please fill in all fields before adding.");
      return;
    }

    handleArrayOfObjectsChange(
      "trainingEquipment",
      trainingEquipments,
      data.trainingEquipment?.length || 0,
    );

    setTrainingEquipments({
      trade: "",
      nameOfEquipment: "",
      numberOfEquipment: "",
    });
  };

  return (
    <div className="space-y-2">
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">Title of the project</h3>
        <p className="text-sm text-gray-600">
          Please provide the name/title of your project.
        </p>
        <input
          type="text"
          value={data.title || ""}
          onChange={(e) => handleInputChange("title", e.target.value)}
          className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
        />
      </div>
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">
          Project Activities and Expected Outcomes
        </h3>
        <p className="text-sm text-gray-600">
          Outline the planned activities to be supported; The skills gap to be
          addressed by the project, the expected outcomes/results, and justify
          why you need the grant to solve it. Explain why this project cannot be
          executed without a grant.
        </p>
        <textarea
          value={data.activitiesAndOutcomes || ""}
          onChange={(e) =>
            handleInputChange("activitiesAndOutcomes", e.target.value)
          }
          className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
        />
      </div>
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">Readiness to execute the project</h3>
        <p className="text-sm text-gray-600">
          Explain to which extent you are prepared to execute this project.
        </p>
        <textarea
          value={data.readinessExecute || ""}
          onChange={(e) =>
            handleInputChange("readinessExecute", e.target.value)
          }
          className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
        />
      </div>
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">
          Role of other involved training providers
        </h3>
        <p className="text-sm text-gray-600">
          Explain the role of any other involved training provider in the
          project, if any. Indicate the training provider you would like to
          partner with if any.
        </p>
        <textarea
          value={data.role || ""}
          onChange={(e) => handleInputChange("role", e.target.value)}
          className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
        />
      </div>
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">Sustainability</h3>
        <p className="text-sm text-gray-600">
          How will your project (the planned training activity) continue after
          this funding
        </p>
        <textarea
          value={data.sustainability || ""}
          onChange={(e) => handleInputChange("sustainability", e.target.value)}
          className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
        />
      </div>
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">
          Identification of employees in need of skills upgrading{" "}
        </h3>
        <p className="text-sm text-gray-600">
          Provide the number of employees you need to train and their
          background.
        </p>
        <input
          type="number"
          value={data.identificationEmployee || ""}
          onChange={(e) =>
            handleInputChange("identificationEmployee", e.target.value)
          }
          className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
        />
      </div>
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">Contribution from the applicant </h3>
        <p className="text-sm text-gray-600">
          Justify how your institution will contribute to facilitate the
          training.
        </p>
        <textarea
          value={data.contributionFromApplicant || ""}
          onChange={(e) =>
            handleInputChange("contributionFromApplicant", e.target.value)
          }
          className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
        />
      </div>
      {!subwindows.includes("subwindow_4") && (
        <>
          <div className="p-4 bg-white rounded-lg ">
            <h3 className="text-lg font-bold">Training Delivery Process</h3>
            <p className="text-sm text-gray-600">
              Estimate the training duration with respect to the training
              content/modules to be offered.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Select
                  name="trade"
                  value={trainingProcessInputs.trade}
                  onChange={(selectedOption) =>
                    setTrainingProcessInputs((prev) => ({
                      ...prev,
                      trade: selectedOption || "",
                    }))
                  }
                  data={trades}
                  className="mt-1 block w-full  pl-5  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Select Trade"
                />
                <input
                  type="text"
                  placeholder="Name of Module"
                  value={trainingProcessInputs.moduleName}
                  onChange={(e) =>
                    setTrainingProcessInputs((prev) => ({
                      ...prev,
                      moduleName: e.target.value,
                    }))
                  }
                  className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
                />
                <input
                  type="date"
                  placeholder="From Date"
                  value={trainingProcessInputs.from}
                  onChange={(e) =>
                    setTrainingProcessInputs((prev) => ({
                      ...prev,
                      from: e.target.value,
                    }))
                  }
                  className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
                />
                <input
                  type="date"
                  placeholder="To Date"
                  value={trainingProcessInputs.to}
                  onChange={(e) =>
                    setTrainingProcessInputs((prev) => ({
                      ...prev,
                      to: e.target.value,
                    }))
                  }
                  className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
                />
                <input
                  type="number"
                  placeholder="Number of Hours"
                  value={trainingProcessInputs.numberOfHours}
                  onChange={(e) =>
                    setTrainingProcessInputs((prev) => ({
                      ...prev,
                      numberOfHours: e.target.value,
                    }))
                  }
                  className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={addTrainingProcess}
                  className="mt-2 p-2 bg-primary text-white px-20 rounded-full"
                >
                  Add
                </button>
              </div>
            </div>
            {data.trainingProcess?.length &&
              data.trainingProcess?.length > 0 && (
                <table className="w-full mt-4 border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Trade</th>
                      <th className="border p-2">Module Name</th>
                      <th className="border p-2">From Date</th>
                      <th className="border p-2">To Date</th>
                      <th className="border p-2">Number of Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.trainingProcess || []).map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">
                          {trades.find(
                            (trade: any) => trade.value === item.trade,
                          )?.label || "N/A"}
                        </td>
                        <td className="border p-2">{item.moduleName}</td>
                        <td className="border p-2">
                          {new Date(item.from).toLocaleDateString()}
                        </td>
                        <td className="border p-2">
                          {new Date(item.to).toLocaleDateString()}
                        </td>
                        <td className="border p-2">{item.numberOfHours}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
          <div className="p-4 bg-white rounded-lg ">
            <h3 className="text-lg font-bold">Training Manual</h3>
            <p className="text-sm text-gray-600">
              Please attach a detailed description of the content (training
              manual) of the proposed training.
            </p>
            <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
              <label
                htmlFor="file-upload-trainingManual"
                className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
              >
                <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold">+</span>
                </div>
                {files.trainingManual ? (
                  <div className="text-center">
                    <p className="text-xl font-medium text-gray-700">
                      {files.trainingManual.name}
                    </p>
                    <p className="text-sm text-gray-500">File selected</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-md text-gray-500">Upload file</p>
                    <p className="text-md text-gray-400">or drag and drop</p>
                  </div>
                )}
              </label>
              <input
                id="file-upload-trainingManual"
                name="trainingManual"
                type="file"
                accept=".pdf"
                style={{ display: "none" }}
                onChange={(e) => handleFileChange(e, "trainingManual")}
              />
            </div>
          </div>
          <div className="p-4 bg-white rounded-lg ">
            <h3 className="text-lg font-bold">Training Delivery Process</h3>
            <p className="text-sm text-gray-600">
              Estimate the training duration with respect to the training
              content/modules to be offered.
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <Select
                  name="trade"
                  value={trainingProcessInputs.trade}
                  onChange={(selectedOption) =>
                    setTrainingProcessInputs((prev) => ({
                      ...prev,
                      trade: selectedOption || "",
                    }))
                  }
                  data={trades}
                  className="mt-1 block w-full  pl-5  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Select Trade"
                />
                <input
                  type="text"
                  placeholder="Name of Staff"
                  value={staffInputs.number}
                  onChange={(e) =>
                    setTrainingProcessInputs((prev) => ({
                      ...prev,
                      moduleName: e.target.value,
                    }))
                  }
                  className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={addTrainingProcess}
                  className="mt-2 p-2 bg-primary text-white px-20 rounded-full"
                >
                  Add
                </button>
              </div>
            </div>
            {data.trainingProcess?.length &&
              data.trainingProcess?.length > 0 && (
                <table className="w-full mt-4 border-collapse border border-gray-200">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border p-2">Name</th>
                      <th className="border p-2">Position</th>
                      <th className="border p-2">Qualification</th>
                      <th className="border p-2">Available</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data.staffs || []).map((item, index) => (
                      <tr key={index}>
                        <td className="border p-2">{item.number}</td>
                        <td className="border p-2">{item.position}</td>
                        <td className="border p-2">{item.qualification}</td>
                        <td className="border p-2">{item.available}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
          </div>
        </>
      )}
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">Training Equipment</h3>
        <p className="text-sm text-gray-600">
          List down the equipment available to facilitate this training
        </p>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Name of Equipment"
              value={trainingEquipments.nameOfEquipment}
              onChange={(e) =>
                setTrainingEquipments((prev) => ({
                  ...prev,
                  nameOfEquipment: e.target.value,
                }))
              }
              className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
            />
            <input
              type="number"
              placeholder="Number of Equipments"
              value={trainingEquipments.numberOfEquipment}
              onChange={(e) =>
                setTrainingEquipments((prev) => ({
                  ...prev,
                  numberOfEquipment: e.target.value,
                }))
              }
              className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
            />
            <Select
              name="trade"
              value={trainingEquipments.trade}
              onChange={(selectedOption) =>
                setTrainingEquipments((prev) => ({
                  ...prev,
                  trade: selectedOption || "",
                }))
              }
              data={trades}
              className="mt-1 block w-full  pl-5  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Select Trade"
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={addTrainingEquipment}
              className="mt-2 p-2 bg-primary text-white px-20 rounded-full"
            >
              Add
            </button>
          </div>
        </div>
        {data.trainingEquipment?.length &&
          data.trainingEquipment?.length > 0 && (
            <table className="w-full mt-4 border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Number of Equipment</th>
                  <th className="border p-2">Selected Trade</th>
                </tr>
              </thead>
              <tbody>
                {(data.trainingEquipment || []).map((item, index) => (
                  <tr key={index}>
                    <td className="border p-2">{item.nameOfEquipment}</td>
                    <td className="border p-2">{item.numberOfEquipment}</td>
                    <td className="border p-2">
                      {trades.find((trade: any) => trade.value === item.trade)
                        ?.label || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
      </div>
      <div className="p-4 bg-white rounded-lg ">
        <h3 className="text-lg font-bold">Training Equipment - (Continued)</h3>
        <p className="text-sm text-gray-600">
          Please attach the proof of ownership (Notarized list of equipment,
          Original Invoices (EBM for locally purchased equipment).)
        </p>
        <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl -sm">
          <label
            htmlFor="file-upload-trainingManual"
            className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
          >
            <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">+</span>
            </div>
            {files.trainingEquipment ? (
              <div className="text-center">
                <p className="text-xl font-medium text-gray-700">
                  {files.trainingEquipment.name}
                </p>
                <p className="text-sm text-gray-500">File selected</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-md text-gray-500">Upload file</p>
                <p className="text-md text-gray-400">or drag and drop</p>
              </div>
            )}
          </label>
          <input
            id="file-upload-trainingEquipment"
            name="trainingEquipment"
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "trainingEquipment")}
          />
        </div>
      </div>
    </div>
  );
};

export default FundingQuestions;
