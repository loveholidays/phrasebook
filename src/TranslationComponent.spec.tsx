/* eslint-disable global-require */

import React from 'react';

import { render } from '@testing-library/react';
import { Translation } from './TranslationComponent';
import { TranslationProvider } from './TranslationProvider';

describe('Translation component', () => {
  const locale = 'en-GB';
  const translations = require('./testing/testTranslations.json');

  it('translates the default component', () => {
    const { asFragment } = render(
      <TranslationProvider
        locale={locale}
        translations={translations}
      >
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
      </TranslationProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('translates with one param and two components', () => {
    const { asFragment } = render(
      <TranslationProvider
        locale={locale}
        translations={translations}
      >
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
      </TranslationProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('translates with two params and one component', () => {
    const { asFragment } = render(
      <TranslationProvider
        locale={locale}
        translations={translations}
      >
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
      </TranslationProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('translates when the components have children', () => {
    const { asFragment } = render(
      <TranslationProvider
        locale={locale}
        translations={translations}
      >
        <Translation
          translationKey="componentWithChildren"
          components={[
            (text) => <a href="/#">{text}</a>,
            (text) => <strong>{text}</strong>,
          ]}
        />
      </TranslationProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
