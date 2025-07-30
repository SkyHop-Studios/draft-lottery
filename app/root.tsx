import React from "react";
import {Outlet} from "react-router";
import "/app/app.css"

export default function Root() {
  return (
    <div className="min-h-screen bg-black text-white font-apotek">
      <Outlet/>
    </div>
  );
}