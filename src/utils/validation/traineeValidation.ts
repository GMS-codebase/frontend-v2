import rwandaLocations from "../location";

export interface ValidationError {
  field: string;
  message: string;
  row?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export interface TraineeData {
  firstName: string;
  lastName: string;
  nationalId: string;
  phoneNumber: string;
  dob: string;
  gender: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
}

// Validation functions for individual fields
export const validateFirstName = (firstName: string): string | null => {
  if (!firstName || firstName.trim().length === 0) {
    return "First name is required";
  }
  if (firstName.trim().length < 2) {
    return "First name must be at least 2 characters";
  }
  if (firstName.trim().length > 50) {
    return "First name must not exceed 50 characters";
  }
  if (!/^[a-zA-Z\s'-]+$/.test(firstName.trim())) {
    return "First name can only contain letters, spaces, hyphens, and apostrophes";
  }
  return null;
};

export const validateLastName = (lastName: string): string | null => {
  if (!lastName || lastName.trim().length === 0) {
    return "Last name is required";
  }
  if (lastName.trim().length < 2) {
    return "Last name must be at least 2 characters";
  }
  if (lastName.trim().length > 50) {
    return "Last name must not exceed 50 characters";
  }
  if (!/^[a-zA-Z\s'-]+$/.test(lastName.trim())) {
    return "Last name can only contain letters, spaces, hyphens, and apostrophes";
  }
  return null;
};

export const validateNationalId = (nationalId: string): string | null => {
  if (!nationalId || nationalId.trim().length === 0) {
    return "National ID is required";
  }

  
  const cleanId = nationalId.trim().replace(/\s/g, '');
  
  // Check if it's a valid Rwandan National ID format (16 digits)
  if (!/^\d{16}$/.test(cleanId)) {
    return "National ID must be exactly 16 digits";
  }
  
  // Validate the Rwandan National ID format
  if (!validateRwandanNationalId(cleanId)) {
    return "Invalid National ID format. Must be 16 digits starting with '1', followed by 4-digit year (1900-2024), gender (8 for male, 7 for female), and 8 remaining digits";
  }
  
  return null;
};

export const validatePhoneNumber = (phoneNumber: string): string | null => {
  if (!phoneNumber || phoneNumber.trim().length === 0) {
    return "Phone number is required";
  }
  
  const cleanPhone = phoneNumber.trim().replace(/\s/g, '');
  
  // Check for Rwandan phone number format
  if (!/^(\+250|250|0)?[0-9]{9}$/.test(cleanPhone)) {
    return "Phone number must be a valid Rwandan number (e.g., +250123456789, 250123456789, or 0123456789)";
  }
  
  return null;
};

export const validateDateOfBirth = (dob: string): string | null => {
  if (!dob || dob.trim().length === 0) {
    return "Date of birth is required";
  }
  
  let date: Date;
  const cleanDob = dob.trim();
  
  // Check if it's an Excel serial number (numeric string)
  if (/^\d+$/.test(cleanDob)) {
    const serialNumber = parseInt(cleanDob);
    
    // Excel serial number validation (1 = Jan 1, 1900)
    // Valid range: 1 to approximately 2958465 (year 9999)
    if (serialNumber < 1 || serialNumber > 2958465) {
      return "Invalid date format. Use YYYY-MM-DD format";
    }
    
    // Convert Excel serial number to JavaScript date
    // Excel serial number 1 = January 1, 1900
    // Excel treats 1900 as a leap year (bug), so we need to adjust
    // The correct formula: (serialNumber - 25569) * 86400000
    // 25569 is the number of days between Excel epoch (1900-01-01) and Unix epoch (1970-01-01)
    // 86400000 is milliseconds per day
    const excelEpochOffset = 25569; // Days between 1900-01-01 and 1970-01-01
    const millisecondsPerDay = 86400000;
    
    // Convert Excel serial number to JavaScript date
    date = new Date((serialNumber - excelEpochOffset) * millisecondsPerDay);
  } else {
    // Try to parse as regular date string
    date = new Date(cleanDob);
  }
  
  if (isNaN(date.getTime())) {
    return "Invalid date format. Use YYYY-MM-DD format";
  }

  
  const today = new Date(); 

  
  // Check if the date is in the future
  if (date > today) {
    return "Invalid date of birth - cannot be in the future";
  }
  
  // Calculate age more accurately
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  // Adjust age if birthday hasn't occurred this year
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  if (age < 16) {
    return "Trainee must be at least 16 years old";
  }
  
  if (age > 100) {  
    return "Invalid date of birth - age seems unrealistic";
  }
  
  return null;
};

export const validateGender = (gender: string): string | null => {
  if (!gender || gender.trim().length === 0) {
    return "Gender is required";
  }
  
  const validGenders = ['MALE', 'FEMALE', 'male', 'female', 'M', 'F', 'm', 'f'];
  const cleanGender = gender.trim().toUpperCase();
  
  if (!validGenders.includes(cleanGender)) {
    return "Gender must be MALE, FEMALE, M, or F";
  }
  
  return null;
};

export const validateProvince = (province: string): string | null => {
  if (!province || province.trim().length === 0) {
    return "Province is required";
  }
  
  const validProvinces = rwandaLocations.getProvinces();
  const cleanProvince = province.trim();
  
  // Case-insensitive matching
  const matchedProvince = validProvinces.find(p => 
    p.toLowerCase() === cleanProvince.toLowerCase()
  );
  
  if (!matchedProvince) {
    return `Invalid province. Must be one of: ${validProvinces.join(', ')}`;
  }
  
  return null;
};

export const validateDistrict = (province: string, district: string): string | null => {
  if (!district || district.trim().length === 0) {
    return "District is required";
  }
  
  if (!province || province.trim().length === 0) {
    return "Province must be provided to validate district";
  }
  
  const validDistricts = rwandaLocations.getDistricts(province);
  const cleanDistrict = district.trim();
  
  // Case-insensitive matching
  const matchedDistrict = validDistricts.find(d => 
    d.toLowerCase() === cleanDistrict.toLowerCase()
  );
  
  if (!matchedDistrict) {
    return `Invalid district for ${province}. Must be one of: ${validDistricts.join(', ')}`;
  }
  
  return null;
};

export const validateSector = (province: string, district: string, sector: string): string | null => {
  if (!sector || sector.trim().length === 0) {
    return "Sector is required";
  }
  
  if (!province || !district) {
    return "Province and district must be provided to validate sector";
  }
  
  const validSectors = rwandaLocations.getSectors(province, district);
  const cleanSector = sector.trim();
  
  // Case-insensitive matching
  const matchedSector = validSectors.find(s => 
    s.toLowerCase() === cleanSector.toLowerCase()
  );
  
  if (!matchedSector) {
    return `Invalid sector for ${district}, ${province}. Must be one of: ${validSectors.join(', ')}`;
  }
  
  return null;
};

export const validateCell = (province: string, district: string, sector: string, cell: string): string | null => {
  if (!cell || cell.trim().length === 0) {
    return "Cell is required";
  }
  
  if (!province || !district || !sector) {
    return "Province, district, and sector must be provided to validate cell";
  }
  
  const validCells = rwandaLocations.getCells(province, district, sector);
  const cleanCell = cell.trim();
  
  // Case-insensitive matching
  const matchedCell = validCells.find(c => 
    c.toLowerCase() === cleanCell.toLowerCase()
  );
  
  if (!matchedCell) {
    return `Invalid cell for ${sector}, ${district}, ${province}. Must be one of: ${validCells.join(', ')}`;
  }
  
  return null;
};

export const validateVillage = (province: string, district: string, sector: string, cell: string, village: string): string | null => {
  if (!village || village.trim().length === 0) {
    return "Village is required";
  }
  
  if (!province || !district || !sector || !cell) {
    return "Province, district, sector, and cell must be provided to validate village";
  }
  
  const validVillages = rwandaLocations.getVillages(province, district, sector, cell);
  const cleanVillage = village.trim();
  
  // Case-insensitive matching
  const matchedVillage = validVillages.find((v: string) => 
    v.toLowerCase() === cleanVillage.toLowerCase()
  );
  
  if (!matchedVillage) {
    return `Invalid village for ${cell}, ${sector}, ${district}, ${province}. Must be one of: ${validVillages.join(', ')}`;
  }
  
  return null;
};

// Rwandan National ID validation (format: 1{year}{gender}{8 remaining digits})
const validateRwandanNationalId = (nationalId: string): boolean => {
  if (nationalId.length !== 16) return false;
  
  // Check if all characters are digits
  if (!/^\d{16}$/.test(nationalId)) return false;
  
  // Check if it starts with "1"
  if (nationalId[0] !== '1') return false;
  
  // Extract year (positions 1-4, full 4-digit year)
  const year = parseInt(nationalId.substring(1, 5));
  const currentYear = new Date().getFullYear();
  
  // Year should be from 1900 to current year
  if (year < 1900 || year > currentYear) {
    return false;
  }
  
  // Extract gender digit (position 5)
  const genderDigit = parseInt(nationalId[5]);
  
  // Gender digit should be 8 for male or 7 for female
  if (genderDigit !== 8 && genderDigit !== 7) {
    return false;
  }
  
  // Remaining 8 digits (positions 6-13) should be valid
  const remainingDigits = nationalId.substring(6, 14);
  if (!/^\d{8}$/.test(remainingDigits)) {
    return false;
  }
  
  // Extract check digit (last 2 digits, positions 14-15)
  const checkDigit = nationalId.substring(14, 16);
  if (!/^\d{2}$/.test(checkDigit)) {
    return false;
  }
  
  return true;
};

// Main validation function for a single trainee
export const validateTrainee = (trainee: TraineeData, rowIndex: number): ValidationResult => {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  
  // Validate required fields
  const firstNameError = validateFirstName(trainee.firstName);
  if (firstNameError) {
    errors.push({ field: 'firstName', message: firstNameError, row: rowIndex });
  }
  
  const lastNameError = validateLastName(trainee.lastName);
  if (lastNameError) {
    errors.push({ field: 'lastName', message: lastNameError, row: rowIndex });
  }
  
  const nationalIdError = validateNationalId(trainee.nationalId);
  if (nationalIdError) {
    errors.push({ field: 'nationalId', message: nationalIdError, row: rowIndex });
  }
  
  const phoneError = validatePhoneNumber(trainee.phoneNumber);
  if (phoneError) {
    errors.push({ field: 'phoneNumber', message: phoneError, row: rowIndex });
  }
  
  const dobError = validateDateOfBirth(trainee.dob);
  if (dobError) {
    errors.push({ field: 'dob', message: dobError, row: rowIndex });
  }
  
  const genderError = validateGender(trainee.gender);
  if (genderError) {
    errors.push({ field: 'gender', message: genderError, row: rowIndex });
  }
  
  // Validate location hierarchy
  const provinceError = validateProvince(trainee.province);
  if (provinceError) {
    errors.push({ field: 'province', message: provinceError, row: rowIndex });
  } else {
    const districtError = validateDistrict(trainee.province, trainee.district);
    if (districtError) {
      errors.push({ field: 'district', message: districtError, row: rowIndex });
    } else {
      const sectorError = validateSector(trainee.province, trainee.district, trainee.sector);
      if (sectorError) {
        errors.push({ field: 'sector', message: sectorError, row: rowIndex });
      } else {
        const cellError = validateCell(trainee.province, trainee.district, trainee.sector, trainee.cell);
        if (cellError) {
          errors.push({ field: 'cell', message: cellError, row: rowIndex });
        } else {
          const villageError = validateVillage(trainee.province, trainee.district, trainee.sector, trainee.cell, trainee.village);
          if (villageError) {
            errors.push({ field: 'village', message: villageError, row: rowIndex });
          }
        }
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Validate multiple trainees and check for duplicates
export const validateTrainees = (trainees: TraineeData[]): ValidationResult => {
  const allErrors: ValidationError[] = [];
  const allWarnings: ValidationError[] = [];
  const nationalIds = new Set<string>();
  const duplicateIds: string[] = [];
  
  trainees.forEach((trainee, index) => {
    const result = validateTrainee(trainee, index + 2); // +2 because Excel rows start from 1 and we skip header
    allErrors.push(...result.errors);
    allWarnings.push(...result.warnings);
    
    // Check for duplicate national IDs
    const cleanId = trainee.nationalId.trim().replace(/\s/g, '');
    if (nationalIds.has(cleanId)) {
      duplicateIds.push(cleanId);
    } else {
      nationalIds.add(cleanId);
    }
  });
  
  // Add duplicate warnings
  duplicateIds.forEach(id => {
    allWarnings.push({
      field: 'nationalId',
      message: `Duplicate National ID found: ${id}`,
    });
  });
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings
  };
};

// Convert Excel serial number to date string
export const convertExcelSerialToDateString = (serialNumber: number): string => {
  // Excel serial number 1 = January 1, 1900
  // Excel treats 1900 as a leap year (bug), so we need to adjust
  const excelEpochOffset = 25569; // Days between 1900-01-01 and 1970-01-01
  const millisecondsPerDay = 86400000;
  
  // Convert Excel serial number to JavaScript date
  const date = new Date((serialNumber - excelEpochOffset) * millisecondsPerDay);
  
  // Format as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  console.log("date", `${year}-${month}-${day}`);
  
  return `${year}-${month}-${day}`;
};

// Check if a string is an Excel serial number
export const isExcelSerialNumber = (value: string): boolean => {
  return /^\d+$/.test(value.trim()) && parseInt(value) >= 1 && parseInt(value) <= 2958465;
};

// Helper function to capitalize first character
const capitalizeFirstChar = (str: string): string => {
  if (!str || str.length === 0) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Format phone number to standard format
export const formatPhoneNumber = (phoneNumber: string): string => {
  const cleanPhone = phoneNumber.trim().replace(/\s/g, '');
  
  if (cleanPhone.startsWith('+250')) {
    return cleanPhone;
  } else if (cleanPhone.startsWith('250')) {
    return '+' + cleanPhone;
  } else if (cleanPhone.startsWith('0')) {
    return '+250' + cleanPhone.substring(1);
  } else if (cleanPhone.length === 9) {
    return '+250' + cleanPhone;
  }
  
  return cleanPhone;
};

// Normalize gender values
export const normalizeGender = (gender: string): string => {
  const cleanGender = gender.trim().toUpperCase();
  
  if (['M', 'MALE'].includes(cleanGender)) {
    return 'MALE';
  } else if (['F', 'FEMALE'].includes(cleanGender)) {
    return 'FEMALE';
  }
  
  return cleanGender;
};



