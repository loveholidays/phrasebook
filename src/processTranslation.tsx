import { DEFAULT_NAMESPACE } from './constants';
import {
  Locale, Namespaces, TranslationArguments, TranslationArgumentValue, TranslationData,
} from './types';

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

interface ProcessTranslationParams {
  locale: Locale;
  namespaces: Namespaces;
  key: string;
  args?: TranslationArguments;
}

export const processTranslation = ({
  locale,
  namespaces,
  key,
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
  } else if (typeof args.count !== 'undefined' && args.count !== 1 && args.count !== -1) {
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

  // Replace placeholders like `{{count}}` with values from `args`
  return Object.entries(replaceableArgs).reduce(
    (v, [ name, value ]) => {
      const regexp = new RegExp(`{{\\s*${name}\\s*}}`, 'g');

      if (!regexp.test(v)) {
        console.error(`Argument: "${name}" with value: "${value}" is not valid`);
      }

      const localizedValue = String(formatArgument(locale, value));

      return v.replace(regexp, localizedValue);
    },
    translation as string,
  );
};
