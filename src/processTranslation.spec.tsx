import { processTranslation } from './processTranslation';
import namespaces from './testing/testNamespaces.json';

describe('processTranslation', () => {
  const locale = 'en-GB';
  const onError = jest.fn();

  describe('Should return expected translated value', () => {
    it.each([
      [ 'search.label', {}, 'Search' ],
      [ 'search.label', { count: 10 }, 'Search' ],
      [ 'reviews', { count: -10 }, '-10 reviews' ],
      [ 'reviews', { count: 0 }, '0 reviews' ],
      [ 'reviews', { count: 1 }, '1 review' ],
      [ 'reviews', { count: -1 }, '-1 review' ],
      [ 'reviews', { count: 123 }, '123 reviews' ],
      [ 'boardBasis.code', {}, 'Board Basis' ],
      [ 'boardBasis.code', { context: 'AI' }, 'All Inclusive hotel' ],
      [ 'boardBasis.code', { context: 'AI', count: 1 }, 'All Inclusive hotel' ],
      [ 'boardBasis.code', { context: 'AI', count: 2 }, 'All Inclusive hotels' ],
      [ 'empty', {}, '' ],
      [ 'title', { ns: 'ns1' }, 'title from namespace 1' ],
      [ 'stringWithParam', { param: 'foo' }, 'text with parameter: foo' ],
      [ 'stringWithParam', { ns: 'ns1', param1: 'test1', param2: 'test2' }, 'text with parameter: test1' ],
      [ 'stringWithParam', { ns: 'ns2', param1: 'test1', param2: 'test2' }, 'text with parameters: test1 test2' ],
    ])('%s %p => %s', (key, args, expected) => {
      expect(
        processTranslation({
          locale,
          namespaces,
          key,
          args,
          onError,
        }),
      ).toBe(expected);
      expect(onError).not.toHaveBeenCalled();
    });
  });

  describe('Should throw expected error', () => {
    it.each([
      [ 'missing.translation.key', {}, 'Missing translation: "missing.translation.key"' ],
      [ 'boardBasis', { context: 'foo' }, 'Missing translation: "boardBasis" with suffix: "foo"' ],
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

  describe('when calling with wrong param', () => {
    it('Should log the error', () => {
      const result = processTranslation({
        locale,
        namespaces,
        key: 'stringWithParam',
        args: { param1: 'test' },
        onError,
      });

      expect(result).toBe('text with parameter: {{ param  }}');

      expect(onError).toHaveBeenCalledWith('REPLACE_ARGUMENT_NOT_PASSED', {
        key: 'stringWithParam',
        argumentName: 'param',
      });
    });
  });

  describe('Override number locale', () => {
    it('should format number based on override locale', () => {
      const result = processTranslation({
        locale,
        numberLocale: 'de-DE',
        namespaces,
        key: 'reviews',
        args: { count: 12345 },
        onError,
      });

      expect(result).toBe('12.345 reviews');
    });
  });
});
