import { useEffect, useState } from "react";
import { QRCodeRenderersOptions } from "qrcode";
import ReactPDF from "@react-pdf/renderer";
import cuid from "cuid";

import "App.css";
import colors from "theme/colors.module.css";
import QRGenerator from "components/QRGenerator";
import ControlPanel from "components/ControlPanel";

export type DocumentOptions = {
  imageCount: number;
  documentTitle: string;
};

const defaultPageOptions: ReactPDF.PageProps = {
  size: "A4",
  orientation: "portrait",
  style: {
    margin: 0,
    padding: 0,
  },
};

const defaultDocumentOptions: DocumentOptions = {
  documentTitle: "QR Code Foundry",
  imageCount: 10,
};

const defaultQRCodeOptions: QRCodeRenderersOptions = {
  width: 128,
  margin: 4,
  errorCorrectionLevel: "M",
  scale: 128 / 100,
  color: {
    dark: colors.gray800,
    light: colors.white,
  },
};

function App() {
  const [codes, setCodes] = useState<string[]>([]);

  const [qrOptions, setQrOptions] = useState(defaultQRCodeOptions);
  const [pageOptions, setPageOptions] = useState(defaultPageOptions);
  const [documentOptions, setDocumentOptions] = useState(defaultDocumentOptions);

  useEffect(() => {
    const generatedCodes = [];
    for (let i = 0; i < documentOptions.imageCount; i++)
      generatedCodes.push(cuid());
    setCodes(generatedCodes);
  }, [documentOptions.imageCount]);

  return (
    <div className="flex flex-col sm:flex-row">
      <ControlPanel
        qrOptions={qrOptions}
        setQrOptions={setQrOptions}
        documentOptions={documentOptions}
        setDocumentOptions={setDocumentOptions}
        pageOptions={pageOptions}
        setPageOptions={setPageOptions}
      />
      <QRGenerator
        title={documentOptions.documentTitle}
        qrOptions={qrOptions}
        qrCodes={codes}
        pageOptions={pageOptions}
      />
    </div>
  );
}

export default App;
