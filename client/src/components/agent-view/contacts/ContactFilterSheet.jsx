import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, X } from "lucide-react";

const ContactFilterSheet = ({
  open,
  onOpenChange,
  categories = [],
  categoryFilter = [],
  onCategoryChange,
  onClearAll,
}) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" className="border-[#808085] text-black font-bold">
          <Filter className="w-4 h-4 mr-2" />
          Filter By
          {categoryFilter.length > 0 && (
            <span className="ml-2 bg-[#043927] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
              {categoryFilter.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-96 overflow-y-auto bg-white p-6">
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-[#043927]">
            Filter Options
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Category Filter */}
          <div className="space-y-3 border-t pt-6">
            <Label className="text-base font-bold text-gray-900">Category</Label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {categories.length > 0 ? (
                categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2 py-1">
                    <Checkbox
                      id={`category-${category}`}
                      checked={categoryFilter.includes(category)}
                      onCheckedChange={() => onCategoryChange(category)}
                    />
                    <label
                      htmlFor={`category-${category}`}
                      className="text-sm font-medium leading-none text-gray-800 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {category}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No categories found</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 border-t pt-6">
            <Button
              onClick={onClearAll}
              variant="outline"
              className="w-full border-2 border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 font-bold"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All Filters
            </Button>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-gradient-to-r from-[#043927] to-emerald-700 hover:from-[#032d1f] hover:to-emerald-800 text-white font-bold"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ContactFilterSheet;
