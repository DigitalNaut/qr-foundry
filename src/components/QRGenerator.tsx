// Source: https://blog.logrocket.com/generating-pdfs-react/

import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useEffect, useLayoutEffect, useState } from "react";
import type { Style } from "@react-pdf/types/style";
import CreateQRImage from "./QRCode";

const vw = () =>
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const vh = () =>
  Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// Create styles
const createStyles: () => Record<string, Style> = () =>
  StyleSheet.create({
    viewer: {
      width: vw(), //the pdf viewer will take up all of the width and height
      height: vh(),
    },
    page: {
      marginTop: 10,
      color: "#333",
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      alignItems: "center",
    },
    section: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
    },
    image: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    caption: {
      fontSize: 9,
    },
  });

type BasicDocumentProps = {
  title: string;
  qrCodeSize: number;
  qrCodes: string[];
};

// Create Document Component
export default function BasicDocument({
  title,
  qrCodeSize,
  qrCodes,
}: BasicDocumentProps) {
  const [styles, setStyles] = useState(createStyles());
  const [qrImages, setQRImages] = useState<string[]>();

  useLayoutEffect(() => {
    window.onresize = () => {
      setStyles(createStyles());
    };

    return () => {
      window.onchange = null;
    };
  }, []);

  useEffect(() => {
    (async function createQRCode() {
      const imageCodes = await Promise.all(
        qrCodes.map((code) => {
          return CreateQRImage(code, qrCodeSize);
        })
      );

      setQRImages(imageCodes);
    })();
  }, [qrCodes, qrCodeSize]);

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>{title}</Text>
          </View>
          <View style={styles.section}>
            {qrImages?.map((image, index) => {
              return (
                <View style={styles.image}>
                  <Image
                    src={image}
                    style={{
                      width: qrCodeSize,
                    }}
                  />
                  <Text style={styles.caption}>{qrCodes[index]}</Text>
                </View>
              );
            })}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
