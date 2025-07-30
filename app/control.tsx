import {useCallback, useEffect, useState} from "react"
import { db } from "./firebase"
import {onValue, ref, set} from "firebase/database"
import {CurrentlyChoosingFranchise, getAlphabetLetterFromRowNumber, type RowPicks} from "~/display";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "~/components/ui/select";
import {FranchiseSelectInput} from "~/lib/franchise-select-input";
import PasswordGate from "~/lib/password-gate";
import {Switch} from "~/components/ui/switch";

export type FranchiseNames = "wrg" | "monarch" | "genesix" | "omnius" | "azura" | "cosmico" | "oxgaming" | "death-cloud-esports" | "shadow" | "unity"

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
  const [currentlyChoosing, setCurrentlyChoosing] = useState<number>(0);
  const [backgroundOn, setBackgroundOn] = useState<boolean>(true);
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
    const messageRef = ref(db, "broadcast/backgroundOn");
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      setBackgroundOn(data);
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

  const updateBackground = useCallback((checked: boolean) => {
    const backgroundRef = ref(db, "broadcast/backgroundOn");

    console.log(checked);
    set(backgroundRef, checked).then(() => {
      setBackgroundOn(checked);
      window.alert("Updated backgroundOn successfully!");
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
  }, [ backgroundOn ]);

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
    <div className="p-4 grid grid-cols-2 gap-4 bg-black min-h-screen">
      <div className="col-span-2">
        Current Pick: {currentlyChoosing}
        <div>
          Background On:
          <Switch
            checked={backgroundOn}
            onCheckedChange={(checked) => updateBackground(checked)}
          />
        </div>


        <div style={{ scale: 0.5 }}>
          <CurrentlyChoosingFranchise />
        </div>
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
        {pickOrder && <div className="flex flex-col gap-2">
          {allFranchises.map((franchise, index) => {
            // Should be disabled if pickedRows already has a value for this row
            const disabled = !!pickedRows[`row${index + 1}` as keyof RowPicks];
            return <div className="flex items-center gap-2" key={index}>
              Row {getAlphabetLetterFromRowNumber(index)}:
              <div className={disabled && "cursor-not-allowed pointer-events-none opacity-50"}>
                <FranchiseSelectInput
                  options={allFranchises.filter((value) => value === pickOrder[currentlyChoosing] || pickedRows[`row${index + 1}` as keyof RowPicks]
                  )}
                  value={pickedRows[`row${index + 1}` as keyof RowPicks]}
                  onValueChange={value => setPickedRows({...pickedRows, [`row${index + 1}`]: value})}
                />
              </div>
            </div>
          })}
        </div>}

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
