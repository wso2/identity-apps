/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
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
import { Divider, Message } from "semantic-ui-react";

/**
 * Prop types of the component.
 */
type SAMLWebApplicationCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the SAML web application template creation wizard.
 *
 * @param {SAMLWebApplicationCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const SAMLWebApplicationCreateWizardHelp: FunctionComponent<SAMLWebApplicationCreateWizardHelpPropsInterface> = (
    props: SAMLWebApplicationCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Name</Heading>
            <p>Provide a unique name for the application so that it can be easily identified.</p>
            <p>E.g. Zoom, Salesforce, etc.</p>

            <>
                <Divider/>
                <Heading as="h5">Protocol</Heading>
                <p>
                    The access configuration protocol which will be used to SSO (Single Sign On) to
                    the
                    application.
                </p>
                <Message info>
                    <a href="#" target="_blank">
                        Click here
                    </a>{ " " }
                    to learn more about supported protocols for agent-based single sign-on.
                </Message>
            </>

            <Divider />

            <>
                <Heading as="h5">Issuer</Heading>
                <p>
                    This is the saml:Issuer element that contains the unique identifier of the
                    service
                    provider. This is also the issuer value specified in the SAML Authentication
                    Request
                    issued by the service provider.
                </p>
                <p>E.g. saml2-web-app-travelocity.com</p>

                <Divider/>

                <Heading as="h5">Assertion consumer URLs</Heading>
                <p>
                    This is the URL to which the browser should be redirected to after the
                    authentication is
                    successful. This is the Assertion Consumer Service (ACS) URL of the service
                    provider.
                </p>
                <p>E.g. http://localhost:8080/travelocity.com/home.jsp</p>
            </>
        </div>
    );
};

/**
 * Default props for the component
 */
SAMLWebApplicationCreateWizardHelp.defaultProps = {
    "data-testid": "saml-web-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default SAMLWebApplicationCreateWizardHelp;
