# Phrasebook

A lightweight drop-in for i18next users looking to translate their projects.

loveholidays made Phrasebook for our [website](https://www.loveholidays.com/).

It supports tree-shaking, and generates less JavaScript than i18next.

Phrasebook supports tree shaking to help reduce the client side bundle. On our site this saved us 12kB compared to using i18next.

This package uses native [ESM](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) and does not provide a CommonJS export.

## Usage

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
