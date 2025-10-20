import React, { useState } from "react";
import { Phone, Mail, MessageCircle, MessageSquare, X } from "lucide-react";

export default function DetailDialog({ isOpen, setIsOpen }) {
  const [loading, setLoading] = useState(null);

  const customer = {
    name: "Frederick Devine",
    email: "f.devine@afp-supply.com",
    phone: "+491771234567",
    status: "AFP Supply",
    role: "Manager",
  };

  const handleAction = async (action) => {
    setLoading(action);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(null);
    alert(`${action} automation triggered for ${customer.name}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto flex flex-col sm:flex-row overflow-hidden">
        {/* Left Section: Customer Details */}
        <div className="flex-1 p-5 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto">
          <div className="flex justify-between items-start">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
              Customer Details
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Name */}
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Name</p>
            <p className="text-base sm:text-lg font-medium text-gray-900 break-words">
              {customer.name}
            </p>
          </div>

          {/* Status */}
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Status</p>
            <div className="flex items-center space-x-2 flex-wrap">
              <span className="w-2 h-2 bg-yellow-400 rounded-full flex-shrink-0"></span>
              <span className="text-sm sm:text-base text-blue-600 font-medium">
                {customer.status}
              </span>
              <span className="text-gray-400">·</span>
              <span className="text-sm sm:text-base text-gray-600">
                {customer.role}
              </span>
            </div>
          </div>

          {/* Email */}
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Email</p>
            <p className="text-sm sm:text-base text-blue-600 font-medium break-all">
              {customer.email}
            </p>
          </div>

          {/* Phone */}
          <div>
            <p className="text-xs sm:text-sm text-gray-400 mb-1">Phone</p>
            <p className="text-sm sm:text-base text-blue-600 font-medium break-words">
              {customer.phone} <span className="text-gray-500">Mobile</span>
            </p>
          </div>
        </div>

        {/* Right Section: Automation Actions */}
        <div className="w-full sm:w-2/5 bg-gray-50 border-t sm:border-t-0 sm:border-l p-5 sm:p-8 flex flex-col justify-center">
          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-3 sm:mb-5">
            Automation Actions
          </h3>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Call */}
            <button
              onClick={() => handleAction("Call")}
              disabled={loading !== null}
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 group"
            >
              {loading === "Call" ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Phone className="w-5 h-5 sm:w-6 sm:h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-semibold">Call</span>
                </>
              )}
            </button>

            {/* Email */}
            <button
              onClick={() => handleAction("Email")}
              disabled={loading !== null}
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 group"
            >
              {loading === "Email" ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-semibold">Email</span>
                </>
              )}
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleAction("WhatsApp")}
              disabled={loading !== null}
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 group"
            >
              {loading === "WhatsApp" ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-semibold">
                    WhatsApp
                  </span>
                </>
              )}
            </button>

            {/* SMS */}
            <button
              onClick={() => handleAction("SMS")}
              disabled={loading !== null}
              className="flex flex-col items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 group"
            >
              {loading === "SMS" ? (
                <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 mb-1 group-hover:scale-110 transition-transform" />
                  <span className="text-xs sm:text-sm font-semibold">SMS</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
