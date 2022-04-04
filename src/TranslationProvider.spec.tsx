import React from 'react';

import { render } from '@testing-library/react';
import { TranslationProvider, useTranslation } from './TranslationProvider';
import { TranslationArguments } from './types';

describe('TranslationProvider', () => {
  const locale = 'en-GB';
  const translations = {
    search: {
      label: 'Search',
    },
    reviews: '{{count}} review',
    reviews_plural: '{{count}} reviews',
    boardBasis: {
      code: 'Board Basis',
      code_AI: 'All Inclusive',
    },
  };

  it('translates using useTranslation hook', () => {
    const Test: React.FC<{ name: string; args?: TranslationArguments }> = ({ name, args }) => {
      const { t } = useTranslation();

      return (
        <span>{t(name, args)}</span>
      );
    };

    const { asFragment } = render(
      <TranslationProvider
        locale={locale}
        translations={translations}
      >
        <Test
          name="search.label"
        />
        <Test
          name="reviews"
          args={{ count: 1 }}
        />
        <Test
          name="reviews"
          args={{ count: 4 }}
        />
        <Test
          name="boardBasis.code"
        />
        <Test
          name="boardBasis.code"
          args={{ context: 'AI' }}
        />
      </TranslationProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
