import { useId } from 'react';
import type { AvatarAppearance as Appearance, AvatarGender } from '../lib/types';

const face = {
  girl: { cy: 235, rx: 116, ry: 140, eyesY: 235, leftEye: 466, rightEye: 558 },
  boy: { cy: 310, rx: 116, ry: 142, eyesY: 307, leftEye: 462, rightEye: 558 },
};
const skinPaths = {
  girl: {
    arms: 'M360 470C350 570 306 690 278 800C270 840 286 875 312 874C344 870 352 830 344 800C372 700 408 590 410 485ZM664 470C674 570 718 690 746 800C754 840 738 875 712 874C680 870 672 830 680 800C652 700 616 590 614 485Z',
    legs: 'M372 790C374 930 386 1050 370 1268C388 1300 420 1304 442 1280C462 1080 482 930 496 808ZM652 790C650 930 638 1050 654 1268C636 1300 604 1304 582 1280C562 1080 542 930 528 808Z',
  },
  boy: {
    arms: 'M342 600C326 690 298 810 278 888C274 930 292 968 320 970C350 968 360 930 346 900C364 810 388 700 392 610ZM682 600C698 690 726 810 746 888C750 930 732 968 704 970C674 968 664 930 678 900C660 810 636 700 632 610Z',
    legs: 'M370 980C374 1100 380 1200 356 1300C370 1335 404 1345 432 1322C454 1190 476 1080 494 988ZM654 980C650 1100 644 1200 668 1300C654 1335 620 1345 592 1322C570 1190 548 1080 530 988Z',
  },
};

function HairBase({ gender, appearance }: { gender: AvatarGender; appearance: Appearance }) {
  const boyCrowns = {
    mullet: 'M358 304C338 194 402 88 512 82S682 184 660 320L646 446L610 470L586 426L566 470L548 410L476 410L456 470L430 430L402 468L370 430Z',
    'french-fade': 'M374 304C364 204 418 120 510 110C608 100 666 190 650 310L616 276C584 246 552 238 516 250C476 234 430 250 396 286Z',
    buzz: 'M388 300C382 220 432 158 512 154C594 150 646 214 636 300C600 272 560 258 512 260C464 258 424 272 388 300Z',
    bowl: 'M362 314C348 196 410 102 512 96C620 90 682 190 662 316L632 350C590 318 434 318 392 350Z',
  };
  const crown = gender === 'girl'
    ? 'M370 292C350 164 410 68 512 68S674 164 654 300L620 350C614 292 604 238 580 194C552 158 530 146 512 150C470 138 432 174 414 226C402 270 406 322 394 362Z'
    : boyCrowns[appearance.boyHairStyle];
  return <g><path d={crown} fill={appearance.hairColor} opacity=".88" style={{ mixBlendMode: 'color' }} />
    <path d={crown} fill={appearance.hairColor} opacity=".16" style={{ mixBlendMode: 'screen' }} /></g>;
}

function GirlHairFront({ appearance, fill }: { appearance: Appearance; fill: string }) {
  const style = appearance.girlHairStyle;
  const curtain = 'M394 220C420 172 470 146 506 154C480 196 456 246 430 310C414 298 402 266 394 220ZM630 220C604 172 554 146 518 154C544 196 568 246 594 310C610 298 622 266 630 220Z';
  if (style === 'bun') return <g fill={fill} stroke="#17100d" strokeWidth="4">
    <ellipse cx="512" cy="70" rx="91" ry="66" /><path d="M430 98C454 18 570 10 604 92C568 56 534 54 512 74C484 46 454 60 430 98Z" opacity=".72" />
    <path d={curtain} /><path d="M420 258C388 330 392 430 420 520C438 488 448 452 434 410C458 352 454 300 438 264ZM604 258C636 330 632 430 604 520C586 488 576 452 590 410C566 352 570 300 586 264Z" />
  </g>;
  if (style === 'braid') {
    const braid = [0, 1, 2, 3, 4, 5, 6].map((part) => {
      const cy = 410 + part * 72;
      const cx = part % 2 ? 394 : 374;
      return <ellipse key={part} cx={cx} cy={cy} rx="47" ry="62" transform={`rotate(${part % 2 ? 24 : -24} ${cx} ${cy})`} />;
    });
    return <g fill={fill} stroke="#17100d" strokeWidth="4"><path d={curtain} />
      <path d="M408 260C382 324 372 356 378 390C404 408 430 400 448 376C426 336 432 300 446 270Z" />
      {braid}<rect x="354" y="886" width="70" height="20" rx="10" fill="#1b1310" />
      <path d="M360 902C352 960 368 1000 390 1024C416 998 426 954 416 902Z" /></g>;
  }
  const longLayers = 'M374 246C340 330 346 470 370 590L350 690L382 674L398 742L420 706L440 760L458 700C430 570 420 404 440 256ZM650 246C684 330 678 470 654 590L674 690L642 674L626 742L604 706L584 760L566 700C594 570 604 404 584 256Z';
  const waves = 'M374 246C338 340 372 396 348 468C326 540 382 580 350 650C334 704 378 758 430 730C462 684 422 634 450 576C474 520 430 464 450 390C466 332 444 282 430 246ZM650 246C686 340 652 396 676 468C698 540 642 580 674 650C690 704 646 758 594 730C562 684 602 634 574 576C550 520 594 464 574 390C558 332 580 282 594 246Z';
  return <g fill={fill} stroke="#17100d" strokeWidth="4"><path d={style === 'waves' ? waves : longLayers} /><path d={curtain} />
    {style === 'layers' && <path d="M392 430L438 466M374 548L430 584M632 430L586 466M650 548L594 584" fill="none" stroke="#fff" strokeWidth="7" opacity=".12" />}</g>;
}

function BoyHairFront({ appearance, fill }: { appearance: Appearance; fill: string }) {
  const style = appearance.boyHairStyle;
  if (style === 'mullet') return <g fill={fill} stroke="#17100d" strokeWidth="4">
    <path d="M372 254C390 206 438 174 492 172C468 206 460 246 438 300C420 344 410 390 420 448L390 472L366 438C350 370 354 304 372 254ZM652 254C634 206 586 174 532 172C556 206 564 246 586 300C604 344 614 390 604 448L634 472L658 438C674 370 670 304 652 254Z" />
    <path d="M406 246C438 194 472 178 508 190C486 224 476 264 466 320L432 292ZM618 246C586 194 552 178 516 190C538 224 548 264 558 320L592 292Z" />
    <path d="M392 346L420 326M378 398L412 378M632 346L604 326M646 398L612 378" fill="none" stroke="#fff" strokeWidth="7" opacity=".1" />
  </g>;
  if (style === 'french-fade') return <g fill={fill} stroke="#17100d" strokeWidth="4">
    <path d="M390 278C406 194 446 154 512 152C584 150 626 198 640 280C604 252 568 246 536 260C492 244 440 252 390 278Z" />
    {[420, 454, 488, 522, 556, 590, 438, 474, 510, 546, 578].map((cx, index) =>
      <circle key={`${cx}-${index}`} cx={cx} cy={index < 6 ? 210 : 174} r={index % 3 === 0 ? 29 : 25} />)}
    <path d="M390 270C410 252 432 252 450 270L466 250L486 276L506 250L526 278L548 252L570 274L594 250L634 276" />
    <path d="M382 278C370 320 378 356 394 378L412 348L408 292ZM642 278C654 320 646 356 630 378L612 348L616 292Z" opacity=".55" />
  </g>;
  if (style === 'buzz') return <g fill={fill} stroke="#17100d" strokeWidth="4">
    <path d="M390 292C390 214 440 164 512 162C586 160 634 216 634 294C590 270 548 260 512 262C474 260 432 270 390 292Z" />
    <path d="M410 246L426 238M442 214L458 208M478 194L494 190M516 188L532 190M554 198L570 204M590 222L604 232"
      fill="none" stroke="#fff" strokeWidth="6" opacity=".13" strokeLinecap="round" />
  </g>;
  return <g fill={fill} stroke="#17100d" strokeWidth="4">
    <path d="M372 288C378 174 432 114 512 112C596 110 650 176 654 290C616 314 588 320 556 314L548 288L528 316L506 288L484 316L462 286L442 310C416 310 394 304 372 288Z" />
    <path d="M400 188C454 142 566 132 622 192M390 226C452 182 574 172 636 226" fill="none" stroke="#fff" strokeWidth="8" opacity=".1" strokeLinecap="round" />
  </g>;
}

export function AvatarAppearance({ gender, appearance, portrait = false, layer = 'all' }: {
  gender: AvatarGender; appearance: Appearance; portrait?: boolean; layer?: 'all' | 'base' | 'front';
}) {
  const id = useId().replace(/:/g, '');
  const head = face[gender];
  const showBase = layer !== 'front';
  const showFront = layer !== 'base';
  return <svg className={`avatar-appearance ${layer === 'front' ? 'avatar-appearance-front' : ''}`}
    viewBox="0 0 1024 1536" preserveAspectRatio={portrait ? 'xMidYMin slice' : 'xMidYMid meet'} aria-hidden="true">
    <defs><linearGradient id={`${id}-hair`} x1="0" y1="0" x2="1" y2="1">
      <stop stopColor={appearance.hairColor} /><stop offset=".6" stopColor={appearance.hairColor} /><stop offset="1" stopColor="#120b09" />
    </linearGradient></defs>
    {showBase && <><g fill={appearance.skinTone} opacity=".26" style={{ mixBlendMode: 'color' }}>
      <ellipse cx="512" cy={head.cy} rx={head.rx} ry={head.ry} /><path d={skinPaths[gender].arms} /><path d={skinPaths[gender].legs} />
    </g><HairBase gender={gender} appearance={appearance} />
      <g fill={appearance.eyeColor} stroke="#17100d" strokeWidth="4">
        <circle cx={head.leftEye} cy={head.eyesY} r="11" /><circle cx={head.rightEye} cy={head.eyesY} r="11" />
        <circle cx={head.leftEye - 3} cy={head.eyesY - 3} r="3" fill="#fff" stroke="none" />
        <circle cx={head.rightEye - 3} cy={head.eyesY - 3} r="3" fill="#fff" stroke="none" />
      </g></>}
    {showFront && (gender === 'girl'
      ? <GirlHairFront appearance={appearance} fill={`url(#${id}-hair)`} />
      : <BoyHairFront appearance={appearance} fill={`url(#${id}-hair)`} />)}
  </svg>;
}
