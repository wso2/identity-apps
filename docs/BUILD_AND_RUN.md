# Build & Run

Follow this guide to install the dependencies and build the modules needed to run the apps in the local environment.

* [Install Dependencies](#install-dependencies)
  * [Install npm and Lerna modules](#install-npm-and-lerna-modules)
  * [Bootstrap and hoist common dependencies](#bootstrap-and-hoist-common-dependencies)
* [Build](#build)
    * [Building using Maven](#building-using-maven)
    * [Building using npm](#building-using-npm)
* [Run](#run)

## Install Dependencies

### Install npm and Lerna modules

Runs `npm install` & `npx lerna bootstrap` which will bootstrap all the Lerna modules.

```shell
npm run bootstrap
```

### Bootstrap and hoist common dependencies

If you would like to bootstrap the dependencies in the hoist mode execute the following command. Learn more about Lerna hoisting [here](https://github.com/lerna/lerna/blob/main/doc/hoist.md).

```shell
npm run bootstrap:hoist
```

## Build

We support the following set of build strategies.

### Building using Maven

Run the following command from the root of the project (where the root `pom.xml` is located).

```shell
# Installs the dependencies & builds the entire project including the JSP portals.
mvn clean install
```

### Building using npm

Run the relevant command from the root of the project (where the root `package.json` is located).

If you have already installed dependencies.

```shell
# Builds the node projects.
npm run build
```

If you haven't already installed dependencies.

```shell
# Installs the dependencies & builds the node projects.
npm run build:dev
```

## Run

To run the apps, navigate to the specific folder and execute `npm start`.

```shell
# To run My Account
cd apps/myaccount
npm start
```
