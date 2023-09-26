// @ts-expect-error
import QRCode from 'qrcode'

export const generateQRCode = (src: string): Promise<string> => {
  return new Promise((resolve, reject) => {
		QRCode.toDataURL(src, {
			width: 200,
			height: 200,
			margin: 1,
		}, (err: any, url: string) => {
			if (err) reject(err)
				resolve(url)
			})
  });
};

const convertColor = (c: string): [number, number, number] => {
	if (c.startsWith('#')) {
		if (c.length === 4) {
			c = c.replace(/#(.)(.)(.)/, '#$1$1$2$2$3$3')
		}
		if (c.length === 7) {
			const r = c.slice(1, 3)
			const g = c.slice(3, 5)
			const b = c.slice(5, 7)
			return [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)]
		}
	} else if (c.startsWith('rgb')) {
		const [r, g, b] = c.replace(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/, '$1,$2,$3').split(',')
		return [parseInt(r), parseInt(g), parseInt(b)]
	}
	return [0, 0, 0]
}

const changeColor = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, color: string) => {
	const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data: d } = data
	const _color = convertColor(color)
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i]
    const g = d[i + 1]
    const b = d[i + 2]
    const a = d[i + 3]
    if (r === 0 && g === 0 && b === 0 && a === 255) {
      d[i] = _color[0]
      d[i + 1] = _color[1]
      d[i + 2] = _color[2]
      d[i + 3] = 255
    }
  }
  ctx.putImageData(data, 0, 0)
}

export const convertCodeInfo = async (text: string, color: string = '#6cf'): Promise<string> => {
	const url = await generateQRCode(text)
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')!
	return new Promise((resolve, reject) => {
		const img = new Image()
		img.src = url
		img.onload = () => {
			canvas.width = img.width
			canvas.height = img.height
			ctx.drawImage(img, 0, 0)
			changeColor(canvas, ctx, color)
			resolve(canvas.toDataURL('image/png'))
		}
		img.onerror = reject
	})
}
        
        // mix-blend-mode 如何应用在canvas图片上
        // ctx.globalCompositeOperation = 'lighten'
        // const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0)
        // gradient.addColorStop(0, 'rgba(103, 59, 183, 1)')
        // gradient.addColorStop(1, 'rgba(81, 205, 188, 1)')
        // ctx.fillStyle = gradient
        // ctx.fillRect(0, 0, canvas.width, canvas.height)

        // codeInfo.url = canvas.toDataURL('image/png')
        // const name = `${item.name}_二维码.png`
        // const a = document.createElement('a')
        // a.href = codeInfo.url
        // a.download = name
        // a.click()