# @loveholidays/phrasebook

## 2.1.2

### Patch Changes

- c21de8b: bump the version update

## 2.1.1

### Patch Changes

- 0bc5fbc: bump the version

## 2.1.0

### Minor Changes

- 8ce252e: Support mix of context and plural form

## 2.0.2

### Patch Changes

- eddf17e: Fix bug using a hook in the t function

## 2.0.1

### Patch Changes

- d3048ab: Fix React 18 compatibility by using explicit children prop in TranslationProvider

## 2.0.0

### Major Changes

- 3c6181f: Breaking change:
  onError handler API:

  - removing `REPLACE_ARGUMENT_NOT_FOUND` error
  - adding `REPLACE_ARGUMENT_NOT_PASSED` error

  List of changes:

  - Checking that all the specified parameters in the translation string are passed
  - Stop triggering `onError` when passing the parameter that does not exist in the translation string
  - Changing the error type name `REPLACE_ARGUMENT_NOT_FOUND` -> `REPLACE_ARGUMENT_NOT_PASSED`
  - Removing `value` from the error data payload for `REPLACE_ARGUMENT_NOT_PASSED` error

## 1.2.1

### Patch Changes

- 4b74c25: Fixing the error handling bug for `count` argument processing

## 1.2.0

### Minor Changes

- 42cdb72: Adding onError callback for arguments substitution errors

## 1.1.0

### Minor Changes

- d54c25b: Adding support for namespaces

## 1.0.2

### Patch Changes

- 8fd7dd9: Update readme with examples

## 1.0.1

### Patch Changes

- d8a6b82: Make public

## 1.0.0

### Major Changes

- 4107522: V1 release

## 0.0.4

### Patch Changes

- 0e1a9cc: Exports translation context value interace

## 0.0.3

### Patch Changes

- 5b8b8a3: Fix publishing

## 0.0.2

### Patch Changes

- 51da9f3: Add support for changesets and github actions
