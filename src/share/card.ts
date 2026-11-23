import type { Archetype } from '../domain/types';
import { PRODUCT_NAME } from '../product';

const WIDTH = 1080;
const HEIGHT = 1440;

function wrapText(
  context: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const characters = [...text];
  let line = '';
  let cursorY = y;
  for (const character of characters) {
    const candidate = line + character;
    if (context.measureText(candidate).width > maxWidth && line) {
      context.fillText(line, x, cursorY);
      line = character;
      cursorY += lineHeight;
    } else {
      line = candidate;
    }
  }
  if (line) {
    context.fillText(line, x, cursorY);
    cursorY += lineHeight;
  }
  return cursorY;
}

function loadImage(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('QR image failed to load'));
    image.src = source;
  });
}

function drawQrPanel(context: CanvasRenderingContext2D, qrImage: HTMLImageElement): void {
  const panelX = 720;
  const panelY = 980;
  const panelWidth = 250;
  const panelHeight = 300;

  context.fillStyle = 'rgba(242,237,223,0.96)';
  context.beginPath();
  context.roundRect(panelX, panelY, panelWidth, panelHeight, 28);
  context.fill();

  context.drawImage(qrImage, panelX + 25, panelY + 24, 200, 200);
  context.fillStyle = '#343b36';
  context.font = '600 22px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.textAlign = 'center';
  context.fillText('扫码生成你的单案例研究', panelX + panelWidth / 2, panelY + 265);
  context.textAlign = 'start';
}

export async function renderShareCard(
  canvas: HTMLCanvasElement,
  archetype: Archetype,
  secondary: Archetype,
  qrDataUrl: string,
): Promise<void> {
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('Canvas context unavailable');
  }

  const background = context.createLinearGradient(0, 0, WIDTH, HEIGHT);
  background.addColorStop(0, '#111513');
  background.addColorStop(0.58, '#1b211d');
  background.addColorStop(1, archetype.accent);
  context.fillStyle = background;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  context.globalAlpha = 0.18;
  context.fillStyle = '#f2eddf';
  context.beginPath();
  context.arc(930, 190, 260, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;

  context.strokeStyle = 'rgba(242,237,223,0.24)';
  context.lineWidth = 2;
  context.strokeRect(64, 64, WIDTH - 128, HEIGHT - 128);

  context.fillStyle = '#ffd9cb';
  context.font = '500 26px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText('A SINGLE-CASE STUDY OF YOU · V4.1', 110, 150);

  context.fillStyle = '#f2eddf';
  context.font = '700 118px "Songti SC", "STSong", serif';
  context.fillText(archetype.name, 104, 330);

  context.fillStyle = 'rgba(242,237,223,0.72)';
  context.font = '500 28px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText(`竞争解释：${secondary.name}`, 110, 398);

  context.fillStyle = 'rgba(242,237,223,0.82)';
  context.font = '400 50px "Songti SC", "STSong", serif';
  const taglineBottom = wrapText(context, archetype.tagline, 110, 455, 800, 70);

  context.fillStyle = 'rgba(242,237,223,0.18)';
  context.fillRect(110, Math.max(taglineBottom + 36, 620), 860, 2);

  context.fillStyle = '#f2eddf';
  context.font = '600 34px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText('运行参数', 110, Math.max(taglineBottom + 120, 710));

  let pillX = 110;
  const pillY = Math.max(taglineBottom + 150, 740);
  for (const keyword of archetype.keywords) {
    context.font = '600 32px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
    const pillWidth = context.measureText(keyword).width + 54;
    context.fillStyle = 'rgba(242,237,223,0.12)';
    context.beginPath();
    context.roundRect(pillX, pillY, pillWidth, 68, 34);
    context.fill();
    context.strokeStyle = 'rgba(242,237,223,0.28)';
    context.stroke();
    context.fillStyle = '#f2eddf';
    context.fillText(keyword, pillX + 27, pillY + 46);
    pillX += pillWidth + 18;
  }

  context.fillStyle = 'rgba(242,237,223,0.9)';
  context.font = '400 38px "Songti SC", "STSong", serif';
  wrapText(context, archetype.action, 110, pillY + 160, 550, 62);

  const qrImage = await loadImage(qrDataUrl);
  drawQrPanel(context, qrImage);

  context.fillStyle = 'rgba(242,237,223,0.68)';
  context.font = '500 25px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText(PRODUCT_NAME, 110, HEIGHT - 150);
  context.font = '400 20px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText('娱乐性自我报告，不构成心理/医疗诊断、命理预测或现实决策依据', 110, HEIGHT - 108);
}