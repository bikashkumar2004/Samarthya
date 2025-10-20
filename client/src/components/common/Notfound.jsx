import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Notfound() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Oops! The page you are looking for does not exist.
        </p>
        <Button
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
      </div>
    </div>
  );
}
