import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Unauthpage() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-lg shadow-md text-center max-w-md">
        <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-700 mb-6">
          You do not have permission to access this page.
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
