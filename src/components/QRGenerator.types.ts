import ReactPDF from "@react-pdf/renderer";
import { QRCodeRenderersOptions } from "qrcode";

export type BasicDocumentProps = {
  title: string;
  qrCodes: string[];
  qrOptions: QRCodeRenderersOptions;
  pageOptions?: ReactPDF.PageProps;
};
