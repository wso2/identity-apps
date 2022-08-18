# Maintenance

Follow this guide to learn about the maintainance tasks of the repository.

* [Dependabot Updates](#dependabot-updates)

## Dependabot Updates

PRs sent by Dependabot can be found here - https://github.com/wso2/identity-apps/pulls/app%2Fdependabot

Before merging Dependabot PRs, they need to be tested and verified that they don't introduce any bugs or breaking changes locally.

1. Fetch the latest codebase from upstream.

2. **Locally** merge the dependabot branch.

3. Test the changes and verify that everything is working in the product.

4. If the changes are non-breaking, add a comment to verify the testing of the Dependabot PR and merge the PR.

5. If there are breaking changes, send a PR to fix those breaking changes introduced from the newer dependency version. If it is not possible to fix the breaking changes or requires a significant effort, create a git issue and link it to the Dependabot PR to track these changes.
