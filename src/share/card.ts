import type { Archetype } from '../domain/types';

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

export function renderShareCard(canvas: HTMLCanvasElement, archetype: Archetype): void {
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
  context.fillText('A SMALL FIELD GUIDE TO YOURSELF', 110, 150);

  context.fillStyle = '#f2eddf';
  context.font = '700 118px "Songti SC", "STSong", serif';
  context.fillText(archetype.name, 104, 340);

  context.fillStyle = 'rgba(242,237,223,0.82)';
  context.font = '400 50px "Songti SC", "STSong", serif';
  const taglineBottom = wrapText(context, archetype.tagline, 110, 430, 800, 70);

  context.fillStyle = 'rgba(242,237,223,0.18)';
  context.fillRect(110, Math.max(taglineBottom + 36, 590), 860, 2);

  context.fillStyle = '#f2eddf';
  context.font = '600 34px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText('核心关键词', 110, Math.max(taglineBottom + 120, 680));

  let pillX = 110;
  const pillY = Math.max(taglineBottom + 150, 710);
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
  wrapText(context, archetype.action, 110, pillY + 160, 840, 62);

  context.fillStyle = 'rgba(242,237,223,0.68)';
  context.font = '500 25px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText('灵魂使用说明书', 110, HEIGHT - 150);
  context.font = '400 20px "Avenir Next", "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText('娱乐与自我反思用途，不构成心理/医疗诊断', 110, HEIGHT - 108);
}