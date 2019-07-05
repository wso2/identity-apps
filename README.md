# WSO2 Identity Server Web Apps Library

End-user apps in WSO2 Identity Server

## How to start

1. Install NodeJS and NPM from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
2. Download or clone the project source code from [https://github.com/jeradrutnam/wso2is-webapps](https://github.com/jeradrutnam/wso2is-webapps)
3. Install all required npm packages by running `npm install` from the command line in the project root folder (where the package.json is located).
4. And then run `npm run build` to build all the packages with local dependancies.
5. Add below code to `WSO2 Identity Server/repository/deployment/server/webapps/scim2/WEB-INF/web.xml` allow CORS for dev servers.

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

6. Start applications in dev mode by running `cd apps/<app> && npm start` from the command line in the project root folder, this will launch a browser displaying the application. E.g. `cd apps/user-portal && npm start`.

- Run sepearate apps in development mode
    Execute `cd apps/<app> && npm start` command. E.g. `cd apps/user-portal && npm start`.

- Build sepearate modules
    Execute `cd modules/<module> && npm run build` command. E.g. `cd module/theme && npm run build`.

- Build project
    Execute `npm run build`. And you will get the built distribution in `dist/wso2is-webapps-$version.zip` upon build complete.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
