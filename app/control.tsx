import {useCallback, useEffect, useState} from "react"
import { db } from "./firebase"
import {onValue, ref, set} from "firebase/database"
import type {RowPicks} from "~/display";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {FranchiseSelectInput} from "~/lib/franchise-select-input";
import PasswordGate from "~/lib/password-gate";

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

const pickOrder: FranchiseNames[] = []

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
  const [currentlyChoosing, setCurrentlyChoosing] = useState<number>(0);
  const [pickOrder, setPickOrder] = useState<FranchiseNames[]>([]);
  const [pickedRows, setPickedRows] = useState<RowPicks>(initialState as any); // Just lazy type assertion for initial state

  useEffect(() => {
    const messageRef = ref(db, "broadcast/pickData");
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      // If no data is found, don't set pickedRows as we need the empty state to render out
      if (data) {
        setPickedRows(data);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pickOrderRef = ref(db, "broadcast/pickOrder");
    const unsubscribeOrder = onValue(pickOrderRef, (snapshot) => {
      const data = snapshot.val();
      // If no data is found, don't set pickedRows as we need the empty state to render out
      if (data) {
        setPickOrder(data);
      }
    });

    return () => unsubscribeOrder();
  }, []);

  useEffect(() => {
    const pickOrderRef = ref(db, "broadcast/currentlyChoosing");
    const unsubscribeOrder = onValue(pickOrderRef, (snapshot) => {
      const data = snapshot.val();
      // If no data is found, don't set pickedRows as we need the empty state to render out
      if (data) {
        setCurrentlyChoosing(data);
      }
    });

    return () => unsubscribeOrder();
  }, []);

  const updateBroadcast = useCallback(() => {
    const pickRef = ref(db, "broadcast/pickData");
    const currentlyChoosingRef = ref(db, "broadcast/currentlyChoosing");

    set(pickRef, pickedRows).then(() => {
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });

    set(currentlyChoosingRef, currentlyChoosing+1).then(() => {
      window.alert("Updated current choosing successfully!");
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
  }, [ pickedRows ]);

  const updatePickOrder = useCallback(() => {
    const pickOrderRef = ref(db, "broadcast/pickOrder");

    set(pickOrderRef, pickOrder).then(() => {
      window.alert("Updated pick order successfully!");
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
  }, [ pickOrder, currentlyChoosing ]);

  const clearBroadcast = useCallback(() => {
    const pickRef = ref(db, "broadcast/pickData");
    const currentlyChoosingRef = ref(db, "broadcast/currentlyChoosing");
    set(pickRef, initialState).then(() => {
      console.log(`Updated broadcast with picks:`, initialState);
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
    set(currentlyChoosingRef, 0).then(() => {
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
  }, [ pickedRows, currentlyChoosing, initialState ]);

  const clearPickOrder = useCallback(() => {
    const pickOrderRef = ref(db, "broadcast/pickOrder");
    const currentlyChoosingRef = ref(db, "broadcast/currentlyChoosing");

    set(pickOrderRef, []).then(() => {
      window.alert("Updated pick order successfully!");
      setPickOrder([]);
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });

    set(currentlyChoosingRef, 0).then(() => {

    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
  }, [ pickOrder, currentlyChoosing ]);

  return <PasswordGate>
    <div className="p-4 grid grid-cols-2 gap-4">
      <div className="col-span-2">
        Current Pick: {currentlyChoosing}
      </div>

      <div className="">
        Specify Pick Order
        <div className="flex flex-col gap-2">
          {allFranchises.map((franchise, index) => {
            const handlePickChange = (value: FranchiseNames) => {
              const newPickOrder = [...pickOrder];
              newPickOrder[index] = value;
              setPickOrder(newPickOrder);
            }

            return <div className="flex gap-2 items-center" key={index + index}>
              <div>
                Row {index + 1}:
              </div>

              <FranchiseSelectInput
                options={allFranchises.filter((value) =>
                  !pickOrder.includes(value) || pickOrder[index] === value
                )}
                value={pickOrder[index]}
                onValueChange={handlePickChange}
              />
            </div>
          })}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={clearPickOrder}
            className="ml-2 mt-4 p-2 rounded bg-gray-800 text-white cursor-pointer">
            Clear Pick Order
          </button>

          <button
            type="button"
            onClick={updatePickOrder}
            className="ml-2 mt-4 p-2 rounded bg-blue-500 text-white cursor-pointer">
            Save Pick Order
          </button>
        </div>

      </div>

      <div>
        Specify Picks
        <div className="flex flex-col gap-2">
          {allFranchises.map((franchise, index) => {
            return <div className="flex items-center gap-2" key={index}>
              Row {index + 1}:
              <div>
                <FranchiseSelectInput
                  options={allFranchises}
                  value={pickedRows[`row${index + 1}` as keyof RowPicks]}
                  onValueChange={value => setPickedRows({...pickedRows, [`row${index + 1}`]: value})}
                />
              </div>
            </div>
          })}
        </div>

        <div className="flex gap-2">
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
              updateBroadcast()
            }}
            className="ml-2 mt-4 p-2 rounded bg-blue-500 text-white cursor-pointer">
            Update Broadcast
          </button>
        </div>
      </div>
    </div>
  </PasswordGate>
}
