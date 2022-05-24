/**
 * Copyright (c) 2021, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
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

import { TestableComponentInterface } from "@wso2is/core/models";
import { Code, CopyInputField, Heading, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import { identityProviderConfig } from "../../../../../../extensions/configs";
import { ConfigReducerStateInterface } from "../../../../../core/models";
import { AppState } from "../../../../../core/store";

/**
 * Prop types of the component.
 */
type GithubIdentityProviderCreateWizardHelpPropsInterface = TestableComponentInterface;

/**
 * Help content for the GitHub IDP template creation wizard.
 *
 * @param {GithubIdentityProviderCreateWizardHelpPropsInterface} props - Props injected into the component.
 *
 * @return {React.ReactElement}
 */
const GithubIdentityProviderCreateWizardHelp: FunctionComponent<
    GithubIdentityProviderCreateWizardHelpPropsInterface> = (
        props: GithubIdentityProviderCreateWizardHelpPropsInterface
    ): ReactElement => {

        const {
            [ "data-testid" ]: testId
        } = props;

        const { t } = useTranslation();

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
        <div data-testid={ testId }>
            <Message
                type="info"
                header={
                    t("console:develop.features.authenticationProvider.templates.github.wizardHelp." +
                        "preRequisites.heading")
                }
                content={
                    <>
                        <p>
                            <Trans
                                i18nKey={
                                    "console:develop.features.authenticationProvider.templates.github.wizardHelp." +
                                    "preRequisites.getCredentials"
                                }
                            >
                                Before you begin, create an <strong>OAuth application</strong> <a
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer">
                                on GitHub
                            </a>, and obtain a <strong>client ID & secret</strong>.
                            </Trans>
                        </p>
                        <p>

                            <Trans
                                i18nKey={
                                    "console:develop.features.authenticationProvider.templates.github.wizardHelp" +
                                    ".preRequisites.configureHomePageURL"
                                }
                            >
                                Use the following URL as the <strong>Homepage URL</strong>.
                            </Trans>

                            <CopyInputField
                                className="copy-input-dark spaced"
                                value={ config?.deployment?.customServerHost }
                            />
                        </p>
                        <p>
                            <Trans
                                i18nKey={
                                    "console:develop.features.authenticationProvider.templates.github.wizardHelp" +
                                    ".preRequisites.configureRedirectURL"
                                }
                            >
                                Add the following URL as the <strong>Authorization callback URL</strong>.
                            </Trans>

                            <CopyInputField
                                className="copy-input-dark spaced"
                                value={ config?.deployment?.customServerHost + "/commonauth" }
                            />

                            <a
                                href="https://docs.github.com/en/developers/apps/building-oauth-apps/creating-an-oauth-app"
                                target="_blank"
                                rel="noopener noreferrer">
                                {
                                    t("console:develop.features.authenticationProvider.templates.github.wizardHelp." +
                                        "preRequisites.configureOAuthApps")
                                }
                            </a>
                        </p>
                    </>
                }
            />

                <Heading as="h5">
                    {
                        t("console:develop.features.authenticationProvider.templates.github" +
                            ".wizardHelp.name.heading")
                    }
                </Heading>
                <p>
                    {
                        useNewConnectionsView
                            ? t("console:develop.features.authenticationProvider.templates.github." +
                                "wizardHelp.name.connectionDescription")
                            : t("console:develop.features.authenticationProvider.templates.github." +
                                "wizardHelp.name.idpDescription")
                    }
                </p>

                <Divider/>

                <Heading as="h5">
                    { t("console:develop.features.authenticationProvider." +
                        "templates.github.wizardHelp.clientId.heading") }
                </Heading>
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.github" +
                            ".wizardHelp.clientId.description"
                        }
                    >
                        Provide the <Code>Client ID</Code> obtained from GitHub.
                    </Trans>
                </p>

                <Divider/>

                <Heading as="h5">
                    {
                        t("console:develop.features.authenticationProvider.templates.github" +
                            ".wizardHelp.clientSecret.heading")
                    }
                </Heading>
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.github" +
                            ".wizardHelp.clientSecret.description"
                        }
                    >
                        Provide the <Code>Client Secret</Code> obtained from GitHub.
                    </Trans>
                </p>
            </div>
        );
    };

/**
 * Default props for the component
 */
GithubIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "github-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GithubIdentityProviderCreateWizardHelp;
