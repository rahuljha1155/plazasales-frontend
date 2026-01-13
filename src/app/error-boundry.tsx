"use client";
import { Icon } from "@iconify/react";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function ErrorBoundaryWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      FallbackComponent={({ error, resetErrorBoundary }) => (
        <div className="flex justify-center items-center h-screen">
          <div className="flex flex-col text-center! items-center justify-center min-h-[50vh] lg:max-w-5xl min-w-[50vw] p-6 bg-white border border-red-300 rounded-lg ">
            <Icon icon="mynaui:sad-square" className="text-red-600 w-16 h-16 mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Oops! Something went wrong.
            </h2>
            <p className="text-sm text-gray-600 mb-4 text-center">
              {error.message || "An unexpected error occurred."}
            </p>
            <button
              onClick={() => {
                window.location.reload();
              }}
              className="px-5 py-2 bg-red-600 text-white font-medium rounded-full hover:bg-red-700 transition"
            >
              Try Again
            </button>
          </div>

        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
