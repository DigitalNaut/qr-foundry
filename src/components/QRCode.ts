// import { Canvg } from "canvg";
import QRCode from "qrcode";

export default async function CreateQRImage(content: string, width: number) {
  try {
    const options: QRCode.QRCodeRenderersOptions = {
      width: width,
    };
    const newQRCode = await QRCode.toCanvas(content, options);
    return newQRCode.toDataURL();
  } catch (error) {
    console.error(error);
    return null;
  }
}
