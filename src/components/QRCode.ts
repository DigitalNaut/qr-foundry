import QRCode, { QRCodeRenderersOptions } from "qrcode";

export default function createQRImage(
  content: string,
  options: QRCodeRenderersOptions
) {
  try {
    return QRCode.toDataURL(content, options);
  } catch (error) {
    console.error(error);
  }
}
