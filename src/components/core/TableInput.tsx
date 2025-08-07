import { Question, TableColumn } from "@/types/questions-form";
import { Survey } from "@/types/surveys-form";
import React, { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

interface TableInputProps {
  value: any;
  onChange: (data: Record<string, any>[]) => void;
  question?: Question;
  survey?: Survey;
  onQuestionChange: (question: Question | Survey) => void;
  disabled?: boolean;
  isEditing?: boolean;
  mode: "creating" | "viewing" | "answering" | "commenting";
}

const TableInput: React.FC<TableInputProps> = ({
  value,
  onChange,
  question,
  survey,
  onQuestionChange,
  disabled = false,
  mode = "creating",
  isEditing = false,
}) => {
  const data = question || survey;
  const [rows, setRows] = useState<Record<string, any>[]>(value || []);
  const [columns, setColumns] = useState<TableColumn[]>(data?.columns || []);

  const handleAddRow = () => {
    setRows((prev) => [...prev, {}]);
    onChange([...rows, {}]);
  };

  console.log(rows);
  console.log(value);

  const handleRemoveRow = (index: number) => {
    const updatedRows = [...rows];
    updatedRows.splice(index, 1);
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const handleInputChange = (index: number, column: string, value: any) => {
    const updatedRows = [...rows];
    updatedRows[index][column] = value;
    setRows(updatedRows);
    onChange(updatedRows);
  };

  const handleAddColumn = () => {
    if(!data) return;
    const newColumn: TableColumn = { title: "New Column", type: "text" };
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    onQuestionChange({ ...data, columns: updatedColumns });
  };

  const handleRemoveColumn = (index: number) => {
    if(!data) return;
    const updatedColumns = [...columns];
    updatedColumns.splice(index, 1);
    setColumns(updatedColumns);
    onQuestionChange({ ...data, columns: updatedColumns });
  };

  const handleColumnChange = (
    index: number,
    key: keyof TableColumn,
    value: any
  ) => {
    if(!data) return;
    const updatedColumns = [...columns];
    updatedColumns[index][key] = value;
    setColumns(updatedColumns);
    onQuestionChange({ ...data, columns: updatedColumns });
  };

  if (mode === "viewing" || mode === "commenting") {
    return (
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              {columns?.map((col, idx) => (
                <th
                  key={idx}
                  className="px-4 py-2 border border-gray-200 bg-gray-100 text-left text-sm font-semibold"
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns?.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className="px-4 py-2 border border-gray-200 text-sm"
                  >
                    {row[col.title] ?? "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="w-full">
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            {columns?.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-2 border border-gray-200 bg-gray-100 text-left text-sm font-semibold"
              >
                <div className="flex items-center gap-2">
                  {mode === "creating" ? (
                    <input
                      type="text"
                      value={col.title}
                      onChange={(e) =>
                        handleColumnChange(idx, "title", e.target.value)
                      }
                      className={` ${mode === "creating" ? "border border-gray-300" : "border-none"}  rounded py-1 px-2 flex-grow`}
                      disabled={disabled}
                    />
                  ) : (
                    <p>{col.title}</p>
                  )}
                  {mode === "creating" && (
                    <>
                      <select
                        value={col.type}
                        onChange={(e) =>
                          handleColumnChange(idx, "type", e.target.value)
                        }
                        className="border border-gray-300 rounded py-1 px-2"
                        disabled={disabled}
                      >
                        <option value="text">Text</option>
                        <option value="number">Number</option>
                        <option value="date">Date</option>
                        <option value="select">Select</option>
                      </select>
                      {col.type === "select" && (
                        <input
                          type="text"
                          placeholder="Options (comma-separated)"
                          value={col.options?.join(",") || ""}
                          onChange={(e) =>
                            handleColumnChange(
                              idx,
                              "options",
                              e.target.value.split(",")
                            )
                          }
                          className="border border-gray-300 rounded py-1 px-2"
                          disabled={disabled}
                        />
                      )}
                      <button
                        onClick={() => handleRemoveColumn(idx)}
                        className="bg-red-500 text-white rounded px-2 py-1"
                        disabled={disabled}
                      >
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </th>
            ))}
            {mode === "answering" && (
              <th className="px-4 py-2 border border-gray-200 bg-gray-100 text-left text-sm font-semibold">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows?.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-50">
              {columns?.map((col, colIndex) => (
                <td
                  key={colIndex}
                  className="px-4 py-2 border border-gray-200 text-sm"
                >
                  {col.type === "select" && col.options ? (
                    <select
                      value={row[col.title] || ""}
                      onChange={(e) =>
                        handleInputChange(rowIndex, col.title, e.target.value)
                      }
                      className="border border-gray-300 rounded w-full py-1 px-2"
                      disabled={disabled}
                    >
                      <option value="">Select</option>
                      {col.options.map((option, optionIndex) => (
                        <option key={optionIndex} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={col.type}
                      value={row[col.title] || ""}
                      onChange={(e) =>
                        handleInputChange(rowIndex, col.title, e.target.value)
                      }
                      className="border border-gray-300 rounded w-full py-1 px-2"
                      disabled={disabled}
                    />
                  )}
                </td>
              ))}
              <td className="px-4 py-2 border border-gray-200 text-sm">
                <button
                  onClick={() => handleRemoveRow(rowIndex)}
                  className="bg-red-500 text-white rounded px-2 py-1 flex items-center gap-1"
                  disabled={disabled}
                >
                  <FaTrash /> Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        {mode === "answering" && (
          <button
            onClick={handleAddRow}
            className="bg-blue-500 text-white rounded px-4 py-2 flex items-center gap-2"
            disabled={disabled}
          >
            <FaPlus /> Add Row
          </button>
        )}
        {mode === "creating" && (
          <button
            onClick={handleAddColumn}
            className="bg-green-500 text-white rounded px-4 py-2 flex items-center gap-2"
            disabled={disabled}
          >
            <FaPlus /> Add Column
          </button>
        )}
      </div>
    </div>
  );
};

export default TableInput;
