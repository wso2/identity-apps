# Hotfixing Identity Apps

This guide will walk you through preparing hotfixes for a specific Console, My Account or JSP applications (Authentication Portal, Recovery Portal and X509 Authentication Portal) version.

## Preparing hotfixes through Github Action

> # ⚠️ Temporarily disabled
>
> **Please note that the hotfix branch creation Github action is temporarily disabled due to several issues. We are proactively working on fixing them. Meanwhile, refer to the [guide for preparing hotfixes manually](#preparing-hotfixes-manually) for step by step instructions on manually creating hotfix releases yourself.**

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

4. Upon merging the PR, a hotfix release will be automatically triggered. You can find the created hotfix release in the [releases](https://github.com/wso2/identity-apps/releases).

## Preparing hotfixes manually

1. In the identity-apps Github UI, search and switch to the relevant git tag that needs to be hotfixed. **This is important for the second step.**

2. Create the hotfix branch from the selected tag, for the specific application version in wso2/identity-apps repo, from the branch dropdown in Github UI. Make sure to follow the `hotfix-<app_name>@<app_version>` format, when creating the hotfix branch. If there is already a branch with the same name, you may use that existing branch for your hotfix.

For example, if you are planning to send a hotfix for `@wso2is/console` v2.19.9 version, below is how you get to create the hotfix branch.

![create-hotfix-branch](https://i.imgur.com/NhRRXax.png)

3. Fetch the upstream repo branches to your local workspace, and create a new branch from the hotfix branch. This new branch is referred to as `hotfix_feature` throughout this document.

```bash
git fetch upstream hotfix-<app_name>@<app_version>
git checkout -b hotfix_feature hotfix-<app_name>@<app_version>
```

4. Implement your changes in the created feature branch (`hotfix_feature`) and send a PR from your hotfix_feature_branch targeting the created hotfix branch. Get the PR approved and merged.

5. Go to [releases](https://github.com/wso2/identity-apps/releases) and click on `Draft a new release`.

![draft-a-new-release](https://i.imgur.com/LiACkDj.png)

6. You will see the form to create a new release. Follow the steps below.

- For the tag name, type in the new release tag of the hotfix to be released. Please follow the format `<app_name>@<version>-hotfix-<hotfix-number>` when specifying the new release tag. Click `Create new <your_release_tag> on publish`. 

![enter-tag-name](https://i.imgur.com/2hEUI5s.png)

- Select the hotfix branch from the `target branch` dropdown

- Click `Generate release notes` button to get a release description automatically generated.

- Type in the same hotfix release tag you specified in the `Choose a tag` dropdown, in the `Release title` field as well.

- **UNTICK** the `Set as latest release` checkbox and click `Publish release`.

**Note: It is crucial to ensure that the `Set as latest release` checkbox is UNCHECKED, as failing to do so may disrupt internal workflows.**
