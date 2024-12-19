# Maintenance

Follow this guide to learn about the maintainance tasks of the repository.

* [Dependabot Updates](#dependabot-updates)

## Dependabot Updates

PRs sent by `dependabot` can be found here - https://github.com/wso2/identity-apps/pulls/app%2Fdependabot

Before merging `dependabot` PRs, they need to be tested and verified that they don't introduce any bugs or breaking changes locally.

1. Fetch the latest codebase from upstream.

2. **Locally** merge the dependabot branch.

3. Test the changes and verify that everything is working in the product.

4. If the changes are non-breaking, add a comment to verify the testing of the dependabot PR. Since `dependabot` bumps the `package.lock.json` versions, if the dependency in question is a **direct dependency**, we can bump the version in `package.json`  and send another PR closing the dependabot PR.

5. If it's a **transitive dependency**, we can check whether we can bump the parent dependency. In case if the parent dependency doesn't have the fixed version of the transitive dependency, we can create an issue in the respective project and merge the `package.lock.json` as a temporary fix.

6. If there are breaking changes, send a PR to fix those breaking changes introduced from the newer dependency version. If it is not possible to fix the breaking changes or requires a significant effort, create a git issue and link it to the Dependabot PR to track these changes.
