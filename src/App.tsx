import cuid from "cuid";
import { useEffect, useState } from "react";
import "./App.css";
import QRGenerator from "./components/QRGenerator";

const imageSize = 128;
const imageCount = 300;

function App() {
  const [codes, setCodes] = useState<string[]>([]);

  useEffect(() => {
    let count = 0;
    const generatedCodes = [];
    while (count < imageCount) {
      generatedCodes.push(cuid());
      count++;
    }
    setCodes(generatedCodes);
  }, []);

  return (
    <QRGenerator title="Hello, world!" qrCodeSize={imageSize} qrCodes={codes} />
  );
}

export default App;
