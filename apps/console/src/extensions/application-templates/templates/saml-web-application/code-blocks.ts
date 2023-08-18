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

import { SAMLIntegrateSDKConfigInterface, SAMLTryoutSampleConfigInterface } from "./models";

export const tomcatSAMLAgentMavenDependencyCode = (): string => {
    return `<dependency>
    <groupId>io.asgardeo.tomcat.saml.agent</groupId>
    <artifactId>io.asgardeo.tomcat.saml.agent</artifactId>
    <version>0.1.31</version>
</dependency>`;
};

export const wso2InternalRepoPointingCode = (): string => {
    return `<repositories>
    <repository>
        <id>wso2.releases</id>
        <name>WSO2 internal Repository</name>
        <url>http://maven.wso2.org/nexus/content/repositories/releases/</url>
        <releases>
            <enabled>true</enabled>
            <updatePolicy>daily</updatePolicy>
            <checksumPolicy>ignore</checksumPolicy>
        </releases>
    </repository>
</repositories>`;
};

export const tomcatSAMLAgentSamplePropertiesCode = (
    config: SAMLIntegrateSDKConfigInterface, appContextPath: string): string => {
    if (!config) {
        return "";
    }

    const appContext: string = appContextPath && appContextPath !== ""
        ? appContextPath
        : "<YOUR_APP_PATH>";
    const enableResponseSigning: boolean = config.enableResponseSigning !== undefined 
        ? config.enableResponseSigning 
        : false;
    const enableRequestSigning: boolean = config.enableRequestSigning !== undefined 
        ? config.enableRequestSigning 
        : false;
    const enableSLO: boolean = config.enableSLO !== undefined 
        ? config.enableSLO 
        : true;
    const enableAssertionEncryption: boolean = config.enableAssertionEncryption !== undefined 
        ? config.enableAssertionEncryption 
        : false;

    return `SAML2.AssertionConsumerURL=${ config.acsURL }
SAML2.SPEntityId=${ config.samlIssuer }
SAML2.IdPEntityId=${ config.issuer }
SAML2.IdPURL=${ config.ssoUrl }
SkipURIs=${ appContext }/index.html
SAML2SSOURL=samlsso
IndexPage=index.html
ErrorPage=/error.jsp
EnableSAML2SSOLogin=true
SAML2.EnableSLO=${ enableSLO }
SAML2.SLOURL=logout
SAML2.EnableResponseSigning=${ enableResponseSigning }
SAML2.EnableAssertionSigning=false
SAML2.EnableAssertionEncryption=${ enableAssertionEncryption }
SAML2.EnableRequestSigning=${ enableRequestSigning }
SAML2.IsPassiveAuthn=false
IdPPublicCert=${ config.certificate?.replace(/(\r\n|\n|\r)/gm,"")}
KeyStorePassword=<PASSWORD>
PrivateKeyAlias=<ALIAS>
IdPPublicCertAlias=wso2carbon
PrivateKeyPassword=wso2carbon`;
};

export const tomcatSAMLAgentSampleWebXMLCode = (): string => {
    return `<filter>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <filter-class>io.asgardeo.tomcat.saml.agent.SAML2SSOAgentFilter</filter-class>
</filter>
<filter-mapping>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <url-pattern>*.jsp</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <url-pattern>*.html</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <url-pattern>/samlsso</url-pattern>
</filter-mapping>
<filter-mapping>
    <filter-name>SAML2SSOAgentFilter</filter-name>
    <url-pattern>/logout</url-pattern>
</filter-mapping>

<listener>
    <listener-class>io.asgardeo.tomcat.saml.agent.SSOAgentContextEventListener</listener-class>
</listener>
<context-param>
    <param-name>property-file</param-name>
    <param-value>sample-app.properties</param-value>
</context-param>
<context-param>
    <param-name>certificate-file</param-name>
    <param-value>KEYSTORE_FILE_NAME</param-value>
</context-param>`;
};

export const tomcatSAMLAgentLoginButtonCode = (): string => {
    return `<form action="home.jsp" method="post">
    <input type="submit" value="log in">
</form>`;
};

export const tomcatSAMLAgentLogoutCode = (): string => {
    return `<form action="logout?SAML2.HTTPBinding=HTTP-POST" method="get">
    <input type="submit" value="Log Out">
</form>`;
};

export const tomcatSAMLAgentDockerEnvCode = (config: SAMLTryoutSampleConfigInterface): string => {
    const tomcatHost: string = config.tomcatHost && config.tomcatHost !== ""
        ? config.tomcatHost
        : "<TOMCAT_HOST>";
    const enableResponseSigning: boolean = config.enableResponseSigning !== undefined 
        ? config.enableResponseSigning 
        : false;
    const enableRequestSigning: boolean = config.enableRequestSigning !== undefined 
        ? config.enableRequestSigning 
        : false;
    const enableSLO: boolean = config.enableSLO !== undefined 
        ? config.enableSLO 
        : true;
    const enableAssertionEncryption: boolean = config.enableAssertionEncryption !== undefined 
        ? config.enableAssertionEncryption 
        : false;

    return `SAML2.AssertionConsumerURL=${ tomcatHost }/sample-app/home.jsp
SAML2.SPEntityId=${ config.samlIssuer }
SAML2.IdPEntityId=${ config.issuer }
SAML2.IdPURL=${ config.ssoUrl }
SAML2SSOURL=samlsso
EnableSAML2SSOLogin=true
SAML2.EnableSLO=${ enableSLO }
SAML2.SLOURL=logout
SkipURIs=/sample-app/index.html
IndexPage=index.html
ErrorPage=/error.jsp
SAML2.EnableResponseSigning=${ enableResponseSigning }
SAML2.EnableAssertionSigning=false
SAML2.EnableAssertionEncryption=${ enableAssertionEncryption }
SAML2.EnableRequestSigning=${ enableRequestSigning }
SAML2.IsPassiveAuthn=false
IdPPublicCert=${ config.certificate?.replace(/(\r\n|\n|\r)/gm,"")}
KeyStorePassword=wso2carbon
PrivateKeyAlias=wso2carbon
IdPPublicCertAlias=wso2carbon
PrivateKeyPassword=wso2carbon`;
};
