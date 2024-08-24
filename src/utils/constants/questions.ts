export const questions = {
  window_1: {
    subwindow_1: [
      {
        title: "Title of the project",
        description: "Please provide the name/title of your project.",
        input: "title",
        type: "text",
      },
      {
        title: "Project Activities and Expected Outcomes",
        description:
          "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
        input: "activitiesAndOutcome",
        type: "textarea",
      },
      {
        title: "Readiness to execute the project",
        description:
          "Explain to which extent you are prepared to execute this project.",
        input: "readinessExecute",
        type: "textarea",
      },
      {
        title: "Role of other involved training providers",
        description:
          "Explain the role of any other involved training provider in the project, if any. Indicate the training provider you would like to partner with if any.",
        input: "roleAttachment",
        type: "file",
      },
      {
        title: "Training Delivery Process",
        description:
          "Estimate the training duration with respect to the training content/modules to be offered. [Trade/Name of Module/From/To/Number of Hours]",
        input: "trainingDeliveryProcess",
        type: "arrayOfObjects",
        dto: {
          trade: {
            type: "text",
            label: "Trade",
            selector: "trades",
            getOptions: (t: any) => {
              return { label: t.name, value: t.uuid };
            },
          },
          moduleName: { type: "text", label: "Name of Module" },
          fromDate: { type: "date", label: "From Date" },
          toDate: { type: "date", label: "To Date" },
          numberOfHours: { type: "number", label: "Number of Hours" },
        },
      },
      {
        title: "Training Equipment",
        description:
          "List down the equipment available to facilitate this training. [Name of equipment/Number/Related Trade]",
        input: "trainingEquipment",
        type: "arrayOfObjects",
        dto: {
          equipmentName: { type: "text", label: "Name of Equipment" },
          quantity: { type: "number", label: "Number" },
          relatedTrade: {
            type: "select",
            label: "Related Trade",
            selector: "trades",
            getOptions: (t: any) => {
              return { name: t.name, value: t.uuid };
            },
          },
        },
      },
      {
        title: "Identification of employees in need of skills upgrading",
        description:
          "List down the number of employees you need to train and their background qualification for a period ranging from a few days to 3 months.",
        input: "identificationEmployee",
        type: "textarea",
      },
      {
        title: "Technical Staff",
        description:
          "Identify the technical staff (instructors) required to train the trades you are applying for.",
        input: " staffAttachment",
        type: "file",
      },
      {
        title: "Sustainability",
        description:
          "How will your project (the planned training activity) continue after this funding?",
        input: "sustainability",
        type: "textarea",
      },
      {
        title: "Provide the financial report of the previous financial year",
        description: "",
        input: "previousFinancialReportAttachment",
        type: "file",
      },
      {
        title: "Provide the proof of ownership/renting of training premises",
        description: "",
        input: "trainingPremisesAttachment",
        type: "file",
      },
      {
        title: "Contribution from the applicant",
        description:
          "Justify how your institution will contribute to facilitate the training.",
        input: "contributionFromApplicant",
        type: "textarea",
      },
    ],
    subwindow_2: [
      {
        title: "Title of the project",
        description: "Please provide the name/title of your project.",
        input: "title",
        type: "text",
      },
      {
        title: "Project Activities and Expected Outcomes",
        description:
          "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
        input: "activitiesAndOutcome",
        type: "textarea",
      },
      {
        title: "Readiness to execute the project",
        description:
          "Explain to which extent you are prepared to execute this project.",
        input: "readinessExecute",
        type: "textarea",
      },
      {
        title:
          "Explain the role of any other involved training provider in the project, if any.",
        description:
          "(Indicate the training provider you would like to partner with if any.)",
        input: "roleAttachment",
        type: "file",
      },
      {
        title: "Training Delivery Process",
        description:
          "Keep in mind that the training period for window 1 should be ranging from few days to 6 months, estimate the training duration with respect to the training content/modules to be offered.) [Trade/Name of Module/From/To/Number of Hours",
        input: "trainingManualAttachment",
        type: "file",
      },

      {
        title: "Training Delivery Process - (Continued)",
        description:
          "[Please attach a detailed description of the content (training manual) of the proposed training",
        input: "identificationEmployee",
        type: "textarea",
      },
      {
        title: "Training Equipment",
        description:
          "List down the equipment available to facilitate this training. [Name of equipment/Number/Related Trade]",
        input: "trainingEquipment",
        type: "arrayOfObjects",
        dto: {
          equipmentName: { type: "text", label: "Name of Equipment" },
          quantity: { type: "number", label: "Number" },
          relatedTrade: { type: "text", label: "Related Trade" },
        },
      },
      {
        title: "Training Equipment - (Continued) ",
        description:
          "Please attach the proof of ownership (Notarized list of equipment, Original Invoices (EBM for locally purchased equipment).",
        input: " staffAttachment",
        type: "file",
      },
      {
        title: "Training Equipment - (Continued) ",
        description: "Add a comment related to the training equipment if any",
        input: "sustainability",
        type: "textarea",
      },
      {
        title: "Recruitment of trainees ",
        description:
          "List down the number of trainees you need to train and their background qualification for a period ranging from few days to 6 months",
        input: "recruitmentTrainerNumber",
        type: "number",
      },
      {
        title: "Technical Staff",
        description:
          "Identify the technical staff (instructors) required to train the trades you are applying for",
        input: "trainingPremisesAttachment",
        type: "file",
      },
      {
        title: "Sustainability",
        description:
          "How will your project (the planned training activity) continue after this funding",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Budget Summary ",
        description:
          "List the most important activities you are soliciting funding for and the indicative budget for each activity",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title:
          "Provide at least 2 MoUs with the companies/industries to host the trainees during the internship ",
        description: "",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Provide the proof of ownership/renting of training premises ",
        description: "",
        input: "contributionFromApplicant",
        type: "textarea",
      },

      {
        title: "Provide the proof of ownership/renting of training premises ",
        description: "",
        input: "contributionFromApplicant",
        type: "textarea",
      },
    ],
  },
  window_2: {
    subwindow_1: [
      {
        title: "Title of the project",
        description: "Please provide the name/title of your project.",
        input: "title",
        type: "text",
      },
      {
        title: "Project Activities and Expected Outcomes",
        description:
          "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
        input: "activitiesAndOutcome",
        type: "textarea",
      },
      {
        title: "Readiness to execute the project",
        description:
          "Explain to which extent you are prepared to execute this project.",
        input: "readinessExecute",
        type: "textarea",
      },
      {
        title:
          "Explain the role of any other involved training provider in the project, if any.",
        description:
          "(Indicate the training provider you would like to partner with if any.)",
        input: "roleAttachment",
        type: "file",
      },
      {
        title: "Training Delivery Process",
        description:
          "Keep in mind that the training period for window 1 should be ranging from few days to 6 months, estimate the training duration with respect to the training content/modules to be offered.) [Trade/Name of Module/From/To/Number of Hours",
        input: "trainingManualAttachment",
        type: "file",
      },

      {
        title: "Training Delivery Process - (Continued)",
        description:
          "[Please attach a detailed description of the content (training manual) of the proposed training",
        input: "identificationEmployee",
        type: "file",
      },
      {
        title: "Training Equipment",
        description:
          "List down the equipment available to facilitate this training. [Name of equipment/Number/Related Trade]",
        input: "trainingEquipment",
        type: "arrayOfObjects",
        dto: {
          equipmentName: { type: "text", label: "Name of Equipment" },
          quantity: { type: "number", label: "Number" },
          relatedTrade: { type: "text", label: "Related Trade" },
        },
      },
      {
        title: "Training Equipment - (Continued) ",
        description:
          "Please attach the proof of ownership (Notarized list of equipment, Original Invoices (EBM for locally purchased equipment).",
        input: " staffAttachment",
        type: "file",
      },
      {
        title: "Training Equipment - (Continued) ",
        description: "Add a comment related to the training equipment if any",
        input: "sustainability",
        type: "textarea",
      },
      {
        title: "Recruitment of trainees ",
        description:
          "List down the number of trainees you need to train and their background qualification for a period ranging from few days to 6 months",
        input: "recruitmentTrainerNumber",
        type: "number",
      },
      {
        title: "Technical Staff",
        description:
          "Identify the technical staff (instructors) required to train the trades you are applying for",
        input: "trainingPremisesAttachment",
        type: "file",
      },
      {
        title: "Sustainability",
        description:
          "How will your project (the planned training activity) continue after this funding",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Budget Summary ",
        description:
          "List the most important activities you are soliciting funding for and the indicative budget for each activity",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title:
          "Provide at least 2 MoUs with the companies/industries to host the trainees during the internship ",
        description: "",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Provide the proof of ownership/renting of training premises ",
        description: "",
        input: "contributionFromApplicant",
        type: "file",
      },
    ],
    subwindow_2: [
      {
        title: "Title of the project",
        description: "Please provide the name/title of your project.",
        input: "title",
        type: "text",
      },
      {
        title: "Project Activities and Expected Outcomes",
        description:
          "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
        input: "activitiesAndOutcome",
        type: "textarea",
      },
      {
        title: "Readiness to execute the project",
        description:
          "Explain to which extent you are prepared to execute this project.",
        input: "readinessExecute",
        type: "textarea",
      },
      {
        title:
          "Explain the role of any other involved training provider in the project, if any.",
        description:
          "(Indicate the training provider you would like to partner with if any.)",
        input: "roleAttachment",
        type: "file",
      },
      {
        title: "assessment and certification Process",
        description:
          "Keep in mind that the assessment, certification and reporting period for RPL for one cohort should be ranging from few days to 3 months, estimate the assessment duration with respect to the competencies to be assessed d.) [Trade/Name of Module/From/To/Number of Hours",
        input: "assessmentAndCertificationProcess",
        type: "file",
      },

      {
        title: "Assessment Equipment",
        description:
          "List down the equipment available to facilitate this assessment)[Name of equipment/Number/Related Trade",
        input: "assessmentEquipment",
        type: "textarea",
      },
      {
        title: "Assessment Equipment - (Continued)",
        description:
          "Please attach the proof of ownership (Notarized list of equipment, Original Invoices (EBM for locally purchased equipment).",
        input: " assessmentEquipmentAttachmen",
        type: "textarea",
      },
      {
        title: "Assessment Equipment - (Continued) ",
        description: "Add a comment related to the assessment equipment if an.",
        input: " staffAttachment",
        type: "textarea",
      },
      {
        title: "Recruitment of candidates",
        description:
          "Provide the number of candidates you need to assess and their background",
        input: "sustainability",
        type: "textarea",
      },
      {
        title: "Recruitment of trainees ",
        description:
          "List down the number of trainees you need to train and their background qualification for a period ranging from few days to 6 months",
        input: "recruitmentTrainerNumber",
        type: "number",
      },
      {
        title: "Assessors/facilitators ",
        description:
          "Provide the assessors/facilitators required to assess the trades you are applying for",
        input: "  assessorsAndFacilitators",
        type: "textarea",
      },
      {
        title: "Sustainability",
        description:
          "How will your project (the planned training activity) continue after this funding",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Budget Summary ",
        description:
          "List the most important activities you are soliciting funding for and the indicative budget for each activity",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Previous financial Report ",
        description: "Provide the financial report of the previous year",
        input: "MOUsAttachment1",
        type: "file",
      },
      {
        title: "Previous financial Report(2) ",
        description: "Provide the financial report of the previous year",
        input: "MOUsAttachment2",
        type: "file",
      },
      {
        title: "Training premises",
        description: "",
        input: "contributionFromApplicant",
        type: "textarea",
      },

      {
        title: "Contribution from the applicant  ",
        description:
          "Justify how your institution will contribute to facilitate the  assessment",
        input: "contributionFromApplicant",
        type: "textarea",
      },
    ],
    subwindow_3: [
      {
        title: "Title of the project",
        description: "Please provide the name/title of your project.",
        input: "title",
        type: "text",
      },
      {
        title: "Project Activities and Expected Outcomes",
        description:
          "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
        input: "activitiesAndOutcome",
        type: "textarea",
      },
      {
        title: "Readiness to execute the project",
        description:
          "Explain to which extent you are prepared to execute this project.",
        input: "readinessExecute",
        type: "textarea",
      },
      {
        title:
          "Explain the role of any other involved training provider in the project, if any.",
        description:
          "(Indicate the training provider you would like to partner with if any.)",
        input: "roleAttachment",
        type: "file",
      },
      {
        title: "Training Delivery Process",
        description:
          "Keep in mind that the training period for window 1 should be ranging from few days to 6 months, estimate the training duration with respect to the training content/modules to be offered.) [Trade/Name of Module/From/To/Number of Hours",
        input: "trainingManualAttachment",
        type: "file",
      },
      {
        title: "Training Delivery Process - (Continued)",
        description:
          "[Please attach a detailed description of the content (training manual) of the proposed training",
        input: "identificationEmployee",
        type: "file",
      },
      {
        title: "Training Equipment",
        description:
          "List down the equipment available to facilitate this training. [Name of equipment/Number/Related Trade]",
        input: "trainingEquipment",
        type: "arrayOfObjects",
        dto: {
          equipmentName: { type: "text", label: "Name of Equipment" },
          quantity: { type: "number", label: "Number" },
          relatedTrade: { type: "text", label: "Related Trade" },
        },
      },
      {
        title: "Training Equipment - (Continued) ",
        description:
          "Please attach the proof of ownership (Notarized list of equipment, Original Invoices (EBM for locally purchased equipment).",
        input: " staffAttachment",
        type: "file",
      },
      {
        title: "Training Equipment - (Continued) ",
        description: "Add a comment related to the training equipment if any",
        input: "sustainability",
        type: "textarea",
      },
      {
        title: "Recruitment of trainees ",
        description:
          "List down the number of trainees you need to train and their background qualification for a period ranging from few days to 6 months",
        input: "recruitmentTrainerNumber",
        type: "number",
      },
      {
        title: "Technical Staff",
        description:
          "Identify the technical staff (instructors) required to train the trades you are applying for",
        input: "trainingPremisesAttachment",
        type: "file",
      },
      {
        title: "Sustainability",
        description:
          "How will your project (the planned training activity) continue after this funding",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Budget Summary ",
        description:
          "List the most important activities you are soliciting funding for and the indicative budget for each activity",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title:
          "14.	Provide the financial report of the previous financial year  ",
        description: "",
        input: "previousFinancialReportAttachment",
        type: "file",
      },
      {
        title: "Provide the proof of ownership/renting of training premises ",
        description: "",
        input: "contributionFromApplicant",
        type: "file",
      },

      {
        title: "16.	Contribution from the applicant ",
        description:
          "Justify how your institution will contribute to facilitate the training",
        input: "contributionFromApplicant",
        type: "textarea",
      },
    ],
  },
  window_3: {
    subwindow_1: [
      {
        title: "Title of the project",
        description: "Please provide the name/title of your project.",
        input: "title",
        type: "text",
      },
      {
        title: "Project Activities and Expected Outcomes",
        description:
          "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
        input: "activitiesAndOutcome",
        type: "textarea",
      },
      {
        title: "Readiness to execute the project",
        description:
          "Explain to which extent you are prepared to execute this project.",
        input: "readinessExecute",
        type: "textarea",
      },
      {
        title:
          "Explain the role of any other involved training provider in the project, if any.",
        description:
          "(Indicate the training provider you would like to partner with if any.)",
        input: "roleAttachment",
        type: "file",
      },
      {
        title: "Training Delivery Process",
        description:
          "Keep in mind that the training period for window 1 should be ranging from few days to 6 months, estimate the training duration with respect to the training content/modules to be offered.) [Trade/Name of Module/From/To/Number of Hours",
        input: "trainingManualAttachment",
        type: "file",
      },

      {
        title: "Training Delivery Process - (Continued)",
        description:
          "[Please attach a detailed description of the content (training manual) of the proposed training",
        input: "identificationEmployee",
        type: "file",
      },
      {
        title: "Training Equipment",
        description:
          "List down the equipment available to facilitate this training. [Name of equipment/Number/Related Trade]",
        input: "trainingEquipment",
        type: "arrayOfObjects",
        dto: {
          equipmentName: { type: "text", label: "Name of Equipment" },
          quantity: { type: "number", label: "Number" },
          relatedTrade: { type: "text", label: "Related Trade" },
        },
      },
      {
        title: "Training Equipment - (Continued) ",
        description:
          "Please attach the proof of ownership (Notarized list of equipment, Original Invoices (EBM for locally purchased equipment).",
        input: " staffAttachment",
        type: "file",
      },
      {
        title: "Training Equipment - (Continued) ",
        description: "Add a comment related to the training equipment if any",
        input: "sustainability",
        type: "textarea",
      },
      {
        title: "Recruitment of trainees ",
        description:
          "List down the number of trainees you need to train and their background qualification for a period ranging from few days to 6 months",
        input: "",
        type: "number",
      },
      {
        title: "Technical Staff",
        description:
          "Identify the technical staff (instructors) required to train the trades you are applying for",
        input: "trainingPremisesAttachment",
        type: "file",
      },
      {
        title: "Sustainability",
        description:
          "How will your project (the planned training activity) continue after this funding",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Budget Summary ",
        description:
          "List the most important activities you are soliciting funding for and the indicative budget for each activity",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Provide the financial report of the previous financial year  ",
        description: "",
        input: "contributionFromApplicant",
        type: "file",
      },
      {
        title: "Provide the proof of ownership/renting of training premises ",
        description: "",
        input: "contributionFromApplicant",
        type: "file",
      },

      {
        title: "Contribution from the applicant",
        description:
          "Justify how your institution will contribute to facilitate the training",
        input: "contributionFromApplicant",
        type: "textarea",
      },
    ],
    subwindow_2: [
      {
        title: "Title of the project",
        description: "Please provide the name/title of your project.",
        input: "title",
        type: "text",
      },
      {
        title: "Project Activities and Expected Outcomes",
        description:
          "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
        input: "activitiesAndOutcome",
        type: "textarea",
      },
      {
        title: "Readiness to execute the project",
        description:
          "Explain to which extent you are prepared to execute this project.",
        input: "readinessExecute",
        type: "textarea",
      },
      {
        title: "Assessment and certification Process.",
        description:
          "Keep in mind that the assessment, certification and reporting period for RPL for one cohort should be ranging from few days to 3 months, estimate the assessment duration with respect to the competencies to be assessed.) [Trade/Name of Module/From/To/Number of Hours",
        input: "assessmentAndCertificationProcess",
        type: "textarea",
      },
      {
        title: "Assessment Equipment - (Continued",
        description:
          "Add a comment related to the assessment equipment if any.",
        input: "assessmentEquipment",
        type: "file",
      },

      {
        title: "	Recruitment of candidates ",
        description:
          "Provide the number of candidates you need to assess and their background",
        input: "identificationEmployee",
        type: "number",
      },
      {
        title: "Assessors/facilitators ",
        description:
          "Provide the assessors/facilitators required to assess the trades you are applying for",
        input: "trainingEquipmentAttachment",
        type: "file",
      },
      {
        title: "Sustainability  ",
        description:
          "How will your project (The planned assessment activity) continue after this funding.",
        input: " staffAttachment",
        type: "file",
      },
      {
        title: "Budget Summary ",
        description:
          "List the most important activities you are soliciting funding for and the indicative budget for each activity",
        input: "sustainability",
        type: "textarea",
      },

      {
        title: "Previous financial Report ",
        description: "IProvide the financial report of the previous year",
        input: "trainingPremisesAttachment",
        type: "file",
      },
      {
        title: "Training premises ",
        description:
          "Provide proof of ownership/renting/MoUs of training premises",
        input: "contributionFromApplicant",
        type: "file",
      },
      {
        title: "Contribution from the applicant  ",
        description:
          "List the most important activities you are soliciting funding for and the indicative budget for each activity",
        input: "contributionFromApplicant",
        type: "textarea",
      },

      {
        title: "Provide the proof of ownership/renting of training premises ",
        description: "",
        input: "contributionFromApplicant",
        type: "file",
      },
    ],
    subwindow_3: [
      {
        title: "Title of the project",
        description: "Please provide the name/title of your project.",
        input: "title",
        type: "text",
      },
      {
        title: "Project Activities and Expected Outcomes",
        description:
          "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
        input: "activitiesAndOutcome",
        type: "textarea",
      },
      {
        title: "Readiness to execute the project",
        description:
          "Explain to which extent you are prepared to execute this project.",
        input: "readinessExecute",
        type: "textarea",
      },
      {
        title:
          "Explain the role of any other involved training provider in the project, if any.",
        description:
          "(Indicate the training provider you would like to partner with if any.)",
        input: "roleAttachment",
        type: "file",
      },
      {
        title: "Training Delivery Process",
        description:
          "Keep in mind that the training period for window 1 should be ranging from few days to 6 months, estimate the training duration with respect to the training content/modules to be offered.) [Trade/Name of Module/From/To/Number of Hours",
        input: "trainingManualAttachment",
        type: "file",
      },

      {
        title: "Training Manual",
        description:
          "[Please attach a detailed description of the content (training manual) of the proposed training",
        input: "identificationEmployee",
        type: "file",
      },
      {
        title: "Training Equipment",
        description:
          "List down the equipment available to facilitate this training. [Name of equipment/Number/Related Trade]",
        input: "trainingEquipment",
        type: "arrayOfObjects",
        dto: {
          equipmentName: { type: "text", label: "Name of Equipment" },
          quantity: { type: "number", label: "Number" },
          relatedTrade: { type: "text", label: "Related Trade" },
        },
      },
      {
        title: "Training Equipment - (Continued) ",
        description:
          "Please attach the proof of ownership (Notarized list of equipment, Original Invoices (EBM for locally purchased equipment).",
        input: " staffAttachment",
        type: "file",
      },
      {
        title: "Training Equipment - (Continued) ",
        description: "Add a comment related to the training equipment if any",
        input: "sustainability",
        type: "textarea",
      },
      {
        title: "Recruitment of trainees ",
        description:
          "Provide the number of trainees you need to train and their background",
        input: "recruitmentTrainerNumber",
        type: "number",
      },
      {
        title: "Technical Staff",
        description:
          "Identify the technical staff (instructors) required to train the trades you are applying for",
        input: "trainingPremisesAttachment",
        type: "file",
      },
      {
        title: "Sustainability",
        description:
          "How will your project (the planned training activity) continue after this funding",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Budget Summary ",
        description:
          "List the most important activities you are soliciting funding for and the indicative budget for each activity",
        input: "contributionFromApplicant",
        type: "textarea",
      },
      {
        title: "Previous financial Report  ",
        description: "Provide the financial report of the previous year",
        input: "previousFinancialReportAttachment",
        type: "file",
      },
      {
        title: "Training premises",
        description: "Provide proof of ownership/renting of training premises",
        input: "contributionFromApplicant",
        type: "file",
      },

      {
        title: "Contribution from the applicant ",
        description:
          "Justify how your institution will contribute to facilitate the training",
        input: "contributionFromApplicant",
        type: "textarea",
      },
    ],
  },
  window_4: [
    {
      title: "Title of the project",
      description: "Please provide the name/title of your project.",
      input: "title",
      type: "textarea",
    },
    {
      title: "Project Activities and Expected Outcomes",
      description:
        "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
      input: "activitiesAndOutcome",
      type: "textarea",
    },
    {
      title: "Readiness to execute the project",
      description:
        "Explain to which extent you are prepared to execute this project.",
      input: "readinessExecute",
      type: "textarea",
    },
    {
      title:
        "Explain the role of any other involved training provider in the project, if any.",
      description:
        "(Indicate the training provider you would like to partner with if any.)",
      input: "roleAttachment",
      type: "file",
    },
    {
      title: "Training Delivery Process",
      description:
        "Keep in mind that the training period for window 1 should be ranging from few days to 6 months, estimate the training duration with respect to the training content/modules to be offered.) [Trade/Name of Module/From/To/Number of Hours",
      input: "trainingManualAttachment",
      type: "file",
    },

    {
      title: "Training Manual",
      description:
        "[Please attach a detailed description of the content (training manual) of the proposed training",
      input: "identificationEmployee",
      type: "textarea",
    },
    {
      title: "Training Equipment",
      description:
        "List down the equipment available to facilitate this training. [Name of equipment/Number/Related Trade]",
      input: "trainingEquipmentAttachment",
      type: "file",
    },
    {
      title: "Training Equipment - (Continued) ",
      description:
        "Please attach the proof of ownership (Notarized list of equipment, Original Invoices (EBM for locally purchased equipment).",
      input: " staffAttachment",
      type: "file",
    },
    {
      title: "Training Equipment - (Continued) ",
      description: "Add a comment related to the training equipment if any",
      input: "sustainability",
      type: "textarea",
    },
    {
      title: "Recruitment of trainees ",
      description:
        "Provide the number of trainees you need to train and their background",
      input: "recruitmentTrainerNumber",
      type: "number",
    },
    {
      title: "Technical Staff",
      description:
        "Identify the technical staff (instructors) required to train the trades you are applying for",
      input: "trainingPremisesAttachment",
      type: "file",
    },
    {
      title: "Sustainability",
      description:
        "How will your project (the planned training activity) continue after this funding",
      input: "contributionFromApplicant",
      type: "textarea",
    },
    {
      title: "Budget Summary ",
      description:
        "List the most important activities you are soliciting funding for and the indicative budget for each activity",
      input: "contributionFromApplicant",
      type: "textarea",
    },
    {
      title: "Previous financial Report  ",
      description: "Provide the financial report of the previous year",
      input: "previousFinancialReportAttachment",
      type: "file",
    },
    {
      title: "Training premises",
      description: "Provide proof of ownership/renting of training premises",
      input: "contributionFromApplicant",
      type: "file",
    },
    {
      title: "Contribution from the applicant ",
      description:
        "Justify how your institution will contribute to facilitate the training",
      input: "contributionFromApplicant",
      type: "textarea",
    },
  ],
};

export const indicativeBudgetQuestions = [
  {
    title: "Budget Summary",
    description: "Attach a file related to the budget summary",
    input: "budgetSummaryAttachment",
    type: "file",
  },
  {
    title: "Budget Comment",
    description: "",
    input: "budgetComment",
    type: "textarea",
  },
  {
    title: "Contribution",
    description:
      "Outline the planned activities to be supported; The skills gap to be addressed by the project, the expected outcomes/results, and justify why you need the grant to solve it. Explain why this project cannot be executed without a grant.",
    input: "contribution",
    type: "textarea",
  },
];
