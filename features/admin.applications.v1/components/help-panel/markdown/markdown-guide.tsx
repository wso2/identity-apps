/**
 * Copyright (c) 2024, WSO2 LLC. (https://www.wso2.com).
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

import { AppState, history } from "@wso2is/admin.core.v1";
import { AlertLevels, IdentifiableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import {
    ContentLoader,
    Markdown
} from "@wso2is/react-components";
import get from "lodash-es/get";
import set from "lodash-es/set";
import React, { FunctionComponent, ReactElement, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch } from "redux";
import { Grid } from "semantic-ui-react";
import * as CustomMarkdownComponents from "./components";
import GlobalMarkdownProvider from "./global-markdown-provider";
import { useGetApplication } from "../../../api/use-get-application";
import useGetApplicationInboundConfigs from "../../../api/use-get-application-inbound-configs";
import {
    ApplicationInterface,
    SAML2ServiceProviderInterface,
    SAMLApplicationConfigurationInterface,
    SupportedAuthProtocolTypes
} from "../../../models";
import "./markdown-guide.scss";

/**
 * Prop types of the `MarkdownGuide` component.
 */
export interface MarkdownGuidePropsInterface extends IdentifiableComponentInterface {
    /**
     * Id of the current application.
     */
    applicationId: string;
    /**
     * Content to be displayed in Markdown format.
     */
    content: string;
    /**
     * Is the application info request loading.
     */
    isLoading?: boolean;
}

/**
 * An interface that includes all the moderated data types using initial data.
 */
interface ModeratedData {
    pemCertificate?: string;
}

/**
 * An interface that includes all the data types which can be used in the markdown guide.
 */
interface MarkdownGuideDataInterface {
    general?: ApplicationInterface;
    protocol?: {
        saml?: SAML2ServiceProviderInterface;
    };
    metadata?: {
        saml?: SAMLApplicationConfigurationInterface;
    }
    tenantDomain?: string;
    clientOrigin?: string;
    serverOrigin?: string;
    moderatedData?: ModeratedData;
}

/**
 * Markdown guide generation component.
 *
 * @param Props - Props to be injected into the component.
 */
export const MarkdownGuide: FunctionComponent<MarkdownGuidePropsInterface> = (
    props: MarkdownGuidePropsInterface
): ReactElement => {
    const {
        applicationId,
        content,
        isLoading,
        ["data-componentid"]: componentId
    } = props;

    const { t } = useTranslation();

    const dispatch: Dispatch = useDispatch();

    const {
        data: application,
        isLoading: applicationLoading,
        error: applicationFetchRequestError
    } = useGetApplication(applicationId, !!applicationId);
    const {
        data: applicationInboundProtocol,
        isLoading: applicationInboundProtocolLoading,
        error: applicationInboundProtocolFetchRequestError
    } = useGetApplicationInboundConfigs(applicationId, SupportedAuthProtocolTypes.SAML, !!applicationId);
    const samlConfigurations: SAMLApplicationConfigurationInterface = useSelector(
        (state: AppState) => state?.application?.samlConfigurations);
    const tenantDomain: string = useSelector((state: AppState) => state?.auth?.tenantDomain);
    const clientOrigin: string = useSelector((state: AppState) => state?.config?.deployment?.clientOrigin);
    const serverOrigin: string = useSelector((state: AppState) => state?.config?.deployment?.idpConfigs?.serverOrigin);
    const appBaseName: string = useSelector((state: AppState) =>
        state?.config?.deployment?.appBaseName);

    /**
     * Handles the application get request error.
     */
    useEffect(() => {
        if (!applicationFetchRequestError) {
            return;
        }

        if (applicationFetchRequestError.response?.data?.description) {
            dispatch(addAlert({
                description: applicationFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.fetchApplication.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.fetchApplication" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.fetchApplication.genericError." +
                "message")
        }));
    }, [ applicationFetchRequestError ]);

    /**
     * Handle errors that occur during the application inbound protocol data fetch request.
     */
    useEffect(() => {
        if (!applicationInboundProtocolFetchRequestError) {
            return;
        }

        if (applicationInboundProtocolFetchRequestError?.response?.data?.description) {
            dispatch(addAlert({
                description: applicationInboundProtocolFetchRequestError.response.data.description,
                level: AlertLevels.ERROR,
                message: t("applications:notifications.getInboundProtocolConfig.error.message")
            }));

            return;
        }

        dispatch(addAlert({
            description: t("applications:notifications.getInboundProtocolConfig" +
                ".genericError.description"),
            level: AlertLevels.ERROR,
            message: t("applications:notifications.getInboundProtocolConfig" +
                ".genericError.message")
        }));
    }, [ applicationInboundProtocolFetchRequestError ]);

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

        return data;
    };

    /**
     * Create a unified data object for the current application
     * by combining multiple API responses.
     */
    const data: MarkdownGuideDataInterface = useMemo(() => {
        const markdownDataObject: MarkdownGuideDataInterface = {};

        if (application) {
            markdownDataObject.general = application;
        }
        if (applicationInboundProtocol) {
            set(markdownDataObject, "protocol.saml", applicationInboundProtocol);
        }
        if (samlConfigurations) {
            set(markdownDataObject, "metadata.saml", samlConfigurations);
        }
        if (tenantDomain) {
            markdownDataObject.tenantDomain = tenantDomain;
        }
        if (clientOrigin) {
            markdownDataObject.clientOrigin = clientOrigin;
        }
        if (serverOrigin) {
            markdownDataObject.serverOrigin = serverOrigin;
        }
        if (application) {
            markdownDataObject.moderatedData = getModeratedData();
        }

        return markdownDataObject;
    }, [
        application,
        applicationInboundProtocol,
        samlConfigurations,
        tenantDomain,
        clientOrigin
    ]);

    /**
     * Create the final markdown content to render by replacing the possible
     * included placeholders.
     */
    const moderatedContent: string = useMemo(() => {
        return content.replace(/\${([^}]+?)}/g, (match: string, key: string) => {
            const propertyValue: unknown = get(data, key);

            if (propertyValue && typeof propertyValue === "string") {
                return propertyValue;
            }

            return match;
        });
    }, [ content, data ]);

    /**
     * Manage internal navigation for relative URLs.
     *
     * @param path - Relative pathname.
     */
    const handleInternalUrl = (path: string) => {
        let pathname: string = path;

        if (!pathname?.startsWith("/")) {
            pathname = "/" + pathname;
        }

        if (!pathname?.startsWith(appBaseName)) {
            pathname = appBaseName + pathname;
        }

        history.push({ pathname });
    };

    return (
        <Grid className="markdown-guide" data-componentid={ componentId }>
            <Grid.Row columns={ 1 }>
                <Grid.Column mobile={ 16 } tablet={ 16 } computer={ 13 }>
                    {
                        isLoading || applicationLoading || applicationInboundProtocolLoading || !moderatedContent
                            ? <ContentLoader inline="centered" active/>
                            : (
                                <GlobalMarkdownProvider
                                    onHandleInternalUrl={ handleInternalUrl }
                                >
                                    <Markdown
                                        allowedElements={ Object.keys(CustomMarkdownComponents) }
                                        components={ CustomMarkdownComponents }
                                        source={ moderatedContent }
                                    />
                                </GlobalMarkdownProvider>
                            )
                    }
                </Grid.Column>
            </Grid.Row>
        </Grid>
    );
};

/**
 * Default props for the `MarkdownGuide` guide.
 */
MarkdownGuide.defaultProps = {
    "data-componentid": "markdown-guide"
};
