import {useCallback, useEffect, useState} from "react"
import { db } from "./firebase"
import { ref, set } from "firebase/database"
import type {RowPicks} from "~/display";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {FranchiseSelectInput} from "~/lib/franchise-select-input";

export type FranchiseNames = "wrg" | "monarch" | "genesix" | "omnius" | "azura" | "cosmico" | "oxgaming" | "death-cloud-esports" | "shadow" | "unity"

export type PickOrder = {
  currentlyChoosing: FranchiseNames
  rowPicks: {
    row1: FranchiseNames
    row2: FranchiseNames
    row3: FranchiseNames
    row4: FranchiseNames
    row5: FranchiseNames
    row6: FranchiseNames
    row7: FranchiseNames
    row8: FranchiseNames
    row9: FranchiseNames
    row10: FranchiseNames
  }
  rowRules: {
    row1: {
      prospect: 1
      rival: 7
      elite: 8
      master: 6
    }
    row2: {
      prospect: 5
      rival: 8
      elite: 7
      master: 2
    }
    row3: {
      prospect: 3
      rival: 1
      elite: 9
      master: 9
    }
    row4: {
      prospect: 4
      rival: 10
      elite: 5
      master: 3
    }
    row5: {
      prospect: 2
      rival: 2
      elite: 10
      master: 8
    }
    row6: {
      prospect: 7
      rival: 3
      elite: 2
      master: 10
    }
    row7: {
      prospect: 6
      rival: 9
      elite: 6
      master: 1
    }
    row8: {
      prospect: 8
      rival: 6
      elite: 4
      master: 4
    }
    row9: {
      prospect: 9
      rival: 5
      elite: 3
      master: 5
    }
    row10: {
      prospect: 10
      rival: 4
      elite: 1
      master: 7
    }
  }
}

const allFranchises: FranchiseNames[] = [
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

const initialState = {
  row1: "",
  row2: "",
  row3: "",
  row4: "",
  row5: "",
  row6: "",
  row7: "",
  row8: "",
  row9: "",
  row10: ""
}

export default function Control() {
  const [currentlyChoosing, setCurrentlyChoosing] = useState<FranchiseNames>();

  const [pickedRows, setPickedRows] = useState<RowPicks>(initialState as any); // Just lazy type assertion for initial state

  const updateMessage = useCallback(() => {
    const pickRef = ref(db, "broadcast/pickData");
    set(pickRef, pickedRows).then(() => {
      console.log(`Updated broadcast with picks:`, pickedRows);
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
  }, [ pickedRows ]);

  const clearBroadcast = useCallback(() => {
    const pickRef = ref(db, "broadcast/pickData");
    set(pickRef, initialState).then(() => {
      console.log(`Updated broadcast with picks:`, initialState);
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
  }, [ pickedRows, initialState ]);

  return (
    <div className="p-4">
      <div className="mb-8">
        Current Franchise Choosing:
        <div className="">
          <FranchiseSelectInput
            value={currentlyChoosing}
            onValueChange={(val) => setCurrentlyChoosing(val as FranchiseNames)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div>
            Row 1:
            <div>
              <FranchiseSelectInput
                value={pickedRows["row1"]}
                onValueChange={value => setPickedRows({...pickedRows, row1: value})}
              />
            </div>
          </div>

          <div>
            Row 2:
            <div>
              <FranchiseSelectInput value={pickedRows["row2"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row2: value})}/>
            </div>
          </div>

          <div>
            Row 3:
            <div>
              <FranchiseSelectInput value={pickedRows["row3"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row3: value})}/>
            </div>
          </div>

          <div>
            Row 4:
            <div>
              <FranchiseSelectInput value={pickedRows["row4"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row4: value})}/>
            </div>
          </div>

          <div>
            Row 5:
            <div>
              <FranchiseSelectInput value={pickedRows["row5"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row5: value})}/>
            </div>
          </div>
        </div>

        <div>
          <div>
            Row 6:
            <div>
              <FranchiseSelectInput value={pickedRows["row6"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row6: value})}/>
            </div>
          </div>

          <div>
            Row 7:
            <div>
              <FranchiseSelectInput value={pickedRows["row7"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row7: value})}/>
            </div>
          </div>

          <div>
            Row 8:
            <div>
              <FranchiseSelectInput value={pickedRows["row8"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row8: value})}/>
            </div>
          </div>

          <div>
            Row 9:
            <div>
              <FranchiseSelectInput value={pickedRows["row9"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row9: value})}/>
            </div>
          </div>

          <div>
            Row 10:
            <div>
              <FranchiseSelectInput value={pickedRows["row10"]}
                                    onValueChange={value => setPickedRows({...pickedRows, row10: value})}/>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => {
          clearBroadcast()
        }}
        className="ml-2 mt-4 p-2 rounded bg-gray-800 text-white cursor-pointer">
        Clear Broadcast
      </button>

      <button
        type="button"
        onClick={() => {
          console.log("Update button clicked");
          updateMessage()
        }}
        className="ml-2 mt-4 p-2 rounded bg-blue-500 text-white cursor-pointer">
        Update Broadcast
      </button>
    </div>
  );
}
