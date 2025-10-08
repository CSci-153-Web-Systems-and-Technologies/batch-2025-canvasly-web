import React, { type MouseEventHandler } from "react";
import { Button } from "./ui/button";

const Hamburger = ({
  onClickHandler,
}: {
  onClickHandler: MouseEventHandler;
}) => {
  return (
    <Button
      onClick={onClickHandler}
      className="bg-color-background rounded-4xl p-2 hover:bg-[#D6D6D6]"
    >
      <div className="flex flex-col gap-[3px]">
        <div className="h-[3px] w-5 bg-black"></div>
        <div className="h-[3px] w-5 bg-black"></div>
        <div className="h-[3px] w-5 bg-black"></div>
      </div>
    </Button>
  );
};

export default Hamburger;
