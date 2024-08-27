"use client";
import React, { useState } from "react";

const TermsAndConditions = () => {
  const [accepted, setAccepted] = useState(false);
  const [rejected, setRejected] = useState(false);

  const handleAccept = () => {
    alert("You have accepted the terms and conditions.");
    // Handle the accept action here, such as redirecting the user
  };

  const handleReject = () => {
    alert("You have rejected the terms and conditions.");
    // Handle the reject action here, such as redirecting the user away
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
      <h1 className="text-4xl font-bold mb-6">
        Grant Contract Terms and Conditions
      </h1>
      <p className="mb-4 text-lg">
        Congratulations on being selected as a recipient of the grant! Before we
        proceed, please carefully read the following terms and conditions. This
        contract outlines the responsibilities, obligations, and expectations
        between you (the Grantee) and the Grant Provider.
      </p>
      <h2 className="text-2xl font-semibold mb-4">1. Purpose of the Grant</h2>
      <p className="mb-4 text-lg">
        The grant provided is intended for [insert specific purpose or project].
        As the Grantee, you agree to use the funds solely for the stated
        purpose. Any deviation from the agreed-upon use of funds must be
        communicated and approved in writing by the Grant Provider.
      </p>
      <h2 className="text-2xl font-semibold mb-4">
        2. Grant Amount and Disbursement
      </h2>
      <p className="mb-4 text-lg">
        The total grant amount awarded is [insert amount]. Disbursement of the
        funds will be made in accordance with the schedule outlined in this
        contract. Any delay or misuse of funds may result in the suspension or
        termination of the grant.
      </p>
      <h2 className="text-2xl font-semibold mb-4">3. Reporting Requirements</h2>
      <p className="mb-4 text-lg">
        As a Grantee, you are required to submit periodic reports on the
        progress and financial status of your project. These reports should be
        submitted by the deadlines specified in this contract. Failure to comply
        with reporting requirements may result in forfeiture of the remaining
        funds.
      </p>
      <h2 className="text-2xl font-semibold mb-4">
        4. Compliance and Accountability
      </h2>
      <p className="mb-4 text-lg">
        The Grantee agrees to comply with all applicable laws, regulations, and
        policies related to the use of grant funds. The Grant Provider reserves
        the right to audit and monitor the use of funds at any time during the
        grant period.
      </p>
      <h2 className="text-2xl font-semibold mb-4">
        5. Termination of the Grant
      </h2>
      <p className="mb-4 text-lg">
        The Grant Provider reserves the right to terminate this grant contract
        at any time if the Grantee fails to adhere to the terms and conditions
        outlined herein. Upon termination, the Grantee must return any unused
        funds within 30 days.
      </p>
      <h2 className="text-2xl font-semibold mb-4">6. Confidentiality</h2>
      <p className="mb-4 text-lg">
        Both parties agree to maintain the confidentiality of all information
        related to this grant agreement, except as required by law or for the
        purpose of fulfilling the obligations under this contract.
      </p>
      <p className="mb-6 text-lg">
        By accepting these terms and conditions, you acknowledge that you have
        read, understood, and agree to abide by all the provisions of this
        contract. If you do not agree, you will not be eligible to receive the
        grant funds.
      </p>

      <div className="mb-6">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-green-600"
            checked={accepted}
            onChange={() => {
              setAccepted(!accepted);
              if (rejected) setRejected(false);
            }}
          />
          <span className="ml-2 text-lg">
            I accept the terms and conditions
          </span>
        </label>
        <label className="inline-flex items-center ml-6">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-red-600"
            checked={rejected}
            onChange={() => {
              setRejected(!rejected);
              if (accepted) setAccepted(false);
            }}
          />
          <span className="ml-2 text-lg">
            I reject the terms and conditions
          </span>
        </label>
      </div>

      <div>
        <button
          className={`px-6 py-2 rounded-lg font-semibold text-white mr-4 ${
            accepted
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleAccept}
          disabled={!accepted}
        >
          Accept
        </button>
        <button
          className={`px-6 py-2 rounded-lg font-semibold text-white ${
            rejected
              ? "bg-red-600 hover:bg-red-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
          onClick={handleReject}
          disabled={!rejected}
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default TermsAndConditions;
