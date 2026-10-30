// Типы текстов для разбора по образцу (5 параметров).
export type Section = { title: string; text?: string; items?: string[]; check?: boolean };

export interface MindText {
  born: string; // "рождённые 6, 15, 24"
  short: string[]; // основные черты (5)
  karmicShort: string;
  headline: string; // "Гармония, Творчество, Любовь"
  full: string[]; // абзацы полного разбора
  keyTheme: string;
  sections: Section[]; // ключевые черты, характеристики, эго, отношения, сильные, слабые, рекомендации, кармические задачи, профессии, знаменитости, советы, здоровье
}

export interface PathText {
  short: string; // "ЧЖП 4 - энергия ..."
  full: string[];
  sections: Section[]; // плюсы, минусы, развитие, профессия, мужчины, женщины, кармические задачи, пример
}

export interface DharmaText {
  short: string;
  full: string[];
  sections: Section[];
}

export interface YearText {
  short: string;
  advice: string;
  headline: string;
  sections: Section[]; // что это значит, плюс, минус, что делать, избегать, главное правило
}

export interface KeysText {
  planet: string;
  day: string;
  color: string;
  stone: string;
  metal: string;
  strong: string;
  weak: string;
  good: string;
  neutral: string;
}

export interface MoneyDigit { title: string; text: string }
