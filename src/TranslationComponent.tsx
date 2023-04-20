import React, { Fragment, ReactElement } from 'react';

import { useTranslation } from './TranslationProvider';

type TranslationComponent = (ReactElement | ((text: string) => ReactElement));

const regExp = {
  singleComponent: /^<(\d+)>$/,
  childrenComponent: /^<(\d+)>([^<]*)<\/\d+>$/,
  extractComponents: /(<\d+>[^<]*<\/\d+>|<\d+>)/,
};

const resolveParts = (parts: string[], components: TranslationComponent[]) => parts.map((part) => {
  // <1>
  if (regExp.singleComponent.test(part)) {
    const [ , i ] = part.match(regExp.singleComponent)!;
    const index = Number(i) - 1;

    return components[index];
  }

  // <1>text</1>
  if (regExp.childrenComponent.test(part)) {
    const [ , i, text ] = part.match(regExp.childrenComponent)!;
    const index = Number(i) - 1;

    const component = components[index];

    if (typeof component === 'function') {
      return component(text);
    }

    return component;
  }

  return part;
});

interface TranslationProps {
  translationKey: string;
  namespace?: string;
  params?: Record<string, string | number | undefined>;
  components?: TranslationComponent[];
}

export const Translation: React.FC<TranslationProps> = ({
  translationKey,
  namespace,
  params = {},
  components = [],
}) => {
  const { t } = useTranslation(namespace);
  const translation = t(translationKey, params);
  const parts = translation.split(regExp.extractComponents);
  const resolvedParts = resolveParts(parts, components);

  return (
    <Fragment>
      {resolvedParts.map((part, i) => (
        <Fragment key={i}>
          {part}
        </Fragment>
      ))}
    </Fragment>
  );
};
