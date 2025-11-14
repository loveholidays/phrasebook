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
        locale: 'de-DE',
        namespaces,
        key: 'reviews',
        args: { count: 12345 },
        onError,
      });

      expect(result).toBe('12.345 reviews');
    });
  });

  describe('i18next plural format support', () => {
    describe('Polish plurals (one, few, many, other)', () => {
      it.each([
        [ 'nights_pl', { count: 1 }, '1 noc', 'one' ],
        [ 'nights_pl', { count: 2 }, '2 noce', 'few' ],
        [ 'nights_pl', { count: 3 }, '3 noce', 'few' ],
        [ 'nights_pl', { count: 4 }, '4 noce', 'few' ],
        [ 'nights_pl', { count: 5 }, '5 nocy', 'many' ],
        [ 'nights_pl', { count: 10 }, '10 nocy', 'many' ],
        [ 'nights_pl', { count: 21 }, '21 nocy', 'many' ],
        [ 'nights_pl', { count: 22 }, '22 noce', 'few' ],
        [ 'nights_pl', { count: 25 }, '25 nocy', 'many' ],
        [ 'nights_pl', { count: 100 }, '100 nocy', 'many' ],
      ])('%s with count=%s should return "%s" (%s)', (key, args, expected) => {
        const result = processTranslation({
          locale: 'pl',
          namespaces,
          key,
          args,
          onError,
        });

        expect(result).toBe(expected);
      });
    });

    describe('Arabic plurals (zero, one, two, few, many, other)', () => {
      it.each([
        [ 'nights_ar', { count: 0 }, '٠ ليلة', 'zero' ],
        [ 'nights_ar', { count: 1 }, 'ليلة واحدة', 'one' ],
        [ 'nights_ar', { count: 2 }, 'ليلتان', 'two' ],
        [ 'nights_ar', { count: 3 }, '٣ ليالٍ', 'few' ],
        [ 'nights_ar', { count: 10 }, '١٠ ليالٍ', 'few' ],
        [ 'nights_ar', { count: 11 }, '١١ ليلة', 'many' ],
        [ 'nights_ar', { count: 100 }, '١٠٠ ليلة', 'other' ],
      ])('%s with count=%s should return "%s" (%s)', (key, args, expected) => {
        const result = processTranslation({
          locale: 'ar',
          namespaces,
          key,
          args,
          onError,
        });

        expect(result).toBe(expected);
      });
    });

    describe('Czech plurals (one, few, many, other)', () => {
      it.each([
        [ 'nights_cs', { count: 1 }, '1 noc', 'one' ],
        [ 'nights_cs', { count: 2 }, '2 noci', 'few' ],
        [ 'nights_cs', { count: 3 }, '3 noci', 'few' ],
        [ 'nights_cs', { count: 4 }, '4 noci', 'few' ],
        [ 'nights_cs', { count: 5 }, '5 nocí', 'many' ],
        [ 'nights_cs', { count: 10 }, '10 nocí', 'many' ],
      ])('%s with count=%s should return "%s" (%s)', (key, args, expected) => {
        const result = processTranslation({
          locale: 'cs',
          namespaces,
          key,
          args,
          onError,
        });

        expect(result).toBe(expected);
      });
    });

    describe('Backward compatibility with _plural suffix', () => {
      it('should still work with old _plural format', () => {
        expect(
          processTranslation({
            locale: 'en-GB',
            namespaces,
            key: 'reviews',
            args: { count: 0 },
            onError,
          }),
        ).toBe('0 reviews');

        expect(
          processTranslation({
            locale: 'en-GB',
            namespaces,
            key: 'reviews',
            args: { count: 1 },
            onError,
          }),
        ).toBe('1 review');

        expect(
          processTranslation({
            locale: 'en-GB',
            namespaces,
            key: 'reviews',
            args: { count: 5 },
            onError,
          }),
        ).toBe('5 reviews');
      });
    });
  });
});
