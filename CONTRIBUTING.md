## How to contribute?

We follow pretty standard rules around pull requests and issues. Please ensure you use a title that is descriptive of the changes you are making.

If you have an idea for a feature or want to fix a bug, please consider opening an issue first. We're also happy to discuss and help you open a PR and get your changes in!

If you think you've found a bug, open a new issue.
If you found a bug you'd like to fix, open a PR.

## How do I setup the project?

You can install all the dependencies with `npm`.

```
npm i
```

Useful commands:

- `npm run build` - Builds the package for testing/publishing
- `npm run lint` - Runs eslint on the package
- `npm run test` - Runs our jest tests for the package

## Publishing & Versioning

We use changesets to manage our versioning and to handle when a new version is published. For more details please read [this guide](./.changeset/README.md)

New versions will be published on merge to main if a changeset was supplied as part of a pull request.
