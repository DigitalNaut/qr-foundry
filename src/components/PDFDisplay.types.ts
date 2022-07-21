import ReactPDF from "@react-pdf/renderer";
import { ReactNode } from "react";
import type * as rdd from "react-device-detect";

export type DeviceProps = {
  children: (props: typeof rdd) => ReactNode;
};
export type DeviceDetectorProps = {
  document: ReactPDF.PDFDownloadLinkProps["document"];
  styles: any;
  filename: string;
};
