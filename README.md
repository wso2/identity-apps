# WSO2 Identity Server Apps

End-user apps in WSO2 Identity Server

[![Stackoverflow](https://img.shields.io/badge/Ask%20for%20help%20on-Stackoverflow-orange)](https://stackoverflow.com/questions/tagged/wso2is)
[![Discord](https://img.shields.io/badge/Join%20us%20on-Discord-%23e01563.svg)](https://discord.gg/wso2)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://github.com/wso2/product-is/blob/master/LICENSE)
[![Twitter](https://img.shields.io/twitter/follow/wso2.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=wso2)

---

## Table of Content

<!-- Execute: `node scripts/generate-markdown-toc.js README.md` -->
<!-- TOC:START - Do not remove or modify this section -->

- [Prerequisite](#prerequisite)
  * [Setup Development Environment](#setup-development-environment)
  * [Download WSO2 Identity Server](#download-wso2-identity-server)
  * [Setup WSO2 Identity Server](#setup-wso2-identity-server)
    + [Allow CORS Origins](#allow-cors-origins)
    + [Configure FIDO2 origins](#configure-fido2-origins)
    + [Make Applications Editable](#make-applications-editable)
    + [Configure Callback URLs for System Applications (for WSO2 IS v7.0 and above)](#configure-callback-urls-for-system-applications-for-wso2-is-v70-and-above)
    + [Start the Identity Server](#start-the-identity-server)
    + [Configure Callback URLs for System Applications (for WSO2 IS below v7.0)](#configure-callback-urls-for-system-applications-for-wso2-is-below-v70)
- [Build & Run](#build--run)
  * [Build](#build)
    + [For Console & My Account](#for-console--my-account)
    + [For JSP apps (authentication portal, recovery portal, etc)](#for-jsp-apps-authentication-portal-recovery-portal-etc)
  * [Run](#run)
    + [Console](#console)
    + [My Account](#my-account)
- [Releases](#releases)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Connectors](#connectors)
- [Troubleshoot](#troubleshoot)
- [Contributing](#contributing)
- [Reporting Issues](#reporting-issues)
- [License](#license)

<!-- TOC:END -->

## Prerequisite

### Setup Development Environment

1. Install NodeJS LTS(Latest Stable Version) from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
2. Install [pnpm](https://pnpm.io/).

> [!NOTE]  
> Only PNPM v8.x is supported at the moment.

    ```shell
    corepack prepare pnpm@8.7.4 --activate
    ```

    Or, follow the other [recommended installation options](https://pnpm.io/installation).

3. Install Maven from [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi).
4. Install JDK 11 [https://openjdk.org/projects/jdk/](https://openjdk.org/projects/jdk/).
5. Install the [recommended developer tools](./docs/SET_UP_DEV_ENVIRONMENT.md).

### Download WSO2 Identity Server

In order to setup this repository locally, you need to have [WSO2 Identity Server](https://wso2.com/identity-server/) installed on your local environment.

We recommend you to download the [latest release](https://github.com/wso2/product-is/releases) or build the [product-is](https://github.com/wso2/product-is) from [source](https://github.com/wso2/product-is#building-the-distribution-from-source).

### Setup WSO2 Identity Server

#### Allow CORS Origins

Add the following code to `repository/conf/deployment.toml` in `WSO2 Identity Server` distribution pack to allow CORS for local deployment URLs.

```toml
[cors]
allowed_origins = [
    "https://localhost:9000",
    "https://localhost:9001"
]
supported_methods = [
    "GET",
    "POST",
    "HEAD",
    "OPTIONS",
    "PUT",
    "PATCH",
    "HEAD",
    "DELETE",
    "PATCH"
]
exposed_headers = [ "Location" ]
```

#### Configure FIDO2 origins

Add your hostname and port as a trusted FIDO2 origin to the `deployment.toml` file as given below.

```toml
[fido.trusted]
origins=["https://localhost:9000"]
```

#### Make Applications Editable

Currently, `Console` & `My Account` are considered as system applications hence they are readonly by default. In order to configure them, you need to add the following config to the `deployment.toml` file to override the default behavior.

```toml
[system_applications]
read_only_apps = []
```

#### Configure Callback URLs for System Applications (for WSO2 IS v7.0 and above)

> [!IMPORTANT]
> In Identity Server v7.0 and above, `callback_url`s for system applications need to be configured from the `deployment.toml` file. If your Identity Server version is below v7.0, callback URLs can be configured from the developer console, which is explained in a later step in this guide.

```toml
[console]
callback_url = "regexp=(https://localhost:9443/console|https://localhost:9443/t/(.*)/console|https://localhost:9443/console/login|https://localhost:9443/t/(.*)/console/login|https://localhost:9001/console|https://localhost:9001/t/(.*)/console|https://localhost:9001/console/login|https://localhost:9001/t/(.*)/console/login|https://localhost:9443/o/(.*)/console|https://localhost:9001/o/(.*)/console|https://localhost:9001/o/(.*)/console/login)"

[myaccount]
callback_url = "regexp=(https://localhost:9443/myaccount|https://localhost:9443/t/(.*)/myaccount|https://localhost:9443/myaccount/login|https://localhost:9443/t/(.*)/myaccount/login|https://localhost:9000/myaccount|https://localhost:9000/t/(.*)/myaccount|https://localhost:9000/myaccount/login|https://localhost:9000/t/(.*)/myaccount/login|https://localhost:9443/console/resources/users/init-impersonate.html|https://localhost:9001/console/resources/users/init-impersonate.html)"
```

#### Start the Identity Server

Now you can go ahead and start WSO2 Identity Server that was downloaded in the [Prerequisites](#prerequisite) step.

For instructions on startup, [read the docs](https://is.docs.wso2.com/en/latest/deploy/get-started/run-the-product/).

#### Configure Callback URLs for System Applications (for WSO2 IS below v7.0)

> ℹ️ Note
>
> This step is only applicable for WSO2 Identity Server versions below v7.0.

1. Navigate to the Management Console i.e `https://localhost:9443/carbon/` from the browser, and login to the system by entering an admin password.

> 💡 Find out the default password details at [https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator](https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator)

2. In the Management Console,
   - navigate to `Service Providers -> List` from left side panel.
   - Then go to `Edit` option in the application that you want to configure in dev mode (ex: `MY_ACCOUNT`).
   - Click on `Inbound Authentication Configuration -> OAuth/OpenID Connect Configuration -> Edit`.
   - Update the `Callback Url` field with below corresponding values.

     - Console

        ```shell
        regexp=(https://localhost:9443/console|https://localhost:9443/t/(.*)/console|https://localhost:9443/console/login|https://localhost:9443/t/(.*)/console/login|https://localhost:9001/console|https://localhost:9001/t/(.*)/console|https://localhost:9001/console/login|https://localhost:9001/t/(.*)/console/login|https://localhost:9443/o/(.*)/console|https://localhost:9001/o/(.*)/console|https://localhost:9001/o/(.*)/console/login)
        ```

     - My Account

        ```shell
        regexp=(https://localhost:9443/myaccount|https://localhost:9443/t/(.*)/myaccount|https://localhost:9443/myaccount/login|https://localhost:9443/t/(.*)/myaccount/login|https://localhost:9000/myaccount|https://localhost:9000/t/(.*)/myaccount|https://localhost:9000/myaccount/login|https://localhost:9000/t/(.*)/myaccount/login)
        ```

## Build & Run

### Build

Clone or download the `identity-apps` repository and run the following commands from the command line in the project root directory (where the `package.json` is located) to build all the packages with dependencies.

#### For Console & My Account

```shell
# From project root.
pnpm install && pnpm build
```

#### For JSP apps (authentication portal, recovery portal, etc)

```shell
# From project root.
cd identity-apps-core

mvn clean install
```

### Run

To start the apps in development mode, execute the following commands accordingly.

#### Console

```shell
# To start Console
cd apps/console
pnpm start
```

Once the development server is up and running, you can access the application via [https://localhost:9001/console](https://localhost:9001/console).

#### My Account

```shell
# To start My Account
cd apps/myaccount
pnpm start
```

Once the development server is up and running, you can access the application via [https://localhost:9000/myaccount](https://localhost:9000/myaccount).

## Releases

This repository uses [🦋 Changesets](https://github.com/changesets/changesets) to manage releases. Refer to [release documentation](docs/release/README.md) to learn more about the release process.

## Configuration

The portals i.e. Console & My Account are configurable using the `deployment.toml` when they are hosted inside the Identity Server.
Read through our [configurations guidelines](./docs/CONFIGURATION.md) to learn about the configuration process.

## Deployment

Go through our [deployment guide](./docs/DEPLOYMENT.md) to learn the supported app deployment options.

## Connectors

Go through our [connectors guide](./docs/CONNECTORS.md) to learn how to handle connectors in the Identity Server Console.

## Troubleshoot

Go through our [troubleshooting guide](./docs/TROUBLESHOOTING.md) to clarify any issues you encounter.

If the issue you are facing is not on the existing guide, consider reaching out to us on [Discord](https://discord.gg/wso2), [StackOverflow](https://stackoverflow.com/questions/tagged/wso2is) or by creating an issue as described in [Reporting Issues](#reporting-issues).

## Contributing

Go through our [contributing guideline](./CONTRIBUTING.md) to get an understanding about our contribution process and other necessary instructions.

## Reporting Issues

We encourage you to report issues, improvements and feature requests regarding the project through [GitHub Issue Tracker](https://github.com/wso2/product-is/issues).

> ⚠️ **Important:**
>
> Please be advised that security issues must be reported to [security@wso2.com](mailto:security@wso2.com), not as GitHub issues, in order to reach proper audience. We strongly advise following the [WSO2 Security Vulnerability Reporting Guidelines](https://docs.wso2.com/display/Security/WSO2+Security+Vulnerability+Reporting+Guidelines) when reporting the security issues.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.

---------------------------------------------------------------------------
(c) Copyright 2022 WSO2 LLC.
