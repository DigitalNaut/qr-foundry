import type { Style } from "@react-pdf/types/style";
import ReactPDF from "@react-pdf/renderer";
import { QRCodeRenderersOptions } from "qrcode";

export type BasicDocumentProps = {
  title: string;
  qrCodes: string[];
  qrOptions: QRCodeRenderersOptions;
  styles: Record<string, Style>;
  pageProps?: ReactPDF.PageProps;
};
