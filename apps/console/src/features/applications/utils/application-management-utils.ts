/**
 * Copyright (c) 2020, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import camelCase from "lodash-es/camelCase";
import intersectionBy from "lodash-es/intersectionBy";
import unionBy from "lodash-es/unionBy";
import { FunctionComponent, SVGProps } from "react";
import { DocPanelUICardInterface, store } from "../../core";
import {
    getAvailableInboundProtocols,
    getOIDCApplicationConfigurations,
    getSAMLApplicationConfigurations
} from "../api";
import {
    SAMLConfigurationDisplayNames,
    SupportedAuthProtocolTypeDescriptions,
    SupportedAuthProtocolTypeDisplayNames
} from "../components/meta";
import { ApplicationManagementConstants } from "../constants";
import {
    AuthProtocolMetaListItemInterface,
    SAMLApplicationConfigurationInterface,
    SAMLConfigModes,
    SupportedAuthProtocolTypes,
    emptySAMLAppConfiguration
} from "../models";
import {
    checkAvailableCustomInboundAuthProtocolMeta,
    setAvailableCustomInboundAuthProtocolMeta,
    setAvailableInboundAuthProtocolMeta,
    setOIDCApplicationConfigs,
    setSAMLApplicationConfigs
} from "../store";

/**
 * Utility class for application(service provider) operations.
 */
export class ApplicationManagementUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     */
    private constructor() { }

    /**
     * Gets the list of available inbound protocols list and sets them in the redux store.
     *
     * @param meta - Meta data to filter.
     * @param customOnly - Whether to fetch just the custom protocols.
     */
    public static getInboundProtocols(meta: AuthProtocolMetaListItemInterface[], customOnly = false): Promise<void> {
        return getAvailableInboundProtocols(customOnly)
            .then((response) => {
                // Filter meta based on the available protocols.
                const filteredMeta = intersectionBy(meta, response, "name");

                store.dispatch(
                    setAvailableInboundAuthProtocolMeta(unionBy<AuthProtocolMetaListItemInterface>(filteredMeta,
                        response, "name"))
                );
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:develop.features.applications.notifications" +
                            ".fetchInboundProtocols.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("console:develop.features.applications.notifications" +
                        ".fetchInboundProtocols.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("console:develop.features.applications.notifications" +
                        ".fetchInboundProtocols.genericError.message")
                }));
            });
    }


    /**
     * Gets the list of available custom inbound protocols list and sets them in the redux store.
     *
     * @param meta - Meta data to filter.
     * @param customOnly - Whether to fetch just the custom protocols.
     */
    public static getCustomInboundProtocols(
        meta: AuthProtocolMetaListItemInterface[], customOnly = true): Promise<void> {
        return getAvailableInboundProtocols(customOnly)
            .then((response) => {
                // Filter meta based on the available protocols.
                const filteredMeta = intersectionBy(meta, response, "name");

                store.dispatch(
                    setAvailableCustomInboundAuthProtocolMeta(unionBy<AuthProtocolMetaListItemInterface>(
                        filteredMeta,
                        response,
                        "name")
                    )
                );
                store.dispatch(checkAvailableCustomInboundAuthProtocolMeta(true));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:develop.features.applications.notifications" +
                            ".fetchCustomInboundProtocols.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("console:develop.features.applications.notifications" +
                        ".fetchCustomInboundProtocols.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("console:develop.features.applications.notifications" +
                        ".fetchCustomInboundProtocols.genericError.message")
                }));
            });
    }

    /**
     * Finds the icon from the given object.
     *
     * @param imageName - Name on the image to be found.
     * @param illustrationObject - Collection of images.
     * @returns The icon from the given object.
     */
    public static findIcon(imageName: string,
        illustrationObject: Record<string, FunctionComponent<SVGProps<SVGSVGElement>> | string>
    ): FunctionComponent<SVGProps<SVGSVGElement>> | string {

        const key: string = Object.keys(illustrationObject).find((key) => key === imageName);

        if (key) {
            return illustrationObject[key];
        } else {
            return imageName;
        }
    }

    /**
     * Retrieve IDP details of the OIDC application and sets it in redux state.
     */
    public static getOIDCApplicationMeta = (): Promise<void> => {
        return getOIDCApplicationConfigurations()
            .then((response) => {
                store.dispatch(setOIDCApplicationConfigs(response));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:develop.features.applications.notifications." +
                            "fetchOIDCIDPConfigs.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("console:develop.features.applications.notifications." +
                        "fetchOIDCIDPConfigs.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("console:develop.features.applications.notifications." +
                        "fetchOIDCIDPConfigs.genericError.message")
                }));
            });
    };

    /**
     * Retrieve IDP details of the SAML application and sets it in redux state.
     */
    public static getSAMLApplicationMeta = (): Promise<void> => {
        return getSAMLApplicationConfigurations()
            .then((response) => {
                store.dispatch(setSAMLApplicationConfigs(response));
            })
            .catch((error) => {
                if (error.response && error.response.data && error.response.data.description) {
                    store.dispatch(addAlert({
                        description: error.response.data.description,
                        level: AlertLevels.ERROR,
                        message: I18n.instance.t("console:develop.features.applications.notifications." +
                            "fetchSAMLIDPConfigs.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("console:develop.features.applications.notifications." +
                        "fetchSAMLIDPConfigs.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("console:develop.features.applications.notifications." +
                        "fetchSAMLIDPConfigs.genericError.message")
                }));
            });
    };

    /**
     * Retrieve IDP details from the SAML meta XML.
     */
    public static getIDPDetailsFromMetaXML = (strXML: string): SAMLApplicationConfigurationInterface => {
        const samlConfigs: SAMLApplicationConfigurationInterface = emptySAMLAppConfiguration();
        let doc;

        if(window.ActiveXObject) {
            // For IE6, IE5
            doc = new ActiveXObject("Microsoft.XMLDOM");
            doc.async = "false";
            doc.loadXML(strXML);
        }
        else {
            // For Firefox, Chrome etc
            const parser = new DOMParser();

            doc = parser.parseFromString(strXML, "text/xml");
        }

        samlConfigs.issuer = doc.getElementsByTagName("EntityDescriptor")[0].attributes[1].value;
        samlConfigs.certificate = doc.getElementsByTagName("X509Certificate")[0].innerHTML;
        samlConfigs.ssoUrl = doc.getElementsByTagName(
            "IDPSSODescriptor")[0].childNodes[6].attributes.Location.nodeValue;
        samlConfigs.sloUrl = doc.getElementsByTagName(
            "IDPSSODescriptor")[0].childNodes[2].attributes.Location.nodeValue;
        samlConfigs.metadata = strXML;

        return samlConfigs;
    };

    /**
     * Generate the application samples for the help panel.
     *
     * @param raw  - Object containing of samples/docs and their doc URLs.
     *
     * @returns Generated application samples.
     */
    public static generateSamplesAndSDKDocs = (raw: Record<string, unknown>): DocPanelUICardInterface[] => {

        if (typeof raw !== "object") {
            return [];
        }

        const samples: DocPanelUICardInterface[] = [];

        for (const [ key, value ] of Object.entries(raw)) {
            samples.push({
                displayName: key,
                docs: value.toString(),
                image: camelCase(key).toLowerCase(),
                name: camelCase(key).toLowerCase()
            });
        }

        return samples;
    };

    /**
     * Get the docs key for the SDKs.
     *
     * @param template - Template id.
     * @returns The docs key of the SDK.
     */
    public static getSDKDocsKey = (template: string): string => `${
        ApplicationManagementConstants.APPLICATION_DOCS_KEY }["${ template }"].SDKs`;

    /**
     * Get the docs key for the Samples.
     *
     * @param template - Template id.
     * @returns The docs key of the Samples.
     */
    public static getSampleDocsKey = (template: string): string => `${
        ApplicationManagementConstants.APPLICATION_DOCS_KEY }["${ template }"].Samples`;

    /**
     * Get the docs key for the Configurations.
     *
     * @param template - Template id.
     * @returns The docs key of Configuration.
     */
    public static getConfigDocsKey = (template: string): string => `${
        ApplicationManagementConstants.APPLICATION_DOCS_KEY }["${ template }"].Configurations`;

    /**
     * Separate out multiple origins in the passed string.
     *
     * @param origins - Allowed origins
     * @returns Resolved allowed origins.
     */
    public static resolveAllowedOrigins = (origins: string): string[] => {

        if (!origins) {
            return [];
        }

        if (origins.split(",").length > 1) {
            return origins.split(",");
        }

        return origins && (origins !== "") ? [ origins ] : [];
    };

    /**
     * Add regexp to multiple callbackUrls and update configs.
     *
     * @param urls - Callback URLs.
     * @returns Prepared callback URL.
     */
    public static buildCallBackUrlWithRegExp = (urls: string): string => {

        let callbackURL = urls.replace(/['"]+/g, "");

        if (callbackURL.split(",").length > 1) {
            callbackURL = "regexp=(" + callbackURL.split(",").join("|") + ")";
        }

        return callbackURL;
    };

    /**
     * Remove regexp from incoming data and show the callbackUrls.
     *
     * @param url - Callback URLs.
     * @returns Prepared callback URL.
     */
    public static buildCallBackURLWithSeparator = (url: string): string => {

        if (url.includes("regexp=(")) {
            url = url.replace("regexp=(", "");
            url = url.replace(")", "");
            url = url.split("|").join(",");
        }

        return url;
    };

    /**
     * Resolves the display name of auth protocols.
     * ex: oidc to OpenID Connect
     *
     * @param protocol - Auth Protocol.
     * @returns Display name of auth protocol.
     */
    public static resolveProtocolDisplayName(protocol: SupportedAuthProtocolTypes): string {

        return SupportedAuthProtocolTypeDisplayNames[protocol];
    }

    /**
     * Resolves the descriptions of auth protocols.
     *
     * @param protocol - Auth Protocol.
     * @returns The descriptions of auth protocols.
     */
    public static resolveProtocolDescription(protocol: SupportedAuthProtocolTypes): string {

        return SupportedAuthProtocolTypeDescriptions[protocol];
    }

    /**
     * Resolves the display name of SAML configuration mode.
     *
     * @param mode - Config mode.
     * @returns Display name of SAML configuration mode.
     */
    public static resolveSAMLConfigModeDisplayName(mode: SAMLConfigModes): string {

        return SAMLConfigurationDisplayNames[mode];
    }

    public static mapProtocolTypeToName(type: string): string {
        let protocolName = type;

        if (protocolName === "oauth2") {
            protocolName = SupportedAuthProtocolTypes.OIDC;
        } else if (protocolName === "passivests") {
            protocolName = SupportedAuthProtocolTypes.WS_FEDERATION;
        } else if (protocolName === "wstrust") {
            protocolName = SupportedAuthProtocolTypes.WS_TRUST;
        } else if (protocolName === "samlsso") {
            protocolName = SupportedAuthProtocolTypes.SAML;
        }

        return protocolName;
    }
}
