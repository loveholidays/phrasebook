# Phrasebook

A lightweight drop-in for `react-i18next` users looking to translate their projects. Currently in production on www.loveholidays.com.

## Why phrasebook?

- Tree-shakeable
- Like for like interface with `react-i18next`
- Native ESM module
- Small bundle size (<1kb)

We leverage `TFunction` types in our site which are not exported properly from `i18next` without including the entire bundle. With this package you have all the types you need alongside a fully working set of functions that translate i18next files.

This package uses native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and does not provide a CommonJS export.

### Bundle size comparisons

| Package                  | Bundle size                                                             | Difference                      |
| ------------------------ | ----------------------------------------------------------------------- | ------------------------------- |
| react-i18next            | [6.5kb](https://bundlephobia.com/package/react-i18next@11.16.2)         |                                 |
| @loveholidays/phrasebook | [883b](https://bundlephobia.com/package/@loveholidays/phrasebook@0.0.4) | 736% smaller than react-i18next |
| @lingui/react            | [2.5kb](https://bundlephobia.com/package/@lingui/react@3.13.2)          | 260% smaller than react-i18next |

## Installation

Currently available on [NPM](https://www.npmjs.com/package/@loveholidays/phrasebook)

```
$ npm i @loveholidays/phrasebook --save
```

### Usage

As this is a drop-in replacement usage is the same as i18next. For example if you are currently using react-i18next you can replace you imports like so:

```
import { useTranslation } from 'react-i18next';
```

becomes

```
import { useTranslation } from '@loveholidays/phrasebook';

```

## Contributing

Please see our [guidelines](./CONTRIBUTING.md)
