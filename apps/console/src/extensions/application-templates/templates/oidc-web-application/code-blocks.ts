/**
 * Copyright (c) 2021, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
 *
 * WSO2 LLC. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { SDKMeta } from "./meta";
import { OIDCIntegrateSDKConfigInterface, OIDCTryoutSampleConfigInterface } from "./models";

export const tomcatOIDCAgentMavenDependencyCode = (): string => {

    return `<dependency>
    <groupId>io.asgardeo.tomcat.oidc.agent</groupId>
    <artifactId>io.asgardeo.tomcat.oidc.agent</artifactId>
    <version>0.1.8</version>
</dependency>`;
};

export const wso2InternalRepoPointingCode = (): string => {

    return `<repositories>
    <repository>
        <id>wso2.releases</id>
        <name>WSO2 internal Repository</name>
        <url>https://maven.wso2.org/nexus/content/repositories/releases/</url>
        <releases>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
            <checksumPolicy>ignore</checksumPolicy>
        </releases>
    </repository>
    <repository>
        <id>wso2-nexus</id>
        <name>WSO2 internal Repository</name>
        <url>https://maven.wso2.org/nexus/content/groups/wso2-public/</url>
        <releases>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
            <checksumPolicy>ignore</checksumPolicy>
        </releases>
    </repository>
</repositories>`;
};

export const tomcatOIDCAgentSamplePropertiesCode = (
    config: OIDCIntegrateSDKConfigInterface, appContextPath: string): string | null => {

    if (!config) {
        return null;
    }

    const appContext: string = appContextPath && appContextPath !== ""
        ? appContextPath
        : "<YOUR_APP_PATH>";

    return `consumerKey=${ config.clientID }
consumerSecret=${ config.clientSecret }
scope=${ config?.scope.join(",") }\n
callBackURL=${ appContext }${ SDKMeta.tomcatOIDCAgent.integrate.defaultCallbackContext }\n
issuer=${ config.serverOrigin }/oauth2/token
authorizeEndpoint=${ config.serverOrigin }/oauth2/authorize
logoutEndpoint=${ config.serverOrigin }/oidc/logout
tokenEndpoint=${ config.serverOrigin }/oauth2/token
jwksEndpoint=${ config.serverOrigin }/oauth2/jwks\n
skipURIs=${ appContext }/index.html
logoutURL=logout`;
};

export const tomcatOIDCAgentSampleWebXMLCode = (): string => {

    return `<filter>
    <filter-name>OIDCAgentFilter</filter-name>
    <filter-class>io.asgardeo.tomcat.oidc.agent.OIDCAgentFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>OIDCAgentFilter</filter-name>
    <url-pattern>/logout</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>OIDCAgentFilter</filter-name>
    <url-pattern>/oauth2client</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>OIDCAgentFilter</filter-name>
    <url-pattern>*.jsp</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>OIDCAgentFilter</filter-name>
    <url-pattern>*.html</url-pattern>
</filter-mapping>
<listener>
    <listener-class>io.asgardeo.tomcat.oidc.agent.SSOAgentContextEventListener</listener-class>
</listener>
<context-param>
    <param-name>app-property-file</param-name>
    <param-value>oidc-sample-app.properties</param-value>
</context-param>
<listener>
    <listener-class>io.asgardeo.tomcat.oidc.agent.JKSLoader</listener-class>
</listener>`;
};

export const tomcatOIDCAgentLoginButtonCode = (): string => {

    return `<form action="<HOME_PAGE>" method="post">
    <input type="submit" value="Log In">
</form>`;
};

export const tomcatOIDCAgentLogoutCode = (): string => {

    return `<form action="logout" method="get">
    <input type="submit" value="Log Out">
</form>`;
};

export const tomcatOIDCSamplePropertiesFileCode = (
    config: OIDCTryoutSampleConfigInterface, sampleServerHost: string): string | null => {

    if (!config) {
        return null;
    }

    const sampleHost: string = sampleServerHost && sampleServerHost !== ""
        ? sampleServerHost
        : "<TOMCAT_HOST>";

    return `consumerKey=${ config.clientID }
consumerSecret=${ config.clientSecret }
scope=openid,address,email,profile\n
callBackURL=${ sampleHost }/oidc-sample-app/oauth2client
trustedAudience=${ sampleHost }/oidc-sample-app\n
issuer=${ config.serverOrigin }/oauth2/token
authorizeEndpoint=${ config.serverOrigin }/oauth2/authorize
logoutEndpoint=${ config.serverOrigin }/oidc/logout
tokenEndpoint=${ config.serverOrigin }/oauth2/token
jwksEndpoint=${ config.serverOrigin }/oauth2/jwks
#sessionIFrameEndpoint=${ config.serverOrigin }/oidc/checksession\n
skipURIs=/oidc-sample-app/index.html
indexPage=index.html
logoutURL=logout
errorPage=error.jsp`;
};

export const dotNetSDKNugetCLICode = (): string => {
    return "Install-Package Asgardeo.OIDC.SDK -Version 0.1.1";
};

export const dotNetSDKConfigCode = (config: OIDCIntegrateSDKConfigInterface): string | null => {
    if (!config) {
        return null;
    }

    return `<configuration>
    <appSettings>
        <add key="ClientId" value="${ config.clientID }" />
        <add key="ClientSecret" value="${ config.clientSecret }" />
        <add key="AuthorizationEndpoint" value="${ config.serverOrigin }/oauth2/authorize" />
        <add key="TokenEndpoint" value="${ config.serverOrigin }/oauth2/token" />
        <add key="UserInfoEndpoint" value="${ config.serverOrigin }/oauth2/userinfo" />
        <add key="LogoutEndpoint" value="${ config.serverOrigin }/oidc/logout" />
        <add key="RedirectURI" value="http://localhost:8080/pickup-manager/callback/" />
        <add key="PostLogoutRedirectURI" value="http://localhost:8080/pickup-manager/postlogout/" />
        <add key="ClientSettingsProvider.ServiceUri" value="" />
    </appSettings>
</configuration>`;
};

export const dotNetSDKInstallerConfigCode = (config: OIDCTryoutSampleConfigInterface): string | null => {

    if (!config) {
        return null;
    }

    return `Client ID - ${ config.clientID }
Client Secret - ${ config.clientSecret }
Authorization Endpoint - ${ config.serverOrigin }/oauth2/authorize
Token Endpoint - ${ config.serverOrigin }/oauth2/token
Userinfo Endpoint - ${ config.serverOrigin }/oauth2/userinfo
Logout Endpoint - ${ config.serverOrigin }/oidc/logout
Redirect URI - http://localhost:8080/pickup-manager/callback/
PostLogout Redirect URI - http://localhost:8080/pickup-manager/postlogout/`;
};

export const dotNetSDKLoginCode = (): string => {

    return `readonly AuthenticationHelper authenticationHelper = new AuthenticationHelper();
await authenticationHelper.Login();
var accessToken = authenticationHelper.AccessToken;`;
};

export const dotNetSDKLogoutCode = (): string => {

    return `await authenticationHelper.Logout(accessToken);
var request = authenticationHelper.Request;`;
};
