import { processTranslation } from './processTranslation';

describe('processTranslation', () => {
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
      code_BB: 'Breakfast Included',
    },
    empty: '',
  };

  it.each([
    [ 'search.label', {}, 'Search' ],
    [ 'reviews', { count: -10 }, '-10 reviews' ],
    [ 'reviews', { count: 0 }, '0 reviews' ],
    [ 'reviews', { count: 1 }, '1 review' ],
    [ 'reviews', { count: -1 }, '-1 review' ],
    [ 'reviews', { count: 123 }, '123 reviews' ],
    [ 'boardBasis.code', {}, 'Board Basis' ],
    [ 'boardBasis.code', { context: 'AI' }, 'All Inclusive' ],
    [ 'empty', {}, '' ],
  ])('%s %p => %s', (key, args, expected) => {
    expect(
      processTranslation({
        locale,
        translations,
        key,
        args,
      }),
    ).toBe(expected);
  });

  it('throws error when translation was not found', () => {
    expect(
      () => processTranslation({
        locale,
        translations,
        key: 'missing.translation.key',
      }),
    ).toThrow('Missing translation: "missing.translation.key"');

    expect(
      () => processTranslation({
        locale,
        translations,
        key: 'boardBasis',
        args: { context: 'foo' },
      }),
    ).toThrow('Missing translation: "boardBasis" with suffix: "foo"');
  });
});
