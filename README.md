# Phrasebook

A lightweight translation library for React/Preact projects with a similar interface to `react-i18next`.

Made with ❤️ by [loveholidays.com](https://www.loveholidays.com)

## Why phrasebook?

- Tree-shakeable
- Similar interface to `react-i18next`
- Native ESM module with TypeScript type definitions
- Small bundle size (~1kb)

This package exports native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and does not provide a CommonJS export.

## Bundle size comparisons

| Package                  | Bundle size (gzip)                                                | Difference |
| ------------------------ | ----------------------------------------------------------------- | ---------- |
| @loveholidays/phrasebook | [1.1kb](https://bundlephobia.com/package/@loveholidays/phrasebook)| baseline   |
| @lingui/react@4.11       | [1.4kb](https://bundlephobia.com/package/@lingui/react@4.11.4)    | + 27%      |
| react-i18next@15.0       | [5.3kb](https://bundlephobia.com/package/react-i18next@15.0.2)    | + 482%     |

## Installation

Currently available on [NPM](https://www.npmjs.com/package/@loveholidays/phrasebook):

```
$ npm i -S @loveholidays/phrasebook
- or -
$ yarn add @loveholidays/phrasebook
```

## Usage

Use the `TranslationProvider` to create the localisation context:

```tsx
import { TranslationProvider } from '@loveholidays/phrasebook';

const App = () => (
  <TranslationProvider
    locale="en-gb"
    translations={translations}
    onError={(errorType, data) => {
      const { key, argumentName } = data;
    }}
  >
    // ...
  </TranslationProvider>
);
```

The `locale` string is used for locale specific number formatting.
The `translations` object follows a format similar to the i18next JSON format [with some exceptions](#differences-to-i18next).

Use the `useTranslation` hook to access the translation function:

```tsx
import { useTranslation } from '@loveholidays/phrasebook';

const MyComponent = () => {
  const { t } = useTranslation();

  return (
    <>
      <h1>{t('helloWorld')}</h1>
      <h2>{t('welcomeBack', { name: 'David' })}</h2>
      <p>{t('youHaveXNewMessages', { count: 14 })}</p>
    </>
  );
};
```

Use the `Translation` component to embed React components into the translations (similar to the [Trans component](https://react.i18next.com/latest/trans-component) of `react-i18next`):

```tsx
import { Translation } from '@loveholidays/phrasebook';

const MyComponent = () => (
  <p>
    <Translation
      translationKey="myKey" // "Read all the {count} reviews <1>here</1>, served by: <2>"
      params={{
        count: 1234,
      }}
      components={[
        (text) => <a href="/#">{text}</a>, // text between <1> and </1> is passed in as a param
        <img src="logo.svg" />,
      ]}
    />
  </p>
);

// result: <p>Read all the 1234 reviews <a href="/#">here</a>, served by: <img src="logo.svg" /></p>
```

## Differences to i18next

The goal is to provide a lightweight alternative for the most common used features of `react-i18next`, although phrasebook won't ever be 100% compatible with that.

- There is no support for [translation backends](https://www.i18next.com/how-to/add-or-load-translations#combined-with-a-backend-plugin), the translation object must be loaded and passed in to the `TranslationProvider`.
- The translation object format is not fully compatible with the [i18next JSON format](https://www.i18next.com/misc/json-format), the currently supported features are: nested translations, `_plural` suffix, [contexts](https://www.i18next.com/translation-function/context#basic).

## Namespaces

Namespaced translations can be used with `<TranslationProvider />` by passing an object into the `namespaces` prop - where the keys are the names of the namespaces and the values are the translations for the given namespace:

```tsx
<TranslationProvider
  locale={locale}
  namespaces={{
    homepage: {
      title: 'Homepage',
    },
    checkout: {
      title: 'Checkout',
    },
  }}
>
```

The `ns` option controls the namespace when using the `t` function:

```tsx
const { t } = useTranslation();

const homepageTitle = t('title', { ns: 'homepage' });
const checkoutTitle = t('title', { ns: 'checkout' });
```

To avoid repeating the `ns` option when using `t`, the default namespace can be changed when using the `useTranslation` hook:

```tsx
const { t } = useTranslation('homepage');

const homepageTitle = t('title');
const checkoutTitle = t('title', { namespace: 'checkout' });
```

The `Translation` component takes an optional `namespace` prop to achieve the same:

```tsx
  <Translation
    translationKey="myKey"
    namespace="myNamespace"
    params={ ... }
    components={ ... }
  />
```

## i18n ally extension support for VS Code

We highly recommend to use the [i18n ally](https://github.com/lokalise/i18n-ally) extension for VS Code users. To make it work with phrasebook you need to add this file to your project:

```yaml
# .vscode/i18n-ally-custom-framework.yml

languageIds:
  - javascript
  - typescript
  - javascriptreact
  - typescriptreact
usageMatchRegex:
  - "[^\\w\\d]t\\(['\"`]({key})['\"`]"
monopoly: false
```

## Contributing

Please see our [contributing guidelines](./CONTRIBUTING.md)
