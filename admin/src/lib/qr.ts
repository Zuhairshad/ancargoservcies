import QRCode from 'qrcode'

export async function qrDataUrl(text: string, size = 320) {
  return QRCode.toDataURL(text, {
    width: size,
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#06202FFF', light: '#FFFFFFFF' },
  })
}
