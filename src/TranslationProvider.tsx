import React, { createContext, useContext } from 'react';

import { processTranslation } from './processTranslation';
import { Locale, TFunction, TranslationData } from './types';

export interface TranslationContextValue {
  locale: Locale;
  t: TFunction;
}

export const TranslationContext = createContext<TranslationContextValue>({
  locale: '',
  t: () => '',
});

interface TranslationProviderProps {
  locale: Locale;
  translations: TranslationData;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  locale,
  translations,
  children,
}) => (
  <TranslationContext.Provider
    value={{
      locale,
      t: (key, args) => processTranslation({
        locale,
        translations,
        key,
        args,
      }),
    }}
  >
    {children}
  </TranslationContext.Provider>
);

export const useTranslation = () => useContext(TranslationContext);
