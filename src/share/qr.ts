import QRCode from 'qrcode';
import type { Attribution } from '../analytics/attribution';
import type { ArchetypeId } from '../domain/types';
import { buildShareUrl } from './url';

export async function createShareQrDataUrl(
  archetypeId: ArchetypeId,
  baseUrl?: string,
  attribution: Attribution = {},
): Promise<string> {
  return QRCode.toDataURL(buildShareUrl(archetypeId, baseUrl, attribution, 'image'), {
    width: 360,
    margin: 1,
    errorCorrectionLevel: 'H',
    color: {
      dark: '#151817',
      light: '#f2eddf',
    },
  });
}