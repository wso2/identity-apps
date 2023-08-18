/**
 * Copyright (c) 2022, WSO2 LLC. (http://www.wso2.com). All Rights Reserved.
 *
 * This software is the property of WSO2 LLC. and its suppliers, if any.
 * Dissemination of any information or reproduction of any material contained
 * herein in any form is strictly forbidden, unless permitted by WSO2 expressly.
 * You may not alter or remove any copyright or other notice from copies of this content.
 */

import { IdentifiableComponentInterface } from "@wso2is/core/models";
import { Code, CodeEditor, CopyInputField, Heading, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement, useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Divider } from "semantic-ui-react";
import { IdentityProviderManagementUtils } from "../../../../features/identity-providers/utils";
import { SIWEConstants } from "../../../components/identity-providers/constants";
import { identityProviderConfig } from "../../../configs/identity-provider";

/**
 * Prop types for the component.
 */
type SIWEAuthenticationProviderCreateWizardHelpPropsInterface = IdentifiableComponentInterface;

/**
 * Help content for the Sign In with Ethereum IDP template creation wizard.
 *
 * @param {SIWEAuthenticationProviderCreateWizardHelpPropsInterface} props - Props injected into the component.
 *
 * @return {React.ReactElement}
 */
const SIWEAuthenticationProviderCreateWizardHelp: FunctionComponent<
    SIWEAuthenticationProviderCreateWizardHelpPropsInterface> = (
        props: SIWEAuthenticationProviderCreateWizardHelpPropsInterface
    ): ReactElement => {

        const {
            [ "data-componentid" ]: componentId
        } = props;

        const { t } = useTranslation();

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
            <div data-testid={ componentId }>
                <Message
                    type="info"
                    header={
                        t("console:develop.features.authenticationProvider.templates.github.wizardHelp." +
                        "preRequisites.heading")
                    }
                    content={ (
                        <>
                            <p>
                                <Trans
                                    i18nKey={
                                        "extensions:develop.identityProviders.siwe.wizardHelp." +
                                        "preRequisites.getCredentials"
                                    }
                                >
                                    Before you begin, register an <strong>OIDC client</strong> using the OIDC 
                                    client registration of <Code withBackground={ false }>
                                        oidc.signinwithethereum.org
                                    </Code>, and obtain a <strong>client ID & secret</strong>.
                                </Trans>
                            </p>
                            <p>
                                <Trans
                                    i18nKey={
                                        "extensions:develop.identityProviders.siwe.wizardHelp." +
                                        ".preRequisites.configureRedirectURI"
                                    }
                                >
                                    The following URL has to be set as the <strong>Redirect URI</strong>.
                                </Trans>

                                <CopyInputField
                                    className="copy-input-dark spaced"
                                    value={ IdentityProviderManagementUtils.getCommonAuthEndpoint() }
                                />
                            </p>
                            <a
                                href={ SIWEConstants.SIWE_CLIENT_REGISTRATION_DOCS_URL }
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {
                                    t("extensions:develop.identityProviders.siwe.wizardHelp" +
                                    ".preRequisites.clientRegistrationDocs")
                                }
                            </a>
                            <p>
                                <Trans
                                    i18nKey={
                                        "extensions:develop.identityProviders.siwe.wizardHelp" +
                                        ".preRequisites.configureClient"
                                    }
                                >
                                    If you want to quickly get things started, use the following 
                                    <Code withBackground={ false }>curl</Code> command to register the client.
                                </Trans>
                                <Divider hidden />
                                <CodeEditor
                                    oneLiner
                                    readOnly="nocursor"
                                    withClipboardCopy
                                    showLineNumbers={ false }
                                    language="shell"
                                    options={ {
                                        lineWrapping: true
                                    } }
                                    height="100%"
                                    theme="dark"
                                    sourceCode={
                                        SIWEConstants.SIWE_CLIENT_REGISTRATION_CURL_COMMAND
                                            .replace(
                                                "${commonauth}",
                                                IdentityProviderManagementUtils.getCommonAuthEndpoint()
                                            )
                                    }
                                />
                            </p>
                        </>)
                    }
                />

                <Heading as="h5">
                    { t("extensions:develop.identityProviders.siwe.wizardHelp.name.heading") }
                </Heading>
                <p>
                    {
                        useNewConnectionsView
                            ? t("extensions:develop.identityProviders.siwe.wizardHelp.name.connectionDescription")
                            : t("extensions:develop.identityProviders.siwe.wizardHelp.name.idpDescription")
                    }
                </p>

                <Divider/>

                <Heading as="h5">
                    { t("extensions:develop.identityProviders.siwe.wizardHelp.clientId.heading") }
                </Heading>
                <p>
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.siwe.wizardHelp.clientId.description"
                        }
                    >
                        Provide the <Code>client_id</Code> you received from
                        <Code>oidc.signinwithethereum.org</Code> for your OIDC client.
                    </Trans>
                </p>

                <Divider/>

                <Heading as="h5">
                    { t("extensions:develop.identityProviders.siwe.wizardHelp.clientSecret.heading") }
                </Heading>
                <p>
                    <Trans
                        i18nKey={
                            "extensions:develop.identityProviders.siwe.wizardHelp.clientSecret.description"
                        }
                    >
                        Provide the <Code>client_secret</Code> you received from
                        <Code>oidc.signinwithethereum.org</Code> for your OIDC client.
                    </Trans>
                </p>
            </div>
        );
    };

/**
 * Default props for the component
 */
SIWEAuthenticationProviderCreateWizardHelp.defaultProps = {
    "data-componentid": "swe-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SIWEAuthenticationProviderCreateWizardHelp;
