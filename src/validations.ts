export const numberExp = /^[0-9.]+$/.source;
export const stringExp = /^[a-zA-Z0-9\s!@#$%^&?(),.]+$/.source;
export const colorExp = /^#[0-9a-fA-F]{6}$/.source;

export const numberValidator = (config: JSX.IntrinsicElements["input"]) => {
  const { value } = config;
  if (config.type !== "number") return "";

  const num = Number(value);
  if (Number.isNaN(num)) return "Must be a number";
  if ((config.min && num < config.min) || (config.max && num > config.max))
    return `Must be between ${config.min} and ${config.max}`;

  return "";
};

export const stringValidator = (config: JSX.IntrinsicElements["input"]) => {
  const { value } = config;
  if (config.type !== "text") return "";
  if (!value) return "";

  const valueString = value?.toString();
  if (config.minLength && valueString.length < config.minLength)
    return `Must be at least ${config.minLength} characters`;
  if (config.pattern && !valueString.match(config.pattern))
    return `Must match pattern ${config.pattern}`;

  return "";
};

export const colorValidator = (config: JSX.IntrinsicElements["input"]) => {
  const { value } = config;
  if (config.type !== "color") return "";
  if (!value) return "";

  const valueString = value?.toString();
  if (valueString.length !== 7) return "Must be a valid color";

  return "";
};
