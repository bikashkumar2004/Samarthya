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
          <Select
            value={value}
            onValueChange={(val) =>
              setFormData({ ...formData, [controlItem.name]: val })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={controlItem.placeholder || "Select"} />
            </SelectTrigger>
            <SelectContent>
              {controlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.value}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5 px-0 mx-0" key={controlItem.name}>
            <Label className="mb-1 ml-0 text-left text-[#043927]">{controlItem.label}</Label>
            {renderInputByComponentType(controlItem)}
          </div>
        ))}
      </div>
      <Button type="submit" className="mt-4 w-full bg-[#043927] text-white font-semibold">
        {buttonText || "Submit"}
      </Button>
    </form>
  );
}
