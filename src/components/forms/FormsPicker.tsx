"use client";
import React, { useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type SelectProps = {
  value: number;
  lable?: string | null;
};

type FormsPickerProps = {
  options: Array<SelectProps>;
};

const FormsPicker = ({ options }: FormsPickerProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();

  const formId = searchParams.get("formId") || options[0].value.toString();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex gap-2 items-center">
      <Label className="font-bold">Select a form</Label>
      <Select
        value={formId}
        onValueChange={(value) => {
          router.push(pathName + "?" + createQueryString("formId", value));
        }}
      >
        <SelectTrigger className="w-fit">
          <SelectValue placeholder={options[0].lable} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.lable}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default FormsPicker;
