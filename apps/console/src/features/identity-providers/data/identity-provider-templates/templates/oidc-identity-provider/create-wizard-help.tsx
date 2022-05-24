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
import { CopyInputField, Heading, Message } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useSelector } from "react-redux";
import { Divider, Icon } from "semantic-ui-react";
import { store } from "../../../../../core";
import { AppState, ConfigReducerStateInterface } from "../../../../../core";

/**
 * Prop types of the component.
 */
type CustomIdentityProviderCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the custom IDP template creation wizard.
 *
 * @param {CustomIdentityProviderCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const CustomIdentityProviderCreateWizardHelp: FunctionComponent<CustomIdentityProviderCreateWizardHelpPropsInterface>
    = ( props: CustomIdentityProviderCreateWizardHelpPropsInterface ): ReactElement => {

        const {
            [ "data-testid" ]: testId
        } = props;

        const config: ConfigReducerStateInterface = useSelector((state: AppState) => state.config);

        return (
            <div data-testid={ testId }>
                <Message
                    type="info"
                    header="Prerequisite"
                    content={
                        <p>Before you begin, register an application in the Identity Provider, and obtain a
                            <strong> client ID & secret</strong>. Use the following URL as the <strong>
                                Authorized Redirect URL</strong>.
                            <br />
                            <br />
                            <CopyInputField
                                className="copy-input-dark"
                                value={ config?.deployment?.customServerHost + "/commonauth" }
                            />
                            <br />
                            <Icon name="info circle" />
                            The URL to which the authorization code is sent upon authentication and where the
                            user is redirected to upon logout.
                        </p>
                    }
                />
                <Heading as="h5">Client ID</Heading>
                <p>Provide the client ID obtained from the identity provider.</p>
                <Divider />
                <Heading as="h5">Client secret</Heading>
                <p>Provide the client secret obtained from the identity provider.</p>
                <Divider />
                <Heading as="h5">Authorization endpoint URL</Heading>
                <p>Provide the standard authorization endpoint URL of the identity provider.</p>
                <p>E.g., https://enterprise_domain/authorize</p>
                <Divider />
                <Heading as="h5">Token endpoint URL</Heading>
                <p>Provide the standard token endpoint URL of the identity provider.</p>
                <p>E.g., https://enterprise_domain/token</p>

            </div>
        );
};

/**
 * Default props for the component
 */
CustomIdentityProviderCreateWizardHelp.defaultProps = {
    "data-testid": "custom-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default CustomIdentityProviderCreateWizardHelp;
