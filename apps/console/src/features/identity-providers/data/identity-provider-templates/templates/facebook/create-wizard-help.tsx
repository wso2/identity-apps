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
type FacebookIdentityProviderCreateWizardHelpPropsInterface = TestableComponentInterface;

/**
 * Help content for the Facebook IDP template creation wizard.
 *
 * @param props - Props injected into the component.
 *
 *  @returns React Element
 */
const FacebookIdentityProviderCreateWizardHelp: FunctionComponent<
    FacebookIdentityProviderCreateWizardHelpPropsInterface> = (
        props: FacebookIdentityProviderCreateWizardHelpPropsInterface
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
                        t("console:develop.features.authenticationProvider.templates.facebook." +
                        "wizardHelp.preRequisites.heading")
                    }
                    content={
                        (<>
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.facebook." +
                                        "wizardHelp.preRequisites.getCredentials"
                                    }
                                >
                                Before you begin, create an <strong>application</strong> <a
                                        href="https://developers.facebook.com/"
                                        target="_blank"
                                        rel="noopener noreferrer">
                                on Facebook Developer Console
                                    </a>, and obtain a <strong>App ID & secret</strong>.
                                </Trans>
                            </p>
                            <p>
    
                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.facebook." +
                                        "wizardHelp.preRequisites.configureSiteURL"
                                    }
                                >
                                Use the following as the <strong>Site URL</strong>.
                                </Trans>
    
                                <CopyInputField
                                    className="copy-input-dark spaced"
                                    value={ config?.deployment?.customServerHost }
                                />
                            </p>
                            <p>
                                <Trans
                                    i18nKey={
                                        "console:develop.features.authenticationProvider.templates.facebook." +
                                        "wizardHelp.preRequisites.configureRedirectURL"
                                    }
                                >
                                Add the following URL as a <strong>Valid OAuth Redirect URI</strong>.
                                </Trans>
    
                                <CopyInputField
                                    className="copy-input-dark spaced"
                                    value={ config?.deployment?.customServerHost + "/commonauth" }
                                />
    
                                <a
                                    href="https://developers.facebook.com/docs/development/create-an-app"
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    {
                                        t("console:develop.features.authenticationProvider.templates.facebook" +
                                        ".wizardHelp.preRequisites.configureOAuthApps")
                                    }
                                </a>
                            </p>
                        </>)
                    }
                />
    
                <Heading as="h5">
                    {
                        t("console:develop.features.authenticationProvider.templates.facebook" +
                                ".wizardHelp.name.heading")
                    }
                </Heading>
                <p>
                    {
                        useNewConnectionsView
                            ? t("console:develop.features.authenticationProvider.templates.facebook." +
                                    "wizardHelp.name.connectionDescription")
                            : t("console:develop.features.authenticationProvider.templates.facebook." +
                                    "wizardHelp.name.idpDescription")
                    }
                </p>
    
                <Divider/>
    
                <Heading as="h5">
                    { t("console:develop.features.authenticationProvider." +
                            "templates.facebook.wizardHelp.clientId.heading") }
                </Heading>
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.facebook" +
                                ".wizardHelp.clientId.description"
                        }
                    >
                            Provide the <Code>App ID</Code> obtained from Facebook.
                    </Trans>
                </p>
    
                <Divider/>
    
                <Heading as="h5">
                    {
                        t("console:develop.features.authenticationProvider.templates.facebook" +
                                ".wizardHelp.clientSecret.heading")
                    }
                </Heading>
                <p>
                    <Trans
                        i18nKey={
                            "console:develop.features.authenticationProvider.templates.facebook." +
                                "wizardHelp.clientSecret.description"
                        }
                    >
                            Provide the <Code>App Secret</Code> obtained from Facebook.
                    </Trans>
                </p>
            </div>
        );
    };

/**
 * Default props for the component
 */
FacebookIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "facebook-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default FacebookIdentityProviderCreateWizardHelp;
