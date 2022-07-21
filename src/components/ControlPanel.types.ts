import ReactPDF from "@react-pdf/renderer";
import { DocumentOptions } from "App.types";
import { QRCodeRenderersOptions } from "qrcode";
import { ChangeEvent } from "react";

export type PermittedEntries =
  | "documentTitle"
  | "filename"
  | "imageNumber"
  | "light"
  | "dark"
  | keyof Pick<ReactPDF.PageProps, "size" | "orientation">
  | keyof Omit<
      QRCodeRenderersOptions,
      "color" | "version" | "toSJISFunc" | "errorCorrectionLevel"
    >;

export type ConfigListType = {
  [key in PermittedEntries]: JSX.IntrinsicElements["input"];
};

export type ControlPanelProps = {
  qrOptions: QRCodeRenderersOptions;
  setQrOptions: (options: QRCodeRenderersOptions) => void;
  documentOptions: DocumentOptions;
  setDocumentOptions: (options: DocumentOptions) => void;
  pageOptions: ReactPDF.PageProps;
  setPageOptions: (options: ReactPDF.PageProps) => void;
};

export type SupportedElements = HTMLInputElement | HTMLSelectElement;
export type OnChangeEvent = ChangeEvent<SupportedElements>;
