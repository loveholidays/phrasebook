export interface TranslationData {
  [key: string]: string | TranslationData;
}

export type Namespaces = Record<string, TranslationData>;

export type TranslationArgumentValue = string | number | undefined;

export type TranslationArguments = {
  count?: number;
  context?: string;
  numberLocale?: Locale;
  [name: string]: TranslationArgumentValue;
};

export type TFunction = (key: string, args?: TranslationArguments) => string;

export type Locale = string;
