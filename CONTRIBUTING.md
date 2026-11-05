## How to contribute?

We follow pretty standard rules around pull requests and issues. Please ensure you use a title that is descriptive of the changes you are making.

If you have an idea for a feature or want to fix a bug, please consider opening an issue first. We're also happy to discuss and help you open a PR and get your changes in!

If you think you've found a bug, open a new issue.
If you found a bug you'd like to fix, open a PR.

## How do I setup the project?

Use Node 24, as specified in `.nvmrc` (`nvm use` if you use nvm). You can install all the dependencies with `npm`.

```
npm i
```

Useful commands:

- `npm run build` - Builds the package for testing/publishing
- `npm run lint` - Runs eslint on the package
- `npm run test` - Runs our jest tests for the package

## Publishing & Versioning

We use changesets to manage our versioning. For more details please read [this guide](./.changeset/README.md).

New versions are staged on merge to main if a changeset was supplied as part of a pull request. A package maintainer must approve the staged version before it is published.

### npm trusted publishing

The main workflow stages `@loveholidays/phrasebook` using GitHub Actions OIDC, without an npm token. It grants the build job `id-token: write` and installs npm 11.15.0 or later, as required for staged publishing. Changesets manages versioning; `npm stage publish --access public --tag latest` submits the built package for approval. The workflow does not publish directly or create a release tag.

The trusted publisher in the package's npm settings must match:

- Provider: GitHub Actions
- Organization: `loveholidays`
- Repository: `phrasebook`
- Workflow filename: `build-main.yaml` (without `.github/workflows/`)
- Environment: leave blank
- Allowed actions: `npm stage publish` only; direct `npm publish` is not required

Coordinate a new trusted publisher's setup with the next intended release and complete the first release within two days to avoid configuration expiry. A push without changesets skips staging and does not validate the trusted publisher.

### Approving a release

After a successful staging run, open the package's Staged Packages tab on npmjs.com, inspect the staged version, and approve it with 2FA. Alternatively, use npm 11.15.0 or later while signed in as a package maintainer:

```bash
npm stage list @loveholidays/phrasebook
npm stage view <stage-id>
npm stage approve <stage-id>
```

Approval publishes the version with the `latest` dist-tag. Confirm the version is available on npm before creating and pushing its Git tag. Use the exact `Update package versions` commit from the staging run, rather than the current main tip:

```bash
git fetch origin main
git show <version-commit>:package.json
git tag -a v<approved-version> <version-commit> -m "Release v<approved-version>"
git push origin refs/tags/v<approved-version>
```

Approve pending releases in version order so an older approval does not move `latest` backwards. If staging fails after the version commit was pushed, the changesets have already been consumed: a new push without changesets will skip staging. Check for an existing stage first, since a version already staged cannot be submitted again. If no stage exists, a signed-in package maintainer can check out the recorded version commit in a clean checkout, run `npm ci` and `npm run build` on Node 24, then run `npm stage publish --access public --tag latest` with npm 11.15.0 or later. If a stage is rejected, submit a new changeset for a new version.

After the first successful OIDC release, confirm that the package version and release tag were published, then remove Phrasebook's unused npm secret access. Check other consumers before revoking the underlying token or deleting a shared secret. Git pushes use the automatic GitHub Actions token configured by checkout, with `contents: write`; this workflow does not need a GitHub PAT.

A package dry run checks package contents but cannot validate the OIDC trust relationship; that requires a real release from the main workflow. See [npm's trusted publishing documentation](https://docs.npmjs.com/trusted-publishers/) and the related secrets follow-up [webmono#5510](https://github.com/loveholidays/webmono/issues/5510).
