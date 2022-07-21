import { LegacyRef } from "react";

type Falsy = false | 0 | "" | null | undefined;

export type InputFieldProps<T = JSX.IntrinsicElements["input"]> = Pick<
  JSX.IntrinsicElements["input"],
  | "type"
  | "name"
  | "value"
  | "onChange"
  | "onBlur"
  | "onFocus"
  | "required"
  | "aria-describedby"
  | "className"
> & {
  innerRef?: LegacyRef<HTMLInputElement>;
  validator: (config: T) => string | Falsy;
  inputClassName: T;
  label?: string;
  uppercase?: true;
};
