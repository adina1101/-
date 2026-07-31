import { useApp } from '../lib/app-context';
import type { AvatarAppearance, BoyHairStyle, GirlHairStyle } from '../lib/types';

const hairColors = ['#171313', '#3b241d', '#75452d', '#c38a55', '#d9c6a1', '#8c263d'];
const skinTones = ['#f6c7a1', '#e9a06f', '#c9784d', '#965333', '#61351f'];
const eyeColors = ['#63391f', '#2d6d58', '#3f6691', '#76706a', '#291d18'];
const boyStyles: Array<{ id: BoyHairStyle; image: string }> = [
  { id: 'mullet', image: '/assets/avatar/hair/boy-mullet.png' },
  { id: 'french-fade', image: '/assets/avatar/hair/boy-french-fade.png' },
  { id: 'buzz', image: '/assets/avatar/hair/boy-buzz.png' },
  { id: 'bowl', image: '/assets/avatar/hair/boy-bowl.png' },
];
const girlStyles: Array<{ id: GirlHairStyle; image: string }> = [
  { id: 'layers', image: '/assets/avatar/hair/girl-layers.png' },
  { id: 'bun', image: '/assets/avatar/hair/girl-bun.png' },
  { id: 'waves', image: '/assets/avatar/hair/girl-waves.png' },
  { id: 'braid', image: '/assets/avatar/hair/girl-braid.png' },
];

export function AvatarAppearanceEditor() {
  const { profile, language, updateAvatarAppearance } = useApp();
  const appearance = profile.appearance;
  const ru = language === 'ru';
  const text = {
    title: ru ? 'Внешность' : 'Appearance',
    hint: ru ? 'Настройте лицо и волосы' : 'Customize the face and hair',
    hairstyle: ru ? 'Причёска' : 'Hairstyle',
    hair: ru ? 'Цвет волос' : 'Hair color',
    skin: ru ? 'Оттенок кожи' : 'Skin tone',
    eyes: ru ? 'Цвет глаз' : 'Eye color',
  };
  const swatches = (key: keyof Pick<AvatarAppearance, 'hairColor' | 'skinTone' | 'eyeColor'>, values: string[]) =>
    <div className="appearance-swatches">{values.map((color) => <button key={color}
      className={appearance[key] === color ? 'active' : ''} style={{ background: color }}
      onClick={() => updateAvatarAppearance({ [key]: color })} aria-label={color} />)}</div>;

  const hairSelector = profile.gender === 'girl'
    ? <div className="hair-style-options girl">{girlStyles.map((style) => <button key={style.id}
      className={appearance.girlHairStyle === style.id ? 'active' : ''}
      onClick={() => updateAvatarAppearance({ girlHairStyle: style.id })}>
      <span className="hair-reference-thumb" style={{ backgroundImage: `url("${style.image}")` }} />
      {ru
        ? { layers: 'Каскад', bun: 'Пучок', waves: 'Волны', braid: 'Коса' }[style.id]
        : { layers: 'Layers', bun: 'Messy bun', waves: 'Waves', braid: 'Side braid' }[style.id]}
    </button>)}</div>
    : <div className="hair-style-options boy">{boyStyles.map((style) => <button key={style.id}
      className={appearance.boyHairStyle === style.id ? 'active' : ''}
      onClick={() => updateAvatarAppearance({ boyHairStyle: style.id })}>
      <span className="hair-reference-thumb" style={{ backgroundImage: `url("${style.image}")` }} />
      {ru
        ? { mullet: 'Маллет', 'french-fade': 'Френч-фейд', buzz: 'Базз-кат', bowl: 'Боул-кат' }[style.id]
        : { mullet: 'Mullet', 'french-fade': 'French fade', buzz: 'Buzz cut', bowl: 'Bowl cut' }[style.id]}
    </button>)}</div>;

  return <div className="appearance-editor">
    <h3>{text.title}</h3><p>{text.hint}</p>
    <section><strong>{text.hairstyle}</strong>{hairSelector}</section>
    <section><strong>{text.hair}</strong>{swatches('hairColor', hairColors)}</section>
    <section><strong>{text.skin}</strong>{swatches('skinTone', skinTones)}</section>
    <section><strong>{text.eyes}</strong>{swatches('eyeColor', eyeColors)}</section>
  </div>;
}
