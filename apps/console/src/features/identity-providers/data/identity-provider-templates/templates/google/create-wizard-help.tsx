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
import { CopyInputField, Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider, Message } from "semantic-ui-react";
import { store } from "../../../../../core";

/**
 * Prop types of the component.
 */
type GoogleIDPCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the custom IDP template creation wizard.
 *
 * @param {GoogleIDPCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const GoogleIDPCreateWizardHelp: FunctionComponent<GoogleIDPCreateWizardHelpPropsInterface> = (
    props: GoogleIDPCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    return (
        <div data-testid={ testId }>
            <Message info>
                <Heading as="h5" className="mb-3">Prerequisite</Heading>
                <p>Before you begin, create an <strong>OAuth Credential</strong> on the <a
                    href="https://console.developers.google.com"
                    target="_blank"
                    rel="noopener noreferrer">
                    Google developer console
                </a>, and obtain a <strong>client ID & secret</strong>. Use the following URL as the <strong>
                        Authorized Redirect URI</strong>.
                    <br />
                    <br />
                    <CopyInputField
                        className="copy-input-dark"
                        value={ store.getState().config.deployment.serverHost + "/commonauth" }
                    />
                    <br />
                    <a
                        href="https://support.google.com/googleapi/answer/6158849"
                        target="_blank"
                        rel="noopener noreferrer">
                        See Google&apos;s guide to obtain the credentials.
                    </a>
                </p>
            </Message>
            <Heading as="h5">Name</Heading>
            <p>Provide a unique name for the identity provider.</p>
            <Divider />
            <Heading as="h5">Client ID</Heading>
            <p>Provide the Client ID obtained from Google.</p>
            <Divider />
            <Heading as="h5">Client secret</Heading>
            <p>Provide the Client Secret obtained from Google.</p>
        </div>
    );
};

/**
 * Default props for the component
 */
GoogleIDPCreateWizardHelp.defaultProps = {
    "data-testid": "google-idp-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default GoogleIDPCreateWizardHelp;
