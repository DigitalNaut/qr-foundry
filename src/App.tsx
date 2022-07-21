import { useEffect, useState } from "react";
import { QRCodeRenderersOptions } from "qrcode";
import ReactPDF from "@react-pdf/renderer";
import cuid from "cuid";

import "App.css";
import colors from "theme/colors.module.css";
import QRGenerator from "components/QRGenerator";
import ControlPanel from "components/ControlPanel";
import { DocumentOptions } from "App.types";
import PDFDisplay from "components/DeviceDetector";
import { createStyles } from "theme/styles";

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
  filename: "qr-code-foundry.pdf",
};

const defaultQRCodeOptions: QRCodeRenderersOptions = {
  width: 128,
  margin: 4,
  errorCorrectionLevel: "M",
  scale: 128 / 100,
  color: {
    dark: colors.slate800,
    light: colors.white,
  },
};

function App() {
  const [styles] = useState(createStyles());
  const [codes, setCodes] = useState<string[]>([]);

  const [qrOptions, setQrOptions] = useState(defaultQRCodeOptions);
  const [pageOptions, setPageOptions] = useState(defaultPageOptions);
  const [documentOptions, setDocumentOptions] = useState(
    defaultDocumentOptions
  );

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
      <PDFDisplay
        styles={styles}
        filename={documentOptions.filename}
        document={
          <QRGenerator
            title={documentOptions.documentTitle}
            qrOptions={qrOptions}
            qrCodes={codes}
            pageProps={pageOptions}
            styles={styles}
          />
        }
      />
    </div>
  );
}

export default App;
