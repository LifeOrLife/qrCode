import './style.css'
import { convertCodeInfo } from './qrcode'
import bg from './bg.png'

const start = async () => {
  const con = document.getElementById('app') as HTMLDivElement
  const container = document.createElement('div')
  container.className = 'container'
  const img = new Image()
  const src = await convertCodeInfo('hello world', '#' + Math.random().toString(16).slice(2, 8))
  img.src = src
  img.alt = 'QRCode'
  container.appendChild(img)
  const bgImg = new Image()
  bgImg.src = bg
  bgImg.alt = 'bg'
  bgImg.className = 'bg'
  container.appendChild(bgImg)
  con.appendChild(container)
}

start()
