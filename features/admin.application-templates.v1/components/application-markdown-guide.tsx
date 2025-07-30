/**
 * Copyright (c) 2024-2025, WSO2 LLC. (https://www.wso2.com).
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

import {
    ApplicationInterface,
    OIDCApplicationConfigurationInterface,
    SAMLApplicationConfigurationInterface
} from "@wso2is/admin.applications.v1/models/application";
import {
    OIDCDataInterface,
    PassiveStsConfigurationInterface,
    SAML2ConfigurationInterface,
    SupportedAuthProtocolTypes,
    WSTrustConfigurationInterface
} from "@wso2is/admin.applications.v1/models/application-inbound";
import useDeploymentConfig from "@wso2is/admin.core.v1/hooks/use-app-configs";
import { AppState } from "@wso2is/admin.core.v1/store";
import { MarkdownGuide } from "@wso2is/admin.template-core.v1/components/markdown-guide";
import { IdentifiableComponentInterface } from "@wso2is/core/models";
import set from "lodash-es/set";
import React, { FunctionComponent, ReactElement, useMemo } from "react";
import { useSelector } from "react-redux";
import { AuthProtocolTypes } from "../../admin.connections.v1";
import { ApplicationTemplateConstants } from "../constants/templates";

/**
 * Prop types of the `ApplicationMarkdownGuide` component.
 */
export interface ApplicationMarkdownGuidePropsInterface extends IdentifiableComponentInterface {
    /**
     * Current editing application data.
     */
    application: ApplicationInterface;
    /**
     * Current editing application inbound protocol data.
     */
    inboundProtocolConfigurations: OIDCDataInterface | SAML2ConfigurationInterface | WSTrustConfigurationInterface
        | PassiveStsConfigurationInterface;
    /**
     * Content to be displayed in Markdown format.
     */
    content: string;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
    /**
     * Current application protocol name.
     */
    protocolName: string;
}

/**
 * An interface that includes all the moderated data types using initial data.
 */
interface ModeratedData {
    pemCertificate?: string;
    scopes?: {
        spaceSeperatedList?: string;
        commaSeperatedList?: string;
    };
}

/**
 * An interface that includes all the data types which can be used in the markdown guide.
 */
interface MarkdownGuideDataInterface {
    general?: ApplicationInterface;
    protocol?: {
        oidc?: OIDCDataInterface;
        saml?: SAML2ConfigurationInterface;
        wsTrust?: WSTrustConfigurationInterface;
        passiveSts?: PassiveStsConfigurationInterface;
    };
    metadata?: {
        saml?: SAMLApplicationConfigurationInterface;
        odic?: OIDCApplicationConfigurationInterface;
    };
    tenantDomain?: string;
    clientOrigin?: string;
    serverOrigin?: string;
    productName?: string;
    accountAppURL?: string;
    docSiteURL?: string;
    moderatedData?: ModeratedData;
}

/**
 * Application markdown guide generation component.
 *
 * @param Props - Props to be injected into the component.
 */
export const ApplicationMarkdownGuide: FunctionComponent<ApplicationMarkdownGuidePropsInterface> = ({
    application,
    inboundProtocolConfigurations,
    content,
    isLoading,
    protocolName,
    ["data-componentid"]: componentId = "application-markdown-guide"
}: ApplicationMarkdownGuidePropsInterface): ReactElement => {

    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state?.application?.samlConfigurations);
    const oidcConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state?.application?.oidcConfigurations);
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const clientOrigin: string = useSelector((state: AppState) => state?.config?.deployment?.clientOrigin);
    const serverOrigin: string = useSelector((state: AppState) => state?.config?.deployment?.serverOrigin);
    const productName: string = useSelector((state: AppState) => state?.config?.ui?.productName);
    const accountAppURL: string = useSelector((state: AppState) =>
        state?.config?.deployment?.accountApp?.tenantQualifiedPath);
    const { deploymentConfig } = useDeploymentConfig();

    /**
     * Convert certificate into the pem format.
     *
     * @param cert - Certificate in string format.
     * @returns Pem format certificate content.
     */
    function getPemFormatCertificate(cert: string): string {
        const header: string = "-----BEGIN CERTIFICATE-----";
        const footer: string = "-----END CERTIFICATE-----";
        const lineLength: number = 64;

        // Insert line breaks every `lineLength` characters.
        const formattedCert: string = cert.match(new RegExp(".{1," + lineLength + "}", "g"))?.join("\n") || "";

        return `${header}\n${formattedCert}\n${footer}`;
    }

    /**
     * Prepare moderated data using the initial API response data.
     */
    const getModeratedData = (): ModeratedData => {
        const data: ModeratedData = {};

        if (samlConfigurations?.certificate) {
            data.pemCertificate = btoa(getPemFormatCertificate(samlConfigurations?.certificate));
        }

        // TODO: Dynmically update the scopes based on the application configured scopes.
        // Default to OAuth 2.0 scopes.
        data.scopes = {
            commaSeperatedList: "'openid', 'profile'",
            spaceSeperatedList: "openid profile"
        };

        return data;
    };

    /**
     * Create a unified data object for the current application
     * by combining multiple API responses.
     */
    const data: MarkdownGuideDataInterface = useMemo(() => {
        if (!application || !inboundProtocolConfigurations || !samlConfigurations || !oidcConfigurations
            || !tenantDomain || !clientOrigin || !serverOrigin
        ) {
            return null;
        }

        let protocolKeyName: string = protocolName;

        if (SupportedAuthProtocolTypes.WS_FEDERATION === protocolKeyName) {
            protocolKeyName = ApplicationTemplateConstants.APPLICATION_INBOUND_PROTOCOL_KEYS[
                AuthProtocolTypes.WS_FEDERATION ];
        } else if (SupportedAuthProtocolTypes.WS_TRUST === protocolKeyName) {
            protocolKeyName = ApplicationTemplateConstants.APPLICATION_INBOUND_PROTOCOL_KEYS[
                AuthProtocolTypes.WS_TRUST ];
        }

        const markdownDataObject: MarkdownGuideDataInterface = {};

        markdownDataObject.general = application;
        set(markdownDataObject, `protocol.${protocolKeyName}`, inboundProtocolConfigurations);
        set(markdownDataObject, "metadata.saml", samlConfigurations);
        set(markdownDataObject, "metadata.oidc", samlConfigurations);
        markdownDataObject.tenantDomain = tenantDomain;
        markdownDataObject.clientOrigin = clientOrigin;
        markdownDataObject.serverOrigin = serverOrigin;
        markdownDataObject.productName = productName;
        markdownDataObject.accountAppURL = accountAppURL;
        markdownDataObject.docSiteURL = deploymentConfig?.docSiteURL;
        markdownDataObject.moderatedData = getModeratedData();

        return markdownDataObject;
    }, [
        application,
        inboundProtocolConfigurations,
        samlConfigurations,
        oidcConfigurations,
        tenantDomain,
        clientOrigin,
        serverOrigin
    ]);

    return (
        <MarkdownGuide
            data={ data as unknown as Record<string, unknown> }
            content={ content }
            isLoading={ isLoading }
            data-componentid={ componentId }
        />
    );
};
