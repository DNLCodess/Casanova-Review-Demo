// components/Loader.js
import React from "react";
import Image from "next/image";

const Loader = ({ loaderImage }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <Image
        src={loaderImage}
        alt="Loading..."
        className="animate-spin w-20 h-20"
      />
    </div>
  );
};

export default Loader;
