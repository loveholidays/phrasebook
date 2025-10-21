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

  let suffix = args.context;

  if (typeof args[COUNT] !== 'undefined') {
    const count = args[COUNT] as number;
    let pluralSuffix: string | undefined;

    if (count === 0 && root[`${lastPart}_zero`]) {
      pluralSuffix = 'zero';
    } else {
      try {
        const pluralRules = new Intl.PluralRules(locale);
        const category = pluralRules.select(Math.abs(count));
        const categoryKey = suffix ? `${lastPart}_${suffix}_${category}` : `${lastPart}_${category}`;

        if (root[categoryKey]) {
          pluralSuffix = category;
        } else if (!suffix && root[`${lastPart}_${category}`]) {
          pluralSuffix = category;
        } else if (root[`${lastPart}_other`] || (suffix && root[`${lastPart}_${suffix}_other`])) {
          pluralSuffix = 'other';
        } else if (count !== 1 && count !== -1) {
          pluralSuffix = 'plural';
        }
      } catch {
        if (count !== 1 && count !== -1) {
          pluralSuffix = 'plural';
        }
      }
    }

    if (pluralSuffix) {
      suffix = suffix ? `${suffix}_${pluralSuffix}` : pluralSuffix;
    }
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
