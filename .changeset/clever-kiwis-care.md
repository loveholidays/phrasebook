---
'@loveholidays/phrasebook': major
---

Breaking change:
onError handler API:

- removing `REPLACE_ARGUMENT_NOT_FOUND` error
- adding `REPLACE_ARGUMENT_NOT_PASSED` error

List of changes:

- Checking that all the specified parameters in the translation string are passed
- Stop triggering `onError` when passing the parameter that does not exist in the translation string
- Changing the error type name `REPLACE_ARGUMENT_NOT_FOUND` -> `REPLACE_ARGUMENT_NOT_PASSED`
- Removing `value` from the error data payload for `REPLACE_ARGUMENT_NOT_PASSED` error
