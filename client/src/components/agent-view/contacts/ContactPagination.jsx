import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ContactPagination = ({
  currentPage,
  totalPages,
  totalCount,
  startIndex,
  endIndex,
  onPageChange,
}) => {
  if (totalCount === 0) return null;

  return (
    <div className="border-t-2 border-gray-200 bg-gradient-to-r from-gray-50 to-white px-6 py-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-bold text-[#043927]">{startIndex + 1}</span> to{" "}
          <span className="font-bold text-[#043927]">
            {Math.min(endIndex, totalCount)}
          </span>{" "}
          of <span className="font-bold text-[#043927]">{totalCount}</span> results
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="hidden sm:flex items-center gap-1">
            {currentPage > 2 && (
              <>
                <Button
                  onClick={() => onPageChange(1)}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                >
                  1
                </Button>
                {currentPage > 3 && <span className="px-2 text-gray-500">...</span>}
              </>
            )}

            {currentPage > 1 && (
              <Button
                onClick={() => onPageChange(currentPage - 1)}
                variant="outline"
                size="sm"
                className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
              >
                {currentPage - 1}
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-10 h-10 border-2 border-[#043927] bg-emerald-50 text-[#043927] font-bold shadow"
            >
              {currentPage}
            </Button>

            {currentPage < totalPages && (
              <Button
                onClick={() => onPageChange(currentPage + 1)}
                variant="outline"
                size="sm"
                className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
              >
                {currentPage + 1}
              </Button>
            )}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && (
                  <span className="px-2 text-gray-500">...</span>
                )}
                <Button
                  onClick={() => onPageChange(totalPages)}
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 border-2 border-gray-300 hover:bg-gray-100 font-bold"
                >
                  {totalPages}
                </Button>
              </>
            )}
          </div>

          <div className="sm:hidden text-sm font-bold text-gray-700">
            Page {currentPage} of {totalPages}
          </div>

          <Button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            variant="outline"
            size="sm"
            className="border-2 border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed font-bold"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContactPagination;
