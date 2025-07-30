import React from "react";
import {Links, Meta, Outlet} from "react-router";
import "/app/app.css"

export default function Root() {
  return <html>
    <head>
      <Links />
      <Meta />
    </head>
    <body>
      <div className="min-h-screen text-white font-apotek">
        <Outlet/>
      </div>
    </body>
  </html>
}