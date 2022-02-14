# Setting Up Development Environment

Follow this guide to set up the source code, development tools & other software.

* [Prerequisite Software](#prerequisite-software)
* [Setting up Development Tools](#setting-up-development-tools)
  * [React Developer Tools](#react-developer-tools)
  * [Redux DevTools](#redux-devtools)
  * [ESLint IDE Plugin](#eslint-ide-plugin)
    * [Webstorm](#webstorm)
    * [VS Code](#vs-code)
* [Setting up the Source Code](#setting-up-the-source-code)

## Prerequisite Software

To build and write code, make sure you have the following set of tools on your local environment:

* [Git](https://git-scm.com/downloads) - Open source distributed version control system. For install instructions, refer [this](https://www.atlassian.com/git/tutorials/install-git).

* [Node.js](https://nodejs.org/en/download/) - JavaScript runtime with node package manager ([npm](https://www.npmjs.com/)).

    > 💡`npm` 7 has some breaking changes to peer dependencies. Hence, go with a `npm` version lower than `7`.  We are working on to fix this issue. Tracker https://github.com/wso2/product-is/issues/10186.

* [Maven](https://maven.apache.org/download.cgi) - Build automation tool for Java projects.
  
    > 💡 For Maven 3.8 and up, please check the [Troubleshooting Guide](./TROUBLESHOOTING.md#build-failures).

* [Java Development Kit 1.8](https://www.oracle.com/java/technologies/javase/javase-jdk8-downloads.html) - Development environment for building applications using the Java programming language.

## Setting up Development Tools

### React Developer Tools

Browser extension to debug React code.

- [Download for Chrome](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)
- [Download for Firefox](https://addons.mozilla.org/en-US/firefox/addon/react-devtools/)

### Redux DevTools

Redux DevTools for debugging application's Redux store operations.

- [Download for Chrome](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=en)
- [Download for Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

### ESLint IDE Plugin

ESLint is a static code analysis tool for identifying problematic patterns found in JavaScript/Typescript code.

Make sure you setup the supplementary plugins in your IDE of choice.

#### Webstorm

WebStorm shows warnings and errors reported by ESLint right in the editor, as you type.

- [Install the plugin](https://www.jetbrains.com/help/webstorm/eslint.html)

#### VS Code

Integrates ESLint into VS Code. The extension uses the ESLint library installed in the opened workspace folder.

- [Install the plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Setting up the Source Code

1. [Fork](https://docs.github.com/en/github/getting-started-with-github/fork-a-repo) the repository.
2. Clone your fork to the local machine.

Replace `<github username>` with your own username.

```shell
git clone https://github.com/<github username>/identity-apps.git
```

3. Set the original repo as the upstream remote.

```shell
git remote add upstream https://github.com/wso2/identity-apps.git
```
