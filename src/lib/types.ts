export type Language = 'ru' | 'en';
export type Theme = 'dark' | 'light';
export type GameCategory = 'popular' | 'poker' | 'casino' | 'solitaire';
export interface UserProfile {
  nickname: string;
  photo: string | null;
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
