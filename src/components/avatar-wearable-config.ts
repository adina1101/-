export type TopStyle =
  | 'tank' | 'jersey07' | 'cat' | 'plaid' | 'lace' | 'varsity'
  | 'cocoa' | 'ruched' | 'cream' | 'burgundy' | 'layered' | 'gray'
  | 'forest' | 'sand' | 'noir' | 'mocha' | 'leather' | 'college' | 'bomber' | 'cardigan';
export type PantsStyle = 'wide' | 'flare' | 'baggy';

export interface WearableConfig {
  gender?: 'boy' | 'girl';
  top: TopStyle;
  pants: PantsStyle;
  denim: [string, string];
}

export const wearableLooks: Record<string, WearableConfig> = {
  'look-shadow-tank': { gender: 'girl', top: 'tank', pants: 'wide', denim: ['#17181d', '#30333d'] },
  'look-pink-07': { gender: 'girl', top: 'jersey07', pants: 'wide', denim: ['#b9bcc1', '#e0dfda'] },
  'look-cat-street': { gender: 'girl', top: 'cat', pants: 'wide', denim: ['#141519', '#2b2d35'] },
  'look-plaid-layer': { gender: 'girl', top: 'plaid', pants: 'wide', denim: ['#202733', '#475467'] },
  'look-lace-cargo': { gender: 'girl', top: 'lace', pants: 'wide', denim: ['#58677b', '#8490a1'] },
  'look-varsity-33': { top: 'varsity', pants: 'wide', denim: ['#4c5869', '#89919d'] },
  'look-cocoa-stripe': { gender: 'girl', top: 'cocoa', pants: 'flare', denim: ['#17181d', '#343640'] },
  'look-noir-ruched': { gender: 'girl', top: 'ruched', pants: 'flare', denim: ['#15161a', '#30323a'] },
  'look-cream-point': { gender: 'girl', top: 'cream', pants: 'flare', denim: ['#17181d', '#33353e'] },
  'look-burgundy-satin': { gender: 'girl', top: 'burgundy', pants: 'flare', denim: ['#17181d', '#30323a'] },
  'look-layered-collar': { gender: 'girl', top: 'layered', pants: 'flare', denim: ['#24262d', '#41434c'] },
  'look-gray-asym': { gender: 'girl', top: 'gray', pants: 'flare', denim: ['#17181d', '#33353d'] },
  'look-boy-forest-campus': { gender: 'boy', top: 'forest', pants: 'baggy', denim: ['#d8d9da', '#aeb0b4'] },
  'look-boy-sand-layer': { gender: 'boy', top: 'sand', pants: 'baggy', denim: ['#17181d', '#30323a'] },
  'look-boy-noir-knit': { gender: 'boy', top: 'noir', pants: 'baggy', denim: ['#a9bbc9', '#71899b'] },
  'look-boy-mocha-track': { gender: 'boy', top: 'mocha', pants: 'baggy', denim: ['#17181d', '#33353d'] },
  'look-boy-leather-layer': { gender: 'boy', top: 'leather', pants: 'baggy', denim: ['#707d88', '#43505c'] },
  'look-boy-college-gray': { gender: 'boy', top: 'college', pants: 'baggy', denim: ['#17181d', '#353740'] },
  'look-boy-black-bomber': { gender: 'boy', top: 'bomber', pants: 'baggy', denim: ['#d5d6d8', '#aeb0b5'] },
  'look-boy-cardigan': { gender: 'boy', top: 'cardigan', pants: 'baggy', denim: ['#adc2d2', '#758fa3'] },
};
