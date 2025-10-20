import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const types = {
  INPUT: "input",
  TEXTAREA: "textarea",
  SELECT: "select",
};

export default function CommonForm({
  formControls,
  formData,
  setFormData,
  onSubmit,
  buttonText,
}) {
  // Function to render inputs dynamically
  function renderInputByComponentType(controlItem) {
    const value = formData[controlItem.name] || "";

    switch (controlItem.componentType) {
      case types.INPUT:
        return (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type || "text"}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );

      case types.TEXTAREA:
        return (
          <Textarea
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );

      case types.SELECT:
        return (
          <div className="flex flex-col gap-1 w-full">
            {controlItem.label && (
              <label className="text-sm font-medium text-gray-700">
                {controlItem.label}
              </label>
            )}

            <Select
              value={value}
              onValueChange={(val) =>
                setFormData({ ...formData, [controlItem.name]: val })
              }
            >
              <SelectTrigger
                className="
            w-full 
            h-11 
            px-3 
            text-sm 
            font-medium 
            rounded-md 
            border border-gray-300 
            bg-white 
            focus:ring-2 focus:ring-[#043927] 
            focus:border-[#043927] 
            outline-none 
            transition 
            duration-200 
            hover:border-gray-400
          "
              >
                <SelectValue
                  placeholder={controlItem.placeholder || "Select"}
                />
              </SelectTrigger>

              <SelectContent className="bg-white border border-gray-200 rounded-md shadow-md">
                {controlItem.options?.map((optionItem) => (
                  <SelectItem
                    key={optionItem.id}
                    value={optionItem.id}
                    className="
                text-sm 
                font-medium 
                text-gray-700 
                hover:bg-gray-100 
                cursor-pointer 
                px-3 
                py-2 
                rounded-md
              "
                  >
                    {optionItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      default:
        return (
          <Input
            name={controlItem.name}
            placeholder={controlItem.placeholder}
            id={controlItem.name}
            type={controlItem.type || "text"}
            value={value}
            onChange={(event) =>
              setFormData({
                ...formData,
                [controlItem.name]: event.target.value,
              })
            }
          />
        );
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5 px-0 mx-0" key={controlItem.name}>
            <Label className="mb-1 ml-0 text-left text-[#043927]">
              {controlItem.label}
            </Label>
            {renderInputByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button
        type="submit"
        className="mt-4 w-full bg-[#043927] text-white font-semibold"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
