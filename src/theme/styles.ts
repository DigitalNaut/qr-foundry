import type { Style } from "@react-pdf/types/style";
import { StyleSheet } from "@react-pdf/renderer";
import colors from "theme/colors.module.css";

const h1style = "text-blue-600 font-bold text-2xl text-center";
const h2style = "text-slate-500 font-bold text-lg";
const h3style = "text-blue-600 font-bold";

export const headerStyles = {
  h1: h1style,
  h2: h2style,
  h3: h3style,
};

const sectionStyle = "flex flex-col gap-2";
const colorPickerInputStyle = "w-full h-10";
const colorPickerFieldStyle = "uppercase";
const fieldsetStyle = "flex border border-solid border-slate-300 p-3 gap-2";
const fieldsetLegendStyle = "text-slate-500";
const baseButtonStyle = "w-full text-white text-center p-2";
const primaryButtonStyle = `${baseButtonStyle} bg-blue-500`;
const secondaryButtonStyle = `${baseButtonStyle} bg-slate-400`;
const selectInputStyle = "w-full p-2 rounded-sm bg-slate-200";

const labelStyle = "block text-sm font-medium text-slate-700";
const inputStyle = "w-full roundedpx-2 py-1 bg-slate-200";
const requiredStyle = "border border-slate-500";
const errorStyle = "pt-1 text-red-700";

export const formInputStyles = {
  section: sectionStyle,
  colorPickerInput: colorPickerInputStyle,
  colorPickerLabel: colorPickerFieldStyle,
  fieldset: fieldsetStyle,
  fieldsetLegend: fieldsetLegendStyle,
  baseButton: baseButtonStyle,
  primaryButton: primaryButtonStyle,
  secondaryButton: secondaryButtonStyle,
  select: selectInputStyle,
  label: labelStyle,
  input: inputStyle,
  required: requiredStyle,
  error: errorStyle,
};

// Create styles
export const createStyles: () => Record<string, Style> = () =>
  StyleSheet.create({
    viewer: {
      width: "100vw",
      height: "100vh",
      boxSizing: "border-box",
    },
    page: {
      marginTop: 10,
      color: colors.late400,
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      justifyItems: "center",
      alignItems: "center",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
    header: {
      width: "100%",
      textAlign: "center",
    },
    image: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    caption: {
      width: "100%",
      color: colors.slate400,
      marginBottom: 3,
      fontSize: 9,
    },
  });
