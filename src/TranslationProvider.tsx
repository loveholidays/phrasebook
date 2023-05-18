import React, { createContext, useContext, useMemo } from 'react';
import { DEFAULT_NAMESPACE } from './constants';

import { processTranslation } from './processTranslation';
import type {
  Namespaces, Locale, TFunction, TranslationData, TranslationArgumentValue,
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
  onError?: (
    error: string,
    data: {
      key: string;
      argumentName: string;
      value: TranslationArgumentValue;
    }
  ) => void;
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

export interface UseTranslationReturnValue {
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
  onError,
  children,
}) => {
  const { namespaces: parentNamespaces } = useContext(TranslationContext);
  const mergedNamespaces = useMemo(
    () => mergeNamespaces(parentNamespaces, namespaces, translations),
    [ parentNamespaces, namespaces, translations ],
  );

  return (
    <TranslationContext.Provider
      value={{
        locale,
        namespaces: mergedNamespaces,
        t: (key, args) => processTranslation({
          locale,
          namespaces: mergedNamespaces,
          key,
          args,
          onError,
        }),
      }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

