import React, {useState} from 'react';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import type {FranchiseNames} from "~/control";

type FranchiseSelectInputProps = {
  onValueChange: (value: FranchiseNames) => void;
  value?: FranchiseNames
  exclude?: FranchiseNames[]
}

export const FranchiseSelectInput = ({ value, onValueChange, exclude }: FranchiseSelectInputProps) => {
  const franchises: FranchiseNames[] = [
    "wrg",
    "monarch",
    "genesix",
    "omnius",
    "azura",
    "cosmico",
    "oxgaming",
    "death-cloud-esports",
    "shadow",
    "unity"
  ];

  const filteredFranchises = exclude ? franchises.filter(f => !exclude.includes(f)) : franchises;

  return <Select value={value} onValueChange={(val) => onValueChange(val as FranchiseNames)}>
    <SelectTrigger>
      <SelectValue placeholder={"Select a franchise"} />
    </SelectTrigger>
    <SelectContent>
      {filteredFranchises.map((franchise) => (
        <SelectItem key={franchise} value={franchise}>
          {franchise.charAt(0).toUpperCase() + franchise.slice(1)}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
};