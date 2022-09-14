# WSO2 Identity Server Theme

Styles, fonts and images for WSO2 Identity Server Web Apps

## Setup build environment

Install NodeJS from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

## Build

- Run `pnpm build` from the command line in folder root directory (where the root `package.json` is located).

- `dist` folder will create in the root directory with self contained themes.

## Generate sub theme

This theme module is build with customized [Semantic-UI](https://semantic-ui.com/) less distribution files along with some enhancements to support our product styling and capabilities.

1. Run `pnpm build` once. And there will be new sample theme generated under `src/themes/` folder.

1. Create a duplicate from the generated sample theme folder `src/themes/sample` => E.g. `src/themes/foo-theme`.

1. Use less overrides and variables to override existing styles. Use files in `src/semantic-ui-core/default` & `src/themes/default` as reference.

1. Re-build the project. And your new sub-theme will be created in the `dist` folder.

## Reporting Issues

We encourage you to report issues, improvements and feature requests regarding the project through [GitHub Issue Tracker](https://github.com/wso2/identity-apps/issues).

**Important:** And please be advised that, security issues must be reported to [security@wso2.com](mailto:security@wso2.com), not as GitHub issues, in order to reach proper audience. We strongly advise following the [WSO2 Security Vulnerability Reporting Guidelines](https://docs.wso2.com/display/Security/WSO2+Security+Vulnerability+Reporting+Guidelines) when reporting the security issues.
