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
import { Divider } from "semantic-ui-react";

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
            <p>A unique name for the application.</p>
            <p>E.g., My App</p>

            <>
                <Divider/>
                <Heading as="h5">Protocol</Heading>
                <p>
                    The access configuration protocol which will be used to SSO (Single sign-on) to
                    the application.
                </p>
            </>

            <Divider />

            <>
                <Heading as="h5">Issuer</Heading>
                <p>
                    This is the <strong>saml:Issuer</strong> element that contains the unique identifier of the
                    application. The value added here should be specified in the SAML authentication
                    request sent by the client application.
                </p>
                <p>E.g., my-app.com</p>

                <Divider/>

                <Heading as="h5">Assertion response URLs</Heading>
                <p>
                    These are the URLs to which the browser should be redirected to, after the
                    authentication is successful. These are also known as the Assertion Consumer Service (ACS) URL
                    of the service provider.
                </p>
                <p>E.g., http://my-app.com/home.jsp</p>
            </>

            <Divider hidden/>
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
