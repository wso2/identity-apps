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
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider } from "semantic-ui-react";

type Props = TestableComponentInterface;

const SamlIDPWizardHelp: FunctionComponent<Props> = (props: Props): ReactElement => {

    const { [ "data-testid" ]: testId } = props;

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Service provider entity id</Heading>
            <p>
                A globally unique name for IDPs under Asgardeo. This can be any value but when you configure a service
                provider in the external IDP you should give the same value as the Service Provider Entity ID.
            </p>
            <Divider/>
            <Heading as="h5">Identity provider entity id</Heading>
            <p>
                The <code>&lt;Issuer&gt;</code> value of the SAML2 response from the identity provider you are
                configuring. This value must be a unique string among identity providers inside the same tenant.
                This information should be taken from the external Identity provider.
            </p>
            <Divider/>
            <Heading as="h5">SSO Url</Heading>
            <p>
                Single sign-on URL of external identity provider. this is where Asgardeo will send its authentication
                requests.
            </p>
            <Divider/>
            <Heading as="h5">Protocol binding</Heading>
            <p>
                Protocol binding to use when sending requests. http-redirect for simple requests or http-post if
                requests are signed, which is recommended.
            </p>
            <Divider/>
            <Heading as="h5">Name id format</Heading>
            <p>
                Name ID defines the name identifier formats supported by the external identity provider. Name identifier
                is how Asgardeo communicate with external idp regarding a user.
            </p>
        </div>
    );

};

SamlIDPWizardHelp.defaultProps = {
    "data-testid": "saml-idp-create-wizard-help"
};

export default SamlIDPWizardHelp;
