import { Select } from "@mantine/core";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";

interface Question {
  title: string;
  description: string;
  input: string;
  getOptions?: (obj: any) => any;
  selector?: string;
  options?: any;
  type: "text" | "textarea" | "file" | "arrayOfObjects";
  dto?: Record<
    string,
    {
      type: "text" | "textarea" | "file" | "select";
      selector?: string;
      getOptions?: (obj: any) => any;
      options?: any;
    }
  >;
}

interface QuestionsProps {
  questions: Question[][];
  setQuestionsData: (data: { [key: string]: any }) => void;
}

const Questions: React.FC<QuestionsProps> = ({
  questions,
  setQuestionsData,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [inputs, setInputs] = useState<{ [key: string]: any }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const tradesData = useSelector((state: any) => state.trades);
  const [files, setFiles] = useState<{ [key: string]: File | null }>({});
  const [arrayOfObjectsData, setArrayOfObjectsData] = useState<{
    [key: string]: any[];
  }>({});
  const seenInputs = useMemo(() => {
    const seen = new Set<string>();
    for (let i = 0; i < currentPage; i++) {
      questions[i].forEach((question) => {
        seen.add(question.input);
      });
    }
    return seen;
  }, [currentPage, questions]);

  const handleNext = () => {
    if (validatePage()) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
    setQuestionsData({ ...inputs, [name]: value });
    if (errors[name]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    inputName: string,
  ) => {
    const uploadedFile = e.target.files ? e.target.files[0] : null;
    setFiles({ ...files, [inputName]: uploadedFile });
    setInputs({ ...inputs, [inputName]: uploadedFile });
    setQuestionsData({ ...inputs, [inputName]: uploadedFile });
    if (errors[inputName]) {
      setErrors((prevErrors) => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[inputName];
        return updatedErrors;
      });
    }
  };

  const handleAddArrayOfObjects = (question: Question) => {
    const dto = question.dto || {};
    let isValid = true;
    const newEntry: { [key: string]: any } = {};
    const newErrors: { [key: string]: string } = {};

    Object.keys(dto).forEach((key) => {
      const value = inputs[key];
      if (!value) {
        newErrors[key] = `${key} is required`;
        isValid = false;
      } else {
        newEntry[key] = value;
      }
    });

    if (!isValid) {
      setErrors({ ...errors, ...newErrors });
      return;
    }

    const updatedArray = [
      ...(arrayOfObjectsData[question.input] || []),
      newEntry,
    ];
    setArrayOfObjectsData({
      ...arrayOfObjectsData,
      [question.input]: updatedArray,
    });
    setInputs({}); // Reset inputs for arrayOfObjects
    setQuestionsData({ ...inputs, [question.input]: updatedArray });
    setErrors({});
  };

  const validatePage = () => {
    let isValid = true;
    const currentQuestions = questions[currentPage];
    const newErrors: { [key: string]: string } = {};

    currentQuestions.forEach((question) => {
      if (
        question.type !== "arrayOfObjects" &&
        !seenInputs.has(question.input)
      ) {
        const currentInputValue = inputs[question.input];
        if (!currentInputValue) {
          newErrors[question.input] = `${question.title} is required`;
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const renderInputField = (question: Question, key: string) => {
    const questionType = question.dto ? question.dto[key].type : question.type;

    if (questionType === "textarea") {
      return (
        <textarea
          name={key}
          value={inputs[key] || ""}
          onChange={handleInputChange}
          cols={4}
          className="mt-2 p-2 border rounded-2xl bg-primaryText bg-opacity-5 outline-none w-full"
        />
      );
    } else if (questionType === "file") {
      return (
        <div className="flex mt-2 p-4 flex-col items-center justify-center w-full h-48 border-blue-500 border-dashed border-2 bg-[#000F230A] rounded-2xl shadow-sm">
          <label
            htmlFor={`file-upload-${key}`}
            className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
          >
            <div className="text-[#005DE9] w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold">+</span>
            </div>
            {files[key] ? (
              <div className="text-center">
                <p className="text-xl font-medium text-gray-700">
                  {files[key]?.name}
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
            id={`file-upload-${key}`}
            name={key}
            type="file"
            accept=".pdf"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, key)}
          />
        </div>
      );
    } else if (questionType === "select") {
      let options: any = [];
      if (question.options) {
        options = question.options;
      } else if (question.selector && question.getOptions) {
        if (question.selector.toLowerCase() === "trades") {
          options = tradesData.trades?.map((trade: any) =>
            //@ts-ignore
            question.getOptions(trade),
          );
        }
      }
      return (
        <Select
          name={key}
          value={inputs[key] || ""}
          onChange={(value: any) => {
            setInputs({ ...inputs, [key]: value });
            setQuestionsData({ ...inputs, [key]: value });
            if (errors[key]) {
              setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                delete updatedErrors[key];
                return updatedErrors;
              });
            }
          }}
          data={options}
          className="mt-1 block w-full  pl-5  bg-[#000F230A] rounded-2xl shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Select Business Type"
        />
      );
    } else {
      return (
        <input
          type={questionType}
          name={key}
          value={inputs[key] || ""}
          onChange={handleInputChange}
          className="mt-2 p-2 border rounded-full bg-primaryText bg-opacity-5 outline-none w-full"
        />
      );
    }
  };

  return (
    <div className="p-4">
      {questions[currentPage]
        .filter((question) => !seenInputs.has(question.input)) // Filter out already seen questions
        .map((question, index) => (
          <div key={index} className="mb-6">
            <h2 className="text-2xl font-semibold">{question.title}</h2>
            <p className="text-gray-600">{question.description}</p>

            {question.type === "arrayOfObjects" && question.dto ? (
              <div>
                {Object.keys(question.dto).map((key) => {
                  return (
                    <div key={key} className="mb-4">
                      <label className="block text-gray-700 text-xs uppercase">
                        {key}
                      </label>
                      {question.dto &&
                        renderInputField(question.dto[key] as any, key)}
                      {errors[key] && (
                        <p className="text-red-500 text-sm mt-2">
                          {errors[key]}
                        </p>
                      )}
                    </div>
                  );
                })}
                <button
                  onClick={() => handleAddArrayOfObjects(question)}
                  className="mt-4 px-4 py-2 bg-blue-500 rounded-md text-white"
                >
                  Add
                </button>
                {arrayOfObjectsData[question.input] && (
                  <table className="mt-4 w-full table-auto">
                    <thead>
                      <tr>
                        {Object.keys(question.dto).map((key) => (
                          <th
                            key={key}
                            className="px-4 py-2 border bg-gray-200 text-gray-700 text-xs uppercase"
                          >
                            {key}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {arrayOfObjectsData[question.input].map((item, idx) => (
                        <tr key={idx}>
                          {Object.keys(question.dto as any).map((key) => (
                            <td
                              key={key}
                              className="px-4 py-2 border text-center"
                            >
                              {item[key]}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ) : (
              renderInputField(question, question.input)
            )}

            {errors[question.input] && (
              <p className="text-red-500 text-sm mt-2">
                {errors[question.input]}
              </p>
            )}
          </div>
        ))}

      <div className="flex justify-between mt-4">
        {currentPage > 0 && (
          <button
            onClick={handlePrev}
            className="px-4 py-2 bg-gray-300 rounded-md text-black"
          >
            Previous
          </button>
        )}
        {currentPage < questions.length - 1 && (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 rounded-md text-white"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Questions;
