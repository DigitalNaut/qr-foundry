import { useState } from "react";
import { formInputStyles } from "theme/computedStyles";

import { InputFieldProps } from "./InputField.types";

export default function InputField({
  label,
  name,
  type,
  validator,
  innerRef,
  required,
  inputClassName: config,
  value,
  className,
  onChange,
}: InputFieldProps) {
  const [error] = useState(validator(config));

  // Prep work for the input field
  const descriptionLabel = `${name}-error`;
  const { className: configClassName, ...props } = config;

  return (
    <div className={`flex flex-col mt-1 gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className={formInputStyles.label}>
          {label}
        </label>
      )}
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
        className={`${formInputStyles.input} ${
          required ? formInputStyles.required : "false"
        } ${configClassName}`}
      />
      {
        <div
          className={`${formInputStyles.error} empty:hidden`}
          id={descriptionLabel}
        >
          {error}
        </div>
      }
    </div>
  );
}
