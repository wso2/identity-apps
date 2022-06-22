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
import {
    Code,
    CopyInputField,
    DocumentationLink,
    Heading,
    Message,
    useDocumentation
} from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Divider, Icon } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface } from "../../../../../core";

type Props = TestableComponentInterface;

/**
 * Wizard help panel for manual configuration mode.
 * @param props {Props}
 * @constructor
 */
const SamlIDPWizardHelp: FunctionComponent<Props> = (props: Props): ReactElement => {

    const { [ "data-testid" ]: testId } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    const { t } = useTranslation();
    const { getLink } = useDocumentation();

    return (
        <div data-testid={ testId }>
            <Message
                type="info"
                content={
                    <>
                        <Trans
                            i18nKey={
                                "console:develop.features.authenticationProvider.templates.enterprise.saml." +
                                "preRequisites.configureRedirectURL"
                            }
                        >
                            Use the following URL as the <strong>Authorized Redirect URI</strong>.
                        </Trans>
                        <CopyInputField
                            className="copy-input-dark spaced"
                            value={ config?.deployment?.customServerHost + "/commonauth" }
                        />
                        <Icon name="info circle" />
                        {
                            t("console:develop.features.authenticationProvider.templates.enterprise.saml." +
                                "preRequisites.hint", {
                                productName: config.ui.productName
                            })
                        }
                        { getLink("develop.connections.newConnection.enterprise.samlLearnMore") === undefined
                            ? null
                            : <Divider hidden/>
                        }
                        <DocumentationLink
                            link={ getLink("develop.connections.newConnection.enterprise.samlLearnMore") }
                        >
                            {
                                t("console:develop.features.authenticationProvider.templates.enterprise.saml." +
                                    "preRequisites.configureIdp")
                            }
                        </DocumentationLink>
                    </>
                }
            />
            <Heading as="h5">Service provider entity ID</Heading>
            <p>
                This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in the SAML requests initiated from
                { " " }{ config.ui.productName } to external Identity Provider (IdP). You need to provide a unique value
                as the service provider entity ID.
            </p>
            <Divider/>
            <Heading as="h5">Identity provider Single Sign-On URL</Heading>
            <p>
                Single Sign-On URL of the external IdP. { config.ui.productName } will send SAML authentication
                requests to this endpoint.
            </p>
            <p>E.g., https://enterprise_domain/samlsso</p>
            <Divider/>
            <Heading as="h5">Identity provider entity ID</Heading>
            <p>
                This is the <Code>&lt;saml2:Issuer&gt;</Code> value specified in the SAML responses issued by the
                external IdP. Also, this needs to be a unique value to identify the external IdP within your
                organization.
            </p>
            <p>E.g., https://enterprise_domain</p>
        </div>
    );

};

/**
 * Default props of {@link SamlIDPWizardHelp}
 */
SamlIDPWizardHelp.defaultProps = {
    "data-testid": "saml-idp-create-wizard-help"
};

export default SamlIDPWizardHelp;
