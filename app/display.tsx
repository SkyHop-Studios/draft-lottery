import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import {FranchiseBanner} from "~/lib/franchise-banner";
import {RscBannerLogo} from "~/lib/rsc-banner-logo";
import type {FranchiseNames} from "~/control";
import {cn} from "~/lib/utils";
import {FranchiseRowHexagon} from "~/lib/franchise-row-hexagon";
import {RowTierCell} from "~/lib/row-tier-cell";

export type RowPicks = {
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

const rowRules = {
  row1: {
    prospect: 8,
    rival: 10,
    elite: 3,
    master: 1
  },
  row2: {
    prospect: 3,
    rival: 2,
    elite: 8,
    master: 9,
  },
  row3: {
    prospect: 1,
    rival: 7,
    elite: 10,
    master: 4
  },
  row4: {
    prospect: 6,
    rival: 1,
    elite: 5,
    master: 10
  },
  row5: {
    prospect: 4,
    rival: 3,
    elite: 7,
    master: 8
  },
  row6: {
    prospect: 10,
    rival: 9,
    elite: 1,
    master: 2
  },
  row7: {
    prospect: 2,
    rival: 5,
    elite: 9,
    master: 6
  },
  row8: {
    prospect: 7,
    rival: 6,
    elite: 4,
    master: 5
  },
  row9: {
    prospect: 5,
    rival: 8,
    elite: 6,
    master: 3
  },
  row10: {
    prospect: 9,
    rival: 4,
    elite: 2,
    master: 7
  }
}

export default function Display() {
  return <div className="h-screen bg-center bg-cover relative" style={{ backgroundImage: `url(/background.png)` }}>
    <div className="w-[180px] h-[170px] bg-center bg-contain bg-no-repeat absolute left-10 top-10" style={{ backgroundImage: `url(/rsc-logo.png)` }}>

    </div>

    <div className="absolute left-[50%] translate-x-[-50%] top-10 text-6xl font-bold">
      <span className="text-rsc-red">DRAFT</span> LOTTERY
    </div>

    <div className="absolute top-10 right-10">
      <FranchiseBanner className="text-rsc-red" />
      <div className="absolute inset-0 flex items-center justify-between text-3xl font-bold text-black uppercase px-12">
        <img className="w-12" src="/franchise.png" alt=""/>

        <div>Franchise</div>

        <img className="w-12" src="/franchise.png" alt=""/>
      </div>
    </div>

    <div className="absolute left-[12%] right-[12%] top-[260px] flex justify-center items-center">
      <div>
        <div className="text-4xl uppercase font-bold text-center">UP NEXT:</div>
        <CurrentlyChoosingFranchise/>
      </div>
    </div>

    <div className="absolute left-[12%] right-[12%] top-[260px] grid grid-cols-2 gap-8">
      <AlternatingFranchiseRows />
    </div>

    <div className="absolute bottom-10 left-10">
      <RscBannerLogo className="text-rsc-red w-[120px] h-[180px]" />
    </div>

    {/*@ts-ignore*/}
    <div className="text-rsc-master text-rsc-elite text-rsc-rival text-rsc-prospect" />
  </div>
}

const CurrentlyChoosingFranchise = () => {
  const [currentlyChoosing, setCurrentlyChoosing] = useState<number>(0);
  const [pickOrder, setPickOrder] = useState<FranchiseNames[]>([]);

  useEffect(() => {
    const messageRef = ref(db, "broadcast/currentlyChoosing");
    const unsubscribe = onValue(messageRef, (snapshot) => {
      const data = snapshot.val();
      // If no data is found, don't set pickedRows as we need the empty state to render out
      if (data) {
        setCurrentlyChoosing(data);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const pickOrderRef = ref(db, "broadcast/pickOrder");
    const unsubscribe = onValue(pickOrderRef, (snapshot) => {
      const data = snapshot.val();
      // If no data is found, don't set pickedRows as we need the empty state to render out
      if (data) {
        setPickOrder(data);
      }
    });

    return () => unsubscribe();
  }, []);

  const currentlyChoosingFranchise = pickOrder[currentlyChoosing];

  console.log(currentlyChoosing, pickOrder, currentlyChoosingFranchise, FranchiseLogos[currentlyChoosingFranchise]);

  return <>
    {FranchiseLogos[currentlyChoosingFranchise] && <img className={"w-[425px]"} src={FranchiseLogos[currentlyChoosingFranchise]} alt=""/>}
  </>
}


const getAlphabetLetterFromRowNumber = (rowNumber: number) => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[rowNumber] || "N/A";
}


const FranchiseLogos: Record<FranchiseNames, string> = {
  monarch: "/Franchise%20Logos/Monarch Realm.png",
  wrg: "/Franchise%20Logos/White Rabbit Gaming.png",
  omnius: "/Franchise%20Logos/Omnius Gaming.png",
  cosmico: "/Franchise%20Logos/CosmiCo.png",
  azura: "/Franchise%20Logos/azg.png",
  "death-cloud-esports": "/Franchise%20Logos/Death Cloud Esports.png",
  genesix: "/Franchise%20Logos/GeneSix.png",
  shadow: "/Franchise%20Logos/shadow.png",
  unity: "/Franchise%20Logos/unity.png",
  oxgaming: "/Franchise%20Logos/oxgaming.png",
  "": "/Franchise%20Logos/placeholder.png" // Placeholder for empty rows
}

const SizeAdjustment = (franchiseName: FranchiseNames) => {
  switch (franchiseName) {
    case "azura":
    case "cosmico":
    case "genesix":
    case "monarch":
    case "unity":
      return "w-12";
    case "shadow":
    case "death-cloud-esports":
      return "w-10 ml-2";
    case "omnius":
      return "w-8 ml-2"
    case "wrg":
      return "w-8 ml-2";
    case "oxgaming":
      return "w-16";
    default:
      return "w-12";
  }
}

const AlternatingFranchiseRows = () => {
  const [pickedRows, setPickedRows] = useState<RowPicks>({
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
  } as any); // Just for type compatibility, should be improved later

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

  return <>
    {Object.entries(rowRules).map(([key, rowValues], index) => {
      const isReversed = index % 2 !== 0;
      const rowKey = `row${index+1}` as keyof typeof rowRules;

      return <div className={cn("flex items-center gap-2 min-h-[40px]", isReversed && "justify-end")} key={key}>
        <div className={cn("relative flex items-center border-rsc-blue border h-[50px] rounded-r-2xl")}>
          <FranchiseRowHexagon className={cn("absolute -top-3 bottom-0 text-rsc-blue -left-6")} />

          <span className={cn("absolute top-1.5 text-3xl font-bold flex items-center justify-center left-[6px]", index === 8 && "left-[10px]", index === 9 && "left-[4px]")}>
            {getAlphabetLetterFromRowNumber(index)}
          </span>

          <div className={cn("w-[110px] pl-14")}>
            {pickedRows[rowKey] && <img className={SizeAdjustment(pickedRows[rowKey])} src={FranchiseLogos[pickedRows[rowKey]]} alt=""/>}
          </div>
        </div>

        {Object.entries(rowValues).map(([rowKey, tierValues], index) => {
          const tierClass = `text-rsc-${rowKey} `;
          return <div className={cn("relative flex gap-2")} key={rowKey+key}>
            <RowTierCell className={tierClass} />

            <div className="absolute left-0 top-0 bottom-0 right-0 flex items-center justify-center text-black text-2xl font-bold">
              {tierValues}
            </div>
          </div>
        })}
      </div>
    })}
  </>
}
