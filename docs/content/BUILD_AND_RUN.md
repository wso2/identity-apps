# Build & Run

Follow this guide to install the dependencies and build the modules needed to run the apps in the local environment.

* [Install Dependencies](#install-dependencies)
* [Build](#build)
    * [Building using Maven](#building-using-maven)
    * [Building using pnpm](#building-using-pnpm)
* [Run](#run)

## Install Dependencies

The following script installs the local modules(react-components, theme, etc.) using pnpm workspaces and also installs the other dependencies.

```shell
pnpm install
```

## Build

We support the following set of build strategies.

### Building using Maven

Run the following command from the root of the project (where the root `pom.xml` is located).

```shell
# Installs the dependencies & builds the entire project including the JSP portals.
mvn clean install
```

### Building using pnpm

Run the relevant command from the root of the project (where the root `package.json` is located).

```shell
# Builds the node projects.
pnpm build
```

## Run

To run the apps, navigate to the specific folder and execute `npm start`.

```shell
# To run My Account
cd apps/myaccount
pnpm start
```
