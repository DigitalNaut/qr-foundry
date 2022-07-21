import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { formInputStyles } from "theme/styles";
import * as rdd from "react-device-detect";
import { DeviceDetectorProps, DeviceProps } from "./DeviceDetector.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFileDownload,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";

export function DeviceDetector(props: DeviceProps) {
  return <>{props.children(rdd)}</>;
}

export default function PDFDisplay({
  document,
  styles,
  filename,
}: DeviceDetectorProps) {
  return (
    <DeviceDetector>
      {({ isMobile }) => {
        if (isMobile) {
          return (
            <PDFDownloadLink
              document={document} //deas={deas} />}
              fileName={filename}
            >
              {
                ({ loading }) =>
                  loading ? (
                    <div className="p-4 text-center">
                      <FontAwesomeIcon
                        icon={faSpinner}
                        className="w-4 fa fa-pulse"
                      />{" "}
                      Generando PDF...
                    </div>
                  ) : (
                    <div
                      className={`${formInputStyles.primaryButton} flex flex-col p-6`}
                    >
                      <span className="text-xl">
                        <FontAwesomeIcon icon={faDownload} />
                        &nbsp;Descargar PDF
                      </span>
                      <span className="text-blue-300">
                        <FontAwesomeIcon icon={faFileDownload} />
                        &nbsp;{filename}
                      </span>
                    </div>
                  ) // <ModalPDFGenerated />
              }
            </PDFDownloadLink>
          );
        }
        return <PDFViewer style={styles.viewer}>{document}</PDFViewer>;
      }}
    </DeviceDetector>
  );
}
