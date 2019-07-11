# WSO2 Identity Server Web Apps Library

End-user apps in WSO2 Identity Server

## How to start

1. Download or clone the project source code from [https://github.com/wso2/identity-apps](https://github.com/wso2/identity-apps)
2. Install NodeJS from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).

If you are building the project for [product-is](https://github.com/wso2/product-is) build, do this step.

3.  Install Maven from [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi).

## Build

1. Run `mvn clean install` from the command line in the project root directory (where the root `pom.xml` is located). And the built dependency will install to your local `.m2` repository.
2. Then build [WSO2 Identiy Server](https://github.com/wso2/product-is). _(Follow the guide there)_

## Run (Dev Mode)

1. Run `npm run build` from the command line in the project root directory (where the `package.json` is located) to build all the packages with dependancies.
2. Download a [WSO2 Identity Server](https://wso2.com/identity-and-access-management/) distrubution.
3. Add below code to `WSO2 Identity Server/repository/deployment/server/webapps/scim2/WEB-INF/web.xml` allow CORS for dev servers. _(If you are running the app in Webpack dev server)_

```xml
    <filter>
        <filter-name>CORS</filter-name>
        <filter-class>com.thetransactioncompany.cors.CORSFilter</filter-class>
        <init-param>
            <param-name>cors.allowOrigin</param-name>
            <param-value>http://localhost:9000</param-value>
        </init-param>
    </filter>
    <filter-mapping>
        <filter-name>CORS</filter-name>
        <url-pattern>/*</url-pattern>
    </filter-mapping>
```

4. Start in development mode, Execute `cd apps/<app> && npm start` command. E.g. `cd apps/user-portal && npm start`.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
