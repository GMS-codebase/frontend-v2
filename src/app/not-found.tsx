/* eslint-disable react/no-unescaped-entities */
import React from "react";
import Link from "next/link";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-10 shadow-lg rounded-lg text-center">
        <h1 className="text-5xl font-bold text-red-500 mb-4">Oops!</h1>
        <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We're sorry, but the page you are looking for doesn't exist or has
          been moved.
        </p>
        <Link href="/">
          <a className="inline-block px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600">
            Go Back Home
          </a>
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
