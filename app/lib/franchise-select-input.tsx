import React, {useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import type {FranchiseNames} from "~/control";

type FranchiseSelectInputProps = {
  options: FranchiseNames[]
  onValueChange: (value: FranchiseNames) => void;
  value?: FranchiseNames
}

export const FranchiseSelectInput = ({ value, onValueChange, options }: FranchiseSelectInputProps) => {
  return <Select value={value} onValueChange={(val) => onValueChange(val as FranchiseNames)}>
    <SelectTrigger>
      <SelectValue placeholder={"Select a franchise"} />
    </SelectTrigger>
    <SelectContent>
      {options.map((franchise) => (
        <SelectItem key={franchise} value={franchise}>
          {franchise.charAt(0).toUpperCase() + franchise.slice(1)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
};