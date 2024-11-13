import React from "react";
import "../styles/globals.css";

export const metadata = {
  title: "Casanova",
  logo: "../public/assests/primay-logo.png", // Add the logo path here
};

const Rootlayout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <link rel="icon" href={metadata.logo} />
      </head>
      <body>
        <div className="main">
          <div className="gradient" />
        </div>

        <main className="app">
          {children} {/* This renders the passed children */}
        </main>
      </body>
    </html>
  );
};

export default Rootlayout;
