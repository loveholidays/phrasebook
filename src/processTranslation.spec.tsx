import { processTranslation } from './processTranslation';
import namespaces from './testing/testNamespaces.json';

describe('processTranslation', () => {
  const locale = 'en-GB';
  const onError = jest.fn();

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
      [ 'stringWithParam', { param: 'foo' }, 'text with parameter: foo' ],
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
        args: { ns: 'ns1', param: 'foo' },
        onError,
      });

      expect(result).toBe('text with parameter: {{wrongParam}}');

      expect(onError).toHaveBeenCalledWith('REPLACE_ARGUMENT_NOT_FOUND', {
        key: 'stringWithParam',
        argumentName: 'param',
        value: 'foo',
      });
    });
  });
});
