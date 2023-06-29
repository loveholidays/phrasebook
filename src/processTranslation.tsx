import { DEFAULT_NAMESPACE } from './constants';
import {
  Locale, Namespaces, TranslationArguments, TranslationArgumentValue, TranslationData,
} from './types';
import type { OnErrorCallback } from './TranslationProvider';

const formatArgument = (
  locale: Locale,
  value: TranslationArgumentValue,
) => {
  if (typeof value === 'number') {
    try {
      return new Intl.NumberFormat(locale).format(value);
    } catch {
      return value;
    }
  }

  return value;
};

const COUNT = 'count';

interface ProcessTranslationParams {
  locale: Locale;
  namespaces: Namespaces;
  key: string;
  onError?: OnErrorCallback;
  args?: TranslationArguments;
}

export const processTranslation = ({
  locale,
  namespaces,
  key,
  onError,
  args = {},
}: ProcessTranslationParams) => {
  const namespaceName = args.ns ?? DEFAULT_NAMESPACE;

  const parts = key.split('.');
  const lastPart = parts[parts.length - 1];
  const root = parts.slice(0, -1).reduce(
    (root, part) => root?.[part] as TranslationData,
    namespaces[namespaceName],
  );

  if (typeof root !== 'object') {
    throw new Error(`Missing translation: "${key}"`);
  }

  let suffix;

  if (args.context) {
    suffix = args.context;

  // @TODO: Update to the new format https://www.i18next.com/translation-function/plurals
  } else if (typeof args[COUNT] !== 'undefined' && args[COUNT] !== 1 && args[COUNT] !== -1) {
    suffix = 'plural';
  }

  const translation = root[suffix ? `${lastPart}_${suffix}` : lastPart] ?? root[lastPart];

  if (typeof translation !== 'string') {
    throw new Error(`Missing translation: "${key}" with suffix: "${suffix}"`);
  }

  const {
    context,
    ns,
    ...replaceableArgs
  } = args;

  if (onError) {
    const replaceableParams = translation.match(/{{\s*\w*\s*}}/g);

    replaceableParams?.forEach((p) => {
      const param = p.replace(/({{\s*|\s*}})/g, '');

      if (replaceableArgs[param] === undefined) {
        onError(
          'REPLACE_ARGUMENT_NOT_PASSED',
          { key, argumentName: param },
        );
      }
    });
  }

  // Replace placeholders like `{{someText}}` with values from `args`
  return Object.entries(replaceableArgs).reduce(
    (v, [ name, value ]) => {
      const regexp = new RegExp(`{{\\s*${name}\\s*}}`, 'g');
      const localizedValue = String(formatArgument(locale, value));

      return v.replace(regexp, localizedValue);
    },
    translation as string,
  );
};
