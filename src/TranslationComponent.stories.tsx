import React from 'react';

import { Translation } from './TranslationComponent';

export default {
  title: 'Translation',
};

export const Default = () => (
  <Translation
    translationKey="translationComponent"
    params={{
      first: 'a',
      second: 'b',
    }}
    components={[
      <strong key={1}>1234</strong>,
      <strong key={2}>Y</strong>,
    ]}
  />
);

export const OneParamTwoComponents = () => (
  <Translation
    translationKey="oneParamTwoComponents"
    params={{
      first: 'a',
    }}
    components={[
      <strong key={1}>1234</strong>,
      <strong key={2}>Y</strong>,
    ]}
  />
);

export const TwoParamsOneComponent = () => (
  <Translation
    translationKey="twoParamsOneComponent"
    params={{
      first: 'a',
      second: 'b',
    }}
    components={[
      <strong key={1}>1234</strong>,
    ]}
  />
);

export const ComponentWithChildren = () => (
  <Translation
    translationKey="componentWithChildren"
    components={[
      (text) => <a href="/#">{text}</a>,
      (text) => <strong>{text}</strong>,
    ]}
  />
);
