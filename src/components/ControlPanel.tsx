import {
  ChangeEvent,
  Dispatch,
  FormEventHandler,
  PropsWithChildren,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { QRCodeRenderersOptions } from "qrcode";

import { DocumentOptions } from "App";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faSpinner } from "@fortawesome/free-solid-svg-icons";
import InputField, { labelStyle } from "./InputField";
import { colorValidator, numberValidator, stringValidator } from "validations";
import ReactPDF from "@react-pdf/renderer";

const h1style = "text-blue-600 font-bold text-2xl text-center";
const h2style = "text-slate-500 font-bold text-lg";
const h3style = "text-blue-600 font-bold";
const sectionStyle = "flex flex-col gap-2";
const colorPickerInputStyle = "w-full h-10";
const colorPickerLabelStyle = "uppercase";
const fieldsetStyle = "flex border border-solid border-slate-300 p-3 gap-2";
const fieldsetLegendStyle = "text-slate-500";
const baseButtonStyle = "w-full text-white text-center";
const primaryButtonStyle = `${baseButtonStyle} bg-blue-500`;
const secondaryButtonStyle = `${baseButtonStyle} bg-slate-400`;
const selectInputStyle = "w-full p-2 rounded-sm bg-slate-200";

const numberExp = /^[0-9.]+$/.source;
const stringExp = /^[a-zA-Z0-9\s!@#$%^&?(),.]+$/.source;
const colorExp = /^#[0-9a-fA-F]{6}$/.source;

const defaultValues = {
  standardDelay: 2000,
};

type PermittedEntries =
  | "documentTitle"
  | "imageNumber"
  | "light"
  | "dark"
  | keyof Pick<ReactPDF.PageProps, "size" | "orientation">
  | keyof Omit<
      QRCodeRenderersOptions,
      "color" | "version" | "toSJISFunc" | "errorCorrectionLevel"
    >;

type ConfigListType = {
  [key in PermittedEntries]: JSX.IntrinsicElements["input"];
};

export const inputElementsConfig: ConfigListType = {
  width: {
    value: 128,
    min: 32,
    max: 512,
    pattern: numberExp,
  },
  margin: {
    value: 16,
    min: 0,
    max: 128,
    pattern: numberExp,
  },
  documentTitle: {
    maxLength: 128,
    pattern: stringExp,
  },
  imageNumber: {
    min: 1,
    max: 999,
    pattern: numberExp,
  },
  scale: {
    min: 1,
    max: 32,
    pattern: numberExp,
  },
  dark: {
    pattern: colorExp,
    className: colorPickerLabelStyle,
  },
  light: {
    pattern: colorExp,
    className: colorPickerLabelStyle,
  },
  size: {
    value: "A4",
  },
  orientation: {
    value: "portrait",
  },
};

const pageSizes = [
  "4A0",
  "2A0",
  "A0",
  "A1",
  "A2",
  "A3",
  "A4",
  "A5",
  "A6",
  "A7",
  "A8",
  "A9",
  "A10",
  "B0",
  "B1",
  "B2",
  "B3",
  "B4",
  "B5",
  "B6",
  "B7",
  "B8",
  "B9",
  "B10",
  "C0",
  "C1",
  "C2",
  "C3",
  "C4",
  "C5",
  "C6",
  "C7",
  "C8",
  "C9",
  "C10",
  "RA0",
  "RA1",
  "RA2",
  "RA3",
  "RA4",
  "SRA0",
  "SRA1",
  "SRA2",
  "SRA3",
  "SRA4",
  "EXECUTIVE",
  "FOLIO",
  "LEGAL",
  "LETTER",
  "TABLOID",
  "ID1",
] as const;

type ControlPanelProps = {
  qrOptions: QRCodeRenderersOptions;
  setQrOptions: (options: QRCodeRenderersOptions) => void;
  documentOptions: DocumentOptions;
  setDocumentOptions: (options: DocumentOptions) => void;
  pageOptions: ReactPDF.PageProps;
  setPageOptions: (options: ReactPDF.PageProps) => void;
};

type SupportedElements = HTMLInputElement | HTMLSelectElement;
type OnChangeEvent = ChangeEvent<SupportedElements>;

function handleChange(
  event: OnChangeEvent,
  setObj: Dispatch<SetStateAction<any>>
) {
  const { id, value } = event.target;
  setObj((prevObj: any) => ({ ...prevObj, [id]: value }));
}

export default function ControlPanel({
  qrOptions,
  documentOptions,
  pageOptions,
  setQrOptions,
  setDocumentOptions,
  setPageOptions,
}: PropsWithChildren<ControlPanelProps>) {
  const [initialQrOptions] = useState({ ...qrOptions });
  const [initialPageOptions] = useState({
    ...pageOptions,
  });
  const [initialDocumentOptions] = useState({
    ...documentOptions,
  });
  const [isLoading, setLoading] = useState(false);
  const [internalDocumentOptions, setInternalDocumentOptions] =
    useState<DocumentOptions>(initialDocumentOptions);
  const [internalQrOptions, setInternalQrOptions] =
    useState<QRCodeRenderersOptions>(initialQrOptions);
  const [internalPageOptions, setInternalPageOptions] =
    useState<ReactPDF.PageProps>(initialPageOptions);

  const handleChangePageOptions = useCallback(
    (event: OnChangeEvent) => handleChange(event, setInternalPageOptions),
    []
  );
  const handleChangeDocumentOptions = useCallback(
    (event: OnChangeEvent) => handleChange(event, setInternalDocumentOptions),
    []
  );
  const handleChangeQrOptions = useCallback(
    (event: OnChangeEvent) => handleChange(event, setInternalQrOptions),
    []
  );

  const handleColorChange =
    (color: "light" | "dark") => (event: ChangeEvent<HTMLInputElement>) =>
      setInternalQrOptions({
        ...internalQrOptions,
        color: { ...internalQrOptions.color, [color]: event.target.value },
      });

  const onReset = () => {
    console.log("Reset");

    setInternalQrOptions(initialQrOptions);
    setInternalDocumentOptions(internalDocumentOptions);
  };

  const dismissNotification = () => setLoading(false);

  const updateDocument = useCallback(
    (callback: () => void) => {
      setQrOptions(internalQrOptions);
      setDocumentOptions(internalDocumentOptions);
      setPageOptions(internalPageOptions);
      callback?.();
    },
    [
      setQrOptions,
      internalQrOptions,
      setDocumentOptions,
      internalDocumentOptions,
      setPageOptions,
      internalPageOptions,
    ]
  );

  const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event?.preventDefault();
      updateDocument(() => {
        setLoading(false);
      });
    },
    [updateDocument]
  );

  useEffect(() => {
    const newCountdown = setTimeout(handleSubmit, defaultValues.standardDelay);
    setLoading(true);

    return () => {
      clearTimeout(newCountdown);
    };
  }, [handleSubmit]);

  return (
    <div className="flex flex-col w-full p-4 xl:w-fit lg:w-1/3 md:w-2/5 sm:w-1/2 sm:h-screen sm:overflow-y-auto gap-4 relative">
      <form onSubmit={handleSubmit} onReset={onReset}>
        <h1 className={h1style}>
          <FontAwesomeIcon icon={faQrcode} className="w-6" /> QR Foundry
        </h1>
        <h2 className={h2style}>Opciones</h2>
        <div className={sectionStyle}>
          <h3 className={h3style}>Documento</h3>
          <fieldset className={`${fieldsetStyle} flex flex-col`}>
            <InputField
              required
              label="Imágenes generadas"
              name="imageCount"
              type="number"
              config={inputElementsConfig.documentTitle}
              value={internalDocumentOptions.imageCount}
              onChange={handleChangeDocumentOptions}
              validator={numberValidator}
            />
            <legend className={fieldsetLegendStyle}>Propiedades</legend>
            <InputField
              label="Título"
              name="documentTitle"
              type="string"
              config={inputElementsConfig.documentTitle}
              value={internalDocumentOptions.documentTitle}
              onChange={handleChangeDocumentOptions}
              validator={stringValidator}
            />
            <label className={labelStyle} htmlFor="size">
              Tamaño de página
              <select
                id="size"
                value={internalPageOptions.size?.toString()}
                onChange={handleChangePageOptions}
                className={selectInputStyle}
              >
                {pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelStyle} htmlFor="orientation">
              Orientación de página
              <select
                id="orientation"
                value={internalPageOptions.orientation}
                onChange={handleChangePageOptions}
                className={selectInputStyle}
              >
                <option value="portrait">Retrato</option>
                <option value="landscape">Panorama</option>
              </select>
            </label>
          </fieldset>
        </div>
        <div className={sectionStyle}>
          <h3 className={h3style}>Códigos QR</h3>
          <fieldset className={`${fieldsetStyle} flex`}>
            <legend className={fieldsetLegendStyle}>Dimensiones</legend>
            <InputField
              label="Tamaño (px)"
              required
              name="width"
              type="number"
              config={inputElementsConfig.width}
              value={internalQrOptions.width}
              onChange={handleChangeQrOptions}
              validator={numberValidator}
            />
            <InputField
              label="Margen (px)"
              name="margin"
              type="number"
              config={inputElementsConfig.margin}
              value={internalQrOptions.margin}
              onChange={handleChangeQrOptions}
              validator={numberValidator}
            />
          </fieldset>
          <fieldset className={`${fieldsetStyle} flex flex-col`}>
            <legend className={fieldsetLegendStyle}>Resolución</legend>
            <InputField
              name="scale"
              type="range"
              config={inputElementsConfig.scale}
              value={internalQrOptions.scale}
              onChange={handleChangeQrOptions}
              validator={numberValidator}
            />
            <InputField
              name="scale"
              type="text"
              config={inputElementsConfig.scale}
              value={internalQrOptions.scale}
              onChange={handleChangeQrOptions}
              validator={numberValidator}
            />
          </fieldset>
          <fieldset className={fieldsetStyle}>
            <legend className={fieldsetLegendStyle}>Colores</legend>
            <label htmlFor="dark">
              Texto
              <input
                id="dark"
                type="color"
                className={colorPickerInputStyle}
                value={internalQrOptions.color?.dark}
                onChange={handleColorChange("dark")}
              />
              <InputField
                required
                name="dark"
                type="text"
                config={inputElementsConfig.dark}
                value={internalQrOptions.color?.dark}
                onChange={handleColorChange("dark")}
                validator={colorValidator}
              />
            </label>
            <label htmlFor="light">
              Fondo
              <input
                id="light"
                type="color"
                className={colorPickerInputStyle}
                value={internalQrOptions.color?.light}
                onChange={handleColorChange("light")}
              />
              <InputField
                required
                name="light"
                type="text"
                config={inputElementsConfig.light}
                value={internalQrOptions.color?.light}
                onChange={handleColorChange("light")}
                validator={colorValidator}
              />
            </label>
          </fieldset>
          <fieldset className={`${fieldsetStyle} flex flex-col`}>
            <legend className={fieldsetLegendStyle}>Optimización</legend>
            <label htmlFor="errorCorrectionLevel">
              Nivel de corrección de error
              <details
                id="errorCorrectionLevelDescription"
                className="bg-slate-200 p-1"
              >
                <summary className="text-slate-700 bg-slate-200">
                  ¿Qué es?
                </summary>
                <p>Ayuda a escanear la imagen a pesar de ser dañada o sucia.</p>
                <p>
                  Un nivel elevado provee mejor visibilidad pero reduce la
                  capacidad del QR.
                </p>
              </details>
              <select
                id="errorCorrectionLevel"
                value={internalQrOptions.errorCorrectionLevel}
                onChange={handleChangeQrOptions}
                className={selectInputStyle}
              >
                <option value="L">Bajo (~7%)</option>
                <option value="M">Medio (~15%)</option>
                <option value="Q">Cuarto (~25%)</option>
                <option value="H">Alto (~30%)</option>
              </select>
            </label>
          </fieldset>

          <div className="flex gap-1">
            <button type="reset" className={secondaryButtonStyle}>
              Reset
            </button>
            <button type="submit" className={primaryButtonStyle}>
              Generar
            </button>
          </div>
        </div>
        {isLoading && (
          <div className="flex justify-center items-center fixed bottom-8 left-0 right-0">
            <div
              className="bg-blue-400 text-coolGray-50 rounded-md w-fit p-2 shadow-md"
              onClick={dismissNotification}
            >
              <FontAwesomeIcon icon={faSpinner} className="fa fa-pulse" />
              &nbsp; Esperando cambios...
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
