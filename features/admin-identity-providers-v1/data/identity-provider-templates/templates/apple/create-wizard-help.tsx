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
import { Code, CopyInputField, DocumentationLink, Heading, Message, useDocumentation } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import { identityProviderConfig } from "../../../../../admin-extensions-v1/configs";
import { ConfigReducerStateInterface } from "../../../../../admin-core-v1/models";
import { AppState } from "../../../../../admin-core-v1/store";

/**
 * Prop types of the component.
 */
type AppleIdentityProviderCreateWizardHelpPropsInterface = IdentifiableComponentInterface;

/**
 * Help content for the Apple IDP template creation wizard.
 *
 * @param props - Props injected into the component.
 *
 *  @returns React Element
 */
const AppleIdentityProviderCreateWizardHelp: FunctionComponent<AppleIdentityProviderCreateWizardHelpPropsInterface> = (
    props: AppleIdentityProviderCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-componentid" ]: componentId
    } = props;

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

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
        <div data-componentid={ componentId }>
            <Message
                type="info"
                header={
                    t("authenticationProvider:templates.apple." +
                    "wizardHelp.preRequisites.heading")
                }
                content={
                    (<>
                        <p>
                            <Trans
                                i18nKey={
                                    "authenticationProvider:templates.apple." +
                                    "wizardHelp.preRequisites.getCredentials"
                                }
                            >
                                Before you begin, create a <strong>Sign in With Apple</strong> enabled 
                                application on <DocumentationLink
                                    link={ getLink("develop.connections.newConnection.apple.help.developerConsole") }
                                    showEmptyLinkText
                                >Apple Developer Portal</DocumentationLink> with a <strong
                                >Services ID</strong> and a <strong>Private Key</strong>.
                            </Trans>
                        </p>
                        <p>
                            <Trans
                                i18nKey={
                                    "authenticationProvider:templates.apple." +
                                    "wizardHelp.preRequisites.configureWebDomain"
                                }
                            >
                            Use the following as a <strong>Web Domain</strong>.
                            </Trans>
                            <CopyInputField
                                className="copy-input-dark spaced"
                                value={ new URL(config?.deployment?.serverOrigin)?.hostname }
                            />
                        </p>
                        <p>
                            <Trans
                                i18nKey={
                                    "authenticationProvider:templates.apple." +
                                    "wizardHelp.preRequisites.configureReturnURL"
                                }
                            >
                            Add the following URL as a <strong>Return URL</strong>.
                            </Trans>
                            <CopyInputField
                                className="copy-input-dark spaced"
                                value={ config?.deployment?.customServerHost + "/commonauth" }
                            />
                            <DocumentationLink
                                link={ getLink("develop.connections.newConnection.apple.help.configureSignIn") }
                                showEmptyLinkText
                            >
                                {
                                    t("authenticationProvider:templates.apple" +
                                    ".wizardHelp.preRequisites.configureAppleSignIn")
                                }
                            </DocumentationLink>
                        </p>
                    </>)
                }
            />

            <Heading as="h5">
                {
                    t("authenticationProvider:templates.apple" +
                            ".wizardHelp.name.heading")
                }
            </Heading>
            <p>
                {
                    useNewConnectionsView
                        ? t("authenticationProvider:templates.apple." +
                                "wizardHelp.name.connectionDescription")
                        : t("authenticationProvider:templates.apple." +
                                "wizardHelp.name.idpDescription")
                }
            </p>

            <Divider/>

            <Heading as="h5">
                { t("authenticationProvider:" +
                        "templates.apple.wizardHelp.clientId.heading") }
            </Heading>
            <p>
                <Trans
                    i18nKey={
                        "authenticationProvider:templates.apple" +
                            ".wizardHelp.clientId.description"
                    }
                >
                    Provide the <Code>Services ID</Code> created at Apple.
                </Trans>
            </p>

            <Divider/>

            <Heading as="h5">
                {
                    t("authenticationProvider:templates.apple" +
                            ".wizardHelp.teamId.heading")
                }
            </Heading>
            <p>
                <Trans
                    i18nKey={
                        "authenticationProvider:templates.apple." +
                            "wizardHelp.teamId.description"
                    }
                >
                    Provide the Apple developer <Code>Team ID</Code>.
                </Trans>
            </p>

            <Divider/>

            <Heading as="h5">
                {
                    t("authenticationProvider:templates.apple" +
                            ".wizardHelp.keyId.heading")
                }
            </Heading>
            <p>
                <Trans
                    i18nKey={
                        "authenticationProvider:templates.apple." +
                            "wizardHelp.keyId.description"
                    }
                >
                    Provide the <Code>Key Identifier</Code> of the private key generated.
                </Trans>
            </p>

            <Divider/>

            <Heading as="h5">
                {
                    t("authenticationProvider:templates.apple" +
                            ".wizardHelp.privateKey.heading")
                }
            </Heading>
            <p>
                <Trans
                    i18nKey={
                        "authenticationProvider:templates.apple." +
                            "wizardHelp.privateKey.description"
                    }
                >
                    Provide the <Code>Private Key</Code> generated for the application.
                </Trans>
            </p>
        </div>
    );
};

/**
 * Default props for the component
 */
AppleIdentityProviderCreateWizardHelp.defaultProps = {
    "data-componentid": "apple-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AppleIdentityProviderCreateWizardHelp;
