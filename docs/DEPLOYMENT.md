# Deployment

## Deploying the apps on an external server

It is possible to deploy the Console and My Account applications on an external server. To do so, the following steps has to be followed in order to build the applications.

### Build

#### Prepare the source

Execute the following commands from the project root in order to build the repo.

```bash
pnpm install
pnpm build
```

#### Build Console

##### Deploy on a Java EE server (ex: Tomcat)

Go inside `apps/console` and change the `.env.local` file as follows.

```env
SERVER_TYPE="tomcat"
```

And then build the application.


```bash
pnpm build
```

##### Deploy on a static server.

Go inside `apps/console` and change the `.env.local` file as follows.

```env
SERVER_TYPE="static"
```

And then build the application.


```bash
pnpm build
```

> **Note**
> Once the build is completed, you can find the build artifacts inside the build folder i.e `apps/console/build`.

#### Build My Account

##### Deploy on a Java EE server (ex: Tomcat)

Go inside `apps/myaccount` and change the `.env.local` file as follows.

```env
SERVER_TYPE="tomcat"
```

And then build the application.


```bash
pnpm build
```

##### Deploy on a static server.

Go inside `apps/myaccount` and change the `.env.local` file as follows.

```env
SERVER_TYPE="static"
```

And then build the application.


```bash
pnpm build
```

> **Note**
> Once the build is completed, you can find the build artifacts inside the build folder i.e `apps/myaccount/build`.
