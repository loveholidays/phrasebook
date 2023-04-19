import React, { createContext, useContext, useState } from 'react';
import { DEFAULT_NAMESPACE } from './constants';

import { processTranslation } from './processTranslation';
import type {
  Namespaces, Locale, TFunction, TranslationData,
} from './types';

export interface TranslationContextValue {
  locale: Locale;
  namespaces: Namespaces;
  t: TFunction;
}

export const TranslationContext = createContext<TranslationContextValue>({
  locale: '',
  namespaces: {},
  t: () => '',
});

interface TranslationProviderProps {
  locale: Locale;
  namespaces?: Namespaces;
  translations?: TranslationData;
}

// @TODO:
// - option for deep merge?
// - option for providing a custom `mergeNamespaces` function?
const mergeNamespaces = (
  parentNamespaces: Namespaces = {},
  namespaces: Namespaces = {},
  translations?: TranslationData,
): Namespaces => ({
  ...parentNamespaces,
  ...namespaces,
  ...(translations && {
    [DEFAULT_NAMESPACE]: translations,
  }),
});

interface UseTranslationReturnValue {
  t: TFunction;
}

export const useTranslation = (namespace?: string) => ({
  t: namespace
    ? (key, args) => useContext(TranslationContext).t(key, {
      ns: namespace,
      ...args,
    })
    : useContext(TranslationContext).t,
}) as UseTranslationReturnValue;

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
  locale,
  namespaces,
  translations,
  children,
}) => {
  const { namespaces: parentNamespaces } = useContext(TranslationContext);
  const [ mergedNamespaces ] = useState(
    () => mergeNamespaces(parentNamespaces, namespaces, translations),
  );

  return (
    <TranslationContext.Provider
      value={{
        locale,
        namespaces: mergeNamespaces(parentNamespaces, namespaces, translations),
        t: (key, args) => processTranslation({
          locale,
          namespaces: mergedNamespaces,
          key,
          args,
        }),
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

