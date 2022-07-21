// ReactPDF viewer doesn't support mobile, so we need to provide a fallback
// with a download link to the PDF.
// Source: https://github.com/diegomura/react-pdf/issues/714

import { PDFViewer, usePDF } from "@react-pdf/renderer";
import { formInputStyles } from "theme/computedStyles";
import * as rdd from "react-device-detect";
import { DeviceDetectorProps, DeviceProps } from "./PDFDisplay.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faFileDownload,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

export function DeviceDetector(props: DeviceProps) {
  return <>{props.children(rdd)}</>;
}

export default function PDFDisplay({
  document,
  styles,
  filename,
}: DeviceDetectorProps) {
  const [{ error, loading, url }] = usePDF({ document });

  if (loading)
    return (
      <div className="p-4 text-center">
        <FontAwesomeIcon icon={faSpinner} className="w-4 fa fa-pulse" />
        Generando el PDF...
      </div>
    );

  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        <FontAwesomeIcon icon={faFileDownload} className="w-4" />
        Error al generar el PDF.
      </div>
    );

  return (
    <DeviceDetector>
      {({ isMobile }) => {
        if (isMobile) {
          return (
            <a href={url || undefined} download={`${filename}.pdf`}>
              <div
                className={`${
                  url
                    ? formInputStyles.primaryButton
                    : formInputStyles.disabledButton
                } flex flex-col p-6`}
              >
                {url ? (
                  <span className="text-xl">
                    <FontAwesomeIcon icon={faDownload} />
                    &nbsp;Descargar el PDF
                  </span>
                ) : (
                  <span className="text-xl">
                    <FontAwesomeIcon icon={faTimes} />
                    PDF no disponible
                  </span>
                )}
                <span className={url ? "text-blue-300" : ""}>
                  <FontAwesomeIcon icon={faFileDownload} />
                  &nbsp;{filename}
                </span>
              </div>
            </a>
          );
        }
        return <PDFViewer style={styles.viewer}>{document}</PDFViewer>;
      }}
    </DeviceDetector>
  );
}
