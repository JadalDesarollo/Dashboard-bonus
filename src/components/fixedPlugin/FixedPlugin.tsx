// Chakra Imports
// Custom Icons
import React from "react";

import { RiMoonFill, RiSunFill } from "react-icons/ri";
export default function FixedPlugin(props: { [s: string]: any }) {
  const { ...rest } = props;
  const [darkmode, setDarkmode] = React.useState(
    (JSON.parse(localStorage.getItem("mode")) === "dark") ? true : false
  );
  if (JSON.parse(localStorage.getItem("mode")) == "dark") {
    console.log('es dark')
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }
  return (
    <button
      className="border-px fixed bottom-[30px] right-[35px] !z-[99] flex h-[60px] w-[60px] items-center justify-center rounded-full border-[#6a53ff] bg-gradient-to-br from-brandLinear to-blueSecondary p-0"
      onClick={() => {
        if (darkmode) {
          document.body.classList.remove("dark");
          setDarkmode(false);
          localStorage.setItem("mode", JSON.stringify('ligth'));
        } else {
          document.body.classList.add("dark");
          setDarkmode(true);
          localStorage.setItem("mode", JSON.stringify('dark'));
        }
      }}
      {...rest}
    >
      {/* // left={document.documentElement.dir === "rtl" ? "35px" : ""}
      // right={document.documentElement.dir === "rtl" ? "" : "35px"} */}
      <div className="cursor-pointer text-gray-600">
        {darkmode ? (
          <RiSunFill className="h-4 w-4 text-white" />
        ) : (
          <RiMoonFill className="h-4 w-4 text-white" />
        )}
      </div>
    </button>
  );
}
