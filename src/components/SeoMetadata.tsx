import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { games } from '../lib/games';

const origin = 'https://ruddy-eight-39.vercel.app';
const homeTitle = 'CARDIX — карточные игры онлайн: Дурак, Пьяница и турниры';
const homeDescription = 'Бесплатные карточные игры онлайн и офлайн: Дурак, Пьяница, покер, пасьянсы, турниры и игра с друзьями.';

function setMeta(selector: string, value: string) {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', value);
}

export function SeoMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const ruleId = location.startsWith('/rules/') ? location.slice('/rules/'.length) : '';
    const game = games.find((item) => item.id === ruleId);
    const isRules = location === '/rules' || Boolean(game);
    const title = game ? `${game.nameRu}: правила игры — CARDIX`
      : location === '/rules' ? 'Правила карточных игр: Дурак, Пьяница, покер — CARDIX' : homeTitle;
    const description = game
      ? `Полные правила карточной игры «${game.nameRu}»: цель, подготовка, порядок ходов и условия победы. Играть в CARDIX онлайн и офлайн.`
      : location === '/rules' ? 'Понятные правила 32 карточных игр: Дурак, Пьяница, покер, пасьянсы и другие игры в CARDIX.' : homeDescription;
    const canonical = `${origin}${isRules ? location : '/'}`;
    document.title = title;
    document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', canonical);
    setMeta('meta[name="description"]', description);
    setMeta('meta[name="robots"]', location === '/' || isRules
      ? 'index, follow, max-image-preview:large' : 'noindex, nofollow');
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[property="og:url"]', canonical);
    setMeta('meta[name="twitter:title"]', title);
    setMeta('meta[name="twitter:description"]', description);
  }, [location]);
  return null;
}
