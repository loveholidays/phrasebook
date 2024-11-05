import React from 'react';

import { render } from '@testing-library/react';
import { TranslationProvider, useTranslation } from './TranslationProvider';
import { TranslationArguments } from './types';

import namespaces from './testing/testNamespaces.json';

interface TestComponentProps {
  name: string;
  namespace?: string;
  args?: TranslationArguments;
}

const TestComponent: React.FC<TestComponentProps> = ({
  name,
  namespace,
  args,
}) => {
  const { t } = useTranslation(namespace);

  return (
    <span>{t(name, args)}</span>
  );
};

describe('TranslationProvider', () => {
  const locale = 'en-GB';

  it('exposes the translation function via useTranslation hook', () => {
    const { asFragment } = render(
      <TranslationProvider
        locale={locale}
        namespaces={namespaces}
      >
        <TestComponent
          name="search.label"
        />
        <TestComponent
          name="reviews"
          args={{ count: 1 }}
        />
        <TestComponent
          name="reviews"
          args={{ count: 4 }}
        />
        <TestComponent
          name="boardBasis.code"
        />
        <TestComponent
          name="boardBasis.code"
          args={{ context: 'AI' }}
        />
        <TestComponent
          name="title"
          namespace="ns1"
        />
        <TestComponent
          name="title"
          args={{ ns: 'ns2' }}
        />
      </TranslationProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('merges namespaces when nesting providers', () => {
    const { asFragment } = render(
      <TranslationProvider
        locale={locale}
        namespaces={{
          ns1: namespaces.ns1,
        }}
      >
        <TranslationProvider
          locale={locale}
          namespaces={{
            ns2: namespaces.ns2,
          }}
        >
          <TestComponent
            name="title"
            namespace="ns1"
          />
          <TestComponent
            name="title"
            args={{ ns: 'ns2' }}
          />
        </TranslationProvider>
      </TranslationProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should override number format', () => {
    const { asFragment } = render(
      <TranslationProvider
        locale={locale}
        namespaces={namespaces}
      >
        <TestComponent
          name="reviews"
          args={{ count: 12345 }}
        />
        <TestComponent
          name="reviews"
          args={{ count: 12345, overrideLocale: 'de-DE' }}
        />
      </TranslationProvider>,
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
