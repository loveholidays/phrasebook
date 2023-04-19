import { processTranslation } from './processTranslation';
import namespaces from './testing/testNamespaces.json';

describe('processTranslation', () => {
  const locale = 'en-GB';

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
    [ 'title', { ns: 'ns1' }, 'title from namespace 1' ],
  ])('%s %p => %s', (key, args, expected) => {
    expect(
      processTranslation({
        locale,
        namespaces,
        key,
        args,
      }),
    ).toBe(expected);
  });

  it('throws error when translation was not found', () => {
    expect(
      () => processTranslation({
        locale,
        namespaces,
        key: 'missing.translation.key',
      }),
    ).toThrow('Missing translation: "missing.translation.key"');

    expect(
      () => processTranslation({
        locale,
        namespaces,
        key: 'boardBasis',
        args: { context: 'foo' },
      }),
    ).toThrow('Missing translation: "boardBasis" with suffix: "foo"');
  });
});
