/* eslint-disable */

import { HiX } from "react-icons/hi";
import Links from "./components/Links";


import routes from "routes";
import { FiAlignJustify } from "react-icons/fi";

const Sidebar = (props: {
  open: boolean;
  onClose: React.MouseEventHandler<HTMLSpanElement>;
}) => {
  const { open, onClose } = props;
  return (
    <div
      className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-all dark:!bg-navy-800 dark:text-white md:!z-50 lg:!z-50 xl:!z-0 ${open ? "translate-x-0" : "-translate-x-96"
        } w-79`}
    >
      {/*       <span className="self-end mt-3 mx-2"
        onClick={onClose}
      >
        <FiAlignJustify className="h-8 w-8" />
      </span> */}
      <span
        className="absolute top-4 right-4 block cursor-pointer xl:hidden"
        onClick={onClose}
      >
        <HiX />
      </span>

      <div className={`mx-[56px] mt-[50px] mb-[50px] flex items-center`}>
        <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700 dark:text-white">
          JADAL <span className="font-medium ">XYZ</span>
        </div>
      </div>
      <div className="mt-[58px] mb-7 h-px bg-gray-300 dark:bg-white/30" />
      {/* Nav item */}

      <ul className="mb-auto pt-1">
        <Links routes={routes.slice(0, 1)} />
      </ul>
    </div>
  );
};

export default Sidebar;
