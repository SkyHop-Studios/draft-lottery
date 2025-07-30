import React from "react";
import {Outlet} from "react-router";
import "/app/app.css"

export default function Root() {
  return <div>
    <head>
      <link rel="stylesheet" href="https://draft-lottery-five.vercel.app/assets/root-CkRgct3r.css"/>
    </head>
    <div className="min-h-screen bg-black text-white font-apotek">
      <Outlet/>
    </div>
  </div>
}