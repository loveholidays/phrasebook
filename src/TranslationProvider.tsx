import React, { createContext, useContext, useMemo } from 'react';
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

export interface ReplaceArgumentErrorParams {
  key: string;
  argumentName: string;
}

export type OnErrorCallback =
  & ((errorType: 'REPLACE_ARGUMENT_NOT_PASSED', params: ReplaceArgumentErrorParams) => void);

interface TranslationProviderProps {
  locale: Locale;
  namespaces?: Namespaces;
  translations?: TranslationData;
  onError?: OnErrorCallback;
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

/**
 * TranslationProvider
 * Provider used to create the localisation context.
 * @param {object} props
 * @param {string} props.locale String is used for locale specific formatting.
 * @param {object} props.namespaces Namespaced translations where the keys are the names of the namespaces and the values are the translations for the given namespace.
 * @param {object} props.translations Translation for default locale.
 * @param {function} props.onError Callback could be used to track the error during translation processing.
 * */
export const TranslationProvider: React.FC<React.PropsWithChildren<TranslationProviderProps>> = ({
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

