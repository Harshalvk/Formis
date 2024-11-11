import React from "react";

type Props = {
  value: number;
};

const ProgressBar = ({ value }: Props) => {
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-500 rounded-full h-2">
      <div
        className="bg-primary h-2 rounded-md"
        style={{ width: `${value}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
