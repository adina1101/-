import { bodyShapes } from './avatar-wearable-geometry';
import type { TopStyle } from './avatar-wearable-config';

type Gender = 'boy' | 'girl';

function LongBase({ gender, fill, fitted = false, stroke = '#4a4d58' }: {
  gender: Gender; fill: string; fitted?: boolean; stroke?: string;
}) {
  const shape = bodyShapes[gender];
  return <g fill={fill} stroke={stroke} strokeWidth="5" strokeLinejoin="round">
    <path d={shape.leftSleeve} /><path d={shape.rightSleeve} />
    <path d={fitted ? shape.torso : shape.loose} />
  </g>;
}

function ShortBase({ gender, fill, oversized = false, stroke = '#4a4d58' }: {
  gender: Gender; fill: string; oversized?: boolean; stroke?: string;
}) {
  const shape = bodyShapes[gender];
  const y = gender === 'girl' ? 390 : 480;
  const sleeve = gender === 'girl'
    ? `M408 378C370 382 346 410 330 454L376 500C392 474 408 448 430 424M616 378C654 382 678 410 694 454L648 500C632 474 616 448 594 424`
    : `M394 466C348 472 318 510 296 566L350 614C372 578 394 540 426 510M630 466C676 472 706 510 728 566L674 614C652 578 630 540 598 510`;
  return <g fill={fill} stroke={stroke} strokeWidth="6" strokeLinejoin="round">
    <path d={sleeve} fill="none" strokeWidth={gender === 'girl' ? 44 : 54} />
    <path d={oversized ? shape.loose : shape.torso} />
    <path d={`M448 ${y}Q512 ${y + 36} 576 ${y}`} fill="none" opacity=".32" />
  </g>;
}

function CenterText({ gender, children, color = '#fff' }: {
  gender: Gender; children: string; color?: string;
}) {
  return <text x="512" y={gender === 'girl' ? 585 : 690} textAnchor="middle"
    fill={color} fontSize="92" fontWeight="900">{children}</text>;
}

export function AvatarWearableTop({ gender, style, plaidId, stripeId }: {
  gender: Gender; style: TopStyle; plaidId: string; stripeId: string;
}) {
  const shape = bodyShapes[gender];
  const neckY = gender === 'girl' ? 392 : 482;
  const hemY = gender === 'girl' ? 700 : 834;
  if (style === 'tank') return <path d={shape.tank} fill="#15161b" stroke="#353842" strokeWidth="5" />;
  if (style === 'jersey07') return <g><ShortBase gender={gender} fill="#171820" oversized stroke="#ef619a" /><CenterText gender={gender} color="#f45b96">07</CenterText></g>;
  if (style === 'varsity') return <g><ShortBase gender={gender} fill="#f0eee8" oversized stroke="#292d36" /><CenterText gender={gender} color="#20232b">33</CenterText></g>;
  if (style === 'cat') return <g><ShortBase gender={gender} fill="#f3f0e8" stroke="#ccc8bf" /><g fill="#171820" transform={`translate(0 ${gender === 'girl' ? 0 : 100})`}><path d="M466 498L482 470 501 492Q512 488 523 492L542 470 558 498 550 548Q512 570 474 548Z" /><circle cx="496" cy="520" r="5" fill="#fff" /><circle cx="528" cy="520" r="5" fill="#fff" /></g></g>;
  if (style === 'plaid') return <g><ShortBase gender={gender} fill={`url(#${plaidId})`} oversized /><path d={shape.crop} fill="#121319" /><path d={`M512 ${neckY - 12}L478 ${hemY}M512 ${neckY - 12}L546 ${hemY}`} stroke="#101116" strokeWidth="36" /></g>;
  if (style === 'lace') return <g><LongBase gender={gender} fill="#171820" fitted /><path d={`M438 ${neckY - 12}Q512 ${neckY + 76} 586 ${neckY - 12}`} fill="none" stroke="#eee9df" strokeWidth="16" strokeDasharray="12 8" /></g>;
  if (style === 'cocoa') return <LongBase gender={gender} fill={`url(#${stripeId})`} stroke="#6a4b36" />;
  if (style === 'ruched') return <g><path d={shape.tank} fill="#111217" stroke="#383a44" strokeWidth="5" />{[0, 1, 2, 3].map((line) => <path key={line} d={`M438 ${neckY + 42 + line * 40}Q512 ${neckY + 56 + line * 40} 586 ${neckY + 42 + line * 40}`} fill="none" stroke="#474954" strokeWidth="6" />)}</g>;
  if (style === 'cream') return <g><LongBase gender={gender} fill="#eee5d5" fitted stroke="#cfc4b2" /><path d={`M408 ${hemY - 46}L512 ${hemY + 100} 616 ${hemY - 46}Z`} fill="#eee5d5" /></g>;
  if (style === 'burgundy') return <g><path d={shape.tank} fill="#7d1830" stroke="#b34c62" strokeWidth="5" /><path d={`M438 ${neckY + 16}Q512 ${neckY + 88} 586 ${neckY + 16}`} fill="none" stroke="#d17889" strokeWidth="12" opacity=".75" /></g>;
  if (style === 'layered') return <g><LongBase gender={gender} fill="#f3f1ec" fitted stroke="#d6d2ca" /><path d={shape.crop} fill="#15161b" /><path d={`M452 ${neckY - 14}L512 ${neckY + 62} 572 ${neckY - 14}M410 ${hemY - 108}Q512 ${hemY - 62} 614 ${hemY - 108}`} fill="none" stroke="#fff" strokeWidth="18" /></g>;
  if (style === 'gray') return <g><LongBase gender={gender} fill="#8e8f94" fitted stroke="#b9bac0" /><path d={`M408 ${neckY}L612 ${neckY + 70}`} fill="none" stroke="#d1d1d4" strokeWidth="22" /></g>;

  const maleColors: Record<string, string> = {
    forest: '#203d31', sand: '#c5b79d', noir: '#15161b', mocha: '#554a45',
    leather: '#17181b', college: '#d0d1d3', bomber: '#17181b', cardigan: '#414247',
  };
  const fill = maleColors[style] ?? '#202127';
  return <g>
    {(style === 'forest' || style === 'leather') && <path d={`M438 ${neckY + 12}Q512 ${neckY - 72} 586 ${neckY + 12}L560 ${neckY + 72}H464Z`} fill={style === 'forest' ? '#203d31' : '#cacdd0'} stroke="#555963" strokeWidth="5" />}
    <LongBase gender={gender} fill={fill} />
    {(style === 'sand' || style === 'leather' || style === 'bomber' || style === 'cardigan') && <path d={`M512 ${neckY + 8}V${hemY + 6}`} stroke={style === 'sand' ? '#786e5f' : '#777a82'} strokeWidth="7" />}
    {style === 'sand' && <path d={`M470 ${neckY + 10}L430 ${neckY + 65}M554 ${neckY + 10}L594 ${neckY + 65}`} stroke="#4c4036" strokeWidth="18" />}
    {style === 'noir' && <g opacity=".35" stroke="#747782" strokeWidth="5">{[0, 1, 2, 3, 4].map((line) => <path key={line} d={`M396 ${neckY + 55 + line * 58}H628`} />)}</g>}
    {style === 'mocha' && <g stroke="#eee5d7" strokeWidth="11"><path d="M344 500L316 820" /><path d="M365 505L340 820" /><path d="M680 500L708 820" /><path d="M659 505L684 820" /></g>}
    {style === 'leather' && <path d={`M454 ${neckY + 35}L512 ${neckY + 82} 570 ${neckY + 35}`} fill="none" stroke="#d6d8da" strokeWidth="13" />}
    {style === 'college' && <path d={`M438 ${neckY + 110}Q512 ${neckY + 70} 586 ${neckY + 110}`} fill="none" stroke="#a8aaad" strokeWidth="12" />}
    {style === 'cardigan' && <g fill="#202126">{[0, 1, 2, 3].map((dot) => <circle key={dot} cx="512" cy={neckY + 100 + dot * 62} r="8" />)}</g>}
  </g>;
}
