import { createCanvas, loadImage } from 'canvas';
import * as QRCode from 'qrcode';

export class QrUtil {
  /**
   * Genera un código QR a partir de un payload y lo devuelve como base64.
   * @param payload - Datos a codificar en el QR
   * @returns Código QR en formato base64
   */
  static async generateQrBase64(payload: string): Promise<string> {
    try {
      return await QRCode.toDataURL(payload);
    } catch (error) {
      throw new Error(`Error generando QR: ${error.message}`);
    }
  }

  /**
   * Genera un código QR a partir de un payload y lo devuelve como buffer.
   * @param payload - Datos a codificar en el QR
   * @returns Código QR en formato buffer
   */
  static async generateQrBuffer(payload: string): Promise<Buffer> {
    try {
      const qrBuffer = await QRCode.toBuffer(payload);

      const qrSize = 290;

      const canvas = createCanvas(qrSize, qrSize);
      const ctx = canvas.getContext('2d');

      const qrImage = await loadImage(qrBuffer);
      ctx.drawImage(qrImage, 0, 0, qrSize, qrSize);

      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24">
  <path d="M12 2 L4 10 L20 10 Z M10 10 L10 16 L14 16 L14 10 Z"/>
</svg>
`;

      const iconImage = await loadImage(
        `data:image/svg+xml;base64,${Buffer.from(iconSvg).toString('base64')}`,
      );

      const iconSize = 40;
      ctx.drawImage(
        iconImage,
        (qrSize - iconSize) / 2,
        (qrSize - iconSize) / 2,
        iconSize,
        iconSize,
      );

      const finalQrBuffer = canvas.toBuffer();

      return finalQrBuffer;
    } catch (error) {
      console.log('error   -->', error);
      throw new Error(`Error generando QR: ${error.message}`);
    }
  }
}
