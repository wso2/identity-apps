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
import { Code, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Divider } from "semantic-ui-react";
import { AppState, ConfigReducerStateInterface } from "../../../../../core";

type Props = TestableComponentInterface;

const SamlIDPWizardHelp: FunctionComponent<Props> = (props: Props): ReactElement => {

    const { [ "data-testid" ]: testId } = props;

    const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Service provider entity ID</Heading>
            <p>
                This value will be used as the <Code>&lt;saml2:Issuer&gt;</Code> in the SAML requests initiated from
                { config.ui.productName } to external Identity Provider (IdP). You need to provide a unique value
                as the service provider entity id.
            </p>
            <Divider/>
            <Heading as="h5">Identity provider entity ID</Heading>
            <p>
                This is the <Code>&lt;saml2:Issuer&gt;</Code> value specified in the SAML responses issued by the
                external IdP. Also, this needs to be a unique value to identify the external IdP within your
                organization.
            </p>
            <p>E.g., https://ENTERPRISE_DOMAIN</p>
            <Divider/>
            <Heading as="h5">SSO URL</Heading>
            <p>
                Single sign-on URL of the external IdP. { config.ui.productName } will send SAML authentication
                requests to this endpoint.
            </p>
            <p>E.g., https://ENTERPRISE_DOMAIN/samlsso</p>
            <Divider/>
            <Heading as="h5">Protocol binding</Heading>
            <p>
                This specifies the mechanisms to transport SAML messages in communication protocols.
            </p>
            <Divider/>
            <Heading as="h5">Name ID format</Heading>
            <p>
                This specifies the name identifier format that is used to exchange information regarding the user
                in the SAML assertion sent from the external IdP.
            </p>
        </div>
    );

};

SamlIDPWizardHelp.defaultProps = {
    "data-testid": "saml-idp-create-wizard-help"
};

export default SamlIDPWizardHelp;
