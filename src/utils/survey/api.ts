// Mock API functions - replace with your actual API implementation
export const authorizedApi = {
  get: async (url: string) => {
    console.log(`GET ${url}`);

    if (url === "/survey/get-all-survey") {
      return {
        data: [
          {
            id: 1,
            name: "Customer Satisfaction Survey",
            qns: 10,
            expiry_date: "2024-12-31",
            survey_status: "ongoing",
            created_at: "2024-01-15",
            updated_at: "2024-01-15",
            survey_TYPE: "Customer Feedback",
            hasSurvey_Started: true,
            surveyStartingTime: "2024-01-20",
          },
          {
            id: 2,
            name: "Employee Engagement Survey",
            qns: 15,
            expiry_date: "2024-11-30",
            survey_status: "draft",
            created_at: "2024-01-10",
            updated_at: "2024-01-10",
            survey_TYPE: "HR",
            hasSurvey_Started: false,
            surveyStartingTime: null,
          },
          {
            id: 3,
            name: "Product Feedback Survey",
            qns: 8,
            expiry_date: "2024-10-15",
            survey_status: "expired",
            created_at: "2024-01-05",
            updated_at: "2024-01-05",
            survey_TYPE: "Product",
            hasSurvey_Started: true,
            surveyStartingTime: "2024-01-08",
          },
        ],
      };
    }

    if (url === "/survey/get-responses") {
      return {
        data: [
          {
            uuid: "resp-1",
            id: "resp-1",
            survey_id: "1",
            applicant: "John Doe",
            survey: "Customer Satisfaction Survey",
            response:
              "Very satisfied with the service provided. The support team was incredibly helpful and resolved my issues quickly. I would definitely recommend this service to others.",
            timestamp: new Date("2024-01-25"),
            reviewed: false,
            details: {
              email: "john.doe@example.com",
              phone: "+1234567890",
              responses: [
                {
                  question: "How satisfied are you with our service?",
                  answer: "Very satisfied",
                },
                {
                  question: "Would you recommend us to others?",
                  answer: "Yes, definitely",
                },
                {
                  question: "What could we improve?",
                  answer: "Maybe faster response times during peak hours",
                },
              ],
            },
          },
          {
            uuid: "resp-2",
            id: "resp-2",
            survey_id: "1",
            applicant: "Jane Smith",
            survey: "Customer Satisfaction Survey",
            response:
              "Good experience overall, but there's room for improvement in the user interface design and navigation flow.",
            timestamp: new Date("2024-01-24"),
            reviewed: true,
            details: {
              email: "jane.smith@example.com",
              phone: "+1234567891",
              responses: [
                {
                  question: "How satisfied are you with our service?",
                  answer: "Satisfied",
                },
                {
                  question: "Would you recommend us to others?",
                  answer: "Yes",
                },
                {
                  question: "What could we improve?",
                  answer: "Better user interface design",
                },
              ],
            },
          },
          {
            uuid: "resp-3",
            id: "resp-3",
            survey_id: "2",
            applicant: "Mike Johnson",
            survey: "Employee Engagement Survey",
            response:
              "I feel engaged with my work and appreciate the company culture. The remote work flexibility is excellent.",
            timestamp: new Date("2024-01-23"),
            reviewed: false,
            details: {
              email: "mike.johnson@company.com",
              phone: "+1234567892",
              responses: [
                {
                  question: "How engaged do you feel at work?",
                  answer: "Very engaged",
                },
                {
                  question: "Rate your work-life balance",
                  answer: "Excellent",
                },
                {
                  question: "Any suggestions for improvement?",
                  answer: "More team building activities",
                },
              ],
            },
          },
        ],
      };
    }

    return { data: [] };
  },

  post: async (url: string, data?: any) => {
    console.log(`POST ${url}`, data);
    return { data: { success: true } };
  },

  put: async (url: string, data?: any) => {
    console.log(`PUT ${url}`, data);
    return { data: { success: true } };
  },

  delete: async (url: string) => {
    console.log(`DELETE ${url}`);
    return { data: { success: true } };
  },
};
