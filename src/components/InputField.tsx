import { LegacyRef, useState } from "react";

export const labelStyle = "block text-sm font-medium text-slate-700";
const inputStyle = "w-full roundedpx-2 py-1 bg-slate-200";
const requiredStyle = "border border-slate-500";
const errorStyle = "pt-1 text-red-700";

export const formInputStyles = {
  labelStyle,
  inputStyle,
  requiredStyle,
  errorStyle,
};

type Falsy = false | 0 | "" | null | undefined;

type InputFieldProps<T = JSX.IntrinsicElements["input"]> = Pick<
  JSX.IntrinsicElements["input"],
  | "type"
  | "name"
  | "value"
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "required"
  | "aria-describedby"
> & {
  innerRef?: LegacyRef<HTMLInputElement>;
  validator: (config: T) => string | Falsy;
  config: T;
  label?: string;
  uppercase?: true;
};

export default function InputField({
  label,
  name,
  type,
  validator,
  innerRef,
  required,
  config,
  value,
  onChange,
}: InputFieldProps) {
  const [error] = useState(validator(config));

  // Prep work for the input field
  const descriptionLabel = `${name}-error`;
  const { className, ...props } = config;

  return (
    <div>
      {label && (
        <label htmlFor={name} className={labelStyle}>
          {label}
        </label>
      )}
      <div className={`mt-1`}>
        <input
          {...props}
          id={name}
          name={name}
          type={type}
          aria-invalid={!!error}
          aria-describedby={descriptionLabel}
          ref={innerRef}
          value={value}
          onChange={onChange}
          className={`${inputStyle} ${
            required ? requiredStyle : "false"
          } ${className}`}
        />
        {
          <div className={`${errorStyle} empty:hidden`} id={descriptionLabel}>
            {error}
          </div>
        }
      </div>
    </div>
  );
}
