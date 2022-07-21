// Source: https://blog.logrocket.com/generating-pdfs-react/

import {
  Document,
  Page,
  Text,
  View,
  Image,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";

import createQRImage from "./QRCodeCreator";
import { BasicDocumentProps } from "./QRGenerator.types";

// Create Document Component
export default function QRDocument({
  title,
  qrCodes,
  qrOptions,
  styles,
  pageProps,
}: BasicDocumentProps) {
  const [qrImages, setQRImages] =
    useState<Awaited<ReturnType<typeof createQRImage>>[]>();

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
    <Document>
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
  );
}
