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
import { isMobile } from "react-device-detect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQrcode, faSpinner } from "@fortawesome/free-solid-svg-icons";
import InputField from "./InputField";
import {
  colorExp,
  colorValidator,
  numberExp,
  numberValidator,
  stringExp,
  stringValidator,
} from "validations";
import ReactPDF from "@react-pdf/renderer";
import { defaultValues, pageSizes } from "presets";
import {
  ConfigListType,
  ControlPanelProps,
  OnChangeEvent,
} from "./ControlPanel.types";
import { DocumentOptions } from "App.types";
import { formInputStyles, headerStyles } from "theme/styles";

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
    className: formInputStyles.colorPickerLabel,
  },
  light: {
    pattern: colorExp,
    className: formInputStyles.colorPickerLabel,
  },
  size: {
    value: "A4",
  },
  orientation: {
    value: "portrait",
  },
  filename: {
    maxLength: 128,
    pattern: stringExp,
  },
};

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
    if (isMobile) return;

    const newCountdown = setTimeout(handleSubmit, defaultValues.standardDelay);
    setLoading(true);

    return () => {
      clearTimeout(newCountdown);
    };
  }, [handleSubmit]);

  return (
    <div className="flex flex-col w-full p-4 xl:w-fit lg:w-1/3 md:w-2/5 sm:w-1/2 sm:h-screen sm:overflow-y-auto gap-4 relative">
      <form onSubmit={handleSubmit} onReset={onReset}>
        <h1 className={headerStyles.h1}>
          <FontAwesomeIcon icon={faQrcode} className="w-6" /> QR Foundry
        </h1>
        <h2 className={headerStyles.h2}>Opciones</h2>
        <div className={formInputStyles.section}>
          <h3 className={headerStyles.h3}>Documento</h3>
          <fieldset className={`${formInputStyles.fieldset} flex flex-col`}>
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
            <legend className={formInputStyles.fieldsetLegend}>
              Propiedades
            </legend>
            <InputField
              label="Título"
              name="documentTitle"
              type="string"
              config={inputElementsConfig.documentTitle}
              value={internalDocumentOptions.documentTitle}
              onChange={handleChangeDocumentOptions}
              validator={stringValidator}
            />
            <label className={formInputStyles.label} htmlFor="size">
              Tamaño de página
              <select
                id="size"
                value={internalPageOptions.size?.toString()}
                onChange={handleChangePageOptions}
                className={formInputStyles.select}
              >
                {pageSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label className={formInputStyles.label} htmlFor="orientation">
              Orientación de página
              <select
                id="orientation"
                value={internalPageOptions.orientation}
                onChange={handleChangePageOptions}
                className={formInputStyles.select}
              >
                <option value="portrait">Retrato</option>
                <option value="landscape">Panorama</option>
              </select>
            </label>
          </fieldset>
        </div>
        <div className={formInputStyles.section}>
          <h3 className={headerStyles.h3}>Códigos QR</h3>
          <fieldset className={`${formInputStyles.fieldset} flex`}>
            <legend className={formInputStyles.fieldsetLegend}>
              Dimensiones
            </legend>
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
          <fieldset className={`${formInputStyles.fieldset} flex flex-col`}>
            <legend className={formInputStyles.fieldsetLegend}>
              Resolución
            </legend>
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
          <fieldset className={formInputStyles.fieldset}>
            <legend className={formInputStyles.fieldsetLegend}>Colores</legend>
            <label htmlFor="dark">
              Texto
              <input
                id="dark"
                type="color"
                className={formInputStyles.colorPickerInput}
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
                className={formInputStyles.colorPickerInput}
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
          <fieldset className={`${formInputStyles.fieldset} flex flex-col`}>
            <legend className={formInputStyles.fieldsetLegend}>
              Optimización
            </legend>
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
                className={formInputStyles.select}
              >
                <option value="L">Bajo (~7%)</option>
                <option value="M">Medio (~15%)</option>
                <option value="Q">Cuarto (~25%)</option>
                <option value="H">Alto (~30%)</option>
              </select>
            </label>
          </fieldset>

          <InputField
            label="Nombre del archivo"
            name="filename"
            type="string"
            config={inputElementsConfig.filename}
            value={internalDocumentOptions.filename}
            onChange={handleChangeDocumentOptions}
            validator={stringValidator}
          />

          <div className="flex gap-1">
            <button type="reset" className={formInputStyles.secondaryButton}>
              Reset
            </button>
            <button type="submit" className={formInputStyles.primaryButton}>
              Generar PDF
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
