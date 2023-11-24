// Custom components
import React, { InputHTMLAttributes } from "react";

function InputField(props: InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  extra: string;
  placeholder: string;
  variant: string;
  state?: boolean;
  disabled?: boolean;

  type?: string;
  onClick?: (e: any) => void;

}) {
  const { label, id, extra, type, placeholder, variant, state, disabled, onClick, ...inputProps } =
    props;
  return (
    <div className={`${extra}`}>
      <label
        htmlFor={id}
        className={`text-sm text-navy-700 dark:text-white ${variant === "auth" ? "ml-1.5 font-medium" : "ml-3 font-bold"
          }`}
      >
        {label}
      </label>
      <input
        disabled={disabled}
        type={type}
        id={id}
        placeholder={placeholder}
        onClick={onClick}
        {...inputProps}
        className={`mt-2 flex h-14 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none ${disabled === true
          ? "!border-none !bg-gray-100 dark:!bg-white/5 dark:placeholder:!text-[rgba(255,255,255,0.15)]"
          : state === false
            ? "border-red-500 dark:!border-red-400 " :
            "border-gray-200 dark:!border-white/10 dark:text-white  dark:bg-gray-800 dark:border-gray-600 dark:border-none"
          }`}
      />
    </div>
  );
}

export default InputField;
