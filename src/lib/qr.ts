import QRCode from 'qrcode'

/**
 * The carton QR encodes a plain tracking URL, not an internal id — any phone
 * camera opens it, with no app to install and nothing to look up.
 */
export async function qrDataUrl(text: string, size = 320) {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#06202FFF', light: '#FFFFFFFF' },
  })
}
