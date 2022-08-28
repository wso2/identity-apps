# Deployment

## Deploying the apps on an external server

It is possible to deploy the Console and My Account applications on an external server. To do so, the following steps has to be followed in order to build the applications.

### Method 1 - Build using Maven

Follow the steps in listed [here](#build) in-order to build the project with maven.

Once the build is complete, execute the following commands in-order to build the Console & My Account applications for external deployment.

#### Console

##### Deploy on a Java EE server (ex: Tomcat)

```bash
cd apps/console
pnpm build:external
```

##### Deploy on a static server.

```bash
cd apps/console
pnpm  build:external:static
```

Once the build is completed, you can find the build artifacts inside the build folder i.e `apps/console/build`.

#### My Account

##### Deploy on a Java EE server (ex: Tomcat)

```bash
cd apps/myaccount
pnpm build:external
```

##### Deploy on a static server.

```bash
cd apps/myaccount
pnpm build:external:static
```

Once the build is completed, you can find the build artifacts inside the build folder i.e `apps/myaccount/build`.

### Method 2 - Build using pnpm

You can simply use pnpm to build the Console and My Account applications for external deployment by just executing the following script.

#### Deploy on a Java EE server (ex: Tomcat)

```bash
# From project root
pnpm build:external
```

#### Deploy on a static server.

```bash
# From project root
pnpm build:external:static
```

The respective build artifacts could be found inside the build folder. (`apps/(myaccount|console)/build`)
