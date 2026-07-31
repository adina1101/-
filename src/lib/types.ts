export type Language = 'ru' | 'en';
export type Theme = 'dark' | 'light';
export type GameCategory = 'popular' | 'poker' | 'casino' | 'solitaire';
export type AvatarGender = 'boy' | 'girl';
export type BoyHairStyle = 'mullet' | 'french-fade' | 'buzz' | 'bowl';
export type GirlHairStyle = 'layers' | 'bun' | 'waves' | 'braid';

export interface AvatarAppearance {
  boyHairStyle: BoyHairStyle;
  girlHairStyle: GirlHairStyle;
  hairColor: string;
  skinTone: string;
  eyeColor: string;
}

export interface AvatarProfile {
  nickname: string;
  avatar: string | null;
  gender: AvatarGender;
  appearance: AvatarAppearance;
}

export interface Game {
  id: string;
  nameRu: string;
  nameEn: string;
  category: GameCategory;
  icon: string;
  players: string;
  difficulty: 1 | 2 | 3;
  descriptionRu: string;
  descriptionEn: string;
}
