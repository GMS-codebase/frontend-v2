import React from "react";
import { X, User, Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { SurveyResponse } from "@/types/survey/survey";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

interface ResponseDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  response: SurveyResponse | null;
}

const ResponseDetailsModal: React.FC<ResponseDetailsModalProps> = ({
  isOpen,
  onClose,
  response,
}) => {
  if (!isOpen || !response) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-4xl bg-white rounded-xl shadow-xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary-100 rounded-lg">
                <MessageSquare className="w-5 h-5 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Response Details
                </h2>
                <p className="text-sm text-gray-500">
                  Survey response from {response.applicant}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="space-y-8">
              {/* Applicant Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-gray-400" />
                  Applicant Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-gray-900">
                          {response.applicant}
                        </p>
                      </div>
                    </div>

                    {response.details.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium text-gray-900">
                            {response.details.email}
                          </p>
                        </div>
                      </div>
                    )}

                    {response.details.phone && (
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="font-medium text-gray-900">
                            {response.details.phone}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center space-x-3">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Submitted</p>
                        <p className="font-medium text-gray-900">
                          {format(
                            response.timestamp,
                            "MMMM dd, yyyy 'at' HH:mm",
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Survey Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Survey Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Survey Name</p>
                      <p className="font-medium text-gray-900">
                        {response.survey}
                      </p>
                    </div>
                    <Badge variant={response.reviewed ? "success" : "warning"}>
                      {response.reviewed ? "Reviewed" : "Pending Review"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Detailed Responses */}
              {response.details.responses &&
                response.details.responses.length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Detailed Responses
                    </h3>
                    <div className="space-y-4">
                      {response.details.responses.map((item, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-lg p-4"
                        >
                          <div className="mb-3">
                            <p className="text-sm font-medium text-gray-900 mb-1">
                              Question {index + 1}
                            </p>
                            <p className="text-sm text-gray-600">
                              {item.question}
                            </p>
                          </div>
                          <div className="bg-primary-50 rounded-lg p-3">
                            <p className="text-sm font-medium text-gray-700">
                              Answer:
                            </p>
                            <p className="text-gray-900 mt-1">{item.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Response Summary */}
              {response.response && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Response Summary
                  </h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-900 leading-relaxed">
                      {response.response}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {!response.reviewed && (
              <Button variant="primary">Mark as Reviewed</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseDetailsModal;
