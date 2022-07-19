import cuid from "cuid";
import { useEffect, useState } from "react";

import "App.css";
import QRGenerator from "components/QRGenerator";
import ControlPanel from "components/ControlPanel";
import { QRCodeRenderersOptions } from "qrcode";

export type PageOptions = {
  imageCount: number;
  documentTitle: string;
};

function App() {
  const [codes, setCodes] = useState<string[]>([]);

  const defaultPageOptions = {
    documentTitle: "Hello, world!",
    imageCount: 10,
  };
  const defaultOptions: QRCodeRenderersOptions = {
    width: 128,
    margin: 4,
    errorCorrectionLevel: "H",
    scale: 128 / 100,
    color: {
      dark: "#333333",
      light: "#ffffff",
    },
  };
  const [qrOptions, setQrOptions] = useState(defaultOptions);
  const [pageOptions, setPageOptions] = useState(defaultPageOptions);

  const reset = () => setQrOptions(defaultOptions);
  useEffect(() => {
    const generatedCodes = [];
    for (let i = 0; i < pageOptions.imageCount; i++)
      generatedCodes.push(cuid());
    setCodes(generatedCodes);
  }, [pageOptions.imageCount]);

  return (
    <div className="App">
      <ControlPanel
        qrOptions={qrOptions}
        setQrOptions={setQrOptions}
        pageOptions={pageOptions}
        setPageOptions={setPageOptions}
        reset={reset}
      />
      <QRGenerator
        title={pageOptions.documentTitle}
        qrOptions={qrOptions}
        qrCodes={codes}
      />
    </div>
  );
}

export default App;
