import {useCallback, useState} from "react"
import { db } from "./firebase"
import { ref, set } from "firebase/database"

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

export default function Control() {
  const [message, setMessageText] = useState("");

  const updateMessage = useCallback(() => {
    console.log("update message clicked", message);
    const msgRef = ref(db, "broadcast/message");
    set(msgRef, message).then(() => {
      console.log(`Sent message ${message}`);
    }).catch((error) => {
      console.error("Failed to send message:", error);
    });
  }, [ message ]);

  return (
    <div className="p-4">
      Control
      <input
        className="border p-2 text-lg"
        value={message}
        onChange={(e) => setMessageText(e.target.value)}
      />
      <button
        type="button"
        onClick={() => {
          console.log("Update button clicked");
          updateMessage()
        }}
        className="ml-2 p-2 bg-blue-500 text-white">
        Update Broadcast
      </button>
    </div>
  );
}
