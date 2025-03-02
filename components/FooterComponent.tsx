import React from "react";
import { Button } from "./ui/button";

interface FooterComponentProps {
  text: string;
  buttonOne: string;
  buttonTwo: string;
}

const FooterComponent = ({
  text,
  buttonOne,
  buttonTwo,
}: FooterComponentProps) => {
  return (
    <div className="bg-light-light-gray dark:bg-dark-background mt-2 p-4 flex items-center justify-between">
      <span className="text-sm font-semibold">{text}</span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="border-purple-600 text-purple-600 hover:bg-purple-700 hover:text-white rounded-xl"
        >
          {buttonOne}
        </Button>

        <Button className="bg-purple-700 text-white hover:bg-purple-800 rounded-xl">
          {buttonTwo}
        </Button>
      </div>
    </div>
  );
};

export default FooterComponent;
