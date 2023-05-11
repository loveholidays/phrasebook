import { processTranslation } from './processTranslation';
import namespaces from './testing/testNamespaces.json';

describe('processTranslation', () => {
  const locale = 'en-GB';

  describe('Should return expected translated value', () => {
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
  });

  describe('Should throw expected error', () => {
    it.each([
      [ 'missing.translation.key', {}, 'Missing translation: "missing.translation.key"' ],
      [ 'boardBasis', { context: 'foo' }, 'Missing translation: "boardBasis" with suffix: "foo"' ],
      [ 'reviews', { missingArgument: 'foo' }, 'Argument: "missingArgument" with value: "foo" is not valid' ],
    ])('Should throw exception %s %p => %s', (key, args, expected) => {
      expect(
        () => processTranslation({
          locale,
          namespaces,
          key,
          args,
        }),
      ).toThrow(expected);
    });
  });
});
