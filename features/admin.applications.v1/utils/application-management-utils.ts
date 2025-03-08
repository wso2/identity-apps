/**
 * Copyright (c) 2023-2024, WSO2 LLC. (https://www.wso2.com).
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

/* eslint-disable @typescript-eslint/typedef */
import { DocPanelUICardInterface } from "@wso2is/admin.core.v1/models/help-panel";
import { store } from "@wso2is/admin.core.v1/store";
import { AlertLevels } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { I18n } from "@wso2is/i18n";
import camelCase from "lodash-es/camelCase";
import intersectionBy from "lodash-es/intersectionBy";
import unionBy from "lodash-es/unionBy";
import { FunctionComponent, SVGProps } from "react";
import {
    getAvailableInboundProtocols,
    getOIDCApplicationConfigurations,
    getSAMLApplicationConfigurations
} from "../api/application";
import {
    SAMLConfigurationDisplayNames,
    SupportedAuthProtocolTypeDescriptions,
    SupportedAuthProtocolTypeDisplayNames
} from "../components/meta/inbound-protocols.meta";
import { ApplicationManagementConstants } from "../constants/application-management";
import {
    ApplicationListItemInterface,
    SAMLApplicationConfigurationInterface,
    additionalSpProperty,
    emptySAMLAppConfiguration
} from "../models/application";
import {
    AuthProtocolMetaListItemInterface,
    SAMLConfigModes,
    SupportedAuthProtocolTypes,
    SupportedCustomAuthProtocolTypes
} from "../models/application-inbound";
import {
    checkAvailableCustomInboundAuthProtocolMeta,
    setAvailableCustomInboundAuthProtocolMeta,
    setAvailableInboundAuthProtocolMeta,
    setOIDCApplicationConfigs,
    setSAMLApplicationConfigs
} from "../store/actions/application";

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
                        message: I18n.instance.t("applications:notifications" +
                            ".fetchInboundProtocols.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("applications:notifications" +
                        ".fetchInboundProtocols.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("applications:notifications" +
                        ".fetchInboundProtocols.genericError.message")
                }));
            });
    }

    /**
     * Compared the current app version with the give app version and return if app is lower or not.
     *
     * @param currentApplicationVersion - Application current version.
     * @param isOIDCApp - Whether the app is OIDC or not.
     * @returns True if app version is lower or not.
     */
    public static isApplicationOutdated(currentApplicationVersion: string, isOIDCApp?: boolean): boolean {

        if (currentApplicationVersion && isOIDCApp) {

            const appVersion: number[] = currentApplicationVersion?.match(/\d+/g).map(Number);
            const latestAppVersion: number[] = ApplicationManagementConstants
                .LATEST_VERSION.match(/\d+/g).map(Number);

            // App version or latest version arrays should have at least 3 parts.
            // Major, Minor and Patch versions.
            if (appVersion?.length < 3 || latestAppVersion?.length < 3) {
                return false;
            }

            if (appVersion[0] < latestAppVersion[0]) {
                return true;
            } else if (appVersion[1] < latestAppVersion[1]) {
                return true;
            } else if (appVersion[2] < latestAppVersion[2]) {
                return true;
            } else {
                return false;
            }
        }

        return false;
    }

    /**
     * Compared the current app version with the give app version and return if app is allowed to use the feature.
     *
     * @param applicationVersion - Application current version.
     * @param allowedApplicationVersion - Allowed Application version.
     * @returns True if app is allowed to use the feature.
     */
    public static isAppVersionAllowed(applicationVersion: string, allowedApplicationVersion: string): boolean {

        if (applicationVersion && allowedApplicationVersion) {

            const appVersionArray: number[] = applicationVersion?.match(/\d+/g).map(Number);
            const allowedAppVersionArray: number[] = allowedApplicationVersion?.match(/\d+/g).map(Number);

            // App version or latest version arrays should have at least 3 parts.
            // Major, Minor and Patch versions.
            if (appVersionArray?.length < 3 || allowedAppVersionArray?.length < 3) {
                return false;
            }

            for (let i = 0; i < appVersionArray.length; i++) {
                if (appVersionArray[i] > allowedAppVersionArray[i]) {
                    return true;
                } else if (appVersionArray[i] < allowedAppVersionArray[i]) {
                    return false;
                }
            }

            return true;
        }

        return false;
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
                        message: I18n.instance.t("applications:notifications" +
                            ".fetchCustomInboundProtocols.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("applications:notifications" +
                        ".fetchCustomInboundProtocols.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("applications:notifications" +
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
                        message: I18n.instance.t("applications:notifications." +
                            "fetchOIDCIDPConfigs.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("applications:notifications." +
                        "fetchOIDCIDPConfigs.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("applications:notifications." +
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
                        message: I18n.instance.t("applications:notifications." +
                            "fetchSAMLIDPConfigs.error.message")
                    }));

                    return;
                }

                store.dispatch(addAlert({
                    description: I18n.instance.t("applications:notifications." +
                        "fetchSAMLIDPConfigs.genericError.description"),
                    level: AlertLevels.ERROR,
                    message: I18n.instance.t("applications:notifications." +
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

        const childNodeArray: any = doc.getElementsByTagName("IDPSSODescriptor")[0]?.childNodes;

        samlConfigs.issuer = doc.getElementsByTagName("EntityDescriptor")[0].attributes[1].value;
        samlConfigs.certificate = doc.getElementsByTagName("X509Certificate")[0].innerHTML;
        samlConfigs.ssoUrl = childNodeArray[6]?.attributes?.Location?.nodeValue;
        samlConfigs.sloUrl = childNodeArray[2]?.attributes?.Location?.nodeValue;
        samlConfigs.metadata = strXML;
        samlConfigs.artifactResolutionUrl = childNodeArray[1]?.attributes?.Location?.nodeValue;

        // Generate the destination URLs.
        const destinationURLs: string[] = [];

        for (let i: number = 0; i < childNodeArray.length; i++) {
            if (childNodeArray[i]?.nodeName === "SingleSignOnService") {
                if (childNodeArray[i]?.attributes?.Binding?.nodeValue ===
                        "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST") {
                    destinationURLs.push(childNodeArray[i]?.attributes?.Location?.nodeValue);
                }
            }
        }

        samlConfigs.destinationURLs = destinationURLs;

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

        const regex: RegExp = /regexp=\((.*)\)/;
        const matches: RegExpMatchArray = url.match(regex);

        if (matches && matches[1]) {
            url = matches[1];
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
    public static resolveProtocolDisplayName(
        protocol: SupportedAuthProtocolTypes | SupportedCustomAuthProtocolTypes): string {

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

    /**
     * Check whether the application is a Choreo application or not.
     *
     * @param application - application.
     * @returns true if the application is a Choreo application.
     */
    public static isChoreoApplication(application: ApplicationListItemInterface): boolean {
        // Check whether `isChoreoApp` SP property is available.
        const additionalSpProperties: additionalSpProperty[] =
            application?.advancedConfigurations?.additionalSpProperties;

        const choreoSpProperty: additionalSpProperty = additionalSpProperties?.find(
            (spProperty: additionalSpProperty) =>
                spProperty.name === ApplicationManagementConstants.IS_CHOREO_APP_SP_PROPERTY
                && spProperty.value === "true"
        );

        // Check whether the application is a choreo app using choreo app template ID or `isChoreoApp` SP property.
        return application?.templateId === ApplicationManagementConstants.CHOREO_APP_TEMPLATE_ID
            || choreoSpProperty?.name === ApplicationManagementConstants.IS_CHOREO_APP_SP_PROPERTY;
    }
}
