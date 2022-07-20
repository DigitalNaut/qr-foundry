import { useState } from "react";
import { formInputStyles } from "theme/styles";

import { InputFieldProps } from "./InputField.types";

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
        <label htmlFor={name} className={formInputStyles.label}>
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
          className={`${formInputStyles.input} ${
            required ? formInputStyles.required : "false"
          } ${className}`}
        />
        {
          <div className={`${formInputStyles.error} empty:hidden`} id={descriptionLabel}>
            {error}
          </div>
        }
      </div>
    </div>
  );
}
