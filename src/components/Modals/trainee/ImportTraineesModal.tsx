"use client";
import React, { useState, useRef } from "react";
import { Modal, Select, Button, Text, Group, Stack, Divider } from "@mantine/core";
import { IoMdClose } from "react-icons/io";
import { notifications } from "@mantine/notifications";
import { useDispatch } from "react-redux";
import { authorizedApi } from "@/utils/api";
import { SECTOR_STATUS, SUBWINDOW_STATUS, TRADE_STATUS, WINDOW_STATUS } from "@/utils/enums";
import { getSurveyTrainee } from "@/services";
import { getApplicantApplicationsInfo, ApplicantApplicationInfo } from "@/services/api/survey";
import * as XLSX from 'xlsx';
import rwandaLocations from "@/utils/location";
import { 
  validateTrainees, 
  ValidationError, 
  ValidationResult, 
  TraineeData, 
  formatPhoneNumber, 
  normalizeGender 
} from "@/utils/validation/traineeValidation";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  applicantId?: string;
}

interface ImportedTrainee extends TraineeData {
  // Using TraineeData interface from validation utils
}

const ImportTraineesModal: React.FC<Props> = ({
  isOpen,
  onClose,
  applicantId,
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [applicationsInfo, setApplicationsInfo] = useState<ApplicantApplicationInfo | null>(null);
  const [applicationsLoading, setApplicationsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [importedData, setImportedData] = useState<ImportedTrainee[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [selectedSelections, setSelectedSelections] = useState({
    windowId: "",
    subWindowId: "",
    sectorId: "",
    tradeId: "",
  });

  // Utility function to remove duplicate values, keeping only the first occurrence
  const removeDuplicates = (items: { value: string; label: string }[]): { value: string; label: string }[] => {
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.value)) {
        return false; // Skip duplicate
      }
      seen.add(item.value);
      return true; // Keep first occurrence
    });
  };

  // Fetch applicant applications info on component mount
  React.useEffect(() => {
    const fetchApplicationsInfo = async () => {
      try {
        setApplicationsLoading(true);
        const data = await getApplicantApplicationsInfo(applicantId);
        setApplicationsInfo(data);
      } catch (error) {
        console.error("Failed to fetch applications info:", error);
        notifications.show({
          message: "Failed to fetch applications information",
          color: "red",
        });
      } finally {
        setApplicationsLoading(false);
      }
    };

    if (isOpen) {
      fetchApplicationsInfo();
    }
  }, [isOpen, applicantId]);

  // Get all unique windows from applications
  const MultiWindowData = removeDuplicates(
    applicationsInfo?.filter(window => 
      window?.status === WINDOW_STATUS.ACTIVE &&
      window?.subWindows.some(sub => sub.status === SUBWINDOW_STATUS.ACTIVE)
    )
    .map(window => ({
      value: window.uuid,
      label: window.title,
    })) || []
  );

  // Get subwindows for selected window
  const getSubWindowsData = () => {
    if (!selectedSelections.windowId) return [];
    
    const subWindows = applicationsInfo?.filter(window => window.uuid === selectedSelections.windowId)
      .flatMap(window => 
        window.subWindows
          .filter(sub => sub.status === SUBWINDOW_STATUS.ACTIVE)
          .map(subWindow => ({
            value: subWindow.uuid,
            label: subWindow.title,
          }))
      ) || [];
    
    return removeDuplicates(subWindows);
  };

  // Get sectors for selected subwindow
  const getSectorData = () => {
    if (!selectedSelections.windowId || !selectedSelections.subWindowId) return [];
    
    const sectors = applicationsInfo?.filter(window => window.uuid === selectedSelections.windowId)
      .flatMap(window => 
        window.subWindows
          .filter(sub => sub.uuid === selectedSelections.subWindowId && sub.status === SUBWINDOW_STATUS.ACTIVE)
          .flatMap(subWindow => 
            subWindow.sectors
              .filter(sector => sector.status === SECTOR_STATUS.ACTIVE)
              .map(sector => ({
                value: sector.uuid,
                label: sector.name,
              }))
          )
      ) || [];
    
    return removeDuplicates(sectors);
  };

  // Get trades for selected sector
  const getTradesData = () => {
    if (!selectedSelections.windowId || !selectedSelections.subWindowId || !selectedSelections.sectorId) return [];
    
    const trades = applicationsInfo?.filter(window => window.uuid === selectedSelections.windowId)
      .flatMap(window => 
        window.subWindows
          .filter(sub => sub.uuid === selectedSelections.subWindowId && sub.status === SUBWINDOW_STATUS.ACTIVE)
          .flatMap(subWindow => 
            subWindow.sectors
              .filter(sector => sector.uuid === selectedSelections.sectorId && sector.status === SECTOR_STATUS.ACTIVE)
              .flatMap(sector => 
                sector.trades
                  .filter(trade => trade.trade.status === TRADE_STATUS.ACTIVE)
                  .map(trade => ({
                    value: trade.uuid,
                    label: trade.trade.title,
                  }))
              )
          )
      ) || [];
    
    return removeDuplicates(trades);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    parseExcelFile(file);
  };

  const parseExcelFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (jsonData.length < 2) {
          notifications.show({
            message: "File must contain at least a header row and one data row.",
            color: "red",
          });
          return;
        }

        const headers = jsonData[0] as string[];
        const expectedHeaders = ['firstName', 'lastName', 'nationalId', 'phoneNumber', 'dob', 'gender', 'province', 'district', 'sector', 'cell', 'village'];
        
        // Check if headers match expected format
        const missingHeaders = expectedHeaders.filter(header => !headers.includes(header));
        if (missingHeaders.length > 0) {
          notifications.show({
            message: `Missing required columns: ${missingHeaders.join(', ')}`,
            color: "red",
          });
          return;
        }

        const trainees: ImportedTrainee[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row.length >= expectedHeaders.length) {
            const trainee: ImportedTrainee = {
              firstName: (row[headers.indexOf('firstName')] || '').toString().trim(),
              lastName: (row[headers.indexOf('lastName')] || '').toString().trim(),
              nationalId: (row[headers.indexOf('nationalId')] || '').toString().trim(),
              phoneNumber: formatPhoneNumber((row[headers.indexOf('phoneNumber')] || '').toString()),
              dob: (row[headers.indexOf('dob')] || '').toString().trim(),
              gender: normalizeGender((row[headers.indexOf('gender')] || '').toString()),
              province: (row[headers.indexOf('province')] || '').toString().trim(),
              district: (row[headers.indexOf('district')] || '').toString().trim(),
              sector: (row[headers.indexOf('sector')] || '').toString().trim(),
              cell: (row[headers.indexOf('cell')] || '').toString().trim(),
              village: (row[headers.indexOf('village')] || '').toString().trim(),
            };
            
            // Add all trainees for validation, even if some fields are empty
            trainees.push(trainee);
          }
        }
        
        // Validate all trainees
        const validation = validateTrainees(trainees);
        setValidationResult(validation);
        
        // Only show valid trainees in preview
        const validTrainees = trainees.filter((_, index) => {
          const traineeValidation = validation.errors.filter(error => error.row === index + 2);
          return traineeValidation.length === 0;
        });
        
        setImportedData(validTrainees);
        setShowPreview(true);
        
        // Show validation summary
        if (validation.errors.length > 0) {
          notifications.show({
            message: `Found ${validation.errors.length} validation errors. Please review the data before importing.`,
            color: "orange",
          });
        } else if (validation.warnings.length > 0) {
          notifications.show({
            message: `Found ${validation.warnings.length} warnings. Please review before importing.`,
            color: "yellow",
          });
        } else {
          notifications.show({
            message: `Successfully parsed ${trainees.length} trainees. All data is valid.`,
            color: "green",
          });
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        notifications.show({
          message: "Error parsing Excel file. Please check the file format.",
          color: "red",
        });
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleImport = async () => {
    if (!selectedFile || importedData.length === 0) {
      notifications.show({
        message: "Please select a file and ensure data is parsed correctly.",
        color: "red",
      });
      return;
    }

    if (!selectedSelections.windowId || !selectedSelections.subWindowId || 
        !selectedSelections.sectorId || !selectedSelections.tradeId) {
      notifications.show({
        message: "Please select Window, Sub Window, Sector, and Trade.",
        color: "red",
      });
      return;
    }

    // Check for validation errors
    if (validationResult && validationResult.errors.length > 0) {
      notifications.show({
        message: `Cannot import trainees with ${validationResult.errors.length} validation errors. Please fix the errors first.`,
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('windowId', selectedSelections.windowId);
      formData.append('subwindowId', selectedSelections.subWindowId);
      formData.append('tradeId', selectedSelections.tradeId);
      formData.append('sectorId', selectedSelections.sectorId);
      if (applicantId) formData.append('applicantId', applicantId);

      // Import trainees using the new API endpoint
      await authorizedApi.post("/survey-trainee/create-by-file", formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      notifications.show({
        message: `${importedData.length} trainees imported successfully!`,
        color: "green",
      });

      // Refresh the trainees list
      getSurveyTrainee(dispatch, applicantId);
      
      // Reset form
      setSelectedFile(null);
      setImportedData([]);
      setShowPreview(false);
      setSelectedSelections({
        windowId: "",
        subWindowId: "",
        sectorId: "",
        tradeId: "",
      });
      
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      
      onClose();
    } catch (error: any) {
      notifications.show({
        message: error.response?.data?.message || "Failed to import trainees",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    // Create template data with the new column structure and validation hints
    const templateData = [
      ['firstName', 'lastName', 'nationalId', 'phoneNumber', 'dob', 'gender', 'province', 'district', 'sector', 'cell', 'village'],
      ['John', 'Doe', '1234567890123456', '+250123456789', '1990-01-01', 'MALE', 'Kigali', 'Gasabo', 'Bumbogo', 'Bumbogo', 'Bumbogo I'],
      ['Jane', 'Smith', '9876543210987654', '+250987654321', '1992-05-15', 'FEMALE', 'Kigali', 'Kicukiro', 'Gatenga', 'Gatenga', 'Gatenga I'],
      ['', '', '', '', '', '', '', '', '', '', ''],
      ['VALIDATION RULES:', '', '', '', '', '', '', '', '', '', ''],
      ['firstName: Required, 2-50 chars, letters only', '', '', '', '', '', '', '', '', '', ''],
      ['lastName: Required, 2-50 chars, letters only', '', '', '', '', '', '', '', '', '', ''],
      ['nationalId: Required, exactly 16 digits', '', '', '', '', '', '', '', '', '', ''],
      ['phoneNumber: Required, Rwandan format (+250123456789)', '', '', '', '', '', '', '', '', '', ''],
      ['dob: Required, YYYY-MM-DD format, age 16-100', '', '', '', '', '', '', '', '', '', ''],
      ['gender: Required, MALE/FEMALE/M/F', '', '', '', '', '', '', '', '', '', ''],
      ['province: Required, must be valid Rwanda province', '', '', '', '', '', '', '', '', '', ''],
      ['district: Required, must be valid for selected province', '', '', '', '', '', '', '', '', '', ''],
      ['sector: Required, must be valid for selected district', '', '', '', '', '', '', '', '', '', ''],
      ['cell: Required, must be valid for selected sector', '', '', '', '', '', '', '', '', '', ''],
      ['village: Required, must be valid for selected cell', '', '', '', '', '', '', '', '', '', ''],
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    // Generate and download file
    XLSX.writeFile(workbook, 'trainee_import_template.xlsx');
  };

  const resetForm = () => {
    setSelectedFile(null);
    setImportedData([]);
    setShowPreview(false);
    setValidationResult(null);
    setSelectedSelections({
      windowId: "",
      subWindowId: "",
      sectorId: "",
      tradeId: "",
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      closeOnClickOutside={false}
      withCloseButton={false}
      size=""
    >
      <div className="lg:w-[80vw] w-full max-w-[60vw] max-h-[90vh] overflow-y-auto relative bg-white rounded-3xl p-10 flex flex-col">
        <button
          className="absolute top-5 right-5 bg-gray-100 p-1 rounded-lg"
          onClick={onClose}
        >
          <IoMdClose size={25} />
        </button>
        
        <h1 className="text-2xl font-extrabold text-center mb-6">
          Import Survey Trainees
        </h1>

        {applicationsLoading ? (
          <div className="w-full flex justify-center items-center py-8">
            <p className="text-gray-600">Loading applications...</p>
          </div>
        ) : !applicationsInfo || applicationsInfo.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-8 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              {applicantId ? "You are not on contract signing so you can not add trainee surveys" : "This applicant is not on contract signing so can not add trainees"}
            </h2>
            <p className="text-gray-600">
              {applicantId 
                ? "Please complete your contract signing process to import survey trainees."
                : "This applicant needs to complete the contract signing process before survey trainees can be imported."
              }
            </p>
          </div>
        ) : (
        <div className="space-y-6">
          {/* File Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            <div className="space-y-4">
              <div className="text-gray-600">
                <p className="text-lg font-medium">Upload Excel File</p>
                <p className="text-sm">Select an Excel file containing trainee data</p>
                <p className="text-xs text-gray-500 mt-2">
                  Required columns: firstName, lastName, nationalId, phoneNumber, dob, gender, province, district, sector, cell, village
                </p>
              </div>
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="border-[#005DE9] text-[#005DE9] hover:bg-[#005DE9] hover:text-white"
              >
                Choose File
              </Button>
              {selectedFile && (
                <div className="text-sm text-gray-600">
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>
          </div>

          {/* Selection Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 font-medium">Window</label>
              <Select
                placeholder={applicationsLoading ? "Loading..." : "Select Window"}
                data={MultiWindowData || []}
                value={selectedSelections.windowId}
                onChange={(val) => setSelectedSelections(prev => ({ 
                  ...prev, 
                  windowId: val || "",
                  subWindowId: "",
                  sectorId: "",
                  tradeId: ""
                }))}
                disabled={applicationsLoading}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Sub Window</label>
              <Select
                placeholder="Select Sub Window"
                data={getSubWindowsData() || []}
                value={selectedSelections.subWindowId}
                onChange={(val) => setSelectedSelections(prev => ({ 
                  ...prev, 
                  subWindowId: val || "",
                  sectorId: "",
                  tradeId: ""
                }))}
                disabled={!selectedSelections.windowId}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Sector</label>
              <Select
                placeholder="Select Sector"
                data={getSectorData() || []}
                value={selectedSelections.sectorId}
                onChange={(val) => setSelectedSelections(prev => ({ 
                  ...prev, 
                  sectorId: val || "",
                  tradeId: ""
                }))}
                disabled={!selectedSelections.subWindowId}
              />
            </div>
            <div>
              <label className="block mb-2 font-medium">Trade</label>
              <Select
                placeholder="Select Trade"
                data={getTradesData() || []}
                value={selectedSelections.tradeId}
                onChange={(val) => setSelectedSelections(prev => ({ 
                  ...prev, 
                  tradeId: val || ""
                }))}
                disabled={!selectedSelections.sectorId}
              />
            </div>
          </div>

          {/* Template Download */}
          <div className="text-center">
            <Button
              variant="subtle"
              onClick={handleDownloadTemplate}
              className="text-[#005DE9] hover:text-[#005DE9]"
            >
              Download Template
            </Button>
          </div>

          {/* Data Preview */}
          {showPreview && importedData.length > 0 && (
            <div className="space-y-4">
              <Divider />
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold">
                  Preview ({importedData.length} valid trainees)
                </p>
                <Button
                  variant="subtle"
                  onClick={() => setShowPreview(false)}
                  size="sm"
                >
                  Hide Preview
                </Button>
              </div>
              
              <div className="max-h-60 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left">firstName</th>
                      <th className="px-3 py-2 text-left">lastName</th>
                      <th className="px-3 py-2 text-left">nationalId</th>
                      <th className="px-3 py-2 text-left">phoneNumber</th>
                      <th className="px-3 py-2 text-left">dob</th>
                      <th className="px-3 py-2 text-left">gender</th>
                      <th className="px-3 py-2 text-left">province</th>
                      <th className="px-3 py-2 text-left">district</th>
                      <th className="px-3 py-2 text-left">sector</th>
                      <th className="px-3 py-2 text-left">cell</th>
                      <th className="px-3 py-2 text-left">village</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedData.slice(0, 10).map((trainee, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-3 py-2">{trainee.firstName}</td>
                        <td className="px-3 py-2">{trainee.lastName}</td>
                        <td className="px-3 py-2">{trainee.nationalId}</td>
                        <td className="px-3 py-2">{trainee.phoneNumber}</td>
                        <td className="px-3 py-2">{trainee.dob}</td>
                        <td className="px-3 py-2">{trainee.gender}</td>
                        <td className="px-3 py-2">{trainee.province}</td>
                        <td className="px-3 py-2">{trainee.district}</td>
                        <td className="px-3 py-2">{trainee.sector}</td>
                        <td className="px-3 py-2">{trainee.cell}</td>
                        <td className="px-3 py-2">{trainee.village}</td>
                      </tr>
                    ))}
                    {importedData.length > 10 && (
                      <tr>
                        <td colSpan={11} className="px-3 py-2 text-center text-gray-500">
                          ... and {importedData.length - 10} more trainees
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Validation Errors Display */}
          {validationResult && (validationResult.errors.length > 0 || validationResult.warnings.length > 0) && (
            <div className="space-y-4">
              <Divider />
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-red-600">
                  Validation Issues
                </p>
                <Button
                  variant="subtle"
                  onClick={() => setShowPreview(false)}
                  size="sm"
                >
                  Hide Details
                </Button>
              </div>
              
              {/* Errors */}
              {validationResult.errors.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold text-red-600">
                    Errors ({validationResult.errors.length})
                  </p>
                  <div className="max-h-40 overflow-y-auto border border-red-200 rounded-lg bg-red-50">
                    {validationResult.errors.slice(0, 20).map((error, index) => (
                      <div key={index} className="px-3 py-2 border-b border-red-200 last:border-b-0">
                        <div className="text-sm">
                          <span className="font-medium text-red-800">
                            Row {error.row || 'N/A'}, {error.field}:
                          </span>
                          <span className="text-red-700 ml-2">{error.message}</span>
                        </div>
                      </div>
                    ))}
                    {validationResult.errors.length > 20 && (
                      <div className="px-3 py-2 text-center text-red-600 text-sm">
                        ... and {validationResult.errors.length - 20} more errors
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Warnings */}
              {validationResult.warnings.length > 0 && (
                <div className="space-y-2">
                  <p className="font-semibold text-yellow-600">
                    Warnings ({validationResult.warnings.length})
                  </p>
                  <div className="max-h-40 overflow-y-auto border border-yellow-200 rounded-lg bg-yellow-50">
                    {validationResult.warnings.slice(0, 10).map((warning, index) => (
                      <div key={index} className="px-3 py-2 border-b border-yellow-200 last:border-b-0">
                        <div className="text-sm">
                          <span className="font-medium text-yellow-800">
                            {warning.field}:
                          </span>
                          <span className="text-yellow-700 ml-2">{warning.message}</span>
                        </div>
                      </div>
                    ))}
                    {validationResult.warnings.length > 10 && (
                      <div className="px-3 py-2 text-center text-yellow-600 text-sm">
                        ... and {validationResult.warnings.length - 10} more warnings
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              onClick={handleImport}
              disabled={loading || !selectedFile || !showPreview || 
                       !selectedSelections.windowId || !selectedSelections.subWindowId || 
                       !selectedSelections.sectorId || !selectedSelections.tradeId ||
                       (validationResult?.errors && validationResult.errors.length > 0)}
              className={`${
                validationResult?.errors && validationResult.errors.length > 0 
                  ? "bg-red-500 hover:bg-red-600" 
                  : "bg-[#005DE9] hover:bg-[#005DE9]"
              }`}
            >
              {loading ? "Importing..." : 
               validationResult?.errors && validationResult.errors.length > 0 
                 ? `Cannot Import (${validationResult?.errors?.length || 0} errors)` 
                 : `Import ${importedData.length} Trainees`}
            </Button>
          </div>
        </div>
        )}
      </div>
    </Modal>
  );
};

export default ImportTraineesModal;
