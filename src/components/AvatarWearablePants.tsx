import { bodyShapes } from './avatar-wearable-geometry';
import type { PantsStyle } from './avatar-wearable-config';

export function AvatarWearablePants({ gender, style, fill }: {
  gender: 'boy' | 'girl'; style: PantsStyle; fill: string;
}) {
  const { waist, knee, hem, hipLeft, hipRight, center } = bodyShapes[gender].pants;
  const flare = style === 'flare';
  const baggy = style === 'baggy';
  const fittedGirlFlare = flare && gender === 'girl';
  const garmentHem = fittedGirlFlare ? 1322 : hem;
  const inner = center - 8;
  const leftHem = fittedGirlFlare ? hipLeft - 24 : flare ? hipLeft - 42 : baggy ? hipLeft - 18 : hipLeft - 4;
  const rightHem = 1024 - leftHem;
  const kneeInset = fittedGirlFlare ? 14 : flare ? 42 : baggy ? -4 : 15;
  const waistPath = `M${hipLeft} ${waist}C420 ${waist + 25} 470 ${waist + 20} ${center} ${waist + 8}C554 ${waist + 20} 604 ${waist + 25} ${hipRight} ${waist}L${hipRight - 14} ${waist + 126}C590 ${waist + 150} 548 ${waist + 135} ${center} ${waist + 112}C476 ${waist + 135} 434 ${waist + 150} ${hipLeft + 14} ${waist + 126}Z`;
  const leftLeg = `M${hipLeft + 12} ${waist + 82}C${hipLeft + 20} ${waist + 210} ${hipLeft + kneeInset} ${knee - 80} ${hipLeft + kneeInset} ${knee}C${hipLeft + kneeInset - 2} ${knee + 105} ${leftHem + 18} ${garmentHem - 100} ${leftHem} ${garmentHem}C${leftHem + 44} ${garmentHem + 14} ${inner - 35} ${garmentHem + 8} ${inner} ${garmentHem - 2}L${inner} ${waist + 120}C470 ${waist + 116} 426 ${waist + 126} ${hipLeft + 12} ${waist + 82}Z`;
  const rightLeg = `M${hipRight - 12} ${waist + 82}C${hipRight - 20} ${waist + 210} ${hipRight - kneeInset} ${knee - 80} ${hipRight - kneeInset} ${knee}C${hipRight - kneeInset + 2} ${knee + 105} ${rightHem - 18} ${garmentHem - 100} ${rightHem} ${garmentHem}C${rightHem - 44} ${garmentHem + 14} ${center + 43} ${garmentHem + 8} ${center + 8} ${garmentHem - 2}L${center + 8} ${waist + 120}C554 ${waist + 116} 598 ${waist + 126} ${hipRight - 12} ${waist + 82}Z`;

  return <g fill={fill} stroke="#8e98a8" strokeWidth="4" strokeLinejoin="round">
    <path d={waistPath} /><path d={leftLeg} /><path d={rightLeg} />
    <path d={`M${center} ${waist + 18}V${waist + 122}`} fill="none" opacity=".55" />
    <path d={`M${hipLeft + 32} ${waist + 150}C420 ${waist + 172} 464 ${waist + 170} ${inner - 12} ${waist + 150}`} fill="none" opacity=".28" />
    <path d={`M${hipRight - 32} ${waist + 150}C604 ${waist + 172} 560 ${waist + 170} ${center + 20} ${waist + 150}`} fill="none" opacity=".28" />
  </g>;
}
