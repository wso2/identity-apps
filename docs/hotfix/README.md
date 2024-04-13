# Hotfixing Identity Apps

This guide will walk you through preparing hotfixes for a specific Console, My Account or JSP applications (Authentication Portal, Recovery Portal and X509 Authentication Portal) version.


1. Create a hotfix branch for the application version to be hotfixed, using the [*🔥 Hotfix Branch Creation*](https://github.com/wso2/identity-apps/actions/workflows/hotfix-branch-creation.yml) Github Action.

> ℹ️ **Note**
>
> If you don't have enough permission to trigger the workflow yet, feel free to ask someone with permission to trigger the workflow for you.

2. Fetch the created hotfix branch to your local repo, and apply your changes.

```bash
# if upstream repository is not set already
git remote add upstream https://github.com/wso2/identity-apps.git
git fetch upstream
```

3. Send a PR from your branch, targeting the created hotfix branch in upstream repository.

> ℹ️ Note
>
> It's not needed to add changesets to a hotfix PR.

4. Upon merging the PR, a hotfix release will be automatically triggered. You can find the hotfix release in the [releases](https://github.com/wso2/identity-apps/releases).
