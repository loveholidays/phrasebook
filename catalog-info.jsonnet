local backstage = import 'backstage.libsonnet';
local Define = backstage.Define;
local Component = backstage.Component;
local Link = backstage.Link;

Define([
  Component(
    name='phrasebook',
    description='A lightweight translation library for React/Preact projects with a similar interface to react-i18next',
    type='library',
    lifecycle='production',
    repository='loveholidays/phrasebook',
    techdocs='url:https://github.com/loveholidays/phrasebook/tree/master',
    owner='digital-product-infrastructure',
    system='frontend',
    tags=['nodejs', 'typescript', 'open-source', 'i18n'],
    links=[
      Link('NPM package', 'https://www.npmjs.com/package/@loveholidays/phrasebook')
    ],
  )
])
