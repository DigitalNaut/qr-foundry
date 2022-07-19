import {
  ChangeEvent,
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { QRCodeRenderersOptions } from "qrcode";

import { PageOptions } from "App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

type ControlPanelProps = {
  qrOptions: QRCodeRenderersOptions;
  setQrOptions: (options: QRCodeRenderersOptions) => void;
  pageOptions: PageOptions;
  setPageOptions: (options: PageOptions) => void;
  reset: () => void;
};

type SupportedElements = HTMLInputElement | HTMLSelectElement;
type SupportedChangeEvent = ChangeEvent<SupportedElements>;

function handleChange(
  event: SupportedChangeEvent,
  setObj: Dispatch<SetStateAction<any>>
) {
  const { id, value } = event.target;
  setObj((prevObj: any) => ({ ...prevObj, [id]: value }));
}

export default function ControlPanel({
  qrOptions,
  pageOptions,
  setQrOptions,
  setPageOptions,
  reset,
}: PropsWithChildren<ControlPanelProps>) {
  const [loading, setLoading] = useState(false);
  const [internalPageOptions, setInternalPageOptions] = useState<PageOptions>({
    ...pageOptions,
  });
  const [internalQrOptions, setInternalQrOptions] =
    useState<QRCodeRenderersOptions>({ ...qrOptions });

  const handleChangePageOptions = useCallback(
    (event: SupportedChangeEvent) =>
      handleChange(event, setInternalPageOptions),
    []
  );
  const handleChangeQrOptions = useCallback(
    (event: SupportedChangeEvent) => handleChange(event, setInternalQrOptions),
    []
  );

  const handleColorChange =
    (color: "light" | "dark") => (event: ChangeEvent<HTMLInputElement>) =>
      setInternalQrOptions({
        ...internalQrOptions,
        color: { ...internalQrOptions.color, [color]: event.target.value },
      });

  useEffect(() => {
    function updateDocument() {
      setQrOptions(internalQrOptions);
      setPageOptions(internalPageOptions);
      setLoading(false);
    }
    const timer = setTimeout(updateDocument, 2000);
    setLoading(true);

    return () => {
      clearTimeout(timer);
    };
  }, [internalPageOptions, internalQrOptions, setPageOptions, setQrOptions]);

  return (
    <div className="Panel">
      <h2>Opciones</h2>
      <div className="Options">
        <h3>Página</h3>
        <label htmlFor="documentTitle">
          Título del documento
          <input
            id="documentTitle"
            type="text"
            value={internalPageOptions.documentTitle}
            onChange={handleChangePageOptions}
          />
        </label>
        <label htmlFor="imageCount">
          Número de códigos
          <input
            id="imageCount"
            type="number"
            value={internalPageOptions.imageCount}
            onChange={handleChangePageOptions}
          />
        </label>
      </div>
      <div className="Options">
        <h3>Código QR</h3>
        <label htmlFor="width">
          Ancho (px)
          <input
            id="width"
            type="number"
            value={internalQrOptions.width}
            onChange={handleChangeQrOptions}
          />
        </label>
        <label htmlFor="margin">
          Margen (px)
          <input
            id="margin"
            type="number"
            value={internalQrOptions.margin}
            onChange={handleChangeQrOptions}
          />
        </label>
        <label htmlFor="scale">
          Escala (px/100 por cuadro)
          <input
            id="scale"
            type="number"
            value={internalQrOptions.scale}
            onChange={handleChangeQrOptions}
          />
        </label>
        <fieldset>
          <legend>Colores</legend>
          <label htmlFor="dark">
            Texto
            <input
              id="dark"
              type="color"
              value={internalQrOptions.color?.dark}
              onChange={handleColorChange("dark")}
            />
            {internalQrOptions.color?.dark}
          </label>
          <label htmlFor="light">
            Fondo
            <input
              id="light"
              type="color"
              value={internalQrOptions.color?.light}
              onChange={handleColorChange("light")}
            />
            {internalQrOptions.color?.light}
          </label>
        </fieldset>
        <label htmlFor="errorCorrectionLevel">
          Nivel de error
          <select
            id="errorCorrectionLevel"
            value={internalQrOptions.errorCorrectionLevel}
            onChange={handleChangeQrOptions}
          >
            <option value="L">L</option>
            <option value="M">M</option>
            <option value="Q">Q</option>
            <option value="H">H</option>
          </select>
        </label>
        <button onClick={reset}>Reset</button>
      </div>
      {loading && (
        <div>
          <FontAwesomeIcon icon={faSpinner} className="fa fa-pulse" />
          &nbsp; Esperando...
        </div>
      )}
    </div>
  );
}
