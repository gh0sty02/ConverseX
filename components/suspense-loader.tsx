import { Loader2 } from "lucide-react";
import React from "react";

const SuspenseLoader = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center">
        <Loader2 className="w-20 h-20 text-indigo-500 dark:text-indigo-400 animate-spin" />
        <p className="text-black dark:text-white font-bold text-center">
          Loading, Please Wait...
        </p>
      </div>
    </div>
  );
};

export default SuspenseLoader;
