import { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue } from "firebase/database";
import {FranchiseBanner} from "~/lib/franchise-banner";
import {RscBannerLogo} from "~/lib/rsc-banner-logo";
import type {FranchiseNames} from "~/control";
import {cn} from "~/lib/utils";
import {FranchiseRowHexagon} from "~/lib/franchise-row-hexagon";
import {RowTierCell} from "~/lib/row-tier-cell";

type RowPicks = {
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
    prospect: 1,
    rival: 7,
    elite: 8,
    master: 6
  },
  row2: {
    prospect: 5,
    rival: 8,
    elite: 7,
    master: 2,
  },
  row3: {
    prospect: 3,
    rival: 1,
    elite: 9,
    master: 9
  },
  row4: {
    prospect: 4,
    rival: 10,
    elite: 5,
    master: 3
  },
  row5: {
    prospect: 2,
    rival: 2,
    elite: 10,
    master: 8
  },
  row6: {
    prospect: 7,
    rival: 3,
    elite: 2,
    master: 10
  },
  row7: {
    prospect: 6,
    rival: 9,
    elite: 6,
    master: 1
  },
  row8: {
    prospect: 8,
    rival: 6,
    elite: 4,
    master: 4
  },
  row9: {
    prospect: 9,
    rival: 5,
    elite: 3,
    master: 5
  },
  row10: {
    prospect: 10,
    rival: 4,
    elite: 1,
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
    </div>

    <div className="absolute left-[14%] right-[12%] top-[180px] flex flex-col gap-2">
      <AlternatingFranchiseRows />
    </div>


    <div className="absolute bottom-10 left-10">
      <RscBannerLogo className="text-rsc-red w-[120px] h-[180px]" />
    </div>

    {/*@ts-ignore*/}
    <div className="text-rsc-master text-rsc-elite text-rsc-rival text-rsc-prospect" />
  </div>
}


const getAlphabetLetterFromRowNumber = (rowNumber: number)  => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return alphabet[rowNumber] || "N/A";
}

const AlternatingFranchiseRows = () => {
  // const [pickedRows, setPickedRows] = useState<RowPicks>();
  //
  // useEffect(() => {
  //   const messageRef = ref(db, "broadcast/message");
  //   const unsubscribe = onValue(messageRef, (snapshot) => {
  //     const data = snapshot.val();
  //     setMessage(data || "");
  //   });
  //
  //   return () => unsubscribe();
  // }, []);

  return <>
    {Object.entries(rowRules).map(([key, rowValues], index) => {
      const isReversed = index % 2 !== 0;
      return <div className={cn("flex gap-2 min-h-[40px]", isReversed && "flex-row-reverse")} key={key}>
        <div className="relative flex items-center border-rsc-blue border rounded-l-2xl">
          <FranchiseRowHexagon className={cn("absolute -top-2 bottom-0 text-rsc-blue", isReversed ? "-right-12":"-left-6")} />

          <span className={cn("absolute top-4 text-3xl font-bold flex items-center justify-center", isReversed ? "-right-5":"-left-5", index === 8 && "left-9", index === 9 && "right-8")}>{getAlphabetLetterFromRowNumber(index)}</span>

          <div className={cn("", isReversed ? "pr-20":"pl-20")}>
            <img className="w-12" src="/Franchise%20Logos/Monarch Realm.png" alt="#"/>
          </div>
        </div>

        {Object.entries(rowValues).map(([rowKey, tierValues], index) => {
          const tierClass = `text-rsc-${rowKey} `;
          return <div className={cn("relative flex gap-2", isReversed && "flex-row-reverse")} key={rowKey+key}>
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
