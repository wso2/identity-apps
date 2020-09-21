# WSO2 Identity Server Apps

End-user apps in WSO2 Identity Server

|  Branch | Build Status |
| :------------ |:------------- 
| master      | [![Build Status](https://wso2.org/jenkins/view/Dashboard/job/platform-builds/job/identity-apps/badge/icon)](https://wso2.org/jenkins/view/Dashboard/job/platform-builds/job/identity-apps/) |

## Setup build environment

1. Install NodeJS from [https://nodejs.org/en/download/](https://nodejs.org/en/download/).
2. Install Maven from [https://maven.apache.org/download.cgi](https://maven.apache.org/download.cgi).

## Build & Run

#### Build

1. Download or clone the project source code from [https://github.com/wso2/identity-apps](https://github.com/wso2/identity-apps)
2. Run `mvn clean install` from the command line in the project root directory (where the root `pom.xml` is located). 

If you are building [product-is](https://github.com/wso2/product-is), the built identity apps dependencies will install to your local `.m2` repository during the build above.

3. Then you just need to build [WSO2 Identiy Server](https://github.com/wso2/product-is) after. _(Follow the guide there)_

#### Run

4. Execute `wso2server.sh` (For unix environment) or `wso2server.bat` (For windows environment) file from the `bin` directory to run the WSO2 Identity Server.
5. Navigate to `https://localhost:9443/myaccount` or `https://localhost:9443/console` from the browser. (Add certificate exception if required)

## Run in dev mode

1. **Do only if you skip WSO2 Identity Server build step above:** Download the built distribution of WSO2 Identity Server from [https://wso2.com/identity-and-access-management/](https://wso2.com/identity-and-access-management/).
2. Add below code to `repository/conf/deployment.toml` in `WSO2 Identity Server` distribution pack to allow CORS.

```
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
3. Add your hostname and port as a trusted FIDO2 origin in `repository/resources/conf/templates/repository/conf/identity/identity.xml.j2` as given below.

```xml
   <FIDO>
        <WebAuthn>
            <Enable>{{fido.webauthn.enable}}</Enable>
        </WebAuthn>
        <FIDO2TrustedOrigins>
            {% for origin in fido.trusted.origins %}
            <Origin>{{origin}}</Origin>
            {% endfor %}
            <Origin>https://localhost:9000</Origin>
        </FIDO2TrustedOrigins>
   </FIDO>
```
4. Execute `wso2server.sh` (For unix environment) or `wso2server.bat` (For windows environment) file from the `bin` directory to run WSO2 Identity Server.
5. Navigate to `https://localhost:9443/carbon/` from the browser, and login to the system by entering an admin password.
> **Hint!** Can find out the default password details here: [https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator](https://docs.wso2.com/display/ADMIN44x/Configuring+the+System+Administrator)
6. In the system, navigate to `Service Providers -> List` from left side panel. And then go to `Edit` option in the application that you want to configure in dev mode (ex: `MY_ACCOUNT`). Then click on `Inbound Authentication Configuration -> OAuth/OpenID Connect Configuration -> Edit`. And then update the `Callback Url` field with below corresponding values.

**My Account**

```
regexp=(https://localhost:9443/myaccount/login|https://localhost:9443/myaccount/logout|https://localhost:9000/myaccount/login|https://localhost:9000/myaccount/logout)
```

**Console**

```
regexp=(https://localhost:9443/console/login|https://localhost:9443/console/logout|https://localhost:9001/console/login|https://localhost:9001/console/logout)
```

7. Open cloned or downloaded Identity Apps repo and Run `npm run build` from the command line in the project root directory (where the `package.json` is located) to build all the packages with dependencies. _(Note:- Not necessary if you have already done above identity apps build steps)_
8. Start the apps in development mode, Execute `cd apps/<app> && npm start` command. E.g. `cd apps/myaccount && npm start`.
9. Once the app is successfully started, you can access the via the URLs `https://localhost:9000/myaccount` or `https://localhost:9001/console`.

## Reporting Issues

We encourage you to report issues, improvements and feature requests regarding the project through [GitHub Issue Tracker](https://github.com/wso2/identity-apps/issues).

**Important:** And please be advised that, security issues must be reported to [security@wso2.com](mailto:security@wso2.com), not as GitHub issues, in order to reach proper audience. We strongly advise following the [WSO2 Security Vulnerability Reporting Guidelines](https://docs.wso2.com/display/Security/WSO2+Security+Vulnerability+Reporting+Guidelines) when reporting the security issues.

## License

Licenses this source under the Apache License, Version 2.0 ([LICENSE](LICENSE)), You may not use this file except in compliance with the License.
