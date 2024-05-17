/**
 * Copyright (c) 2023, WSO2 LLC. (https://www.wso2.com). All Rights Reserved.
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

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, DocumentationLink, Heading, Message, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { identityProviderConfig } from "@wso2is/admin.extensions.v1/configs";

/**
 * Prop types of the component.
 */
type HyprIDPCreateWizardHelpPropsInterface = IdentifiableComponentInterface

const HyprIDPCreateWizardHelp: FunctionComponent<HyprIDPCreateWizardHelpPropsInterface> = (
    props: HyprIDPCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        ["data-componentid"]: testId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const [ useNewConnectionsView, setUseNewConnectionsView ] = useState<boolean>(undefined);

    /**
     * Checks if the listing view defined in the config is the new connections view.
     */
    useEffect(() => {

        if (useNewConnectionsView !== undefined) {
            return;
        }

        setUseNewConnectionsView(identityProviderConfig.useNewConnectionsView);
    }, [ identityProviderConfig ]);

    return (
        <div data-testid={ testId }>
            <Message
                type="info"
                header={
                    t("authenticationProvider:templates.hypr.wizardHelp." +
                        "preRequisites.heading")
                }
                content={
                    (<>
                        <p>
                            <Trans
                                i18nKey={
                                    "authenticationProvider:templates.hypr.wizardHelp." +
                                    "preRequisites.rpDescription"
                                }
                            >
                                Before you begin, create a RP application in <DocumentationLink
                                    link={ getLink("develop.connections.newConnection.hypr.help.developerConsole") }
                                    showEmptyLinkText
                                >HYPR control centre</DocumentationLink>, and obtain the application ID.
                            </Trans>
                        </p>
                        <p>
                            <Trans
                                i18nKey={
                                    "authenticationProvider:templates.hypr.wizardHelp." +
                                    "preRequisites.tokenDescription"
                                }
                            >
                                You also have to obtain an <DocumentationLink
                                    link={ getLink("develop.connections.newConnection.hypr.help.token") }
                                    showEmptyLinkText
                                >API Token</DocumentationLink> for the application you have created.
                            </Trans>
                        </p>
                    </>)
                }
            />

            <Heading as="h5">
                {
                    t("authenticationProvider:templates.hypr" +
                        ".wizardHelp.name.heading")
                }
            </Heading>
            <p>
                {
                    useNewConnectionsView
                        ? t("authenticationProvider:templates.hypr." +
                            "wizardHelp.name.connectionDescription")
                        : t("authenticationProvider:templates.hypr." +
                            "wizardHelp.name.idpDescription")
                }
            </p>

            <Divider/>

            <Heading as="h5">
                { t("authenticationProvider:templates.hypr.wizardHelp.appId.heading") }
            </Heading>
            <p>
                <Trans
                    i18nKey={
                        "authenticationProvider:templates.hypr" +
                        ".wizardHelp.appId.description"
                    }
                >
                    Provide the <Code>Application ID</Code> of the application registerd in HYPR control center.
                </Trans>
            </p>

            <Divider/>

            <Heading as="h5">
                {
                    t("authenticationProvider:templates.hypr" +
                        ".wizardHelp.baseUrl.heading")
                }
            </Heading>
            <p>
                <Trans
                    i18nKey={
                        "authenticationProvider:templates.hypr" +
                        ".wizardHelp.baseUrl.description"
                    }
                >
                    Provide the <Code>base URL</Code> of your HYPR server deployment. 
                </Trans>
            </p>
            
            <Divider/>

            <Heading as="h5">
                {
                    t("authenticationProvider:templates.hypr" +
                        ".wizardHelp.apiToken.heading")
                }
            </Heading>
            <p>
                <Trans
                    i18nKey={
                        "authenticationProvider:templates.hypr" +
                        ".wizardHelp.apiToken.description"
                    }
                >
                    Provide the <Code>API Token</Code> obtained from HYPR. 
                    This will be used to access HYPR&apos;s APIs.
                </Trans>
            </p>
        </div>
    );
};

/**
 * Default props for the component
 */
HyprIDPCreateWizardHelp.defaultProps = {
    "data-componentid": "hypr-idp-create-wizard-help"
};

export default HyprIDPCreateWizardHelp;
