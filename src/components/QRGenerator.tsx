// Source: https://blog.logrocket.com/generating-pdfs-react/

import {
  Document,
  Page,
  Text,
  View,
  Image,
  PDFViewer,
} from "@react-pdf/renderer";
import { useEffect, useLayoutEffect, useState } from "react";
import { createStyles } from "theme/styles";

import createQRImage from "./QRCodeCreator";
import { BasicDocumentProps } from "./QRGenerator.types";

// Create Document Component
export default function BasicDocument({
  title,
  qrCodes,
  qrOptions,
  pageOptions: pageProps,
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
        <Page {...pageProps} style={styles.page}>
          <View style={styles.section}>
            <Text style={styles.header}>{title}</Text>
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
