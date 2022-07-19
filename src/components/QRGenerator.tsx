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
import createQRImage from "./QRCode";
import { QRCodeRenderersOptions } from "qrcode";

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
      boxSizing: "border-box",
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
      marginBottom: 3,
      fontSize: 9,
    },
    break: {
      width: "100%",
      height: "5em",
      backgroundColor: "#333",
    },
  });

type BasicDocumentProps = {
  title: string;
  qrCodes: string[];
  qrOptions: QRCodeRenderersOptions;
};

// Create Document Component
export default function BasicDocument({
  title,
  qrCodes,
  qrOptions,
}: BasicDocumentProps) {
  const [styles, setStyles] = useState(createStyles());
  const [qrImages, setQRImages] =
    useState<Awaited<ReturnType<typeof createQRImage>>[]>();

  useLayoutEffect(() => {
    window.onresize = () => {
      setStyles(createStyles());
    };

    return () => {
      window.onchange = null;
    };
  }, []);

  useEffect(() => {
    (async function createQRCodes() {
      const imageCodes = await Promise.all(
        qrCodes.map((code) => {
          return createQRImage(code, qrOptions);
        })
      );

      setQRImages(imageCodes);
    })();
  }, [qrCodes, qrOptions]);

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
              const code = qrCodes[index];
              if (!image) return null;
              else
                return (
                  <View style={styles.image} key={code}>
                    <Image
                      src={image}
                      style={{
                        width: qrOptions.width,
                      }}
                    />
                    <Text style={styles.caption}>{code}</Text>
                    <View style={styles.break} />
                  </View>
                );
            })}
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
