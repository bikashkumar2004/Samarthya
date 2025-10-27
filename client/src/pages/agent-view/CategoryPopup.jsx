import React from "react";

const COLORS = ["#7C3AED", "#9333EA", "#3B82F6", "#10B981", "#D1D5DB"];

const CategoryPopup = ({
  sortedCategoryData,
  categoryData,
  onClose,
  handleTakeAction,
}) => {
  const descendingData = [...sortedCategoryData].sort(
    (a, b) => b.value - a.value
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50 animate-fadeIn">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-auto p-8 overflow-y-auto max-h-[80vh]
                   relative animate-slideUp transition-transform duration-300"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-800">
            Category Details (Descending)
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-600 font-medium mb-3">
          Sorted by Value (Descending)
        </p>

        {/* Category List */}
        <div className="space-y-2">
          {descendingData.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-2.5 flex-1">
                <div
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{
                    backgroundColor:
                      COLORS[
                        categoryData.findIndex((c) => c.name === item.name)
                      ] || COLORS[0],
                  }}
                ></div>
                <span className="text-sm font-medium text-gray-700 flex-1">
                  {item.name}
                </span>
                <span className="text-sm font-bold text-gray-800">
                  {item.value}%
                </span>
              </div>

              <button
                onClick={() => handleTakeAction(item.name)}
                className="text-green-600 text-sm font-medium hover:underline hover:text-green-700 transition-all duration-200"
              >
                Take Action
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPopup;
