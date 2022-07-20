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
> & {
  innerRef?: LegacyRef<HTMLInputElement>;
  validator: (config: T) => string | Falsy;
  config: T;
  label?: string;
  uppercase?: true;
};
