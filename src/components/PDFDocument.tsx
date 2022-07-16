import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";
import { useLayoutEffect, useState } from "react";

const vw = () =>
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
const vh = () =>
  Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);

// Create styles
const createStyles = () =>
  StyleSheet.create({
    page: {
      backgroundColor: "white",
      color: "#333",
    },
    section: {
      margin: 10,
      padding: 10,
    },
    viewer: {
      width: vw(), //the pdf viewer will take up all of the width and height
      height: vh(),
    },
  });

// Create Document Component
function BasicDocument() {
  const [styles, setStyles] = useState(createStyles());

  useLayoutEffect(() => {
    console.log("useLayoutEffect");

    window.onresize = () => {
      console.log("document.onchange");
      setStyles(createStyles());
    };

    return () => {
      console.log("cleanup");
      window.onchange = null;
    };
  }, []);

  return (
    <PDFViewer style={styles.viewer}>
      {/* Start of the document*/}
      <Document>
        {/*render a single page*/}
        <Page size="A4" style={styles.page}>
          <View style={styles.section}>
            <Text>Hello, world!</Text>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}
export default BasicDocument;
